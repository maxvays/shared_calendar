# 📅 Shared Calendar Backend

This is the backend service for a group-based shared calendar web app. It allows users to create and join groups, schedule events, and share free/busy time without revealing private details outside their group.

Built with:
- 🟦 **Node.js + Express**
- 🔶 **TypeScript**
- 🐘 **PostgreSQL**
- 🧬 **Prisma ORM**
- 🐳 **Docker + Docker Compose**

---

## 📦 Features

- Users can create accounts and join multiple groups
- Groups can host events visible to all members
- Privacy: Users outside the group only see “busy” time blocks
- Group-based availability checking (free/busy logic)
- Containerized dev environment with Prisma migrations

---

## 🚀 Getting Started

### 🧰 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- (Optional) [TablePlus](https://tableplus.com/) or pgAdmin for DB browsing

---

### ⚙️ Setup

```bash
# From the project root
cd shared-calendar-backend

# Build and run the app and database
docker-compose up --build
```

This will:
- Start a PostgreSQL container with dev credentials
- Run Prisma migrations
- Start the Express server on [http://localhost:4000](http://localhost:4000)

---

### 📁 Project Structure

```
shared-calendar-backend/
├── src/                  # Express app source (index.ts)
├── prisma/               # Prisma schema & migrations
├── .env                  # Environment variables (Docker uses this)
├── Dockerfile            # App build definition
├── docker-compose.yml    # Full stack setup: app + db
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript config
```

---

## 🧪 Example API Test

Create a user:
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Max", "email": "max@example.com", "timezone": "America/New_York"}'
```

---

## 🔧 Dev Commands

```bash
docker-compose down            # Stop everything
docker-compose up --build      # Rebuild and run
docker-compose run app sh      # Shell into app container
docker logs calendar-backend   # View app logs
```

---

## 🧱 Tech Stack

| Layer         | Tech                     |
|---------------|--------------------------|
| API Server    | Node.js + Express + CORS |
| Language      | TypeScript               |
| Database      | PostgreSQL (Dockerized)  |
| ORM           | Prisma                   |
| Container     | Docker + Compose         |

---

## 📌 To Do

- [ ] Implement `POST /groups`
- [ ] Add availability checking
- [ ] Add authentication (e.g. JWT)
- [ ] Add frontend (Next.js or React)
