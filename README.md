# CampusFest Web Site

Full-stack web application for managing the CampusFest student festival.  
Built for "Proyecto Integrador I" at Universidad CENFOTEC.

## Team
- **Bryan Morales Cascante** — Lead Developer

---

## System Overview

This project consists of the development of a full-stack web application designed for the comprehensive management of the CampusFest student festival. The system will centralize activity administration, enrollment control, agenda publication, and the display of participating stands and groups, in order to optimize the process that is currently handled manually.

## User Profiles and Actors Involved

The system contemplates two main actors:

* **Visitor User:** Client-side actor whose main objective is to consume information and participate. They can view general festival information, explore the activities catalog, check the agenda, explore stands, view the winners section, and complete enrollment forms for events.
* **Administrator User:** Actor with management and maintenance privileges. They are the only ones in charge of dynamically feeding the system. They have the ability to create, edit, cancel, and delete activities or enrollments; manage general information on the home page, contact page, and stands; manage all enrollments and waiting lists; and publish the festival's results or recognitions.

## Assumptions, Dependencies, and General Constraints

* **Assumptions:** It is assumed that visitor users have a stable internet connection and access to a valid email account, which is essential for identity validation and receiving enrollment notifications.
* **Dependencies:** Data persistence and continuous system operation depend on the availability of the cloud database service (MongoDB Atlas).
* **Constraints:** At the design and user interface level, development is strictly restricted to 100% compliance with the visual guidelines, typography, and color palettes stipulated in the institutional brand book provided by the client, Verónica Mora, during the requirements elicitation phase.

---

## Design and Implementation Constraints

The development of the CampusFest system will be subject to a set of technical constraints and code regulations designed to ensure the scalability, maintainability, and quality of the deliverable software.

### Mandatory Technologies, Platforms, Languages, and Frameworks

The system will be built under a full-stack web architecture strictly using the following technologies:

* **Presentation Layer (Front-end):** Semantic HTML5, CSS3, and JavaScript will be used. To streamline interface construction and ensure a responsive design, the use of the Bootstrap framework is mandatory.
* **Business Logic Layer (Back-end):** A server will be implemented using the Node.js runtime environment supported by the Express.js framework to build a RESTful API.
* **Data Persistence Layer (Database):** The MongoDB NoSQL engine will be used, specifically deployed through the MongoDB Atlas cloud service.
* **Version Control and Platform:** Git will be used locally, and the centralized repository will mandatorily be hosted on GitHub.

### Regulations and Standards to Comply With

The development team must comply with the following guidelines to maintain a clean (Clean Code) and structured codebase.

#### Naming Conventions and Code Formatting

* **Variables and Functions:** The `camelCase` convention will be used (e.g., `getActivities()`, `availableSpots()`). Names must be descriptive and pronounceable, prohibiting the use of ambiguous abbreviations or single-letter variables (except in `for` loop counters).
* **Classes and DB Models:** `PascalCase` will be used (e.g., `ActivityModel`, `UserAdmin`).
* **Files and Directories:** `kebab-case` will be used to ensure safe and standardized web paths (e.g., `activities-catalog.html`, `auth-controller.js`).
* **Language:** The graphical interface and messages directed to the end-user will be in Spanish. The source code (variable names, functions, databases) will be written prioritizing the English language.

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

## Project Documentation

All documentation, discovery notes, and requirements gathered during the project lifecycle are organized inside the `docs/` directory:

*   [Client Interview](./docs/client-interview.md) — Summary of requirements and discovery session with Verónica Mora.
*   [Functional Requirements](./docs/functional-requirements.md) — Product backlog, user stories, and acceptance criteria.
*   [Non Functional Requirements](./docs/non-functional-requirements.md) — System constraints, security standards, performance metrics, and tech stack configurations.

## Project Directory Structure

```text
/campusfest
├── /docs                   # Project documentation (ERS, diagrams, manuals)
├── .env                    # Environment variables (DB credentials, ports)
├── .gitignore              # Files ignored by Git (node_modules, .env)
├── package.json            # Project dependencies (Express, Mongoose, etc.)
├── README.md               # Main repository documentation for GitHub
├── server.js               # Main file: Initializes the Express server
│
├── /config                 # External services configuration
│   └── db.js               # MongoDB Atlas connection logic
│
├── /models                 # [M] MODELS: Data schemas (Mongoose)
│   ├── Activity.js        
│   ├── Enrollment.js      
│   ├── Stand.js            
│   ├── AdminUser.js     
│   └── Configuration.js    # Dynamic texts for home and contact pages
│
├── /controllers            # [C] CONTROLLERS: Business logic
│   ├── activityController.js
│   ├── enrollmentController.js
│   ├── standController.js
│   └── adminController.js
│
├── /routes                 # ROUTERS: URL and endpoint definitions
│   ├── activities.js       # Public catalog routes
│   ├── enrollments.js      # Public form routes
│   └── admin.js            # Protected backoffice routes
│
├── /middlewares            # MIDDLEWARES: Security filters
│   └── auth.js             # Validates if the user is an administrator
│
├── /views                  # [V] VIEWS: Frontend HTML files
│   ├── home.html         
│   ├── catalog.html       
│   ├── detail.html        
│   ├── contact.html       
│   ├── stands.html         
│   └── /admin              # Exclusive control panel views
│       ├── dashboard.html
│       └── manage-activities.html
│
└── /public                 # STATIC FILES: Public browser resources
    ├── /css
    │   └── style.css       # Custom styles and dark mode variables
    ├── /img                # Institutional logos and banners
    └── /js                 # Front-end logic (Vanilla JS)
        ├── main.js         # General initializer
        ├── api.js          # REST API consumption (Fetch)
        ├── ui.js           # DOM manipulation (Rendering cards, modals)
        ├── filters.js      # Search and date logic
        └── validator.js    # Form validations
```

### Architecture Justification

The adopted directory structure reflects a strict separation of concerns based on the MVC design pattern.

* The data layer (MongoDB collections) is isolated in the `/models` directory.
* Business logic and rule validation operate exclusively in `/controllers`.
* The user interface resides in `/views`, supported by static resources organized modularly in the `/public` folder.

This modularity ensures that the client-side Vanilla JS code (`/public/js/`) is separated by responsibilities (UI, validation, API consumption), avoiding code clutter and facilitating scalability.

---

## 📋 Project Management (Jira Workspace)

The planning, tracking, and management of this project, including the definition of Epics, User Stories, and the complete product backlog, are centralized in **Jira Software**.

The evaluating professor can access the live CampusFest Jira board, review the traceability of the requirements, and monitor the development progress through the following link:

🔗 **[CampusFest - Official Jira Board (Backlog & Epics)](https://proyectointegradormaikoll.atlassian.net/jira/software/projects/CAMPUS/boards/69/backlog?epics=visible&atlOrigin=eyJpIjoiOWQyYzhlMzEyZmY4NDQ5NjhmMWVjZDExMGMzMDhkMTQiLCJwIjoiaiJ9)**

### Traceability Matrix

| Req ID | Brief Description | Epic / Jira Ticket | Implementation (Component / MVC Module) | Status |
| :--- | :--- | :--- | :----- | :----- |
| **FR-01** | Home page structure and Menu | EPIC-01 / **CAMPUS-01** | `views/home.html`, `public/css/style.css` | To do 🟡 |
| **FR-02, FR-03** | 3 dynamic featured activities | EPIC-01 / **CAMPUS-02** | `controllers/homeController.js`, `models/Activity.js` | To do 🟡 |
| **FR-04** | Calendar format agenda | EPIC-01 / **CAMPUS-06** | `views/catalog.html`, `public/js/agenda.js` | To do 🟡 |
| **FR-05** | Visual cards catalog | EPIC-01 / **CAMPUS-07** | `views/catalog.html`, `public/js/ui.js` | To do 🟡 |
| **FR-06** | Full activity details | EPIC-01 / **CAMPUS-08** | `controllers/activityController.js`, `views/detail.html` | To do 🟡 |
| **FR-07** | Visual spot availability status (full/avail) | EPIC-01 / **CAMPUS-12** | `public/js/ui.js` (DOM rendering logic) | To do 🟡 |
| **FR-08** | Multiple filtering (>8 hrs, cat, date) | EPIC-01 / **CAMPUS-13** | `routes/activities.js`, `public/js/filters.js` | To do 🟡 |
| **FR-09** | Automatic chronological sorting | EPIC-01 / **CAMPUS-14** | `controllers/activityController.js` (Query sort) | To do 🟡 |
| **FR-10** | Stands and groups directory | EPIC-01 / **CAMPUS-15** | `views/stands.html`, `controllers/standController.js` | To do 🟡 |
| **FR-11** | Contact page and form | EPIC-01 / **CAMPUS-16** | `views/contact.html`, `routes/contact.js` | To do 🟡 |
| **FR-12** | Winners and results section | EPIC-01 / **CAMPUS-17** | `views/winners.html`, `models/Result.js` | To do 🟡 |
| **FR-13** | Enrollment overlay modal | EPIC-02 / **CAMPUS-18** | `views/catalog.html` (Bootstrap Modal), `public/js/main.js` | To do 🟡 |
| **FR-14, FR-15** | Mandatory capture and JS validation | EPIC-02 / **CAMPUS-19** | `public/js/validator.js` (Frontend) | To do 🟡 |
| **FR-16** | Email uniqueness to avoid duplicates | EPIC-02 / **CAMPUS-20** | `controllers/enrollmentController.js` (Backend) | To do 🟡 |
| **FR-17** | Visual and email confirmation | EPIC-02 / **CAMPUS-21** | `public/js/ui.js`, Nodemailer Service | To do 🟡 |
| **FR-18, FR-19** | Waiting list assignment and alert | EPIC-02 / **CAMPUS-22** | `models/Enrollment.js`, `controllers/enrollmentController.js` | To do 🟡 |
| **FR-20** | Admin CRUD for activities | EPIC-03 / **CAMPUS-23** | `views/admin-activities.html`, `routes/admin.js` | To do 🟡 |
| **FR-21** | Detailed query of participants | EPIC-03 / **CAMPUS-24** | `controllers/adminController.js`, `views/admin-enrollments.html` | To do 🟡 |
| **FR-22** | Exclusive cancellation privileges | EPIC-03 / **CAMPUS-25** | `middlewares/auth.js`, `routes/admin.js` | To do 🟡 |
| **FR-23** | Stands and Groups management (CRUD) | EPIC-03 / **CAMPUS-26** | `controllers/adminStandController.js` | To do 🟡 |
| **FR-24** | Publication of results/winners | EPIC-03 / **CAMPUS-27** | `models/Result.js`, `views/admin-winners.html` | To do 🟡 |
| **FR-25** | Modification of dynamic texts | EPIC-03 / **CAMPUS-28** | `models/Configuration.js`, `controllers/adminController.js` | To do 🟡 |
| **NFR (All)** | Structure, DB, and Environments | SPRINT 1 / **CAMPUS-02** | Documentation, GitHub Repository | Done 🟢 |

