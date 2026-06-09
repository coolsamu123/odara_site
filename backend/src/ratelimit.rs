use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use axum::http::{HeaderMap, StatusCode};

/// Simple in-memory fixed-window rate limiter, keyed by an arbitrary string
/// (e.g. "login:<ip>" or "forgot:<email>"). State resets on restart, which is
/// fine for abuse mitigation. Not distributed — this service is single-instance.
pub struct RateLimiter {
    inner: Mutex<HashMap<String, (u32, Instant)>>,
}

impl RateLimiter {
    pub fn new() -> Self {
        Self { inner: Mutex::new(HashMap::new()) }
    }

    /// Allow up to `max` hits per `window`. Returns Err(retry_after_secs) when
    /// the caller is over the limit.
    pub fn check(&self, key: &str, max: u32, window: Duration) -> Result<(), u64> {
        let now = Instant::now();
        let mut map = self.inner.lock().unwrap();

        // Opportunistic prune so the map can't grow without bound.
        if map.len() > 10_000 {
            map.retain(|_, (_, start)| now.duration_since(*start) < window);
        }

        let entry = map.entry(key.to_string()).or_insert((0, now));
        if now.duration_since(entry.1) >= window {
            *entry = (0, now);
        }
        if entry.0 >= max {
            let retry = window.saturating_sub(now.duration_since(entry.1)).as_secs().max(1);
            return Err(retry);
        }
        entry.0 += 1;
        Ok(())
    }
}

impl Default for RateLimiter {
    fn default() -> Self {
        Self::new()
    }
}

/// Best-effort client IP: trusts Cloudflare's `CF-Connecting-IP`, then the
/// first hop of `X-Forwarded-For`. NOTE: spoofable until the origin only
/// accepts traffic from Cloudflare (lock :80 to CF IP ranges).
pub fn client_ip(headers: &HeaderMap) -> String {
    if let Some(ip) = headers.get("CF-Connecting-IP").and_then(|v| v.to_str().ok()) {
        let ip = ip.trim();
        if !ip.is_empty() {
            return ip.to_string();
        }
    }
    if let Some(xff) = headers.get("X-Forwarded-For").and_then(|v| v.to_str().ok()) {
        if let Some(first) = xff.split(',').next() {
            let first = first.trim();
            if !first.is_empty() {
                return first.to_string();
            }
        }
    }
    "unknown".to_string()
}

/// Turn an over-limit result into an HTTP 429 response tuple.
pub fn too_many(retry_after: u64) -> (StatusCode, String) {
    (
        StatusCode::TOO_MANY_REQUESTS,
        format!("Too many requests. Try again in {}s.", retry_after),
    )
}
