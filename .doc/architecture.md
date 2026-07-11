# System Architecture

## Purpose
- Provide a concise architecture reference for service boundaries, ownership, and major flows.

## System Overview
- This document should describe the primary runtime components and how they interact.
- Default runtime topology:
  - `frontend/`: Next.js App Router application. It renders the user interface and may
    make server-side calls to the backend.
  - `backend/`: Node.js API application. It owns domain logic, authentication
    enforcement, and database access.
  - Database: persistent storage accessed by the backend; its credentials must remain
    private and must not be exposed through `NEXT_PUBLIC_` environment variables.
- Next.js includes a Node.js runtime for server rendering and Route Handlers, but it
  does not replace a dedicated Node.js backend when that backend owns the API and data
  layer. Keep the boundary explicit in the API contract.

## Recommended Sections
- `Context`
	- What problem the system solves and key constraints.
- `Primary Components`
	- Main services/modules and their responsibilities.
- `Data Flow`
	- Request and event flow between the Next.js frontend, Node.js backend, and database.
- `Auth and Org Boundaries`
	- Where authentication and organization scoping are enforced.
- `External Dependencies`
	- Third-party services and integration points.
- `Operational Concerns`
	- Logging, monitoring, retries, and failure handling.
- `Change Log`
	- Date-stamped notes for major architecture updates.

## Update Triggers
- Update this file when API routes, auth boundaries, org boundaries, or major component ownership changes.
