use axum::{Extension, Json, http::StatusCode, response::Redirect};
use axum::extract::Query;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;
use jsonwebtoken::{encode, decode, Header, EncodingKey, DecodingKey, Validation};
use chrono::{Utc, Duration};

// ── DTOs ───────────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: String,
    pub country: String,
    pub company: String,
    pub telephone: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateProfileRequest {
    pub name: Option<String>,
    pub avatar_url: Option<String>,
    pub country: Option<String>,
    pub company: Option<String>,
    pub telephone: Option<String>,
}

#[derive(Deserialize)]
pub struct ChangePasswordRequest {
    pub current_password: String,
    pub new_password: String,
}

#[derive(Deserialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
}

#[derive(Deserialize)]
pub struct ResetPasswordRequest {
    pub token: String,
    pub new_password: String,
}

#[derive(Serialize)]
pub struct UserDto {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub role: String,
    pub country: Option<String>,
    pub company: Option<String>,
    pub telephone: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub user: UserDto,
}

#[derive(Serialize)]
pub struct MessageResponse {
    pub message: String,
}

// ── DB row types ───────────────────────────────────────────────────────

#[derive(Serialize, sqlx::FromRow)]
struct AdminUser {
    pub id: i64,
    pub username: String,
    pub password_hash: String,
}

#[derive(Serialize, sqlx::FromRow)]
struct CommunityUser {
    pub id: i64,
    pub email: String,
    pub password_hash: String,
    pub name: String,
    pub country: String,
    pub company: String,
    pub telephone: String,
    pub avatar_url: String,
}

// ── JWT Claims ─────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,       // user email or admin username
    pub user_id: i64,
    pub exp: usize,
    pub role: String,      // "admin" or "community"
}

fn make_token(state: &AppState, sub: &str, user_id: i64, role: &str) -> Result<String, (StatusCode, String)> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: sub.to_string(),
        user_id,
        exp: expiration,
        role: role.to_string(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
    )
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Token creation error: {}", e)))
}

fn extract_claims(state: &AppState, headers: &axum::http::HeaderMap) -> Result<Claims, (StatusCode, String)> {
    let auth_header = headers.get("Authorization").and_then(|h| h.to_str().ok());
    let token = match auth_header {
        Some(h) if h.starts_with("Bearer ") => &h[7..],
        _ => return Err((StatusCode::UNAUTHORIZED, "Missing or invalid token".to_string())),
    };

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".to_string()))?;

    Ok(token_data.claims)
}

// ── Login (checks admin users first, then community_users) ─────────────

pub async fn login_handler(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    // 1. Try admin users table
    let admin = sqlx::query_as::<_, AdminUser>(
        "SELECT id, username, password_hash FROM users WHERE username = ?1"
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    if let Some(admin_user) = admin {
        if bcrypt::verify(&payload.password, &admin_user.password_hash)
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error verifying password".to_string()))?
        {
            let token = make_token(&state, &admin_user.username, admin_user.id, "admin")?;
            return Ok(Json(LoginResponse {
                access_token: token,
                user: UserDto {
                    id: admin_user.id,
                    name: admin_user.username.clone(),
                    email: admin_user.username,
                    role: "admin".to_string(),
                    country: None,
                    company: None,
                    telephone: None,
                    avatar_url: None,
                },
            }));
        }
    }

    // 2. Try community_users table
    let community = sqlx::query_as::<_, CommunityUser>(
        "SELECT id, email, password_hash, name, country, company, telephone, avatar_url FROM community_users WHERE email = ?1"
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    if let Some(cu) = community {
        if bcrypt::verify(&payload.password, &cu.password_hash)
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error verifying password".to_string()))?
        {
            let token = make_token(&state, &cu.email, cu.id, "community")?;
            return Ok(Json(LoginResponse {
                access_token: token,
                user: UserDto {
                    id: cu.id,
                    name: cu.name,
                    email: cu.email,
                    role: "community".to_string(),
                    country: Some(cu.country),
                    company: Some(cu.company),
                    telephone: if cu.telephone.is_empty() { None } else { Some(cu.telephone) },
                    avatar_url: if cu.avatar_url.is_empty() { None } else { Some(cu.avatar_url) },
                },
            }));
        }
    }

    Err((StatusCode::UNAUTHORIZED, "Invalid email or password".to_string()))
}

// ── Register ───────────────────────────────────────────────────────────

pub async fn register_handler(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    if payload.password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, "Password must be at least 8 characters".to_string()));
    }

    // Check if email already exists
    let existing: Option<(i64,)> = sqlx::query_as(
        "SELECT id FROM community_users WHERE email = ?1"
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    if existing.is_some() {
        return Err((StatusCode::CONFLICT, "An account with this email already exists".to_string()));
    }

    let password_hash = bcrypt::hash(&payload.password, bcrypt::DEFAULT_COST)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Hash error: {}", e)))?;

    let telephone = payload.telephone.unwrap_or_default();

    let result = sqlx::query(
        "INSERT INTO community_users (email, password_hash, name, country, company, telephone) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
    )
    .bind(&payload.email)
    .bind(&password_hash)
    .bind(&payload.name)
    .bind(&payload.country)
    .bind(&payload.company)
    .bind(&telephone)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let user_id = result.last_insert_rowid();
    let token = make_token(&state, &payload.email, user_id, "community")?;

    Ok(Json(LoginResponse {
        access_token: token,
        user: UserDto {
            id: user_id,
            name: payload.name,
            email: payload.email,
            role: "community".to_string(),
            country: Some(payload.country),
            company: Some(payload.company),
            telephone: if telephone.is_empty() { None } else { Some(telephone) },
            avatar_url: None,
        },
    }))
}

// ── Update Profile ─────────────────────────────────────────────────────

pub async fn update_profile_handler(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<Json<UserDto>, (StatusCode, String)> {
    let claims = extract_claims(&state, &headers)?;

    if claims.role != "community" {
        return Err((StatusCode::FORBIDDEN, "Only community users can update profile".to_string()));
    }

    // Build dynamic update
    let mut sets: Vec<String> = Vec::new();
    if payload.name.is_some() { sets.push("name = ?".to_string()); }
    if payload.avatar_url.is_some() { sets.push("avatar_url = ?".to_string()); }
    if payload.country.is_some() { sets.push("country = ?".to_string()); }
    if payload.company.is_some() { sets.push("company = ?".to_string()); }
    if payload.telephone.is_some() { sets.push("telephone = ?".to_string()); }

    if sets.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "No fields to update".to_string()));
    }

    sets.push("updated_at = CURRENT_TIMESTAMP".to_string());

    let sql = format!("UPDATE community_users SET {} WHERE id = ?", sets.join(", "));
    let mut query = sqlx::query(&sql);

    if let Some(ref v) = payload.name { query = query.bind(v); }
    if let Some(ref v) = payload.avatar_url { query = query.bind(v); }
    if let Some(ref v) = payload.country { query = query.bind(v); }
    if let Some(ref v) = payload.company { query = query.bind(v); }
    if let Some(ref v) = payload.telephone { query = query.bind(v); }
    query = query.bind(claims.user_id);

    query
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    // Return updated user
    let cu = sqlx::query_as::<_, CommunityUser>(
        "SELECT id, email, password_hash, name, country, company, telephone, avatar_url FROM community_users WHERE id = ?1"
    )
    .bind(claims.user_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(UserDto {
        id: cu.id,
        name: cu.name,
        email: cu.email,
        role: "community".to_string(),
        country: Some(cu.country),
        company: Some(cu.company),
        telephone: if cu.telephone.is_empty() { None } else { Some(cu.telephone) },
        avatar_url: if cu.avatar_url.is_empty() { None } else { Some(cu.avatar_url) },
    }))
}

// ── Change Password ────────────────────────────────────────────────────

pub async fn change_password_handler(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<ChangePasswordRequest>,
) -> Result<Json<MessageResponse>, (StatusCode, String)> {
    let claims = extract_claims(&state, &headers)?;

    if claims.role != "community" {
        return Err((StatusCode::FORBIDDEN, "Only community users can change password here".to_string()));
    }

    if payload.new_password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, "Password must be at least 8 characters".to_string()));
    }

    let user = sqlx::query_as::<_, CommunityUser>(
        "SELECT id, email, password_hash, name, country, company, telephone, avatar_url FROM community_users WHERE id = ?1"
    )
    .bind(claims.user_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    if !bcrypt::verify(&payload.current_password, &user.password_hash)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error verifying password".to_string()))?
    {
        return Err((StatusCode::UNAUTHORIZED, "Current password is incorrect".to_string()));
    }

    let new_hash = bcrypt::hash(&payload.new_password, bcrypt::DEFAULT_COST)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Hash error: {}", e)))?;

    sqlx::query("UPDATE community_users SET password_hash = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2")
        .bind(&new_hash)
        .bind(claims.user_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(MessageResponse { message: "Password changed successfully".to_string() }))
}

// ── Forgot Password ────────────────────────────────────────────────────

pub async fn forgot_password_handler(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<ForgotPasswordRequest>,
) -> Result<Json<MessageResponse>, (StatusCode, String)> {
    // Always return success to avoid email enumeration
    let success = Json(MessageResponse {
        message: "If an account with that email exists, a reset link has been sent.".to_string(),
    });

    let user: Option<(i64,)> = sqlx::query_as(
        "SELECT id FROM community_users WHERE email = ?1"
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let user_id = match user {
        Some((id,)) => id,
        None => return Ok(success),
    };

    // Generate a secure random token
    let token: String = {
        use std::fmt::Write;
        let mut buf = String::with_capacity(64);
        for _ in 0..32 {
            let byte: u8 = rand::random();
            write!(buf, "{:02x}", byte).unwrap();
        }
        buf
    };

    let expires = Utc::now()
        .checked_add_signed(Duration::hours(1))
        .expect("valid timestamp")
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    sqlx::query("UPDATE community_users SET reset_token = ?1, reset_token_expires = ?2 WHERE id = ?3")
        .bind(&token)
        .bind(&expires)
        .bind(user_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    // Send email (if SMTP is configured)
    if let Some(ref smtp) = state.smtp {
        if let Err(e) = crate::email::send_password_reset_email(smtp, &payload.email, &token) {
            tracing::error!("Failed to send reset email: {}", e);
            // Still return success to avoid enumeration
        }
    } else {
        tracing::warn!("SMTP not configured — cannot send password reset email. Token: {}", token);
    }

    Ok(success)
}

// ── Reset Password ─────────────────────────────────────────────────────

pub async fn reset_password_handler(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<ResetPasswordRequest>,
) -> Result<Json<MessageResponse>, (StatusCode, String)> {
    if payload.new_password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, "Password must be at least 8 characters".to_string()));
    }

    #[derive(sqlx::FromRow)]
    struct ResetRow {
        id: i64,
        reset_token_expires: Option<String>,
    }

    let row = sqlx::query_as::<_, ResetRow>(
        "SELECT id, reset_token_expires FROM community_users WHERE reset_token = ?1"
    )
    .bind(&payload.token)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let row = row.ok_or((StatusCode::BAD_REQUEST, "Invalid or expired reset token".to_string()))?;

    // Check expiry
    if let Some(expires_str) = &row.reset_token_expires {
        if let Ok(expires) = chrono::NaiveDateTime::parse_from_str(expires_str, "%Y-%m-%d %H:%M:%S") {
            if Utc::now().naive_utc() > expires {
                return Err((StatusCode::BAD_REQUEST, "Reset token has expired".to_string()));
            }
        }
    }

    let new_hash = bcrypt::hash(&payload.new_password, bcrypt::DEFAULT_COST)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Hash error: {}", e)))?;

    sqlx::query(
        "UPDATE community_users SET password_hash = ?1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?2"
    )
    .bind(&new_hash)
    .bind(row.id)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(MessageResponse { message: "Password has been reset successfully".to_string() }))
}

// ── Google OAuth ───────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct GoogleCallbackQuery {
    pub code: Option<String>,
    pub error: Option<String>,
}

#[derive(Deserialize)]
struct GoogleTokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct GoogleUserInfo {
    id: String,
    email: String,
    name: String,
    picture: Option<String>,
}

/// GET /api/v1/auth/google — redirect user to Google consent screen
pub async fn google_redirect_handler(
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Redirect, (StatusCode, String)> {
    let google = state.google.as_ref()
        .ok_or((StatusCode::SERVICE_UNAVAILABLE, "Google OAuth not configured".to_string()))?;

    let url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent",
        urlencoded(&google.client_id),
        urlencoded(&google.redirect_uri),
    );

    Ok(Redirect::temporary(&url))
}

/// GET /api/v1/auth/google/callback — handle Google's redirect back
pub async fn google_callback_handler(
    Extension(state): Extension<Arc<AppState>>,
    Query(params): Query<GoogleCallbackQuery>,
) -> Result<Redirect, (StatusCode, String)> {
    let google = state.google.as_ref()
        .ok_or((StatusCode::SERVICE_UNAVAILABLE, "Google OAuth not configured".to_string()))?;

    let frontend_url = state.smtp.as_ref()
        .map(|s| s.frontend_url.clone())
        .unwrap_or_else(|| "http://localhost:3030".to_string());

    if let Some(err) = params.error {
        return Ok(Redirect::temporary(&format!("{}/#/?auth_error={}", frontend_url, urlencoded(&err))));
    }

    let code = params.code
        .ok_or((StatusCode::BAD_REQUEST, "Missing authorization code".to_string()))?;

    // Exchange code for access token
    let client = reqwest::Client::new();
    let token_res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&[
            ("code", code.as_str()),
            ("client_id", google.client_id.as_str()),
            ("client_secret", google.client_secret.as_str()),
            ("redirect_uri", google.redirect_uri.as_str()),
            ("grant_type", "authorization_code"),
        ])
        .send()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Google token exchange failed: {}", e)))?;

    if !token_res.status().is_success() {
        let body = token_res.text().await.unwrap_or_default();
        tracing::error!("Google token error: {}", body);
        return Ok(Redirect::temporary(&format!("{}/#/?auth_error=google_token_failed", frontend_url)));
    }

    let token_data: GoogleTokenResponse = token_res.json().await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Failed to parse Google token: {}", e)))?;

    // Fetch user info from Google
    let user_res = client
        .get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(&token_data.access_token)
        .send()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Google userinfo failed: {}", e)))?;

    let google_user: GoogleUserInfo = user_res.json().await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Failed to parse Google user: {}", e)))?;

    // Find or create community user
    // 1. Check by google_id
    let existing_by_google: Option<(i64, String, String, String, String, String)> = sqlx::query_as(
        "SELECT id, email, name, country, company, telephone FROM community_users WHERE google_id = ?1"
    )
    .bind(&google_user.id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let (user_id, user_email, user_name, user_country, user_company, user_telephone) = if let Some(row) = existing_by_google {
        row
    } else {
        // 2. Check by email (account linking)
        let existing_by_email: Option<(i64,)> = sqlx::query_as(
            "SELECT id FROM community_users WHERE email = ?1"
        )
        .bind(&google_user.email)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

        if let Some((id,)) = existing_by_email {
            // Link google_id to existing account
            sqlx::query("UPDATE community_users SET google_id = ?1, avatar_url = COALESCE(NULLIF(avatar_url, ''), ?2), updated_at = CURRENT_TIMESTAMP WHERE id = ?3")
                .bind(&google_user.id)
                .bind(google_user.picture.as_deref().unwrap_or(""))
                .bind(id)
                .execute(&state.db)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

            let row: (i64, String, String, String, String, String) = sqlx::query_as(
                "SELECT id, email, name, country, company, telephone FROM community_users WHERE id = ?1"
            )
            .bind(id)
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
            row
        } else {
            // 3. Create new user (no password — Google-only account)
            let random_hash = bcrypt::hash("__google_oauth_no_password__", bcrypt::DEFAULT_COST)
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Hash error: {}", e)))?;

            let result = sqlx::query(
                "INSERT INTO community_users (email, password_hash, name, google_id, avatar_url) VALUES (?1, ?2, ?3, ?4, ?5)"
            )
            .bind(&google_user.email)
            .bind(&random_hash)
            .bind(&google_user.name)
            .bind(&google_user.id)
            .bind(google_user.picture.as_deref().unwrap_or(""))
            .execute(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

            (result.last_insert_rowid(), google_user.email.clone(), google_user.name.clone(), String::new(), String::new(), String::new())
        }
    };

    // Issue JWT
    let jwt = make_token(&state, &user_email, user_id, "community")?;

    let user_dto = UserDto {
        id: user_id,
        name: user_name,
        email: user_email,
        role: "community".to_string(),
        country: if user_country.is_empty() { None } else { Some(user_country) },
        company: if user_company.is_empty() { None } else { Some(user_company) },
        telephone: if user_telephone.is_empty() { None } else { Some(user_telephone) },
        avatar_url: google_user.picture,
    };

    let user_json = serde_json::to_string(&user_dto)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Serialize error: {}", e)))?;

    // Redirect to frontend with token and user data in URL fragment
    let redirect_url = format!(
        "{}/#/auth-callback?token={}&user={}",
        frontend_url,
        urlencoded(&jwt),
        urlencoded(&user_json),
    );

    Ok(Redirect::temporary(&redirect_url))
}

fn urlencoded(s: &str) -> String {
    let mut result = String::with_capacity(s.len() * 3);
    for byte in s.bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                result.push(byte as char);
            }
            _ => {
                result.push_str(&format!("%{:02X}", byte));
            }
        }
    }
    result
}
