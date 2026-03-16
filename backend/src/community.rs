use axum::{Extension, Json, http::StatusCode, extract::Path};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;

#[derive(Serialize, sqlx::FromRow)]
pub struct Post {
    pub id: i64,
    pub title: String,
    pub content: String,
    pub author_name: String,
    // Store date as string to avoid serialization issues with simpler setups
    pub created_at: String,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Comment {
    pub id: i64,
    pub post_id: i64,
    pub content: String,
    pub author_name: String,
    pub created_at: String,
}

#[derive(Deserialize)]
pub struct CreatePostReq {
    pub title: String,
    pub content: String,
    pub author_name: String,
}

#[derive(Deserialize)]
pub struct CreateCommentReq {
    pub content: String,
    pub author_name: String,
}

// List all community posts
pub async fn list_posts(
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Vec<Post>>, (StatusCode, String)> {
    let posts = sqlx::query_as::<_, Post>(
        "SELECT id, title, content, author_name, datetime(created_at, 'localtime') as created_at FROM posts ORDER BY created_at DESC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(posts))
}

// Create a new post
pub async fn create_post(
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<CreatePostReq>,
) -> Result<Json<Post>, (StatusCode, String)> {
    let id = sqlx::query(
        "INSERT INTO posts (title, content, author_name) VALUES (?1, ?2, ?3)"
    )
    .bind(&payload.title)
    .bind(&payload.content)
    .bind(&payload.author_name)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?
    .last_insert_rowid();

    let post = sqlx::query_as::<_, Post>(
        "SELECT id, title, content, author_name, datetime(created_at, 'localtime') as created_at FROM posts WHERE id = ?1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(post))
}

// List comments for a specific post
pub async fn list_comments(
    Path(post_id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Vec<Comment>>, (StatusCode, String)> {
    let comments = sqlx::query_as::<_, Comment>(
        "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at FROM comments WHERE post_id = ?1 ORDER BY created_at ASC"
    )
    .bind(post_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(comments))
}

// Add a comment to a post
pub async fn create_comment(
    Path(post_id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<CreateCommentReq>,
) -> Result<Json<Comment>, (StatusCode, String)> {
    let id = sqlx::query(
        "INSERT INTO comments (post_id, content, author_name) VALUES (?1, ?2, ?3)"
    )
    .bind(post_id)
    .bind(&payload.content)
    .bind(&payload.author_name)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?
    .last_insert_rowid();

    let comment = sqlx::query_as::<_, Comment>(
        "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at FROM comments WHERE id = ?1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(comment))
}