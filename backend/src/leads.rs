use axum::{Extension, Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;

#[derive(Deserialize)]
pub struct CaptureLeadReq {
    pub email: String,
    pub name: Option<String>,
    pub company_name: Option<String>,
    pub country: Option<String>,
    pub version: Option<String>,
    pub filename: Option<String>,
    pub platform: Option<String>,
}

#[derive(Serialize)]
pub struct CaptureLeadRes {
    pub message: String,
    pub download_link: String,
}

#[derive(Serialize, sqlx::FromRow, Clone)]
pub struct Lead {
    pub id: i64,
    pub email: String,
    pub name: Option<String>,
    pub company_name: Option<String>,
    pub country: Option<String>,
    pub platform: Option<String>,
    pub version: Option<String>,
    pub ip_address: Option<String>,
    pub download_count: i64,
    pub created_at: Option<String>,
    pub last_download_at: Option<String>,
}

// 1. Capture Lead & Provide Download Link
pub async fn capture_lead(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<CaptureLeadReq>,
) -> Result<Json<CaptureLeadRes>, (StatusCode, String)> {
    let email = payload.email.trim();
    if email.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Email is required".to_string()));
    }

    // Insert or update lead in SQLite
    let query = r#"
        INSERT INTO download_leads (email, name, company_name, country, platform, version, download_count)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1)
        ON CONFLICT(email) DO UPDATE SET
            download_count = download_count + 1,
            name = COALESCE(EXCLUDED.name, download_leads.name),
            company_name = COALESCE(EXCLUDED.company_name, download_leads.company_name),
            country = COALESCE(EXCLUDED.country, download_leads.country),
            platform = COALESCE(EXCLUDED.platform, download_leads.platform),
            version = COALESCE(EXCLUDED.version, download_leads.version),
            last_download_at = CURRENT_TIMESTAMP;
    "#;

    sqlx::query(query)
        .bind(email)
        .bind(&payload.name)
        .bind(&payload.company_name)
        .bind(&payload.country)
        .bind(&payload.platform)
        .bind(&payload.version)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    // In a real app, generate a secure token or presigned S3 URL
    let download_link = format!("https://odara.local/files/resource.pdf?token=12345");

    Ok(Json(CaptureLeadRes {
        message: "Lead captured successfully".into(),
        download_link,
    }))
}

// 2. Admin Route: List all leads
pub async fn list_leads(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Vec<Lead>>, (StatusCode, String)> {
    
    // Auth verification
    let auth_header = headers.get("Authorization").and_then(|h| h.to_str().ok());
    let token = match auth_header {
        Some(h) if h.starts_with("Bearer ") => &h[7..],
        _ => return Err((StatusCode::UNAUTHORIZED, "Missing or invalid token".to_string())),
    };

    let token_data = jsonwebtoken::decode::<crate::auth::Claims>(
        token,
        &jsonwebtoken::DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &jsonwebtoken::Validation::default(),
    ).map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".to_string()))?;

    if token_data.claims.role != "admin" {
        return Err((StatusCode::FORBIDDEN, "Admin only".to_string()));
    }
    let leads = sqlx::query_as::<_, Lead>(
        "SELECT id, email, name, company_name, country, platform, version, ip_address, download_count, 
         datetime(created_at, 'localtime') as created_at, 
         datetime(last_download_at, 'localtime') as last_download_at 
         FROM download_leads ORDER BY created_at DESC"
    )
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(leads))
}