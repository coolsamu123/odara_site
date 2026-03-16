use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

#[derive(Clone)]
pub struct SmtpConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub from_email: String,
    pub frontend_url: String,
}

impl SmtpConfig {
    pub fn from_env() -> Option<Self> {
        let password = std::env::var("SMTP_PASSWORD").ok()?;
        Some(Self {
            host: std::env::var("SMTP_HOST").unwrap_or_else(|_| "smtppro.zoho.eu".to_string()),
            port: std::env::var("SMTP_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(587),
            username: std::env::var("SMTP_USER").unwrap_or_else(|_| "infor@odara.rs".to_string()),
            password,
            from_email: std::env::var("SMTP_FROM").unwrap_or_else(|_| "infor@odara.rs".to_string()),
            frontend_url: std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3030".to_string()),
        })
    }
}

pub fn send_password_reset_email(
    config: &SmtpConfig,
    to_email: &str,
    token: &str,
) -> Result<(), String> {
    let reset_link = format!("{}/#/reset-password?token={}", config.frontend_url, token);

    let body = format!(
        r#"<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #0d0f13; color: #e0e0e0; padding: 40px;">
  <div style="max-width: 480px; margin: 0 auto; background: #1a1d24; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
    <h2 style="color: #ffffff; margin-top: 0;">Reset Your Password</h2>
    <p>We received a request to reset your Odara Community password. Click the button below to set a new password:</p>
    <a href="{reset_link}" style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0;">Reset Password</a>
    <p style="font-size: 14px; color: #888;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;">
    <p style="font-size: 12px; color: #666;">Odara &mdash; odara.rs</p>
  </div>
</body>
</html>"#
    );

    let email = Message::builder()
        .from(
            format!("Odara <{}>", config.from_email)
                .parse()
                .map_err(|e| format!("Invalid from address: {}", e))?,
        )
        .to(to_email
            .parse()
            .map_err(|e| format!("Invalid to address: {}", e))?)
        .subject("Reset your Odara password")
        .header(ContentType::TEXT_HTML)
        .body(body)
        .map_err(|e| format!("Failed to build email: {}", e))?;

    let creds = Credentials::new(config.username.clone(), config.password.clone());

    let mailer = SmtpTransport::starttls_relay(&config.host)
        .map_err(|e| format!("SMTP relay error: {}", e))?
        .port(config.port)
        .credentials(creds)
        .build();

    mailer
        .send(&email)
        .map_err(|e| format!("Failed to send email: {}", e))?;

    Ok(())
}
