# Islamic Life 24/7 (ইসলামিক লাইফ ২৪/৭) — System Architecture & Engineering Specifications

Tagline: *"Your Trusted Digital Islamic Companion — 24 Hours, Every Day."*

---

## 1. System Architecture Overview

`Islamic Life 24/7` is an enterprise-grade, full-stack multi-platform Islamic digital ecosystem built with a clean, modular architecture. It connects Android (Flutter), Web/PWA (React + Vite), Admin Portal, Node.js REST API Services, PostgreSQL + `pgvector` RAG Engine, Redis Cache, and Server-Side AI Guardrails powered by Gemini API.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYERS                                     |
+------------------------------------+----------------------------------------------+
| Android App (Flutter / Dart)       | Web / PWA (React 18 + Vite + Tailwind CSS)  |
| - Background Audio Service (HLS)   | - Responsive Multi-Language Dashboard        |
| - Offline Cache (Hive / SQLite)    | - Local Audio Player & Web Push Notifications|
| - FCM Push Notifications & Adhan   | - Admin Dashboard (React + Data Tables)      |
+------------------------------------+----------------------------------------------+
                                     |
                                     v HTTPS / WSS / JWT
+-----------------------------------------------------------------------------------+
|                            API GATEWAY / EXPRESS BACKEND                          |
| - Rate Limiter (Redis)             | - Auth Guard & Role-Based Access Control     |
| - Input Validation (Zod/Joi)       | - Request Logging & Security Audit           |
+------------------------------------+----------------------------------------------+
                                     |
      +------------------------------+------------------------------+
      |                              |                              |
      v                              v                              v
+------------------------+  +------------------------+  +------------------------+
| CORE SERVICES          |  | AI & RAG SERVICE ENGINE|  | MEDIA STREAMING ENGINE |
| - Prayer Engine        |  | - Intent Classifier    |  | - HLS 24/7 Streamer    |
| - Quran & Tafsir API   |  | - Safety Guardrails    |  | - Radio Scheduler      |
| - Hadith & Dua Engine  |  | - Vector Retriever     |  | - Background Audio Proc|
| - Routine & Habit Sync |  | - Gemini Pro LLM Proxy |  | - On-Demand Podcasts   |
+------------------------+  +------------------------+  +------------------------+
      |                              |                              |
      +------------------------------+------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                                DATA & STORAGE LAYER                               |
+------------------------------------+----------------------------------------------+
| PostgreSQL + pgvector              | Redis Cache                                  |
| - Normalized Relational Data       | - Prayer Time Calculations Cache             |
| - Verified RAG Embeddings (1536d)  | - Session Tokens & Rate Limits               |
| - User Routines & Habit Logs       | - Media Playback States                      |
+------------------------------------+----------------------------------------------+
| S3 Object Storage / Firebase Storage                                              |
| - High Quality Quran Recitations, Hadith Audios, & Islamic Media Streams          |
+-----------------------------------------------------------------------------------+
```

---

## 2. Module Dependency Map

```
                     +-----------------------+
                     |    User / Auth (RBAC) |
                     +-----------+-----------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
+------------------+   +-------------------+   +-------------------+
|  Prayer System   |   |   Quran & Tafsir  |   |   Hadith & Dua    |
| - BD Location BD |   | - Verified Text   |   | - Authenticity Grd|
| - IFB Calculations|  | - Multi Reciters  |   | - Sahih Collections|
+--------+---------+   +---------+---------+   +---------+---------+
         |                       |                       |
         +-----------------------+-----------------------+
                                 |
                                 v
                     +-----------------------+
                     |  Ibadah Habit Tracker |
                     |  & 7-Day Routine Engine|
                     +-----------+-----------+
                                 |
         +-----------------------+-----------------------+
         |                                               |
         v                                               v
+-------------------------------+             +---------------------+
| 24/7 Islamic Media & Streamer |             | Islamic Life AI     |
| - Live Audio Radio Stream     |             | - RAG Engine        |
| - Scheduled Lectures & Waz    |             | - Citation Validator|
| - Foreground Service Sync     |             | - Scholar Guardrails|
+-------------------------------+             +---------------------+
```

---

## 3. 10-Week Engineering Roadmap

| Week | Focus Area | Deliverables & Milestones |
| :--- | :--- | :--- |
| **Week 1** | Architecture & DB Schema | Setup PostgreSQL database, pgvector extension, Prisma ORM, and initial migrations for 42+ tables. |
| **Week 2** | Auth & RBAC Security | Implement JWT authentication, Google/Phone OTP login, Guest mode, and Role-Based Access Control (RBAC). |
| **Week 3** | Prayer & Calendar Engine | Build location-based Prayer Calculation (Islamic Foundation Bangladesh, MWL), Triple Calendar (Hijri, Gregorian, Bengali). |
| **Week 4** | Quran & Hadith Engine | Implement verified Quran text (Arabic, Bengali, English), audio reciter streaming, Tafsir, and Sahih Hadith indexing. |
| **Week 5** | Dua, Dhikr & Habit Tracker | Build authenticated Dua & Dhikr modules, digital Tasbih, Ibadah Habit Tracker, and 7-day personalized routines. |
| **Week 6** | 24/7 Media & Background Audio | Implement continuous HLS streaming, audio scheduling, background playback engine, and mobile foreground service sync. |
| **Week 7** | RAG Pipeline & AI Assistant | Build Document Chunking, Vector Embeddings with `pgvector`, Semantic Retriever, Citation Enforcement, and Safety Layer. |
| **Week 8** | Admin Portal & Content CMS | Web Admin Dashboard for content moderation, media scheduling, RAG ingestion, and audit logging. |
| **Week 9** | Scholar Portal & Verification | Future-ready Scholar Q&A routing, answer verification, community moderation, and safety workflows. |
| **Week 10** | Testing, Audit & Launch | Penetration testing, load testing, WCAG 2.1 accessibility check, PWA offline caching, and production release. |

---

## 4. MVP vs V2 vs V3 Feature Matrix

| Feature | MVP (Phase 1) | V2 (Phase 2) | V3 (Phase 3) |
| :--- | :---: | :---: | :---: |
| **Triple Calendar (Hijri/Greg/Bengali)** | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| **Prayer Times (IFB & BD Location)** | ✅ Full Support | ✅ Adhan Sound Selector | ✅ Smart Watch Sync |
| **Verified Quran & Audio Recitations** | ✅ 114 Surahs + Reciters | ✅ Verse Sync Audio | ✅ Word-by-Word Translation |
| **Dua & Tasbih Digital Counter** | ✅ Preset Duas & Counter | ✅ Custom Dhikr Target | ✅ Audio Guided Dhikr |
| **Islamic Life AI (RAG Assistant)** | ✅ Verified Sources + Guardrails | ✅ Voice Query Support | ✅ Multi-Madhhab Comparative RAG |
| **24/7 Live Islamic Radio Stream** | ✅ Audio Stream | ✅ Video Stream | ✅ Live Interactive Q&A |
| **Ibadah Habit Tracker** | ✅ Private Habit Progress | ✅ Weekly Analytics | ✅ Family Group Progress |
| **Verified Scholar Q&A System** | ❌ (Structure Ready) | ✅ Verified Scholar Portal | ✅ Video Answer Portal |
| **Offline Mode** | ✅ Cached Prayer & Quran | ✅ Full Audio Download | ✅ Smart Offline Sync |
