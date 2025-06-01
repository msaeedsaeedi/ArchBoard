# ArchBoard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org)
[![PNPM](https://img.shields.io/badge/PNPM-9.15.1-orange)](https://pnpm.io)

ArchBoard is a full-stack web application for creating and collaborating on software architecture diagrams. Powered by a **NestJS** backend and **Angular 19** frontend, it uses **PostgreSQL** (migrating from SQLite) with **Prisma** for data persistence, **Konva.js** for diagram rendering, **Socket.io** for real-time collaboration, and **PrimeNg** with **Tailwind CSS** for a sleek UI. From user authentication to diagram exports, ArchBoard streamlines architecture design for developers, architects, and product managers.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
  - [Reporting Issues](#reporting-issues)
  - [Working on Issues](#working-on-issues)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [License](#license)

## Architecture

ArchBoard is built with a modular client-server architecture:

- **Backend** (`apps/backend`): A **NestJS** server handling authentication (local and Google OAuth with JWT), board management, diagram state, and real-time collaboration. It uses **Prisma** to interact with a **PostgreSQL** database (migrating from SQLite) and **Socket.io** for real-time canvas syncing, cursor tracking, and comments. REST APIs (e.g., `/auth/login`, `/boards`) manage persistent operations.
- **Frontend** (`apps/frontend`): An **Angular 19** application delivering a responsive UI for authentication, board management, and diagram editing. **Konva.js** enables drag-and-drop diagrams, connections, and infinite canvas features. **PrimeNg** components and **Tailwind CSS** provide a modern, accessible interface. The frontend uses HTTP for API calls and Socket.io for real-time updates.
- **Infrastructure**: **Docker** and **docker-compose** ensure consistent environments. PostgreSQL runs as a containerized service for development and production.

## Features

- **Authentication (v0.1.0)**: Local signup/login and Google OAuth with JWT sessions, stored in PostgreSQL via Prisma.
- **Board Management (v0.2.0)**: Create, edit, delete, and share boards with collaborators (Owner, Editor, Viewer roles).
- **Diagram Editor (v0.3.0)**: Drag-and-drop components (microservices, databases, etc.), create connections, snap-to-grid, zoom/pan infinite canvas, and delete components using Konva.js.
- **Real-Time Collaboration (v0.4.0)**: Sync canvas changes, track cursors, and add comments in real-time with Socket.io.
- **Export & Presentation (v0.5.0)**: Export diagrams to PNG, SVG, and PDF (via `jsPDF`); presentation mode for full-screen viewing.
- **UI**: Responsive Angular frontend with PrimeNg and Tailwind CSS, supporting dark mode.
- **Database**: PostgreSQL with Prisma ORM, using JSONB for flexible board state storage.
- **Testing**: Jest for backend, Karma/Jasmine for frontend.
- **Code Quality**: ESLint and Prettier for consistency.

## Getting Started

### Prerequisites

- **Node.js**: v22+
- **PNPM**: v9.15.1+ (`npm install -g pnpm`)
- **Docker** & **Docker Compose**: For containerized services
- **Git**: For cloning the repo

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/msaeedsaeedi/archboard.git
   cd archboard
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Update `.env`

### Running the Application

#### Development Mode
Run frontend, backend, and Socket.io with hot-reloading:
```bash
pnpm dev
```
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:4200`

#### Production Mode
Build and run with Docker Compose:
```bash
pnpm docker:build
pnpm docker:start
```
- Access at `http://localhost:80`.

#### Stop Docker
```bash
pnpm docker:stop
```

## Contributing

Contributions are welcome! Here’s how to get involved:

### Reporting Issues

1. Check [Issues](https://github.com/msaeedsaeedi/archboard/issues) for duplicates.
2. Open a new issue using the template in `.github/ISSUE_TEMPLATE/`.
3. Provide a clear title, description, reproduction steps, and logs/screenshots.

### Working on Issues

1. Pick an issue from [Issues](https://github.com/msaeedsaeedi/archboard/issues).
2. Comment to claim it and avoid overlap.
3. Fork the repo and create a branch:
   ```bash
   git checkout -b feature/issue-<number>
   ```
4. Make changes, adhere to code style (`pnpm lint`, `pnpm format`).
5. Add/update tests (`pnpm test`).

### Submitting Pull Requests

1. Commit with clear messages:
   ```bash
   git commit -m "fix(issue-<number>): <description>"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/issue-<number>
   ```
3. Open a PR against `main`, referencing the issue (e.g., `Fixes #123`).
4. Ensure CI passes and address reviewer feedback.

## License

[MIT License](LICENSE) - see the LICENSE file for details.