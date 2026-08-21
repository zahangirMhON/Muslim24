# Islamic Life 24/7 — OpenAPI / REST API Specification (v1)

Base Path: `/api/v1`

All responses follow a standard unified JSON format:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-07-26T15:00:00.000Z"
}
```

Standard Error Payload:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "আপনার সেশনটি মেয়াদোত্তীর্ণ হয়েছে। পুনরায় লগইন করুন।"
  },
  "timestamp": "2026-07-26T15:00:00.000Z"
}
```

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "fullName": "আহমেদ হাসান",
    "email": "ahmed@example.com",
    "password": "SecurePassword123!",
    "districtId": "dhaka"
  }
  ```
- **Response**: `201 Created` with JWT `accessToken` & `refreshToken`.

### `POST /api/v1/auth/login`
Authenticates user with email/password or phone.
- **Request Body**:
  ```json
  {
    "email": "ahmed@example.com",
    "password": "SecurePassword123!"
  }
  ```

---

## 2. Prayer Times & Calendar Endpoints

### `GET /api/v1/prayer/times`
Retrieves daily or monthly prayer times calculated according to Bangladesh location or GPS coordinates.
- **Query Params**:
  - `district` (string, optional, e.g., `dhaka`)
  - `lat` (number, optional, e.g., `23.8103`)
  - `lng` (number, optional, e.g., `90.4125`)
  - `method` (string, default `ifb`)
- **Response Payload**:
  ```json
  {
    "success": true,
    "data": {
      "location": "ঢাকা, বাংলাদেশ",
      "date": "2026-07-26",
      "hijriDate": "১২ মহররম ১৪৪৮ হিজরী",
      "bengaliDate": "১২ শ্রাবণ ১৪৩৩ বঙ্গাব্দ",
      "prayerTimes": [
        { "name": "Fajr", "nameBn": "ফজর", "time": "04:12 AM", "isNext": false },
        { "name": "Dhuhr", "nameBn": "যোহর", "time": "12:08 PM", "isNext": false },
        { "name": "Asr", "nameBn": "আসর", "time": "04:35 PM", "isNext": true },
        { "name": "Maghrib", "nameBn": "মাগরিব", "time": "06:48 PM", "isNext": false },
        { "name": "Isha", "nameBn": "এশা", "time": "08:10 PM", "isNext": false }
      ]
    }
  }
  ```

---

## 3. Islamic Life AI (RAG Assistant) Endpoints

### `POST /api/v1/ai/chat`
Proxies Islamic knowledge queries through backend RAG vector search and Gemini LLM guardrails.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
  ```json
  {
    "message": "তাহাজ্জুদ নামাজের সময় এবং পড়ার সঠিক নিয়ম কি?"
  }
  ```
- **Response Payload**:
  ```json
  {
    "success": true,
    "data": {
      "reply": "তাহাজ্জুদ নামাজ এশার নামাজের পর শেষ রাতে ঘুমানোর পর উঠে পড়া হয়। সর্বনিম্ন ২ রাকাত থেকে শুরু করে ৮ বা ১২ রাকাত পর্যন্ত পড়া যায়।...",
      "sources": [
        "সহীহ বুখারী - অনুচ্ছেদ: রাতের তাহাজ্জুদ",
        "সহীহ মুসলিম - সালাতুল মুসাফিরীন"
      ],
      "confidenceScore": 0.98,
      "disclaimer": "এটি সাধারণ ইসলামিক তথ্যের জন্য প্রদান করা হয়েছে, ব্যক্তিগত ফতোয়া হিসেবে গ্রহণযোগ্য নয়।"
    }
  }
  ```

---

## 4. Quran, Hadith & Media Endpoints

### `GET /api/v1/quran/surahs`
Returns list of all 114 Quran Surahs.

### `GET /api/v1/hadith/search?query=নিয়ত`
Searches verified Sahih Hadith collections.

### `GET /api/v1/media/schedule`
Returns current 24/7 continuous broadcast schedule and stream links.
