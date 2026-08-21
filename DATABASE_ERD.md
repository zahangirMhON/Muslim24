# Islamic Life 24/7 — Database ERD & Schema Documentation

The database architecture uses **PostgreSQL 15+** with the `pgvector` extension for semantic vector search and RAG embeddings. All primary keys use `UUIDv4` for security and distributed data synchronization.

---

## 1. Core Tables & Relationships

```
                            +--------------------+
                            |       users        |
                            +---------+----------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+        +--------------------+        +--------------------+
|  user_profiles   |        |   user_roles       |        |  user_preferences  |
+------------------+        +---------+----------+        +--------------------+
                                      |
                                      v
                            +--------------------+
                            |       roles        |
                            +--------------------+

                                QURAN MODULE
+------------------+        +--------------------+        +--------------------+
|   quran_surahs   |------->|   quran_verses     |<-------| quran_translations |
+------------------+        +---------+----------+        +--------------------+
                                      |
                                      v
                            +--------------------+
                            |    quran_tafsirs   |
                            +--------------------+

                                HADITH MODULE
+------------------+        +--------------------+        +--------------------+
|hadith_collections|------->|    hadith_books    |------->|      hadiths       |
+------------------+        +--------------------+        +--------------------+

                           RAG & AI KNOWLEDGE MODULE
+------------------+        +--------------------+        +--------------------+
|   rag_sources    |------->|   rag_documents    |------->|     rag_chunks     |
+------------------+        +--------------------+        +-- (with pgvector) -+
```

---

## 2. Complete PostgreSQL DDL Schema Script

```sql
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles & Permissions Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'SCHOLAR', 'USER'
    description TEXT
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 3. User Preferences & Settings
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'bn', -- 'bn', 'en', 'ar'
    theme VARCHAR(20) DEFAULT 'dark',
    district_id VARCHAR(50) DEFAULT 'dhaka',
    calculation_method VARCHAR(50) DEFAULT 'ifb',
    asr_madhab VARCHAR(20) DEFAULT 'hanafi',
    data_saver_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Prayer Times & Locations Table
CREATE TABLE locations (
    id VARCHAR(50) PRIMARY KEY,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    division_bn VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    time_offset_minutes INT DEFAULT 0
);

-- 5. Quran Surahs Table
CREATE TABLE quran_surahs (
    id INT PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    meaning_bn VARCHAR(255) NOT NULL,
    revelation_place VARCHAR(20) NOT NULL, -- 'Makkah' or 'Madinah'
    total_verses INT NOT NULL
);

-- 6. Quran Verses Table
CREATE TABLE quran_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_id INT REFERENCES quran_surahs(id) ON DELETE CASCADE,
    verse_number INT NOT NULL,
    text_ar TEXT NOT NULL,
    page_number INT,
    juz_number INT,
    UNIQUE (surah_id, verse_number)
);

-- 7. Quran Translations Table
CREATE TABLE quran_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID REFERENCES quran_verses(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL, -- 'bn', 'en'
    translator_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL
);

-- 8. Quran Tafsir Table
CREATE TABLE quran_tafsirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID REFERENCES quran_verses(id) ON DELETE CASCADE,
    source_name VARCHAR(100) NOT NULL, -- e.g. 'Tafsir Ibn Kathir', 'Tafsir Ahsanul Bayaan'
    language VARCHAR(10) NOT NULL,
    text TEXT NOT NULL
);

-- 9. Hadith Collections
CREATE TABLE hadith_collections (
    id VARCHAR(50) PRIMARY KEY, -- 'bukhari', 'muslim', 'tirmidhi', etc.
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    total_hadiths INT NOT NULL
);

CREATE TABLE hadith_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id VARCHAR(50) REFERENCES hadith_collections(id) ON DELETE CASCADE,
    book_number INT NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL
);

CREATE TABLE hadiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES hadith_books(id) ON DELETE CASCADE,
    hadith_number INT NOT NULL,
    text_ar TEXT,
    text_bn TEXT NOT NULL,
    text_en TEXT,
    grade VARCHAR(50) NOT NULL, -- 'Sahih', 'Hasan', 'Da'if'
    explanation_bn TEXT,
    verification_status VARCHAR(20) DEFAULT 'VERIFIED'
);

-- 10. Dua & Dhikr Table
CREATE TABLE duas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_bn VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    text_ar TEXT NOT NULL,
    transliteration_bn TEXT,
    meaning_bn TEXT NOT NULL,
    meaning_en TEXT,
    reference_bn TEXT NOT NULL,
    authenticity_status VARCHAR(50) DEFAULT 'SAHIH'
);

-- 11. Ibadah Habit Logs
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    fajr_completed BOOLEAN DEFAULT FALSE,
    dhuhr_completed BOOLEAN DEFAULT FALSE,
    asr_completed BOOLEAN DEFAULT FALSE,
    maghrib_completed BOOLEAN DEFAULT FALSE,
    isha_completed BOOLEAN DEFAULT FALSE,
    quran_verses_read INT DEFAULT 0,
    dhikr_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- 12. 24/7 Media & Broadcast Schedule
CREATE TABLE media_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_url VARCHAR(500) NOT NULL,
    media_type VARCHAR(20) NOT NULL, -- 'AUDIO_STREAM', 'VIDEO_STREAM', 'PODCAST'
    speaker_name VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_live BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. RAG Knowledge Sources & Embeddings (pgvector)
CREATE TABLE rag_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rag_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES rag_sources(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reference VARCHAR(255) NOT NULL,
    embedding vector(1536), -- 1536-dimensional vector embedding for Gemini / OpenAI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Speed & Optimization
CREATE INDEX idx_quran_verses_surah ON quran_verses(surah_id);
CREATE INDEX idx_hadiths_book ON hadiths(book_id);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX idx_rag_chunks_embedding ON rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
