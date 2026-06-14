use axum::{Extension, Json, http::StatusCode};
use axum::extract::{Path, Query};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;
use crate::leads::{Lead, DownloadEvent};

// ── Admin guard: reject anything but a valid admin JWT ───────────────────────
fn require_admin(
    headers: &axum::http::HeaderMap,
    state: &AppState,
) -> Result<(), (StatusCode, String)> {
    let token = headers
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "))
        .ok_or((StatusCode::UNAUTHORIZED, "Missing or invalid token".to_string()))?;
    let data = jsonwebtoken::decode::<crate::auth::Claims>(
        token,
        &jsonwebtoken::DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &jsonwebtoken::Validation::default(),
    )
    .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".to_string()))?;
    if data.claims.role != "admin" {
        return Err((StatusCode::FORBIDDEN, "Admin only".to_string()));
    }
    Ok(())
}

// ── Admin: community user management ─────────────────────────────────────────
#[derive(Serialize)]
pub struct AdminUserOut {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub country: Option<String>,
    pub company: Option<String>,
    pub role: String,            // always "community" (admins live in `users`)
    pub active: bool,            // community login is not gated → every account can sign in
    pub created_at: Option<String>,
}

#[derive(Deserialize)]
pub struct UserListQuery {
    pub search: Option<String>,
    pub page: Option<i64>,
}

/// GET /api/v1/admin/users — list community users (optional ?search=).
pub async fn list_users(
    headers: axum::http::HeaderMap,
    Query(q): Query<UserListQuery>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Vec<AdminUserOut>>, (StatusCode, String)> {
    require_admin(&headers, &state)?;
    let _ = q.page;
    let like = format!("%{}%", q.search.unwrap_or_default());
    let rows = sqlx::query_as::<_, (i64, String, String, Option<String>, Option<String>, Option<String>)>(
        "SELECT id, name, email, country, company,
                datetime(created_at, 'localtime') as created_at
         FROM community_users
         WHERE email LIKE ?1 OR name LIKE ?1
         ORDER BY created_at DESC",
    )
    .bind(&like)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let out = rows
        .into_iter()
        .map(|(id, name, email, country, company, created_at)| AdminUserOut {
            id, name, email, country, company,
            role: "community".to_string(),
            active: true,
            created_at,
        })
        .collect();
    Ok(Json(out))
}

/// DELETE /api/v1/admin/users/:id — remove a community user.
pub async fn delete_user(
    headers: axum::http::HeaderMap,
    Path(id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<StatusCode, (StatusCode, String)> {
    require_admin(&headers, &state)?;
    let res = sqlx::query("DELETE FROM community_users WHERE id = ?1")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
    if res.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "User not found".to_string()));
    }
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Serialize)]
pub struct ResetPwOut {
    pub message: String,
    pub temporary_password: String,
}

/// POST /api/v1/admin/users/:id/reset-password — set a random temp password,
/// return it once so the admin can hand it to the user.
pub async fn reset_user_password(
    headers: axum::http::HeaderMap,
    Path(id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<ResetPwOut>, (StatusCode, String)> {
    require_admin(&headers, &state)?;
    // Generate the temp password in a block so the (!Send) ThreadRng is dropped
    // before the .await below — otherwise the handler future isn't Send.
    let temp: String = {
        use rand::Rng;
        // Ambiguity-free alphabet (no 0/O/1/l/I) so a typed temp password is safe.
        const CHARS: &[u8] = b"abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let mut rng = rand::thread_rng();
        (0..12).map(|_| CHARS[rng.gen_range(0..CHARS.len())] as char).collect()
    };
    let hash = bcrypt::hash(&temp, bcrypt::DEFAULT_COST)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Hash error: {}", e)))?;
    let res = sqlx::query(
        "UPDATE community_users SET password_hash = ?1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
    )
    .bind(&hash)
    .bind(id)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
    if res.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "User not found".to_string()));
    }
    Ok(Json(ResetPwOut {
        message: "Password reset".to_string(),
        temporary_password: temp,
    }))
}

#[derive(Serialize)]
pub struct DashboardStats {
    pub total_leads: i64,
    pub total_downloads: i64,
    pub leads_today: i64,
    pub downloads_today: i64,
    pub recent_leads: Vec<Lead>,
    pub recent_events: Vec<DownloadEvent>,
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
        
    let downloads_today: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM download_events WHERE date(downloaded_at) = date('now')"
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

    let recent_events = sqlx::query_as::<_, DownloadEvent>(
        "SELECT id, email, name, company_name, country, platform, version, filename,
         datetime(downloaded_at, 'localtime') as downloaded_at
         FROM download_events ORDER BY downloaded_at DESC LIMIT 50"
    )
    .fetch_all(&state.db)
    .await
    .unwrap_or_default();

    Ok(Json(DashboardStats {
        total_leads: total_leads.0,
        total_downloads: total_downloads.0,
        leads_today: leads_today.0,
        downloads_today: downloads_today.0,
        recent_leads,
        recent_events,
    }))
}