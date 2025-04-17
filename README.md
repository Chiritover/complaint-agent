# Complaint Agent — Take‑Home Assessment

A mini complaint‑management system with a **public** submission form, a **login** page, and an **internal** admin dashboard—complete with filtering, status‑toggles, and delete actions.  

---

## Demo

| Route           | Description                             | Auth              |
|-----------------|-----------------------------------------|-------------------|
| `/submit`       | Public form to file a complaint         | none              |
| `/login`        | Admin sign‑in page                      | none              |
| `/admin`        | Staff dashboard (filter / toggle / delete) | cookie login required |

---

## Tech Stack

| Layer        | Choice                                                  | Why                        |
|--------------|---------------------------------------------------------|----------------------------|
| Frontend     | **React 18** + Vite + TypeScript + Tailwind CSS         | Fast DX, zero‑config dev   |
| Backend      | **Node 20** + Express + TypeScript                      | Small footprint, typed     |
| Auth         | HTTP‑only cookie (`ADMIN_PASSWORD`)                     | Quick password‑based guard |
| Database     | **PostgreSQL 16** (Docker) or Supabase (cloud/CLI)      | Rubric‑compatible          |
| Styling /UI  | Tailwind + shadcn/ui + lucide‑react icons               | Lightweight, accessible    |

---

##  Prerequisites

| Tool | Version |
|------|---------|
| Node | ≥ 18 (LTS 20 recommended) |
| npm  | ≥ 9 |
| Docker | for local Postgres |

---

## Quick Start

### **1. Spin up Postgres 16 in Docker**

```bash
docker run --name complaints-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=complaints -p 5432:5432 -d postgres:16
docker exec -it complaints-db psql -U postgres -d complaints -c "
CREATE TABLE complaints (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  complaint   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);"
```

### **2. Backend**

```bash
cd backend
npm install
npm run dev                 # http://localhost:3000
```

You can set your admin password in backend/.env

### **3. Frontend**

```bash
cd ../frontend
npm install
npm run dev                 # http://localhost:5173
```