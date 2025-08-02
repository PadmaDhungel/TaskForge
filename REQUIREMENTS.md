# 📌 TaskForge — Backend Requirements

TaskForge is a scalable, feature-rich task management backend inspired by Trello. This document defines the functional and non-functional requirements for the MVP and future phases.
---
## ✅ Core Goals
- Build a production-grade Node.js backend
- Showcase advanced use of async/await, services, middleware, and real-world architecture
- Demonstrate ability to handle authentication, RBAC, billing (Stripe), and scalable task management APIs
---
## 🧩 Functional Requirements
### 🧑‍💻 User Authentication
- [ ] User registration
- [ ] Secure password hashing (bcrypt)
- [ ] Login with JWT-based session
- [ ] Refresh token support (optional)
- [ ] Logout / token revocation (optional)
- [ ] Get current user (`/auth/me`)
---
### 🗂️ Board Management
- [ ] Create board
- [ ] List all boards a user belongs to
- [ ] Get board by ID
- [ ] Update board name
- [ ] Delete board (owner only)
---
### 📋 List Management (Columns)
- [ ] Create list in a board
- [ ] Get all lists in a board
- [ ] Update list name and position
- [ ] Delete list
---
### 🗃️ Card Management (Tasks)
- [ ] Create card in a list
- [ ] Move card between lists
- [ ] Assign users to cards
- [ ] Set priority, due date, and labels
- [ ] Archive or delete cards
---
### 💬 Comments
- [ ] Add comment to card
- [ ] Edit/delete own comment
- [ ] Timestamps for each comment
---
### 👥 Collaborators & Team Management
- [ ] Invite user to board
- [ ] Accept or reject invitation
- [ ] Remove member from board
- [ ] View board members and their roles
---
### 🔐 Role-Based Access Control (RBAC)
- System-wide user roles:
  - `BASIC`, `PREMIUM`, `ADMIN`
- Board-level roles:
  - `OWNER`, `ADMIN`, `EDITOR`, `VIEWER`
- Permissions enforced:
  - Only `OWNER`/`ADMIN` can manage members
  - Only `EDITOR` and above can modify content
  - `VIEWER` can only read
---
### 💳 Stripe Integration (Billing)
- [ ] Create Stripe customer on signup
- [ ] Subscribe to premium plan
- [ ] Webhooks for subscription events
- [ ] Upgrade/downgrade account
- [ ] Limit features (e.g., max boards) for `BASIC` users
---
### 🔔 Notifications 
- [ ] Notify when mentioned in comments
- [ ] Notify on assignment or due date nearing
- [ ] Webhook or WebSocket for real-time updates
---
### 🔍 Search 
- [ ] Search cards by title, label, or description
- [ ] Full-text search (PostgreSQL or Elastic)
---
### 🔒 Audit Logs & Activity Feed
- Record every action: card movement, comment, edit
- Filterable logs by user, action, or time
- Viewable per board
---
### 📂 Board Templates (Cloning)
- Save boards as templates
- Allow duplication of templates for new projects
---
### 📎 File Attachments
- Attach PDFs, images, documents to cards
- Preview images inline
- Store in S3, Cloudinary, or local
---
### 💬 Real-Time Collaboration (Socket.io)
- Broadcast card/list changes instantly
- Show who is online and editing what
- WebSocket namespace per board
---
### 📊 Time Tracking & Analytics
- Track time between card creation and completion
- Calculate average task age, most active users
- Export user or board analytics (premium only)
---
### 📅 Calendar Sync & Email Reminders
- Sync tasks with Google Calendar or Outlook
- Daily summary email of upcoming deadlines
- Email reminders 24 hrs before due date
---
### 📤 Export / Import Boards
- Export boards to CSV, PDF, or JSON
- Import templates for quick setup
---
### 🔁 Card Version History
- View previous versions of a card’s description
- Rollback to a previous version
---
### 📶 Offline Sync Engine
- Queue edits when offline and sync when back online
- Conflict resolution strategy (last-write-wins or merge UI)
- Advanced but extremely impressive
---
### 🧠 AI Assistant (OpenAI)
- Summarize card or board status using GPT
- Suggest task breakdowns, reword card descriptions
- Auto-generate subtasks based on title

## ⚙️ Non-Functional Requirements
### Architecture & Code Quality
- [ ] Modular, service-based architecture
- [ ] Environment-based config with `.env`
- [ ] Centralized error handling
- [ ] Logging (console + optional file/3rd-party)
- [ ] Clean, typed codebase (TypeScript)
- [ ] Layered abstraction: routes → controllers → services → db
---
### Performance & Scalability
- [ ] Use of async/await and Promise.all when needed
- [ ] Caching layer with Redis (optional)
- [ ] Rate limiting to prevent abuse
- [ ] Queue system (BullMQ) for background jobs (e.g. notifications)
---
### Testing & Quality
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] Code linting and formatting with ESLint + Prettier
- [ ] GitHub Actions CI for push/PR
---
### DevOps & Deployment
- [ ] Dockerized backend (optional)
- [ ] Health check endpoint (`/health`)
- [ ] `.env.example` for environment setup
- [ ] PostgreSQL (locally or cloud DB)
- [ ] Vercel/Netlify/VPS-friendly deployment config
---
## 🗺️ Feature Roadmap Summary
| Phase    | Features                                                                 |
|----------|--------------------------------------------------------------------------|
| Phase 1  | Auth, Boards, Cards, Lists, RBAC (MVP)                                   |
| Phase 2  | Collaborators, Comments, Assignments, Stripe billing                     |
| Phase 3  | Notifications, Search, Premium limits, Real-time features                |
| Phase 4  | Admin dashboard, Audit logs, Export features, Public board links         |
---
## 📁 Related Planning Files
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — technical breakdown
- [`TASKS.md`](./TASKS.md) — development checklist
- [`API_REFERENCE.md`](./API_REFERENCE.md) — list of endpoints
---
**Last updated:** Aug 2025  
**Maintained by:** PadmaDhungel 
