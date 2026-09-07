import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folders
const MAIN_REPO_ROOT = path.resolve(__dirname, "..");
const MONOLITH_REPO_ROOT = path.resolve(MAIN_REPO_ROOT, "..", "CareerForge-AI-Backend");

console.log("==================================================");
console.log("🔄 CareerForge AI: Microservices -> Monolith Sync");
console.log(`📂 Source: ${MAIN_REPO_ROOT}\\backend`);
console.log(`🎯 Target: ${MONOLITH_REPO_ROOT}`);
console.log("==================================================");

if (!fs.existsSync(MONOLITH_REPO_ROOT)) {
  console.error(`❌ Monolith repository directory not found at: ${MONOLITH_REPO_ROOT}`);
  process.exit(1);
}

// Transformation helpers for imports
function transformContent(content, serviceName, destRelPath) {
  let transformed = content;

  // Normalize line endings
  transformed = transformed.replace(/\r\n/g, "\n");

  const destDir = path.dirname(destRelPath).replace(/\\/g, "/");

  if (destDir.startsWith("graph/")) {
    // 2 levels deep: graph/interview/nodes.js
    transformed = transformed.replace(/from\s+["']\.\.\/agents\//g, 'from "../../agents/');
    transformed = transformed.replace(/from\s+["']\.\.\/prompts\//g, `from "../../prompts/${serviceName}/`);
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\/roadmap\.prompt\.js["']/g, 'from "../../prompts/roadmap/roadmap.prompt.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\/youtube\.js["']/g, 'from "../../config/youtube.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/models?\//g, 'from "../../models/');
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\//g, 'from "../../config/');
    transformed = transformed.replace(/from\s+["']\.\.\/\.\.\/\.\.\/shared\/redis\/redis\.js["']/g, 'from "../../config/redis.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/\.\.\/shared\/redis\/redis\.js["']/g, 'from "../../config/redis.js"');
  } else if (destDir === "controllers") {
    // 1 level deep: controllers/auth.controller.js
    transformed = transformed.replace(/from\s+["']\.\.\/\.\.\/\.\.\/shared\/redis\/redis\.js["']/g, 'from "../config/redis.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/\.\.\/shared\/redis\/redis\.js["']/g, 'from "../config/redis.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/models?\//g, 'from "../models/');
    transformed = transformed.replace(/from\s+["']\.\.\/prompts\//g, `from "../prompts/${serviceName}/`);
    transformed = transformed.replace(/from\s+["']\.\.\/agents\//g, 'from "../agents/');
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\/roadmap\.prompt\.js["']/g, 'from "../prompts/roadmap/roadmap.prompt.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\//g, 'from "../config/');
    if (serviceName === "interview") {
      transformed = transformed.replace(/from\s+["']\.\.\/graph\/graph\.js["']/g, 'from "../graph/interview/graph.js"');
    } else if (serviceName === "roadmap") {
      transformed = transformed.replace(/from\s+["']\.\.\/graph\/roadmap\.graph\.js["']/g, 'from "../graph/roadmap/roadmap.graph.js"');
    }
  } else if (destDir === "agents") {
    transformed = transformed.replace(/from\s+["']\.\.\/prompts\//g, `from "../prompts/${serviceName}/`);
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\/roadmap\.prompt\.js["']/g, 'from "../prompts/roadmap/roadmap.prompt.js"');
    transformed = transformed.replace(/from\s+["']\.\.\/models?\//g, 'from "../models/');
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\//g, 'from "../config/');
  } else if (destDir.startsWith("prompts/")) {
    transformed = transformed.replace(/from\s+["']\.\.\/configs?\//g, 'from "../../config/');
  } else if (destDir === "routes") {
    transformed = transformed.replace(/from\s+["']\.\.\/controllers\//g, 'from "../controllers/');
    transformed = transformed.replace(/from\s+["']\.\.\/middleware\//g, 'from "../middleware/');
  }

  // General fixes
  transformed = transformed.replace(/from\s+["']\.\.\/model\//g, 'from "../models/');
  transformed = transformed.replace(/from\s+["']\.\.\/configs\//g, 'from "../config/');

  return transformed;
}

// Define complete map of files to sync
const SYNC_DEFINITIONS = [
  // Shared Redis
  {
    service: "shared",
    srcRel: "backend/shared/redis/redis.js",
    destRel: "config/redis.js",
  },

  // Auth Service
  {
    service: "auth",
    srcRel: "backend/services/auth/configs/db.js",
    destRel: "config/db.js",
  },
  {
    service: "auth",
    srcRel: "backend/services/auth/configs/firebase.js",
    destRel: "config/firebase.js",
  },
  {
    service: "auth",
    srcRel: "backend/services/auth/controllers/auth.controller.js",
    destRel: "controllers/auth.controller.js",
  },
  {
    service: "auth",
    srcRel: "backend/services/auth/model/user.model.js",
    destRel: "models/user.model.js",
  },
  {
    service: "auth",
    srcRel: "backend/services/auth/routes/auth.route.js",
    destRel: "routes/auth.route.js",
  },

  // Billing Service
  {
    service: "billing",
    srcRel: "backend/services/billing/configs/razorpay.js",
    destRel: "config/razorpay.js",
  },
  {
    service: "billing",
    srcRel: "backend/services/billing/controllers/billing.controller.js",
    destRel: "controllers/billing.controller.js",
  },
  {
    service: "billing",
    srcRel: "backend/services/billing/models/billing.model.js",
    destRel: "models/billing.model.js",
  },
  {
    service: "billing",
    srcRel: "backend/services/billing/routes/billing.route.js",
    destRel: "routes/billing.route.js",
  },

  // Interview Service
  {
    service: "interview",
    srcRel: "backend/services/interview/config/llm.js",
    destRel: "config/llm.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/agents/interview.agent.js",
    destRel: "agents/interview.agent.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/agents/feedback.agent.js",
    destRel: "agents/feedback.agent.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/agents/summary.agent.js",
    destRel: "agents/summary.agent.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/controllers/interview.controller.js",
    destRel: "controllers/interview.controller.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/graph/graph.js",
    destRel: "graph/interview/graph.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/graph/nodes.js",
    destRel: "graph/interview/nodes.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/graph/state.js",
    destRel: "graph/interview/state.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/models/interview.model.js",
    destRel: "models/interview.model.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/prompts/feedbackPrompt.js",
    destRel: "prompts/interview/feedbackPrompt.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/prompts/hrInterviewPrompt.js",
    destRel: "prompts/interview/hrInterviewPrompt.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/prompts/summaryPrompt.js",
    destRel: "prompts/interview/summaryPrompt.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/prompts/technicalInterviewPrompt.js",
    destRel: "prompts/interview/technicalInterviewPrompt.js",
  },
  {
    service: "interview",
    srcRel: "backend/services/interview/routes/interview.route.js",
    destRel: "routes/interview.route.js",
  },

  // Resume Service
  {
    service: "resume",
    srcRel: "backend/services/resume/agents/resume.agent.js",
    destRel: "agents/resume.agent.js",
  },
  {
    service: "resume",
    srcRel: "backend/services/resume/config/pdf.js",
    destRel: "config/pdf.js",
  },
  {
    service: "resume",
    srcRel: "backend/services/resume/controllers/resume.controller.js",
    destRel: "controllers/resume.controller.js",
  },
  {
    service: "resume",
    srcRel: "backend/services/resume/middleware/multer.js",
    destRel: "middleware/multer.js",
  },
  {
    service: "resume",
    srcRel: "backend/services/resume/models/resume.model.js",
    destRel: "models/resume.model.js",
  },
  {
    service: "resume",
    srcRel: "backend/services/resume/routes/resume.route.js",
    destRel: "routes/resume.route.js",
  },

  // Roadmap Service
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/agents/resource.agent.js",
    destRel: "agents/resource.agent.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/agents/roadmap.agent.js",
    destRel: "agents/roadmap.agent.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/configs/youtube.js",
    destRel: "config/youtube.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/configs/roadmap.prompt.js",
    destRel: "prompts/roadmap/roadmap.prompt.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/controllers/roadmap.controller.js",
    destRel: "controllers/roadmap.controller.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/graph/roadmap.graph.js",
    destRel: "graph/roadmap/roadmap.graph.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/graph/roadmap.state.js",
    destRel: "graph/roadmap/roadmap.state.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/models/roadmap.model.js",
    destRel: "models/roadmap.model.js",
  },
  {
    service: "roadmap",
    srcRel: "backend/services/roadmap/routes/roadmap.route.js",
    destRel: "routes/roadmap.route.js",
  },
];

function syncSingleFile(def) {
  const srcPath = path.join(MAIN_REPO_ROOT, def.srcRel);
  const destPath = path.join(MONOLITH_REPO_ROOT, def.destRel);

  if (!fs.existsSync(srcPath)) {
    return false;
  }

  const srcContent = fs.readFileSync(srcPath, "utf-8");
  const transformed = transformContent(srcContent, def.service, def.destRel);

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  let existing = null;
  if (fs.existsSync(destPath)) {
    existing = fs.readFileSync(destPath, "utf-8").replace(/\r\n/g, "\n");
  }

  if (existing !== transformed) {
    fs.writeFileSync(destPath, transformed, "utf-8");
    console.log(`  ✅ Synced: ${def.srcRel} -> ${def.destRel}`);
    return true;
  }

  return false;
}

function syncAll() {
  console.log(`\n⏳ Scanning files and synchronizing...`);
  let count = 0;
  for (const def of SYNC_DEFINITIONS) {
    if (syncSingleFile(def)) {
      count++;
    }
  }
  if (count === 0) {
    console.log("✨ All files are already up-to-date in monolith backend!");
  } else {
    console.log(`🎉 Successfully synchronized ${count} file(s) into monolith backend!`);
  }
}

// Git Push Helper
function commitAndPush(commitMsg = "sync: update backend changes from microservices") {
  try {
    console.log("\n🚀 Checking Git status in monolith repository...");
    const status = execSync("git status --porcelain", {
      cwd: MONOLITH_REPO_ROOT,
      encoding: "utf-8",
    });

    if (!status.trim()) {
      console.log("ℹ️ No uncommitted changes in monolith backend to push.");
      return;
    }

    console.log("📦 Staging and committing changes in monolith...");
    execSync("git add .", { cwd: MONOLITH_REPO_ROOT, stdio: "inherit" });
    execSync(`git commit -m "${commitMsg}"`, {
      cwd: MONOLITH_REPO_ROOT,
      stdio: "inherit",
    });

    console.log("⬆️ Pushing changes to GitHub (triggers auto-deploy on Render)...");
    execSync("git push origin main", {
      cwd: MONOLITH_REPO_ROOT,
      stdio: "inherit",
    });

    console.log("🎉 Successfully pushed to GitHub!");
  } catch (err) {
    console.error("⚠️ Git push failed:", err.message);
  }
}

// Watch Mode
function startWatchMode() {
  console.log("\n👀 Watch mode enabled! Watching backend/services & backend/shared for changes...");
  console.log("Press Ctrl+C to stop.\n");

  const watchDirs = [
    path.join(MAIN_REPO_ROOT, "backend", "services"),
    path.join(MAIN_REPO_ROOT, "backend", "shared"),
  ];

  for (const dir of watchDirs) {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        // Ignore node_modules or temp files
        if (filename.includes("node_modules") || filename.startsWith(".")) return;

        // Find match in definitions
        const normalized = filename.replace(/\\/g, "/");
        const match = SYNC_DEFINITIONS.find(
          (d) => d.srcRel.includes(normalized) || normalized.includes(path.basename(d.srcRel))
        );

        if (match) {
          console.log(`\n📝 Change detected in: ${filename}`);
          syncSingleFile(match);
        }
      });
    }
  }
}

// Execution arguments
const args = process.argv.slice(2);

syncAll();

if (args.includes("--push")) {
  const msgIdx = args.indexOf("--push") + 1;
  const commitMsg = args[msgIdx] || "sync: update backend changes from microservices";
  commitAndPush(commitMsg);
}

if (args.includes("--watch")) {
  startWatchMode();
}
