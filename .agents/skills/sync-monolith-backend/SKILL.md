---
name: sync-monolith-backend
description: Synchronizes changes from the CareerForge AI microservices backend (services and shared folders) into the standalone monolithic backend repository (CareerForge-AI-Backend) for seamless deployment.
---

# Sync Monolith Backend Skill

Use this skill whenever changes are made to any microservice inside `CareerForge AI/backend/services/*` or `backend/shared/*` that need to be reflected in the standalone monolithic backend (`CareerForge-AI-Backend`) for deployment (e.g. on Render).

## Automated Sync Commands

From the `CareerForge AI/backend` folder or main root:

1. **One-time Sync**:
   ```bash
   node scripts/sync-to-monolith.js
   # OR from backend folder:
   npm run sync:monolith
   ```

2. **Continuous Watch Mode** (Auto-syncs whenever files are saved):
   ```bash
   node scripts/sync-to-monolith.js --watch
   # OR from backend folder:
   npm run sync:watch
   ```

3. **Sync, Commit & Push to GitHub** (Automatically triggers Render redeployment):
   ```bash
   node scripts/sync-to-monolith.js --push "feat: updated interview agent prompts"
   # OR from backend folder:
   npm run sync:push -- "feat: your commit message"
   ```

## Architecture Mapping

| Microservice Source (`CareerForge AI`) | Monolith Destination (`CareerForge-AI-Backend`) |
| :--- | :--- |
| `backend/shared/redis/redis.js` | `config/redis.js` |
| `backend/services/auth/configs/` | `config/` |
| `backend/services/auth/controllers/` | `controllers/` |
| `backend/services/auth/model/` | `models/` |
| `backend/services/auth/routes/` | `routes/` |
| `backend/services/interview/agents/` | `agents/` |
| `backend/services/interview/graph/` | `graph/interview/` |
| `backend/services/interview/prompts/` | `prompts/interview/` |
| `backend/services/interview/controllers/` | `controllers/` |
| `backend/services/interview/routes/` | `routes/` |
| `backend/services/resume/agents/` | `agents/` |
| `backend/services/resume/config/` | `config/` |
| `backend/services/resume/controllers/` | `controllers/` |
| `backend/services/resume/middleware/` | `middleware/` |
| `backend/services/resume/routes/` | `routes/` |
| `backend/services/roadmap/agents/` | `agents/` |
| `backend/services/roadmap/configs/` | `config/` & `prompts/roadmap/` |
| `backend/services/roadmap/graph/` | `graph/roadmap/` |
| `backend/services/roadmap/controllers/` | `controllers/` |
| `backend/services/roadmap/routes/` | `routes/` |
| `backend/services/billing/configs/` | `config/` |
| `backend/services/billing/controllers/` | `controllers/` |
| `backend/services/billing/models/` | `models/` |
| `backend/services/billing/routes/` | `routes/` |

The sync script automatically handles import path normalization across directory depths.
