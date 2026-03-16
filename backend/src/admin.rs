use axum::{Extension, Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;
use crate::leads::Lead;

#[derive(Serialize)]
pub struct DashboardStats {
    pub total_leads: i64,
    pub total_downloads: i64,
    pub leads_today: i64,
    pub recent_leads: Vec<Lead>,
}

// 3. Admin Route: Dashboard Aggregations
pub async fn dashboard_stats(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<DashboardStats>, (StatusCode, String)> {
    
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
    
    let total_leads: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM download_leads")
        .fetch_one(&state.db)
        .await
        .unwrap_or((0,));
        
    let total_downloads: (i64,) = sqlx::query_as("SELECT COALESCE(SUM(download_count), 0) FROM download_leads")
        .fetch_one(&state.db)
        .await
        .unwrap_or((0,));
        
    let leads_today: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM download_leads WHERE date(created_at) = date('now')"
    )
        .fetch_one(&state.db)
        .await
        .unwrap_or((0,));
        
    let recent_leads = sqlx::query_as::<_, Lead>(
        "SELECT id, email, name, company_name, country, platform, version, ip_address, download_count, 
         datetime(created_at, 'localtime') as created_at, 
         datetime(last_download_at, 'localtime') as last_download_at 
         FROM download_leads ORDER BY created_at DESC LIMIT 50"
    )
    .fetch_all(&state.db)
    .await
    .unwrap_or_default();

    Ok(Json(DashboardStats {
        total_leads: total_leads.0,
        total_downloads: total_downloads.0,
        leads_today: leads_today.0,
        recent_leads,
    }))
}