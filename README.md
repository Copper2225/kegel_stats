## Kegel Stats

A small full‑stack app to record and review Kegeln (bowling) results. The project consists of a TypeScript/Express backend with a local SQLite database and a React + Vite frontend.

> Note: Statistics are not implemented yet; the app currently only lists recorded entries.

### Tech stack

- **Frontend**: React 19, TypeScript, Vite, Zustand, Formik, Bootstrap, styled-components
- **Backend**: Express (TS), better-sqlite3
- **Database**: SQLite (file-based)

### Project structure

```
.
├─ backend/
│  ├─ server.ts                # Express app + routes
│  ├─ database/
│  │  ├─ database.sqlite       # SQLite database file
│  │  └─ databaseHandler.ts    # Schema + queries (better-sqlite3)
│  ├─ dist/                    # Build output
│  ├─ package.json
│  └─ tsconfig.json
└─ frontend/
   ├─ src/
   │  ├─ View/                 # Pages and components
   │  ├─ requests/             # Backend API client
   │  ├─ stores/               # Zustand store(s)
   │  └─ types/
   ├─ index.html
   ├─ public/
   ├─ package.json
   └─ vite.config.ts
```

## Getting started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm (project uses package-lock.json)

### 1) Backend

```bash
cd backend
npm install

# Development (watch + TS)
npm run backend:dev

# Production build
npm run build
npm start
```

- The backend listens on `http://localhost:3002`.
- On first start it creates tables in `backend/database/database.sqlite` if they do not exist.

### 2) Frontend

```bash
cd frontend
npm install

# Configure backend URL for the frontend
echo "VITE_BACKEND_URL=http://localhost:3002" > .env.local

# Development (Vite dev server)
npm run dev

# Production build
npm run build
npm run preview
```

- The dev server runs on `http://localhost:5173` by default.

## Environment variables

- Frontend
  - `VITE_BACKEND_URL` (required): Base URL of the backend, e.g. `http://localhost:3002`.
- Backend
  - No environment variables are required by default. The server port (`3002`) is currently hardcoded in `backend/server.ts`.

## API

Base URL: `http://localhost:3002`

- POST `/saveRecord`
  - Body:
    ```json
    {
      "alleys": [{ "number": 1, "full": 0, "total": 0, "clear": 0 }],
      "total": 0,
      "location": "string",
      "date": "YYYY-MM-DD",
      "training": true,
      "start": 1
    }
    ```
  - Response:
    ```json
    { "success": true, "recordId": 123 }
    ```

- GET `/allRecords`
  - Response:
    ```json
    {
      "success": true,
      "records": [
        {
          "id": 1,
          "total": 0,
          "alleys": {
            "alley1": { "full": 0, "total": 0, "clear": 0 }
          },
          "location": "string",
          "date": "YYYY-MM-DD",
          "training": 1,
          "start": 1
        }
      ]
    }
    ```

- POST `/deleteRecord`
  - Body:
    ```json
    { "id": 123 }
    ```
  - Response:
    ```json
    { "success": true }
    ```

### Database schema (summary)

- Table `KegelRecords`
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `total INTEGER NOT NULL`
  - `location TEXT NOT NULL`
  - `date TEXT NOT NULL`
  - `training BOOLEAN NOT NULL`
  - `start INTEGER NOT NULL`
  - `created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`

- Table `Alleys`
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `record_id INTEGER NOT NULL REFERENCES KegelRecords(id) ON DELETE CASCADE`
  - `number INTEGER NOT NULL`
  - `full INTEGER`
  - `total INTEGER`
  - `clear INTEGER`

## Frontend usage

The frontend reads `VITE_BACKEND_URL` from the environment and calls the backend via `fetch`. See `frontend/src/requests/api.ts` and feature-specific request modules for details.

## Scripts (cheat sheet)

- Backend
  - `npm run backend:dev`: Start Express in watch mode (TS)
  - `npm run build`: TypeScript build + aliasing to `backend/dist`
  - `npm start`: Run compiled server (`dist/server.js`)

- Frontend
  - `npm run dev`: Start Vite dev server
  - `npm run build`: Build for production
  - `npm run preview`: Preview built app locally
  - `npm run lint`: Lint (repo-level configuration)
  - `npm run prettier`: Format repo

## Notes

- The SQLite database file is stored locally at `backend/database/database.sqlite`.
- If you remove the database file, the app will recreate the tables on next backend start (data will be lost).
- Some platforms may require build tools for native modules; `better-sqlite3` provides prebuilt binaries for common Node versions.

## License

This project currently has no explicit license. Add one if you plan to distribute or open source.


