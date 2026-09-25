# Adbrew Full-Stack Task - Solution Implementation

> **Submission for Backend SDE Intern Role at Adbrew**  
> Candidate: **Ritesh Vishwakarma**  
> Repository: [https://github.com/riteshvish02/Adbrew-task](https://github.com/riteshvish02/Adbrew-task)

---

## 🏗️ Architecture & Design Patterns

To demonstrate production-ready engineering standards and adhere to **SOLID principles**, the codebase is divided into modular, decoupled layers with clear separation of concerns:

```
┌─────────────────────────────────┐
│     Frontend (React Hooks)      │  React 17 + Custom Hook (useTodos)
│   src/app/src/App.jsx           │  Port: 3000
└───────────────▲─────────────────┘
                │
                │ HTTP Requests (JSON)
                │ GET  /todos/
                │ POST /todos/
                │
┌───────────────▼─────────────────┐
│    Controller (Presentation)    │  Django REST Framework APIView
│   src/rest/rest/views.py        │  Port: 8000
└───────────────▲─────────────────┘
                │
                │ Coordinates Business Logic & Validation
                │
┌───────────────▼─────────────────┐
│         Service Layer           │  Input validation, length checks,
│   src/rest/rest/services.py     │  business rule exceptions
└───────────────▲─────────────────┘
                │
                │ PyMongo Queries & BSON Serialization
                │
┌───────────────▼─────────────────┐
│       Repository Layer          │  Encapsulates MongoDB collections
│   src/rest/rest/repository.py   │  (get_all, create, delete, toggle)
└───────────────▲─────────────────┘
                │
┌───────────────▼─────────────────┐
│       Database (MongoDB)        │  MongoDB 4.4 Engine
│   test_db.todos                 │  Port: 27017
└─────────────────────────────────┘
```

### 1. Backend (Django REST + PyMongo)
* **Controller (`views.py`)**: Uses Django REST Framework class-based `APIView` (`TodoListView`, `TodoDetailView`) to accept requests and return standardized JSON responses and HTTP status codes (`200 OK`, `201 CREATED`, `400 BAD REQUEST`, `500 INTERNAL SERVER ERROR`).
* **Service Layer (`services.py`)**: Handles domain validation (verifying non-empty titles, type enforcement, 500-character upper bounds) and separates business logic from HTTP transport.
* **Repository Layer (`repository.py`)**: Encapsulates raw PyMongo queries on `test_db.todos`. Safely handles BSON `ObjectId` serialization to string `id`, sorts by newest first (`_id: -1`), and attaches UTC ISO timestamps.
* **Zero Django ORM / SQLite**: Strictly adheres to the requirement—no Django models, no model serializers, no SQLite.
* **Tests (`test_todos.py`)**: Automated unit test suite verifying serialization, service validation, and repository mocking.

### 2. Frontend (React Hooks)
* **Pure React Hooks**: Built without any class components or lifecycle methods, strictly fulfilling requirement #1.
* **Custom Hook (`useTodos.js`)**: Encapsulates all state logic (`todos`, `loading`, `submitting`, `error`, `addTodo`, `toggleTodo`, `deleteTodo`, `fetchTodos`).
* **API Service (`todoApi.js`)**: Modular client for HTTP communications with robust fallback for different environments.
* **Modern UI**: Clean, responsive layout with loading indicators, empty states, controlled forms, and auto-refresh on submit.

---

## 🛠️ Dockerfile Debugging & Resolved Issues

The original Docker configuration included intentional legacy constraints that were systematically identified and fixed:

1. **Debian Buster EOL Repositories**:
   * *Problem*: Debian Buster reached End-Of-Life; standard package mirrors (`deb.debian.org`) returned `404 Not Found`.
   * *Fix*: Replaced mirrors with `archive.debian.org` and configured `Acquire::Check-Valid-Until "false"`.
2. **Node.js & React Development Server Runtime**:
   * *Problem*: Original Dockerfile installed Yarn without an underlying Node.js runtime.
   * *Fix*: Added official NodeSource setup for Node.js 16 LTS and installed Yarn.
3. **Pip Metadata Validation (PEP 440)**:
   * *Problem*: Modern `pip>=24.1` rejected legacy `celery==5.0.5` metadata (`pytz>dev`). Also replaced deprecated `easy_install pip`.
   * *Fix*: Pinned pip installation to `pip<24.1` to maintain compatibility with legacy requirement specifications.
4. **Volume I/O Performance**:
   * *Problem*: Mounting host filesystems on Windows Docker creates extreme disk I/O bottlenecks when extracting `node_modules`.
   * *Fix*: Added an anonymous volume for `/src/app/node_modules` so package extraction occurs on internal Linux ext4 storage.

---

## 🚀 How to Run

### Method 1: Full Docker Setup (Recommended)
1. Ensure Docker Desktop is running.
2. Build and launch all three containers:
   ```bash
   docker-compose build
   docker-compose up -d
   ```
3. Verify containers:
   ```bash
   docker ps
   ```
   * App: `http://localhost:3000`
   * API: `http://localhost:8000/todos/`
   * MongoDB: `localhost:27017`

### Method 2: Hybrid Local Development
* **Backend + Database (Docker):**
  ```bash
  docker-compose up -d mongo api
  ```
* **Frontend (Local):**
  ```bash
  cd src/app
  npm install
  npm run dev
  ```
  App will open on `http://localhost:3000`.

---

## 🧪 Testing

* **Backend Unit Tests:**
  ```bash
  python src/rest/manage.py test rest
  ```
* **Frontend Unit Tests:**
  ```bash
  cd src/app && npm test -- --watchAll=false
  ```

---

## 📋 API Specification

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/todos/` | Retrieve all todo items (sorted newest first) | `200 OK`, `500 Error` |
| `POST` | `/todos/` | Create a new todo item in MongoDB | `201 Created`, `400 Bad Request`, `500 Error` |
| `PATCH` | `/todos/<id>/` | Toggle completed status of a todo | `200 OK`, `404 Not Found` |
| `DELETE` | `/todos/<id>/` | Delete a todo item by ID | `200 OK`, `404 Not Found` |
