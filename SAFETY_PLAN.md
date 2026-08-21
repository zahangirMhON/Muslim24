# Islamic Life 24/7 — Content Authenticity & AI Safety Plan

---

## 1. Core Religious Integrity Directives

1. **Zero Fabrication Policy**: The application and backend AI MUST NEVER generate hallucinated Quran verses, fabricated Hadith numbers, or invent unverified Islamic rulings.
2. **Strict RAG Grounding**: Every answer provided by `Islamic Life AI` must strictly ground its assertions in verified source chunks stored inside `rag_chunks`.
3. **No Unassisted Fatwas**: The AI assistant is explicitly constrained from giving binding personal fatwas, pronouncing Takfir, or resolving high-risk Fiqh disputes.
4. **Scholar Verification System**: Scholars must undergo identity and qualification verification before reviewing content or answering community questions.

---

## 2. Risk Categorization Matrix

| Risk Level | Category Examples | Required AI Guardrail Action |
| :--- | :--- | :--- |
| **SAFE** | Quran recitation, Prayer timing, General Duas, Basic Wudu rules | Provide direct verified text and citation. |
| **CAUTION** | Ikhtilaf (Fiqh differences among Madhhabs) | Present recognized scholarly opinions neutral to all recognized Sunni schools without declaring one absolute. |
| **HIGH RISK** | Marriage, Divorce, Inheritance, Takfir, Financial Fatwas | Output general educational information only + Mandatory disclaimer: *"Please consult a qualified local Islamic scholar for your specific personal situation."* |

---

## 3. RAG Citation & Grounding Protocol

```
           User Prompt
                |
                v
  Intent & Safety Classifier
                |
     +----------+----------+
     |                     |
[High Risk / Abuse]  [Valid Query]
     |                     |
     v                     v
  Standard            Vector Retrieval (pgvector)
  Disclaimer               |
                           v
                     Top K Relevant Chunks
                           |
                           v
               Grounding Check (Source Present?)
                     /           \
                 (Yes)           (No)
                  /                 \
                 v                   v
      LLM Answer Generation     "I could not find a sufficiently
      + Citations               verified source in the database."
```
