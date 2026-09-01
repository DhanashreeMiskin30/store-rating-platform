# Store Rating Platform — Backend

Express.js + MySQL REST API with JWT authentication and role-based access control.

## Setup

```bash
cp .env.example .env
# edit .env with your MySQL credentials and a JWT secret
npm install
npm run dev      # nodemon, auto-restarts on change
# or
npm start
```

The server reads the database schema from `../database/schema.sql` — run that file against your MySQL server before starting the backend (see the root README).

## Project layout

```
src/
├── config/       # DB pool, app-wide constants
├── controllers/  # Thin HTTP layer — parses req, calls services, formats res
├── services/     # Business logic and validation
├── models/       # Parameterized SQL queries (mysql2)
├── middleware/   # JWT auth, role guards, centralized error handler
├── routes/       # Express routers per resource
├── utils/        # ApiError, asyncHandler, response helpers, validators
├── app.js        # Express app wiring
└── server.js     # Entry point — connects to DB, starts the HTTP server
```

## Environment variables

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default 3306) |
| `DB_NAME` | Database name (`store_rating`) |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret used to sign JWTs — keep this private |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | Port the API listens on |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS |

See the root `README.md` for full API documentation.
