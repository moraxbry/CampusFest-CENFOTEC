# CampusFest Web Site

Full-stack web application for managing the CampusFest student festival.  
Built for "Proyecto Integrador I" at Universidad CENFOTEC.

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap
- **Backend:** Node.js
- **Database:** MongoDB

## Team
- **Bryan Morales Cascante** — Lead Developer

---

## Git Architecture & Conventions

### Commit Message Standards (Conventional Commits)
All commit messages must follow the standard structure: `type(scope): description in lowercase`.

| Type | Purpose | Example |
| :--- | :--- | :--- |
| **`feat`** | A new feature or business logic | `feat(auth): implement jwt token validation` |
| **`fix`** | A bug fix or error correction | `fix(db): resolve memory leak in connection pool` |
| **`docs`** | Documentation changes only | `docs(readme): add project setup and ssh guide` |
| **`style`** | Formatting, linter updates, renaming variables | `style(ui): format product table layout with prettier` |
| **`refactor`** | Code optimization without changing behavior | `refactor(services): simplify item search algorithm` |
| **`chore`** | Maintenance tasks, dependencies, or setup | `chore(deps): update dependencies in configuration file` |

### Branching Model & Workflow (Git Flow)
We implement a branching strategy to separate stable code, active integration, and ongoing daily development tasks isolated across multiple workstations.

| Branch | Classification | Lifetime | Purpose |
| :--- | :--- | :--- | :--- |
| **`main`** | Production | Permanent | Contains 100% stable, production-ready code. No direct commits allowed. |
| **`develop`** | Integration | Permanent | The main sandbox for active development. All finished tasks merge here. |
| **`feat/*`** | Feature | Temporary | Isolated branch created from `develop` to build a single specific feature. |
| **`fix/*`** | Bugfix | Temporary | Urgent branch created from `develop` to resolve an active error or issue. |

#### Standard Development Lifecycle
Whenever you start working on a new feature or switch between computers, follow these steps sequentially:

```bash
# Step 1: Switch to develop and pull the latest changes from the cloud
git checkout develop
git pull origin develop

# Step 2: Create a task-specific branch from develop
git checkout -b feat/your-feature-name

# Step 3: Work on your files, stage them, and commit using standards
git add .
git commit -m "feat(scope): short description of the changes"

# Step 4: Push your temporary branch to GitHub
git push origin feat/your-feature-name
```

## Project Status & Agile Roadmap (Scrum Framework)
| Process / Iteration | Focus Area | Status |
| :--- | :--- | :--- |
| **Product Discovery (Sprint 0)** | Client Interviews, Requirement Gathering, & User Stories Definition | 🟡 In Progress |
| **Product Backlog Refinement** | Estimation (Story Points), Prioritization, & Acceptance Criteria | ⬜ Not Started |
| **Sprint 1** | Pending | ⬜ Not Started |
| **Sprint 2** | Pending | ⬜ Not Started |
| **Sprint 3** | Pending | ⬜ Not Started |
| **Release & Deployment** | Final Product Demo, QA Sign-off, & Cloud Deployment | ⬜ Not Started |

