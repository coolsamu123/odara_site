use axum::{
    Extension, Json, http::StatusCode, extract::{Path, Query},
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;

#[derive(Serialize, sqlx::FromRow)]
pub struct Post {
    pub id: i64,
    pub title: String,
    pub content: String,
    pub author_name: String,
    pub category: String,
    pub status: String,
    pub priority: Option<String>,
    pub votes: i64,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct PostResponse {
    pub id: i64,
    pub title: String,
    pub body: String,
    pub category: String,
    pub status: String,
    pub priority: Option<String>,
    pub votes: i64,
    pub user_voted: bool,
    pub author_id: i64,
    pub author_username: String,
    pub created_at: String,
    pub comments: Vec<CommentResponse>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Comment {
    pub id: i64,
    pub post_id: i64,
    pub content: String,
    pub author_name: String,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct CommentResponse {
    pub id: i64,
    pub body: String,
    pub author_id: i64,
    pub author_username: String,
    pub created_at: String,
}

#[derive(Deserialize)]
pub struct ListPostsQuery {
    pub category: Option<String>,
    pub status: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Deserialize)]
pub struct CreatePostReq {
    pub title: String,
    pub body: String,
    pub category: String,
    pub priority: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdatePostReq {
    pub title: Option<String>,
    pub body: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateCommentReq {
    pub body: String,
}

// Helper: get user id from Authorization header
fn get_optional_user_id(headers: &axum::http::HeaderMap, state: &AppState) -> Option<i64> {
    use jsonwebtoken::{decode, DecodingKey, Validation};
    
    let auth_header = headers.get("Authorization")?
        .to_str()
        .ok()
        .and_then(|h| h.strip_prefix("Bearer "))?;
    
    #[derive(Debug, serde::Deserialize)]
    struct Claims {
        sub: String,
        user_id: i64,
        role: String,
    }
    
    let token_data = decode::<Claims>(
        auth_header,
        &DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &Validation::default(),
    ).ok()?;
    
    Some(token_data.claims.user_id)
}

async fn get_user_name_from_id(state: &AppState, user_id: i64) -> String {
    // Try community_users first
    #[derive(sqlx::FromRow)]
    struct CommunityUser { name: String }
    let row = sqlx::query_as::<_, CommunityUser>(
        "SELECT name FROM community_users WHERE id = ?1"
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await;
    if let Ok(Some(user)) = row {
        return user.name;
    }
    
    // Fall back to admin users
    #[derive(sqlx::FromRow)]
    struct AdminUser { username: String }
    let row2 = sqlx::query_as::<_, AdminUser>(
        "SELECT username FROM users WHERE id = ?1"
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await;
    if let Ok(Some(user)) = row2 {
        return user.username;
    }
    
    "Anonymous".to_string()
}

// GET /api/v1/community/posts?category=&status=&page=1&limit=20
pub async fn list_posts(
    Extension(state): Extension<Arc<AppState>>,
    Query(query): Query<ListPostsQuery>,
) -> Result<Json<Vec<PostResponse>>, (StatusCode, String)> {
    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = (page - 1) * limit;

    let category_filter = query.category.as_ref().map(|s| s.as_str());
    let status_filter = query.status.as_ref().map(|s| s.as_str());

    // Build query based on filters
    let (posts, total): (Vec<Post>, i64) = if let (Some(cat), Some(stat)) = (category_filter, status_filter) {
        let posts = sqlx::query_as::<_, Post>(
            "SELECT id, title, content, author_name, category, status, priority, votes, datetime(created_at, 'localtime') as created_at 
             FROM posts WHERE category = ?1 AND status = ?2 ORDER BY created_at DESC LIMIT ?3 OFFSET ?4"
        )
        .bind(cat)
        .bind(stat)
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

        let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts WHERE category = ?1 AND status = ?2")
            .bind(cat)
            .bind(stat)
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        (posts, total.0)
    } else if let Some(cat) = category_filter {
        let posts = sqlx::query_as::<_, Post>(
            "SELECT id, title, content, author_name, category, status, priority, votes, datetime(created_at, 'localtime') as created_at 
             FROM posts WHERE category = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
        )
        .bind(cat)
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

        let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts WHERE category = ?1")
            .bind(cat)
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        (posts, total.0)
    } else {
        let posts = sqlx::query_as::<_, Post>(
            "SELECT id, title, content, author_name, category, status, priority, votes, datetime(created_at, 'localtime') as created_at 
             FROM posts ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

        let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts")
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        (posts, total.0)
    };

    // For each post, get comments and check if current user voted
    // For simplicity, we won't check user_voted per-post in the list view (would need auth)
    let mut responses: Vec<PostResponse> = Vec::new();
    for p in posts {
        let comments: Vec<Comment> = sqlx::query_as::<_, Comment>(
            "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at 
             FROM comments WHERE post_id = ?1 ORDER BY created_at ASC"
        )
        .bind(p.id)
        .fetch_all(&state.db)
        .await
        .unwrap_or_default();

        responses.push(PostResponse {
            id: p.id,
            title: p.title,
            body: p.content,
            category: p.category,
            status: p.status,
            priority: p.priority,
            votes: p.votes,
            user_voted: false,
            author_id: 0,
            author_username: p.author_name,
            created_at: p.created_at,
            comments: comments.into_iter().map(|c| CommentResponse {
                id: c.id,
                body: c.content,
                author_id: 0,
                author_username: c.author_name,
                created_at: c.created_at,
            }).collect(),
        });
    }

    Ok(Json(responses))
}

// GET /api/v1/community/posts/:id
pub async fn get_post(
    Extension(state): Extension<Arc<AppState>>,
    Path(post_id): Path<i64>,
) -> Result<Json<PostResponse>, (StatusCode, String)> {
    let post: Post = sqlx::query_as::<_, Post>(
        "SELECT id, title, content, author_name, category, status, priority, votes, datetime(created_at, 'localtime') as created_at 
         FROM posts WHERE id = ?1"
    )
    .bind(post_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?
    .ok_or((StatusCode::NOT_FOUND, "Post not found".to_string()))?;

    let comments: Vec<Comment> = match sqlx::query_as::<_, Comment>(
        "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at 
         FROM comments WHERE post_id = ?1 ORDER BY created_at ASC"
    )
    .bind(post_id)
    .fetch_all(&state.db)
    .await
    {
        Ok(c) => c,
        Err(_) => Vec::new(),
    };

    Ok(Json(PostResponse {
        id: post.id,
        title: post.title,
        body: post.content,
        category: post.category,
        status: post.status,
        priority: post.priority,
        votes: post.votes,
        user_voted: false,
        author_id: 0,
        author_username: post.author_name,
        created_at: post.created_at,
        comments: comments.into_iter().map(|c| CommentResponse {
            id: c.id,
            body: c.content,
            author_id: 0,
            author_username: c.author_name,
            created_at: c.created_at,
        }).collect(),
    }))
}

// POST /api/v1/community/posts
pub async fn create_post(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(payload): Json<CreatePostReq>,
) -> Result<Json<PostResponse>, (StatusCode, String)> {
    let user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    let author_name = get_user_name_from_id(&state, user_id).await;

    let status = "open";

    let id = sqlx::query(
        "INSERT INTO posts (title, content, author_name, category, status, priority, votes) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0)"
    )
    .bind(&payload.title)
    .bind(&payload.body)
    .bind(&author_name)
    .bind(&payload.category)
    .bind(&status)
    .bind(&payload.priority)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?
    .last_insert_rowid();

    Ok(Json(PostResponse {
        id,
        title: payload.title,
        body: payload.body,
        category: payload.category,
        status: status.to_string(),
        priority: payload.priority,
        votes: 0,
        user_voted: false,
        author_id: user_id,
        author_username: author_name,
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        comments: vec![],
    }))
}

// PUT /api/v1/community/posts/:id
pub async fn update_post(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(post_id): Path<i64>,
    Json(payload): Json<UpdatePostReq>,
) -> Result<Json<PostResponse>, (StatusCode, String)> {
    let user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    // Build update query dynamically
    let mut updates: Vec<&str> = vec![];
    let mut query_parts: Vec<String> = vec![];

    if payload.title.is_some() { updates.push("title = ?"); }
    if payload.body.is_some() { updates.push("content = ?"); }
    if payload.status.is_some() { updates.push("status = ?"); }
    if payload.priority.is_some() { updates.push("priority = ?"); }

    if updates.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "No fields to update".to_string()));
    }

    let sql = format!("UPDATE posts SET {} WHERE id = ?", updates.join(", "));

    let mut query = sqlx::query(&sql);
    if let Some(ref v) = payload.title { query = query.bind(v); }
    if let Some(ref v) = payload.body { query = query.bind(v); }
    if let Some(ref v) = payload.status { query = query.bind(v); }
    if let Some(ref v) = payload.priority { query = query.bind(v); }
    query = query.bind(post_id);

    query.execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    // Fetch and return updated post
    get_post(Extension(state), Path(post_id)).await
}

// DELETE /api/v1/community/posts/:id
pub async fn delete_post(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(post_id): Path<i64>,
) -> Result<StatusCode, (StatusCode, String)> {
    let _user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    sqlx::query("DELETE FROM posts WHERE id = ?1")
        .bind(post_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(StatusCode::NO_CONTENT)
}

// POST /api/v1/community/posts/:id/vote
pub async fn toggle_vote(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(post_id): Path<i64>,
) -> Result<Json<ToggleVoteResponse>, (StatusCode, String)> {
    let user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    // Check if vote exists
    #[derive(sqlx::FromRow)]
    struct VoteRow { id: i64 }

    let existing: Option<VoteRow> = sqlx::query_as(
        "SELECT id FROM post_votes WHERE post_id = ?1 AND user_id = ?2"
    )
    .bind(post_id)
    .bind(user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    let voted: bool;
    if existing.is_some() {
        // Remove vote
        sqlx::query("DELETE FROM post_votes WHERE post_id = ?1 AND user_id = ?2")
            .bind(post_id)
            .bind(user_id)
            .execute(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        sqlx::query("UPDATE posts SET votes = votes - 1 WHERE id = ?1")
            .bind(post_id)
            .execute(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        voted = false;
    } else {
        // Add vote
        sqlx::query("INSERT INTO post_votes (post_id, user_id) VALUES (?1, ?2)")
            .bind(post_id)
            .bind(user_id)
            .execute(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        sqlx::query("UPDATE posts SET votes = votes + 1 WHERE id = ?1")
            .bind(post_id)
            .execute(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
        voted = true;
    }

    #[derive(sqlx::FromRow)]
    struct VoteCount { count: i64 }
    let count: VoteCount = sqlx::query_as("SELECT COUNT(*) as count FROM post_votes WHERE post_id = ?1")
        .bind(post_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(ToggleVoteResponse { total_votes: count.count, voted }))
}

#[derive(Serialize)]
pub struct ToggleVoteResponse {
    pub total_votes: i64,
    pub voted: bool,
}

// GET /api/v1/community/posts/:post_id/comments
pub async fn list_comments(
    Path(post_id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Vec<CommentResponse>>, (StatusCode, String)> {
    let comments = sqlx::query_as::<_, Comment>(
        "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at 
         FROM comments WHERE post_id = ?1 ORDER BY created_at ASC"
    )
    .bind(post_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(comments.into_iter().map(|c| CommentResponse {
        id: c.id,
        body: c.content,
        author_id: 0,
        author_username: c.author_name,
        created_at: c.created_at,
    }).collect()))
}

// POST /api/v1/community/posts/:post_id/comments
pub async fn create_comment(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(post_id): Path<i64>,
    Json(payload): Json<CreateCommentReq>,
) -> Result<Json<CommentResponse>, (StatusCode, String)> {
    let user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    let author_name = get_user_name_from_id(&state, user_id).await;

    let id = sqlx::query(
        "INSERT INTO comments (post_id, content, author_name) VALUES (?1, ?2, ?3)"
    )
    .bind(post_id)
    .bind(&payload.body)
    .bind(&author_name)
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?
    .last_insert_rowid();

    let comment: Comment = sqlx::query_as::<_, Comment>(
        "SELECT id, post_id, content, author_name, datetime(created_at, 'localtime') as created_at 
         FROM comments WHERE id = ?1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(Json(CommentResponse {
        id: comment.id,
        body: comment.content,
        author_id: user_id,
        author_username: comment.author_name,
        created_at: comment.created_at,
    }))
}

// DELETE /api/v1/community/comments/:id
pub async fn delete_comment(
    headers: axum::http::HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(comment_id): Path<i64>,
) -> Result<StatusCode, (StatusCode, String)> {
    let _user_id = get_optional_user_id(&headers, &state)
        .ok_or((StatusCode::UNAUTHORIZED, "Authentication required".to_string()))?;

    sqlx::query("DELETE FROM comments WHERE id = ?1")
        .bind(comment_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;

    Ok(StatusCode::NO_CONTENT)
}