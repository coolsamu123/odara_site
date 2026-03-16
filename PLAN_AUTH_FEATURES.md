# Plan: Google Auth & Password Reset for Community Login

**Email:** infor@odara.rs (Zoho Mail)

---

## Current State

- **Backend:** Rust/Axum, SQLite, JWT (24h), bcrypt
- **Frontend:** React + TypeScript, AuthModal with login/register forms
- **Gaps:** Register endpoint NOT implemented. No email capability. No OAuth. Profile/password update endpoints missing.

---

## Phase 1: Fix Missing Backend Foundations

Before adding new features, the existing incomplete routes need to work.

- [ ] **1.1** Create a `community_users` table (migration) — separate from admin `users` table
  - Fields: `id`, `email` (unique), `password_hash`, `name`, `country`, `company`, `telephone`, `avatar_url`, `email_verified` (bool), `google_id` (nullable, for OAuth), `reset_token` (nullable), `reset_token_expires` (nullable), `created_at`, `updated_at`
- [ ] **1.2** Implement `POST /api/v1/auth/register` — create community user with bcrypt hash
- [ ] **1.3** Implement `PUT /api/v1/auth/profile` — update name, country, company, telephone, avatar_url (JWT-protected)
- [ ] **1.4** Implement `PUT /api/v1/auth/password` — change password with current password verification (JWT-protected)
- [ ] **1.5** Update `POST /api/v1/auth/login` to check both `users` (admin) and `community_users` tables, return appropriate role

---

## Phase 2: Google OAuth 2.0

### 2.1 Google Cloud Setup (Manual — You)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a project (or use existing)
- [ ] Enable "Google Identity" / OAuth consent screen
- [ ] Create OAuth 2.0 Client ID (Web application)
  - Authorized JavaScript origins: your domain + `http://localhost:3030`
  - Authorized redirect URIs: `https://yourdomain.com/api/v1/auth/google/callback` + `http://localhost:3030/api/v1/auth/google/callback`
- [ ] Note down `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 2.2 Backend — Google OAuth Routes

- [ ] **2.2.1** Add dependencies: `reqwest`, `serde_json` (for Google token verification)
- [ ] **2.2.2** Add env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- [ ] **2.2.3** Implement `GET /api/v1/auth/google` — redirect to Google consent screen
- [ ] **2.2.4** Implement `GET /api/v1/auth/google/callback` — exchange code for tokens, fetch user info from Google, create/find `community_users` record by `google_id` or `email`, issue JWT, redirect to frontend with token
- [ ] **2.2.5** Handle account linking: if a user registered with email+password and later signs in with Google (same email), link the `google_id` to the existing account

### 2.3 Frontend — Google Sign-In Button

- [ ] **2.3.1** Add "Sign in with Google" button to AuthModal (both login and register views)
- [ ] **2.3.2** Button redirects to `GET /api/v1/auth/google`
- [ ] **2.3.3** Handle callback: frontend reads token from URL params after redirect, stores in localStorage, updates AuthContext

---

## Phase 3: Password Reset ("Lost My Password")

### 3.1 Email Sending via Zoho SMTP (Backend)

- [ ] **3.1.1** Add `lettre` crate (Rust email library) to Cargo.toml
- [ ] **3.1.2** Configure Zoho SMTP connection:
  - Host: `smtp.zoho.eu` (or `smtppro.zoho.eu` for custom domain)
  - Port: 465 (SSL) or 587 (TLS)
  - Username: `infor@odara.rs`
  - Password: env var `SMTP_PASSWORD`
- [ ] **3.1.3** Create email helper module (`backend/src/email.rs`) — send HTML emails via SMTP

### 3.2 Backend — Password Reset Routes

- [ ] **3.2.1** Implement `POST /api/v1/auth/forgot-password`
  - Accept `{email}`
  - Generate secure random token, store in `community_users.reset_token` + expiry (1 hour)
  - Send email with reset link: `https://yourdomain.com/#/reset-password?token=TOKEN`
  - Always return success (don't reveal if email exists)
- [ ] **3.2.2** Implement `POST /api/v1/auth/reset-password`
  - Accept `{token, new_password}`
  - Validate token exists and not expired
  - Hash new password, update user, clear token
  - Return success

### 3.3 Frontend — Password Reset UI

- [ ] **3.3.1** Add "Forgot password?" link to login form in AuthModal
- [ ] **3.3.2** Create forgot password view (inside AuthModal or separate): email input → calls `POST /forgot-password` → shows "Check your email" message
- [ ] **3.3.3** Create `/reset-password` page: reads token from URL, shows new password form → calls `POST /reset-password` → shows success → redirect to login
- [ ] **3.3.4** Add `forgotPassword()` and `resetPassword()` to `api.ts`

---

## Phase 4: Verification & Polish

- [ ] **4.1** (Optional) Email verification on register — send verification email, set `email_verified = true` on click
- [ ] **4.2** Rate limiting on auth endpoints (prevent brute force)
- [ ] **4.3** Change default JWT secret to a proper env var
- [ ] **4.4** Test full flows: register → login → forgot password → reset → Google login → account linking

---

## Environment Variables Needed

```env
JWT_SECRET=<strong-random-secret>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/v1/auth/google/callback
SMTP_HOST=smtppro.zoho.eu
SMTP_PORT=465
SMTP_USER=infor@odara.rs
SMTP_PASSWORD=<zoho-app-password>
FRONTEND_URL=https://yourdomain.com
```

---

## New Dependencies

**Backend (Cargo.toml):**
- `lettre` — SMTP email sending
- `reqwest` — HTTP client (Google OAuth token exchange)
- `rand` — secure random token generation (may already be available via other crates)

**Frontend:**
- No new dependencies needed (Google OAuth uses redirect flow, not a JS SDK)

---

## Estimated Task Order

1. Phase 1 first (foundations) — everything else depends on this
2. Phase 3 (password reset) — simpler, high user value
3. Phase 2 (Google OAuth) — requires manual Google Console setup from you
4. Phase 4 (polish) — optional hardening
