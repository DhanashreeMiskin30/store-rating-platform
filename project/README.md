# Store Rating Platform

A full-stack web application where visitors register, log in, and rate stores (1-5), with three roles — System Admin, Normal User, and Store Owner — each getting their own dashboard and permissions enforced independently on the backend.

## Project Overview

Users log in through a single `/login` page. After authentication, a JWT determines their role and they're redirected to the matching dashboard:

- **System Admin** manages every user and store, and sees platform-wide stats.
- **Normal User** browses stores and submits or edits a rating (one per store).
- **Store Owner** sees their own store's average rating and everyone who rated it.

Role checks exist on the frontend for navigation/UX, but **every** protected backend endpoint independently verifies the JWT and role — the frontend is never trusted on its own.

## Features

- Single login system, JWT-based sessions, bcrypt password hashing
- Role-based access control enforced in Express middleware
- Self-registration for normal users; admin can create users of any role
- Server-side search, sort (asc/desc, with ↑/↓ indicators), and pagination on every listing (Admin Users, Admin Stores, Normal User Stores)
- One rating per user per store, enforced by a DB unique constraint and re-checked in the service layer; users can modify an existing rating
- Store owners see only their own store's ratings — never another owner's data
- Centralized error handling with consistent JSON responses and correct HTTP status codes
- Change-password flow available to every role

## Technology Stack

**Frontend:** React 18, React Router 6, Axios, plain modern CSS (no UI framework), functional components + hooks

**Backend:** Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, RESTful APIs

**Database:** MySQL (via `mysql2`), parameterized queries throughout (no raw string concatenation), normalized 3-table schema

## Folder Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/        # DB pool, constants
│   │   ├── controllers/   # HTTP layer
│   │   ├── middleware/    # authenticateToken, authorizeRoles, error handler
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Validation + business logic
│   │   ├── models/        # Parameterized SQL queries
│   │   ├── utils/         # ApiError, asyncHandler, response helpers, validators
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/    # ProtectedRoute, StarRating, Pagination, DataTable...
│   │   ├── pages/         # auth / admin / user / owner pages
│   │   ├── layouts/       # DashboardLayout (sidebar + topbar)
│   │   ├── services/      # Axios API wrappers
│   │   ├── context/       # AuthContext, ToastContext
│   │   ├── hooks/         # useTableQuery
│   │   ├── utils/         # navConfig
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── database/
│   └── schema.sql
└── README.md
```

## Database Setup

1. **Install MySQL** (8.0+ recommended) if you don't already have it running locally.
2. **Create the schema and seed data**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   This creates the `store_rating` database, all three tables (with foreign keys, unique constraints, CHECK constraints, and indexes), and inserts sample data.
3. **Configure `.env`** in `backend/` with your MySQL host/user/password (see below).

## Backend Setup

```bash
cd backend
cp .env.example .env      # then edit DB_* and JWT_SECRET
npm install
npm run dev                # http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
cp .env.example .env       # points to the backend API, defaults to localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173` in your browser. No source changes are needed beyond the two `.env` files.

## Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host, e.g. `localhost` |
| `DB_PORT` | MySQL port, default `3306` |
| `DB_NAME` | Database name, `store_rating` |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Long random string used to sign tokens — never commit a real one |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API port, default `5000` |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS, e.g. `http://localhost:5173` |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## API Documentation

All responses follow:
```json
{ "success": true, "message": "...", "data": {} }
```
or on failure:
```json
{ "success": false, "message": "...", "errors": { "field": "reason" } }
```

### Auth

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | none | `{ name, email, address, password }` | `201` created user (NORMAL_USER role) |
| POST | `/api/auth/login` | none | `{ email, password }` | `200` `{ token, user }` |
| PUT | `/api/auth/change-password` | Bearer token | `{ currentPassword, newPassword, confirmNewPassword }` | `200` |
| GET | `/api/auth/me` | Bearer token | — | `200` current user |

### Admin (`SYSTEM_ADMIN` only)

| Method | Endpoint | Body / Query | Response |
|---|---|---|---|
| GET | `/api/admin/dashboard` | — | `{ totalUsers, totalStores, totalRatings }` |
| POST | `/api/admin/users` | `{ name, email, password, address, role }` | `201` created user |
| GET | `/api/admin/users` | `?name=&email=&address=&role=&sortBy=&sortOrder=&page=&limit=` | `{ users, pagination }` |
| GET | `/api/admin/users/:id` | — | user (+ `store` object if STORE_OWNER) |
| POST | `/api/admin/stores` | `{ name, email, address, ownerId }` | `201` created store |
| GET | `/api/admin/stores` | `?name=&email=&address=&sortBy=&sortOrder=&page=&limit=` | `{ stores, pagination }` (`averageRating` per store) |

### Stores (any authenticated user)

| Method | Endpoint | Query | Response |
|---|---|---|---|
| GET | `/api/stores` | `?search=&sortBy=&sortOrder=&page=&limit=` | stores with `averageRating` and the caller's `myRating` |
| GET | `/api/stores/:id` | — | single store with rating summary |

### Ratings (`NORMAL_USER` only)

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/ratings` | `{ storeId, rating }` | `201` — fails `409` if already rated |
| PUT | `/api/ratings/:storeId` | `{ rating }` | `200` — fails `404` if no existing rating |

### Owner (`STORE_OWNER` only, own store only)

| Method | Endpoint | Response |
|---|---|---|
| GET | `/api/owner/dashboard` | store info, average rating, total ratings, list of raters |
| GET | `/api/owner/ratings` | list of `{ userId, name, email, rating, ratedAt }` |

### HTTP status codes used

`200` success · `201` created · `400` validation error · `401` unauthenticated · `403` forbidden (wrong role) · `404` not found · `409` conflict (duplicate email / duplicate rating) · `500` internal error

## Default Login Credentials

All seeded accounts share the password **`StrongPass@123`**.

| Role | Email |
|---|---|
| System Admin | `admin@storerating.com` |
| Normal User | `rajesh.kumar@example.com` |
| Normal User | `sunita.sharma@example.com` |
| Store Owner (ABC Electronics Store) | `amit.patel@example.com` |
| Store Owner (Fresh Mart Groceries) | `priya.verma@example.com` |

## Architectural Decisions

- **Layered backend** (`routes → controllers → services → models`): controllers stay thin (parse request, call service, shape response); all validation and business rules live in `services/`; all SQL lives in `models/` behind parameterized queries. This keeps route handlers free of business logic and makes each layer independently testable.
- **Server-side listing everywhere**: search, sort, and pagination for Admin Users, Admin Stores, and the Normal User store list are all implemented as SQL `WHERE`/`ORDER BY`/`LIMIT ... OFFSET` clauses, not client-side array filtering — this scales to large datasets and matches the spec's explicit preference.
- **Rating uniqueness enforced twice**: a DB-level `UNIQUE(user_id, store_id)` constraint is the source of truth, and the service layer also checks for an existing rating first so the API can return a clear `409 Conflict` with a helpful message instead of a raw DB error.
- **Centralized error handling**: a single Express error-handling middleware normalizes `ApiError` instances, MySQL constraint violations, and unexpected exceptions into the same JSON shape, and never leaks stack traces or SQL details to the client.
- **JWT + role middleware composition**: `authenticateToken` resolves and attaches `req.user`; `authorizeRoles(...)` is a small factory so each router declares its own allowed roles in one line (e.g. `authorizeRoles(ROLES.SYSTEM_ADMIN)`), keeping authorization intent readable at the route definition.
- **Frontend role gating is UX-only**: `ProtectedRoute` and the sidebar nav config hide irrelevant links and redirect on the client, but they are not a security boundary — the backend re-verifies role on every request, per the spec's explicit requirement.

## Screenshots

_This drive  contain screenshots of the Login page, Admin Dashboard, Admin Users/Stores tables, Normal User store grid, and Store Owner dashboard here after running the app locally._

** https://drive.google.com/drive/folders/1eo38la0jiL2daUW-QDjGfmZf8ytoVFyO?usp=sharing **
