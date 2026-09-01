# Store Rating Platform — Frontend

React + Vite single-page app for the Store Rating Platform.

## Setup

```bash
cp .env.example .env
# edit VITE_API_BASE_URL if your backend runs somewhere other than localhost:5000
npm install
npm run dev       # http://localhost:5173
```

## Project layout

```
src/
├── components/
│   ├── common/     # ProtectedRoute, StarRating, Pagination, ConfirmDialog
│   └── tables/     # Reusable server-driven DataTable
├── pages/
│   ├── auth/       # Login, Register
│   ├── admin/      # Dashboard, Users, User details, Add User, Stores, Add Store
│   ├── user/        # Store listing + rating UI
│   └── owner/      # Store owner dashboard
├── layouts/        # DashboardLayout (sidebar + topbar shell)
├── context/        # AuthContext (JWT/session), ToastContext (notifications)
├── services/       # Axios wrappers per API resource
├── hooks/          # useTableQuery (sort/filter/page state for tables)
├── utils/          # Shared config (nav items per role)
├── App.jsx         # Route definitions + role-based redirects
└── main.jsx         # Entry point
```

## Notes

- All role checks in the UI (`ProtectedRoute`, sidebar links) are a convenience only. Every API call is independently authorized by the backend.
- The JWT is stored in `localStorage` and attached to every request via an Axios interceptor; a 401 response clears the session and redirects to `/login`.
- All listing pages (`Admin Users`, `Admin Stores`, `Stores`) fetch from the server with search/sort/pagination query parameters — there is no client-side filtering of a full dataset.
