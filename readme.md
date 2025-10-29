# 📚 Book Review API (Backend + Frontend WIP)

A production-focused Node.js backend project built with Express and MongoDB.  
The system allows authenticated users to manage books while enforcing validation and basic security practices.

This project is under active development — more features to come soon.

---

## ✅ Features Implemented

### 🔐 Authentication

- Register new users with hashed passwords
- Login with email + password
- Secure JWT stored in **HTTP-only cookies** (protects against XSS)
- Logout endpoint clears authentication cookie
- Protected routes using auth middleware

### 📚 Book Management (CRUD)

- Create, read, update, and delete books
- Each book includes:
  - `title`
  - `author`
  - `genre`
  - `description`
  - `publishedYear`
  - `averageRating` (placeholder for now)
- Input validation using custom middleware
- Full integration test coverage for routes

### 🧪 Automated Testing

- **Vitest** test runner
- **Supertest** integration tests for book routes
- **mongodb-memory-server** for in-memory DB testing (no external dependencies)
- Unit tests for Auth and Book services with proper mocking

### 🧱 Clean Architecture

- Layered structure:
  Route → Controller → Service → Database (Model)
- Centralized error handling with custom `AppError`
- Environment config via `.env`

---

## 🧰 Tech Stack

Backend Framework: Express.js
Database: MongoDB + Mongoose
Auth: JWT (HTTP-only cookie based)
Testing: Vitest, Supertest, MongoMemoryServer
Logging/Security: Helmet, CORS, Middlewares
Language: Modern JavaScript (ESM)

---

## 📁 Project Structure

src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── utils/
├── app.js
└── server.js

tests/
├── routes/
└── services/

---

## 🚀 Getting Started

# Install dependencies

npm install

# Setup environment variables

cp .env.example .env

# Run development server

npm run dev

# Execute tests

npx vitest run

Expected .env:

MONGO_URI=your_local_or_cluster_connection
JWT_SECRET=your_secret_here
NODE_ENV=development

---

## 🧩 Current Status

- Auth + Books fully implemented
- Unit + integration testing in place
- Frontend is in progress and consuming the API

---

## 🗺️ Next Milestones

- User reviews + ratings
- Pagination and search features
- Redis caching for performance
- Deployment with Docker
- Monitoring and metrics
