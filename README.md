# ☕ Java Theory Trainer

A local-first web app for studying Java theory questions using spaced repetition. Built with **Spring Boot** (backend) and **React + Vite + TypeScript** (frontend).

---

## Features

- 📚 **245 seed questions** covering Core Java, JVM, Concurrency, Spring, SQL, System Design, Testing, and Build tools — loaded automatically on first run
- 🔁 **Spaced repetition** scheduling (HARD / OK / EASY ratings)
- 📊 **Dashboard** with due-today count and progress stats
- 🎯 **Study sessions** — reveals answer on demand, then you rate your knowledge
- 🗂️ **Question management** — search, filter by tag, add/edit/delete
- 📥 **Import endpoint** — replace or append questions from a JSON file

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.9+ (or use the included `mvnw`) |
| Node.js | 18+ |
| npm | 9+ |

---

## Running Locally

### Terminal 1 — Backend

```bash
cd backend
./mvnw spring-boot:run
```

> The backend starts on **http://localhost:8080**.  
> The H2 database is stored in `backend/data/trainer.mv.db` and persists across restarts.  
> Seed questions are loaded automatically on the first run if the database is empty.

On Windows:
```cmd
cd backend
mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

> The frontend starts on **http://localhost:5173** and proxies `/api` requests to the backend automatically.

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stats` | Dashboard stats (dueToday, total, learned) |
| `POST` | `/api/session/start` | Start a session — returns first due question |
| `GET` | `/api/session/next` | Get next due question |
| `POST` | `/api/review` | Submit rating `{questionId, rating: HARD\|OK\|EASY}` |
| `GET` | `/api/questions?query=&tag=` | List / search questions |
| `POST` | `/api/questions` | Create a question |
| `PUT` | `/api/questions/{id}` | Update a question |
| `DELETE` | `/api/questions/{id}` | Delete a question |
| `POST` | `/api/questions/import?replace=false` | Import questions from JSON array |

### H2 Console (dev only)
Visit **http://localhost:8080/h2-console**  
JDBC URL: `jdbc:h2:file:./data/trainer`  
Username: `sa` / Password: *(empty)*

---

## Importing Custom Questions

Create a JSON file (e.g., `my-questions.json`) with the format:

```json
[
  {
    "prompt": "What is the difference between == and equals() in Java?",
    "answer": "== compares object references (memory addresses), while equals() compares object content. For String, Integer, etc., always use equals() for value comparison.",
    "tags": "Java,OOP",
    "difficulty": "EASY"
  }
]
```

Then import it:

```bash
# Append to existing questions
curl -X POST http://localhost:8080/api/questions/import \
  -H "Content-Type: application/json" \
  -d @my-questions.json

# Replace all existing questions
curl -X POST "http://localhost:8080/api/questions/import?replace=true" \
  -H "Content-Type: application/json" \
  -d @my-questions.json
```

---

## Spaced Repetition Algorithm

| Rating | New interval |
|--------|-------------|
| **HARD** | 1 day |
| **OK** | max(3, current × 2) days |
| **EASY** | max(7, current × 3) days |

`nextReviewDate = today + intervalDays`

---

## Project Structure

```
java-theory-trainer/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/trainer/
│   │   ├── entity/             # JPA entities (Question, ReviewState)
│   │   ├── repository/         # Spring Data repositories
│   │   ├── service/            # Business logic + seed loader
│   │   ├── controller/         # REST controllers
│   │   └── dto/                # Request/response DTOs
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── db/migration/       # Flyway SQL migrations
│   │   └── questions.json      # Seed data (245 questions)
│   └── pom.xml
│
├── frontend/                   # React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── api/client.ts       # Fetch-based API client
│   │   ├── types/index.ts      # TypeScript type definitions
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Stats + session start
│   │   │   ├── Session.tsx     # Review flow (show answer + rating)
│   │   │   └── Questions.tsx   # CRUD + search + filter
│   │   ├── App.tsx             # Router + nav
│   │   └── App.css             # Styles
│   ├── vite.config.ts          # Dev proxy: /api → localhost:8080
│   └── package.json
│
└── README.md
```
