# User Management Dashboard (Full Stack)

A full-stack **User Management Dashboard** with a React (Vite) frontend and a Node.js + Express REST API backend using PostgreSQL + Sequelize, supporting full CRUD for users, search/sort/pagination, validation, and consistent JSON error handling.

## Features

### Frontend (React + Vite)
- Dashboard (Users list) with:
  - Search by name/email (from top bar)
  - Sort + Company filter
  - Desktop table + mobile cards
  - Icon actions (View / Edit / Delete) + delete confirmation modal
  - Total Users badge (from API `meta.total`) [conversation_history:1]
- Add User form (client validations)
- Edit User form (prefilled)
- User Details page (read-only)

### Backend (Node + Express + PostgreSQL)
- REST API base path: `/api`
- CRUD endpoints:
  - `GET /api/users` (supports `?search=&sort=&page=&limit=`)
  - `GET /api/users/:id`
  - `POST /api/users`
  - `PUT /api/users/:id`
  - `PATCH /api/users/:id`
  - `DELETE /api/users/:id`
- Server-side validation:
  - required fields, email format, geo lat/lng numeric
- Error format:
{ "success": false, "message": "...", "errors": [] }
- Handles: invalid id (400), not found (404), validation (400), duplicate email (409), unexpected (500) [conversation_history:1]
---
## Tech Stack
**Frontend**
- React (Vite), JavaScript
- React Router
- Axios
- Lucide Icons
- Custom CSS (responsive dashboard layout)

**Backend**
- Node.js, Express
- PostgreSQL
- Sequelize ORM
- Joi validation
- Morgan logging + CORS

## Project Structure
```
/
User Management System/
├─ Backend/
│  ├─ package.json
│  ├─ nodemon.json
│  ├─ .env.example
│  ├─ README.md
│  ├─ scripts/
│  │  └─ seed.js
│  └─ src/
│     ├─ app.js
│     ├─ server.js
│     ├─ config/
│     │  └─ db.js
│     ├─ models/
│     │  └─ User.js
│     ├─ controllers/
│     │  └─ users.controller.js
│     ├─ routes/
│     │  └─ users.routes.js
│     └─ middlewares/
│        ├─ errorHandler.js
│        └─ validateRequest.js
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   ├─ .env.example
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ styles.css
      ├─ api/
      │  ├─ http.js
      │  └─ users.js
      ├─ components/
      │  ├─ AppLayout.jsx
      │  ├─ TopBar.jsx
      │  ├─ Sidebar.jsx
      │  ├─ Drawer.jsx
      │  ├─ Button.jsx
      │  ├─ Input.jsx
      │  ├─ Select.jsx
      │  ├─ Modal.jsx
      │  ├─ ToastProvider.jsx
      │  ├─ Skeleton.jsx
      │  ├─ Pagination.jsx
      │  ├─ EmptyState.jsx
      │  └─ UserCard.jsx
      ├─ pages/
      │  ├─ UsersList.jsx
      │  ├─ UserCreate.jsx
      │  ├─ UserEdit.jsx
      │  └─ UserDetails.jsx
      └─ utils/
         ├─ validators.js
         └─ helpers.js
```
---

## Setup Instructions

### 1) Backend Setup
1. Go to backend:
cd Backend
npm install
2. Create `.env` (copy from `.env.example`) and set:
PORT=5000
DB_URI=postgres://postgres:YOUR_PASSWORD@localhost:5432/user_dashboard
DB_LOGGING=false
3. Create DB in PostgreSQL (one-time):
CREATE DATABASE user_dashboard;
4. Run backend:
npm run dev
Optional: seed sample users:
npm run seed
Backend runs at:
- http://localhost:5000
- API base: http://localhost:5000/api
---

### 2) Frontend Setup
1. Go to frontend:
cd ../Frontend
npm install
2. Create `.env` (copy from `.env.example`) and set:
VITE_API_BASE_URL=http://localhost:5000/api
3. Run frontend:
npm run dev
Frontend runs at:
- http://localhost:5173

## Screenshots (Optional)
Add screenshots here:

- Dashboard:
  ![Dashboard](https://github.com/user-attachments/assets/092a7350-fb50-495c-a11b-63b84a76dc82)
- Edit User
  ![Dashboard](https://github.com/user-attachments/assets/e5fb0b69-232a-476d-9657-d2c4ff73448b)
- User Details
  ![Dashboard](https://github.com/user-attachments/assets/445176c2-8059-4862-99db-24c8696b8fc5)
  ![Dashboard](https://github.com/user-attachments/assets/13a3e506-12bc-473f-9dc8-ed974d8fc2cd)

- Add User:
   ![Dashboard](https://github.com/user-attachments/assets/13a3e506-12bc-473f-9dc8-ed974d8fc2cd)
