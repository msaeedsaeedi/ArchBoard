# Turborepo Template

This is a monorepo template using [Turborepo](https://turborepo.com/) to manage a full-stack application with a [NestJS](https://nestjs.com/) backend and an [Angular](https://angular.dev/) frontend. It is designed to streamline development, building, and deployment processes with modern tooling and best practices.

## Features
- **Monorepo Structure**: Managed with Turborepo for efficient task orchestration across multiple apps.
- **Backend**: NestJS application with TypeScript, ESLint, Prettier, and Jest for testing.
- **Frontend**: Angular application with server-side rendering (SSR), TypeScript, ESLint, and Karma for testing.
- **Docker Support**: Dockerized services for both frontend and backend with a `docker-compose.yml` for easy setup.
- **Code Quality**: Prettier for code formatting and ESLint for linting across both apps.
- **Dependency Management**: Uses PNPM for fast and efficient package management.
- **CI/CD**: Configured with Dependabot for automated dependency updates.

## Directory Structure
```
msaeedsaeedi-turborepo-template/
├── apps/
│   ├── backend/               # NestJS backend application
│   └── frontend/              # Angular frontend application
├── .github/
│   └── dependabot.yml         # Dependabot configuration for dependency updates
├── docker-compose.yml         # Docker Compose configuration for running services
├── package.json               # Root package.json with monorepo scripts
├── pnpm-workspace.yaml        # PNPM workspace configuration
├── turbo.json                 # Turborepo configuration
├── .dockerignore              # Docker ignore file
├── .prettierignore            # Prettier ignore file
├── .prettierrc                # Prettier configuration
```

## Prerequisites
- [Node.js](https://nodejs.org/) (v22 or higher)
- [PNPM](https://pnpm.io/) (v9.15.1 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/msaeedsaeedi/turborepo-template.git
   cd turborepo-template
   ```

2. Install dependencies using PNPM:
   ```bash
   pnpm install
   ```

### Development
Run both the frontend and backend in development mode:
```bash
pnpm dev
```

- **Frontend**: Runs on `http://localhost:4200`
- **Backend**: Runs on `http://localhost:3000`

### Building
Build both apps for production:
```bash
pnpm build
```

### Docker
Build and start the services using Docker Compose:
```bash
pnpm docker:build
pnpm docker:start
```

Stop the services:
```bash
pnpm docker:stop
```

Clean up Docker resources:
```bash
pnpm docker:prune
```

### Linting and Formatting
Run linting across all apps:
```bash
pnpm lint
```

Format code using Prettier:
```bash
pnpm format
```

### Testing
Run tests for the backend:
```bash
cd apps/backend
pnpm test          # Unit tests
pnpm test:e2e      # End-to-end tests
pnpm test:cov      # Test coverage
```

Run tests for the frontend:
```bash
cd apps/frontend
pnpm test          # Unit tests
```

### Cleaning
Clean build artifacts and node_modules:
```bash
pnpm clean
```

## Deployment
- **Backend**: Follow the [NestJS deployment documentation](https://docs.nestjs.com/deployment) or use [NestJS Mau](https://mau.nestjs.com) for AWS deployment.
- **Frontend**: Built artifacts are optimized for production and served via Nginx. Use the provided `nginx.conf` for routing configuration.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support
- For NestJS-related questions, visit the [NestJS Discord](https://discord.gg/G7Qnnhy) or [documentation](https://docs.nestjs.com).
- For Angular-related questions, check the [Angular CLI documentation](https://angular.dev/tools/cli) or [Angular DevTools](https://angular.dev/tools/devtools).
- For general issues, open a ticket on the [GitHub repository](https://github.com/msaeedsaeedi/turborepo-template).