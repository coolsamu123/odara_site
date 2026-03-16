use sqlx::sqlite::SqlitePoolOptions;
use bcrypt::{hash, DEFAULT_COST};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = "sqlite://odara.db";
    let pool = SqlitePoolOptions::new().connect(database_url).await?;

    let admin_user = "admin";
    let admin_pass = "admin123";

    let hashed = hash(admin_pass, DEFAULT_COST)?;

    sqlx::query(
        "INSERT INTO users (username, password_hash) VALUES (?1, ?2) ON CONFLICT(username) DO NOTHING"
    )
    .bind(admin_user)
    .bind(&hashed)
    .execute(&pool)
    .await?;

    println!("Admin user seeded successfully!");

    Ok(())
}