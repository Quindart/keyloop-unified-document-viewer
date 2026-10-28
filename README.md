# Keyloop Unified Document Viewer

Technical assessment project for **Scenario D: The Unified Document Viewer**.

## Overview

The assessment scenario is a frontend application that gives users one consolidated view of vehicle-related documents. A user enters a valid Vehicle Identification Number (VIN), and the application aggregates document metadata from two mocked external systems: the Sales System API and the Service System API. The intended experience brings sales and service history together in a single, searchable-by-vehicle view.

The repository currently contains a React Router application scaffold with a login flow, workspace shell, and Google OAuth prototype. The VIN lookup, mocked document endpoints, aggregation flow, and document timeline described by the assessment scenario are **not implemented in the current codebase**. This distinction is stated explicitly so the assessment brief is not mistaken for delivered functionality.

## Key Features

### Assessment goals

- **Single VIN search:** Validate a VIN and use it as the lookup key for vehicle documents.
- **Parallel aggregation:** Request Sales System and Service System data concurrently to reduce total wait time.
- **Partial failure resilience:** Keep available results visible if one source is delayed or unavailable, and communicate which source could not be reached.
- **Unified document list:** Present normalized sales and service records in one chronological view, with a clear source badge on each document.
- **Responsive interaction states:** Provide loading skeletons, useful empty states, inline errors, and retry actions across screen sizes.

### Current repository capabilities

- React Router SSR application structure with a login page and protected workspace shell.
- Username/password demo login restricted to the `admin` account.
- Server-side Google OAuth authorization-code flow prototype.
- Reusable UI primitives, Tailwind CSS styling, and Vitest configuration.

The VIN and document-viewer assessment goals above describe the target product behavior; they are not yet available as working features in this repository.

## Architecture and System Design

### Target document aggregation design

The intended request path follows a Backend-for-Frontend (BFF) pattern:

1. The browser submits a VIN to an application route.
2. The server-side route validates and normalizes the VIN, then requests the Sales System and Service System mock endpoints concurrently.
3. Each source response is mapped into a shared document model. Source-specific fields remain behind the service boundary.
4. The route returns the normalized records and per-source availability to the UI. A failure or timeout from one source should not discard successful results from the other.
5. The UI sorts the combined documents by their event date and labels each record with its originating system.

Keeping external-system calls behind a server route avoids coupling browser components to multiple API contracts and provides a natural place for input validation, timeout handling, response normalization, and safe error reporting. **This BFF document flow is an architectural goal, not implemented behavior in the current repository.**

### Current application architecture

The project uses React Router Framework Mode with server-side rendering. Route modules live in `app/routes`; authentication UI and session logic are grouped under `app/features/auth`; and shared layout and UI components live under `app/components`. Zustand persists the client-side demo session, while Google OAuth state and identity are handled by server-side session utilities.

## Project Structure

The tree below reflects the current repository rather than the proposed VIN feature layout:

```text
.
├── app/
│   ├── components/
│   │   ├── layout/             # Workspace header and sidebar
│   │   └── ui/                 # Reusable UI primitives
│   ├── features/
│   │   └── auth/                # Demo authentication and Google OAuth
│   ├── hooks/                   # Shared React hooks
│   ├── lib/                     # Small shared utilities
│   ├── routes/                  # Login, workspace, and auth route modules
│   ├── root.tsx                 # Application document and providers
│   ├── routes.ts                # Route configuration
│   └── app.css                  # Global styles and Tailwind entry point
├── public/                      # Static assets
├── docs/                        # Project documentation
├── package.json                 # Scripts and dependencies
├── react-router.config.ts       # React Router SSR configuration
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Vitest configuration
```

For the planned document viewer, a natural extension would add route modules for VIN search and document results, dedicated document components, a server-side aggregation service, shared document/source types, and tests. Those directories are not present yet.

## Getting Started

### Prerequisites

- Node.js **22 or newer** (the project uses Vite 8 and React Router 8).
- pnpm, matching the checked-in `pnpm-lock.yaml`.
- Git.

### Installation

```bash
git clone <repository-url>
cd keyloop-unified-document-viewer
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The current app opens its login experience; the VIN document lookup described in the assessment scenario is not implemented yet.

### Demo login

| Username | Password |
| --- | --- |
| `admin` | `admin123456Aa@` |

### Optional Google OAuth setup

Google login requires a Google OAuth Web application client. Copy `.env.example` to `.env`, provide the client ID and secret, set `AUTH_SESSION_SECRET`, and register `http://localhost:5173/auth/google/callback` as an authorized redirect URI in Google Cloud Console. Keep `.env` out of source control. Google login is a prototype and is independent of the planned mocked document APIs.

## Testing and Quality Checks

Run the configured unit and component test suite with:

```bash
pnpm test
```

Additional project checks:

```bash
pnpm run typecheck
pnpm run build
pnpm run test:e2e
```

Vitest is configured to discover tests under `tests/unit/` and `tests/hooks/`, using the JSDOM environment and `tests/setup.ts`. **There is currently no `tests/` directory in the repository**, so the test command may report that no test files were found until tests are added. The test scripts and configuration are present, but this README does not claim unrun tests pass.

## AI Collaboration Narrative

Generative AI was used as an engineering collaborator to accelerate exploration, documentation, and implementation review while keeping technical decisions and final acceptance with the project author.

### Collaboration strategy

- Break work into bounded tasks with explicit acceptance criteria, repository constraints, and expected behavior.
- Use AI to inspect the existing route structure, identify relevant modules, and propose implementation options before changing code.
- Keep the assessment scenario and the actual repository state distinct; generated descriptions must not imply an unfinished capability is already delivered.

### Verification and refinement

- Review generated changes against the real dependency versions, scripts, route configuration, and component conventions in the repository.
- Inspect diffs and search for stale references after structural changes.
- Run type generation and TypeScript checks for code changes; run focused tests when tests exist and are relevant.
- Treat generated code and documentation as drafts: correct mismatched assumptions, remove unsupported claims, and retain human review of behavior and security-sensitive authentication paths.

### Quality assurance and reliability

- Validate authentication inputs and keep session data allowlisted rather than trusting arbitrary persisted values.
- Preserve the existing Google OAuth flow when changing demo username/password behavior.
- For the planned document aggregation feature, apply VIN validation, bounded request timeouts, per-source error reporting, normalized response types, deterministic sorting, and tests for success, empty, delayed, and partial-failure cases before describing it as production-ready.
- Prefer observable evidence from typechecks, tests, and build output over claims based only on generated suggestions.

AI assistance supports the engineering process; it does not replace code review, security review, or verification against the assessment requirements.

## Production Readiness Notes

This repository is an assessment scaffold and includes prototype authentication. The unified VIN document workflow and its mocked Sales and Service APIs must be implemented and tested before the project can be considered complete against Scenario D. Production deployment would also require server-side identity and access controls, operational logging, API timeout and retry policies appropriate to the upstream systems, and deployment-specific secret management.
