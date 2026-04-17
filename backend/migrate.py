import sqlite3
from datetime import datetime

old_db_path = "/root/odara_community/data/odara.db"
new_db_path = "/root/odara_site/backend/odara.db"

old_conn = sqlite3.connect(old_db_path)
new_conn = sqlite3.connect(new_db_path)

# Ensure new tables exist (already run by axum migrations)

# Assuming the users in odara_community want to be in `download_leads` 
# with some defaults.
old_cursor = old_conn.cursor()
new_cursor = new_conn.cursor()

# Get users
old_cursor.execute("SELECT email, name, created_at FROM users")
users = old_cursor.fetchall()

migrated = 0
for row in users:
    email, name, created_at = row
    
    # Check if they already exist
    new_cursor.execute("SELECT id FROM download_leads WHERE email = ?", (email,))
    exists = new_cursor.fetchone()
    
    if not exists:
        new_cursor.execute(
            "INSERT INTO download_leads (email, name, download_count, created_at, last_download_at) VALUES (?, ?, 0, ?, ?)",
            (email, name, created_at, created_at)
        )
        migrated += 1

new_conn.commit()
print(f"Migrated {migrated} users from old odara_community database to the new site-backend download_leads table.")
