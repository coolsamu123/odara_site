use axum::{
    routing::{get, post, put, delete},
    Router, Extension, http::Method,
};
use sqlx::sqlite::SqlitePoolOptions;
use std::env;
use std::sync::Arc;
use tower_http::trace::TraceLayer;
use tower_http::cors::{Any, CorsLayer};

mod auth;
mod leads;
mod community;
mod admin;
mod email;

#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::SqlitePool,
    pub jwt_secret: String,
    pub smtp: Option<email::SmtpConfig>,
    pub google: Option<GoogleOAuthConfig>,
}

#[derive(Clone)]
pub struct GoogleOAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    // Load .env file if present
    let _ = dotenvy::dotenv();

    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://odara.db".to_string());
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "super-secret-key-change-in-production".to_string());

    // Ensure the DB file exists for sqlite if it's not memory
    if !database_url.starts_with("sqlite::memory:") {
        if let Some(db_file) = database_url.strip_prefix("sqlite://") {
            if !std::path::Path::new(db_file).exists() {
                std::fs::File::create(db_file)?;
            }
        }
    }

    println!("Connecting to database...");
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    println!("Running migrations...");
    sqlx::migrate!("./migrations").run(&pool).await?;

    let smtp = email::SmtpConfig::from_env();
    if smtp.is_some() {
        println!("SMTP configured for password reset emails");
    } else {
        println!("SMTP not configured — password reset emails will be logged only");
    }

    let google = match (
        env::var("GOOGLE_CLIENT_ID"),
        env::var("GOOGLE_CLIENT_SECRET"),
        env::var("GOOGLE_REDIRECT_URI"),
    ) {
        (Ok(client_id), Ok(client_secret), Ok(redirect_uri))
            if !client_id.is_empty() && !client_secret.is_empty() =>
        {
            println!("Google OAuth configured");
            Some(GoogleOAuthConfig { client_id, client_secret, redirect_uri })
        }
        _ => {
            println!("Google OAuth not configured");
            None
        }
    };

    let state = Arc::new(AppState { db: pool, jwt_secret, smtp, google });

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_origin(Any)
        .allow_headers(Any);

    println!("Starting Axum server on 0.0.0.0:3040");

    // Set up routes
    let app = Router::new()
        .route("/api/v1/health", get(health_check))
        // Auth routes
        .route("/api/v1/auth/login", post(auth::login_handler))
        .route("/api/v1/auth/register", post(auth::register_handler))
        .route("/api/v1/auth/profile", put(auth::update_profile_handler))
        .route("/api/v1/auth/password", put(auth::change_password_handler))
        .route("/api/v1/auth/forgot-password", post(auth::forgot_password_handler))
        .route("/api/v1/auth/reset-password", post(auth::reset_password_handler))
        // Google OAuth
        .route("/api/v1/auth/google", get(auth::google_redirect_handler))
        .route("/api/v1/auth/google/callback", get(auth::google_callback_handler))
        // Admin
        .route("/api/v1/admin/dashboard", get(admin::dashboard_stats))
        // Lead capture / Downloads
        .route("/api/v1/downloads", post(leads::capture_lead))
        .route("/api/v1/admin/leads", get(leads::list_leads))
        .route("/api/v1/admin/download-events", get(leads::list_download_events))
        // Community/Q&A
        .route("/api/v1/community/posts", get(community::list_posts).post(community::create_post))
        .route("/api/v1/community/posts/:post_id", get(community::get_post).put(community::update_post).delete(community::delete_post))
        .route("/api/v1/community/posts/:post_id/comments", get(community::list_comments).post(community::create_comment))
        .route("/api/v1/community/posts/:post_id/vote", post(community::toggle_vote))
        .route("/api/v1/community/comments/:comment_id", delete(community::delete_comment))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .layer(Extension(state));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3040").await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn health_check() -> &'static str {
    "OK"
}
