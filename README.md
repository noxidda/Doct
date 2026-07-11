# Doct – Modern Collaborative SaaS Workspace

Syncora is a professional-grade team collaboration platform combining project dashboards, Kanban grids, Notion-like documentation, calendars, and systems administration interfaces. It is styled strictly following **Bauhaus design principles** (sharp corners, no animations, grid-based layouts, and a dedicated wheat-on-brown color palette).

---

## Workspace Structure

The project is structured as a full-stack application split into two primary components:

```
Doct/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Geometric UI layout (Sidebar, Search grid)
│   │   ├── context/        # Auth & AppState contexts (Axios + Sockets connection)
│   │   ├── pages/          # All 20 UI views (Landing, Dashboard, Tasks, Docs, etc.)
│   │   ├── services/       # api.js Axios request configurator
│   │   └── styles/         # index.css theme rules and CSS variables
│   └── package.json
│
└── server/                 # Node.js + Express.js Backend
    ├── src/
    │   ├── middleware/     # Clerk authentication & RBAC check layer
    │   ├── models/         # Mongoose DB models (User, Workspace, Project, Task, Page, Log)
    │   └── server.js       # Main server engine (REST APIs & Socket.io)
    ├── package.json
    └── .env                # Config environment variables
```

---

## Production vs Local Demo Modes

### 1. Local Demo Mode (Default)
Runs instantly out of the box without requiring external API tokens or running databases:
- **Client Fallback:** If the backend server is offline, the React app automatically saves workspaces, projects, tasks, comments, and pages to `localStorage`.
- **Role Switching:** Click the **Test Role** switcher at the bottom of the sidebar to immediately toggle your account role between **Owner, Admin, Manager, and Member** to evaluate permission configurations.
- **Server DB Fallback:** If the Express server starts without a `MONGO_URI` variable, it operates using a high-fidelity Memory Database engine.

### 2. Live Clerk/MongoDB Production Mode
Enable production features by configuring environment variables in `server/.env`:
- Provide `MONGO_URI` to connect to a live MongoDB Atlas database cluster.
- Set `USE_CLERK=true` and input your Clerk API publishable and secret keys to activate JWT authorization.

---

## Setup & Startup Instructions

### 1. Setup Backend
```bash
cd server
npm install
npm run dev
```
*The Express server boots on `http://localhost:5000` with active Socket.io listeners.*

### 2. Setup Frontend
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*
