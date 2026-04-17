-- Log every individual download event (the existing download_leads table only stores one row per email)
CREATE TABLE IF NOT EXISTS download_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    name TEXT,
    company_name TEXT,
    country TEXT,
    platform TEXT,
    version TEXT,
    filename TEXT,
    downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
