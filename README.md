# CareerForge AI 🚀

CareerForge AI is an end-to-end, AI-powered career development platform built on a scalable microservices architecture. It empowers candidates with automated resume analysis & ATS scoring, interactive AI mock interviews with conversational agents, personalized learning roadmaps with curated resources, and subscription billing.

---

## 🌟 Key Features

- 📄 **AI Resume Builder & ATS Scorer**: Extract, evaluate, and enhance resumes with AI-driven insights and ATS compatibility scoring.
- 🎙️ **Interactive AI Mock Interviews**: Dynamic HR and technical mock interviews powered by LangGraph multi-agent workflows, real-time feedback, and performance summaries.
- 🗺️ **Personalized Career Roadmaps**: Step-by-step career path generation complete with recommended milestones and integrated YouTube learning resources.
- 💳 **Billing & Subscriptions**: Seamless plan upgrades and payments integrated with Razorpay.
- ⚡ **Scalable Microservices Architecture**: Decoupled backend services orchestrated by an API Gateway with Redis caching and MongoDB persistence.
- 💻 **Modern React Frontend**: Clean, responsive UI built with Vite, React, Redux Toolkit, and Firebase Authentication.

---

## 🏗️ Architecture & Tech Stack

```
CareerForge AI/
├── backend/
│   ├── gateway/               # API Gateway (Port 8000)
│   ├── services/
│   │   ├── auth/              # Authentication & User Management (Port 8001)
│   │   ├── resume/            # Resume Analysis & ATS Scorer (Port 8002)
│   │   ├── interview/         # LangGraph AI Mock Interview Agent (Port 8003)
│   │   ├── roadmap/           # Career Roadmaps & Resource Finder (Port 8004)
│   │   └── billing/           # Plans & Razorpay Integration (Port 8005)
│   ├── shared/                # Shared Redis & utilities
│   └── docker-compose.yml     # Redis infrastructure
└── frontend/                  # React + Vite + Redux Toolkit Client (Port 5173)
```

### Technologies
- **Frontend**: React 18, Vite, Redux Toolkit, Axios, Firebase, Tailwind/CSS
- **Backend Services**: Node.js, Express, LangGraph, Groq LLM API, Multer, Mongoose, Redis (ioredis)
- **Database & Cache**: MongoDB, Redis
- **APIs & Third-Party**: Groq Cloud, YouTube Data API, Razorpay, Firebase Auth

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (for Redis) or a local/cloud Redis instance
- [MongoDB](https://www.mongodb.com/) (Atlas or local instance)

---

### 2. Clone & Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd CareerForge-AI
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env` in the following locations and supply your API keys:
   - `frontend/.env.example` -> `frontend/.env`
   - `backend/gateway/.env.example` -> `backend/gateway/.env`
   - `backend/services/auth/.env.example` -> `backend/services/auth/.env`
   - `backend/services/billing/.env.example` -> `backend/services/billing/.env`
   - `backend/services/interview/.env.example` -> `backend/services/interview/.env`
   - `backend/services/resume/.env.example` -> `backend/services/resume/.env`
   - `backend/services/roadmap/.env.example` -> `backend/services/roadmap/.env`

---

### 3. Start Infrastructure

Start Redis using Docker Compose:
```bash
cd backend
docker-compose up -d
```

---

### 4. Install Dependencies & Run

#### Backend Gateway & Services
Navigate into each service directory or gateway and run:
```bash
# Example for gateway
cd backend/gateway
npm install
npm run dev

# Example for services (auth, resume, interview, roadmap, billing)
cd backend/services/auth
npm install
npm run dev
```

#### Frontend Client
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and communicate through the Gateway at `http://localhost:8000`.

---

## 🔒 Security & Environment
Never commit `.env` or sensitive credentials. All `.env` files are ignored by default in `.gitignore`. Use the provided `.env.example` files as templates.

---

## 📄 License
ISC License
