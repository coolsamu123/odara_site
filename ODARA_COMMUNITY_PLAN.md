# Odara's Community — Build Plan

## Goal

Build a **self-hosted community platform** for Odara where users can report bugs, request features, share knowledge, and engage with each other. Hosted on `65.21.199.249` with its own Rust backend.

---

## Architecture

```
┌─────────────────────────────────┐
│   Frontend (React)              │
│   coolsamu123.github.io/odara_site  │
│   Community section in the app  │
└──────────────┬──────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────┐
│   Backend (Rust / Axum)         │
│   65.21.199.249:3080            │
│   /api/posts, /api/bugs, etc.   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   SQLite Database               │
│   odara_community.db            │
└─────────────────────────────────┘
```

**Stack:**
- **Backend:** Rust + Axum (consistent with Odara ecosystem)
- **Database:** SQLite (zero config, single file, easy backup)
- **Auth:** Simple username/email registration (bcrypt passwords, JWT tokens)
- **Frontend:** React components added to the existing site

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,  -- bcrypt hash
    avatar_url  TEXT,
    role        TEXT DEFAULT 'member',  -- member, moderator, admin
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts (bugs, features, discussions, announcements)
CREATE TABLE posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id   INTEGER NOT NULL REFERENCES users(id),
    category    TEXT NOT NULL,  -- 'bug', 'feature', 'discussion', 'announcement'
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    status      TEXT DEFAULT 'open',  -- open, in_progress, resolved, closed
    priority    TEXT,  -- low, medium, high, critical (for bugs)
    votes       INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments
CREATE TABLE comments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id     INTEGER NOT NULL REFERENCES posts(id),
    author_id   INTEGER NOT NULL REFERENCES users(id),
    body        TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Votes (one per user per post)
CREATE TABLE votes (
    user_id     INTEGER NOT NULL REFERENCES users(id),
    post_id     INTEGER NOT NULL REFERENCES posts(id),
    PRIMARY KEY (user_id, post_id)
);
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET  | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts?category=bug&status=open` | List posts (filtered) |
| GET | `/api/posts/:id` | Get single post + comments |
| POST | `/api/posts` | Create post (auth required) |
| PUT | `/api/posts/:id` | Update post (author/admin) |
| DELETE | `/api/posts/:id` | Delete post (author/admin) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:id/comments` | Add comment (auth required) |
| DELETE | `/api/comments/:id` | Delete comment (author/admin) |

### Votes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:id/vote` | Toggle upvote (auth required) |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Community stats (members, posts, resolved bugs) |

---

## Frontend Components

```
components/
  community/
    CommunityPage.tsx       — Main page layout with tabs
    CommunityHero.tsx       — Header + "New Post" button
    PostList.tsx            — Filtered list of posts (bugs/features/discussions)
    PostCard.tsx            — Single post preview (title, votes, status, author)
    PostDetail.tsx          — Full post view + comments thread
    PostForm.tsx            — Create/edit post form
    CommentThread.tsx       — List of comments on a post
    CommentForm.tsx         — Write a comment
    VoteButton.tsx          — Upvote toggle with count
    CategoryTabs.tsx        — Tabs: All | Bugs | Features | Discussions
    StatusBadge.tsx         — Colored badge (open, resolved, etc.)
    AuthModal.tsx           — Login / Register modal
    CommunityStats.tsx      — Member count, posts, resolved bugs
```

---

## Implementation Phases

### Phase 1 — Backend Setup
1. Create Rust project: `odara-community-api/`
2. Set up Axum with CORS (allow GitHub Pages origin)
3. Set up SQLite with `rusqlite` or `sqlx`
4. Implement database migrations (create tables)
5. Implement auth endpoints (register, login, JWT)

### Phase 2 — Backend CRUD
6. Implement posts CRUD (create, list, get, update, delete)
7. Implement comments (create, delete)
8. Implement voting (toggle upvote)
9. Implement stats endpoint
10. Add category filtering & pagination

### Phase 3 — Deploy Backend
11. Build release binary
12. Deploy to `65.21.199.249:3080`
13. Set up systemd service for auto-restart
14. Test API with curl

### Phase 4 — Frontend: Navigation & Layout
14. Add "Community" to navbar in `constants.tsx`
15. Create `CommunityPage.tsx` with category tabs
16. Create `CommunityHero.tsx`
17. Wire into `App.tsx`

### Phase 5 — Frontend: Auth
18. Build `AuthModal.tsx` (login/register forms)
19. Store JWT in localStorage
20. Add auth context/state management

### Phase 6 — Frontend: Posts & Comments
21. Build `PostList.tsx` + `PostCard.tsx` (browse posts)
22. Build `PostForm.tsx` (create bug/feature/discussion)
23. Build `PostDetail.tsx` + `CommentThread.tsx` + `CommentForm.tsx`
24. Build `VoteButton.tsx`
25. Build `StatusBadge.tsx` + `CategoryTabs.tsx`

### Phase 7 — Frontend: Stats & Polish
26. Build `CommunityStats.tsx`
27. Match styling to existing site (dark theme, glass panels)
28. Mobile responsive
29. Loading states & error handling

### Phase 8 — Deploy & Ship
30. Commit frontend changes, push → GitHub Pages auto-deploys
31. Final end-to-end testing

---

## Design

- Same dark theme as main site (`#0B0E14`, glass panels, gradients)
- Category colors:
  - Bug: red (`#ef4444`)
  - Feature: cyan (`#06b6d4`)
  - Discussion: indigo (`#6366f1`)
  - Announcement: amber (`#f59e0b`)
- Status badges: open (blue), in_progress (yellow), resolved (green), closed (gray)
- Icons from `lucide-react`: Bug, Lightbulb, MessageSquare, Megaphone, ThumbsUp, User

---

## File Structure

```
odara_site/                          # Existing frontend repo
  components/community/              # New community components
  ...

odara-community-api/                 # New backend repo (on server)
  Cargo.toml
  src/
    main.rs                          # Axum server entry
    db.rs                            # SQLite setup + migrations
    models.rs                        # Data structs
    handlers/
      auth.rs                        # Register, login, me
      posts.rs                       # CRUD posts
      comments.rs                    # CRUD comments
      votes.rs                       # Toggle vote
      stats.rs                       # Community stats
    middleware/
      auth.rs                        # JWT validation middleware
  odara_community.db                 # SQLite database file
```
