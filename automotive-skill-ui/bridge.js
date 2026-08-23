const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const rootDir = __dirname;
const config = readJson(path.join(rootDir, "config.json"), {
  port: 8787,
  skillName: "automotive-marketing-materials",
  execution: { mode: "manual" },
  outputFileNames: ["output.png", "output.jpg", "output.jpeg", "output.webp"]
});
const jobsDir = path.join(rootDir, "jobs");
fs.mkdirSync(jobsDir, { recursive: true });

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/") {
      return sendFile(res, path.join(rootDir, "index.html"));
    }
    if (req.method === "POST" && url.pathname === "/api/jobs") {
      return createJob(req, res);
    }
    if (req.method === "GET" && /^\/api\/jobs\/[^/]+\/status$/.test(url.pathname)) {
      const jobId = url.pathname.split("/")[3];
      return sendJson(res, getJobStatus(jobId));
    }
    if (req.method === "GET" && url.pathname.startsWith("/jobs/")) {
      return sendFile(res, safeJoin(rootDir, decodeURIComponent(url.pathname.slice(1))));
    }
    return sendFile(res, safeJoin(rootDir, decodeURIComponent(url.pathname.slice(1))));
  } catch (error) {
    sendJson(res, { ok: false, error: error.message }, 500);
  }
});

server.listen(config.port, "127.0.0.1", () => {
  console.log(`Automotive Skill UI running at http://localhost:${config.port}/`);
  console.log(`Jobs directory: ${jobsDir}`);
});

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target || ".");
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error("Invalid path");
  }
  return resolved;
}

function sendJson(res, data, status = 200) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(body);
}

function sendFile(res, filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": "no-store"
  });
  fs.createReadStream(filePath).pipe(res);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 30 * 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function createJob(req, res) {
  const payload = JSON.parse(await readBody(req));
  const jobId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14) + "-" + crypto.randomBytes(3).toString("hex");
  const jobDir = path.join(jobsDir, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  const input = normalizeInput(payload);
  if (input.vehicleImage && input.vehicleImage.dataUrl) {
    const saved = saveDataUrl(jobDir, input.vehicleImage);
    input.vehicleImage.savedPath = saved.relativePath;
    delete input.vehicleImage.dataUrl;
  }

  const prompt = buildCodexPrompt(input, jobDir);
  const status = {
    ok: true,
    jobId,
    state: "waiting-for-codex",
    createdAt: new Date().toISOString(),
    message: "任务单已保存。将 prompt.txt 交给 Codex 执行，生成图片放入任务目录后网页会自动显示。"
  };

  fs.writeFileSync(path.join(jobDir, "input.json"), JSON.stringify(input, null, 2), "utf8");
  fs.writeFileSync(path.join(jobDir, "prompt.txt"), prompt, "utf8");
  fs.writeFileSync(path.join(jobDir, "status.json"), JSON.stringify(status, null, 2), "utf8");

  maybeStartExecution(jobId, jobDir, prompt);

  sendJson(res, {
    ok: true,
    jobId,
    jobUrl: `/jobs/${jobId}/`,
    promptUrl: `/jobs/${jobId}/prompt.txt`,
    statusUrl: `/api/jobs/${jobId}/status`,
    prompt
  });
}

function maybeStartExecution(jobId, jobDir, prompt) {
  const execution = config.execution || {};
  if (execution.mode !== "codex-cli") return;

  const command = execution.command || "auto";
  const args = Array.isArray(execution.args) ? [...execution.args] : ["exec"];
  const promptMode = execution.promptMode || "argument";
  const resolvedCommand = resolveCodexCommand(command);
  const stdoutPath = path.join(jobDir, "codex.stdout.log");
  const stderrPath = path.join(jobDir, "codex.stderr.log");

  writeStatus(jobDir, {
    ok: true,
    jobId,
    state: "running-codex",
    updatedAt: new Date().toISOString(),
    message: "已启动 Codex CLI，等待生成图片。"
  });

  if (promptMode === "argument") {
    args.push(prompt);
  }

  let child;
  try {
    const env = { ...process.env };
    env.PATH = `${path.dirname(process.execPath)}${path.delimiter}${env.PATH || ""}`;
    if (execution.nodePath) {
      const nodePath = path.resolve(rootDir, execution.nodePath);
      env.PATH = `${nodePath}${path.delimiter}${env.PATH || ""}`;
    }
    child = spawn(resolvedCommand, args, {
      cwd: jobDir,
      env,
      shell: process.platform === "win32" && /\.cmd$/i.test(resolvedCommand),
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });
  } catch (error) {
    writeExecutionFailure(jobDir, jobId, error);
    return;
  }

  if (promptMode === "stdin") {
    child.stdin.write(prompt);
    child.stdin.end();
  } else {
    child.stdin.end();
  }

  child.stdout.on("data", (chunk) => fs.appendFileSync(stdoutPath, chunk));
  child.stderr.on("data", (chunk) => fs.appendFileSync(stderrPath, chunk));
  child.on("error", (error) => writeExecutionFailure(jobDir, jobId, error));
  child.on("close", (code) => {
    const output = findOutput(jobDir);
    writeStatus(jobDir, {
      ok: code === 0 && Boolean(output),
      jobId,
      state: output ? "done" : "codex-finished-no-image",
      updatedAt: new Date().toISOString(),
      message: output
        ? "Codex 已完成，并检测到输出图片。"
        : `Codex CLI 已退出，退出码 ${code}，但还没有检测到 output 图片。`
    });
  });
}

function resolveCodexCommand(command) {
  if (command && command !== "auto") {
    return path.isAbsolute(command) ? command : path.join(rootDir, command);
  }
  const localName = process.platform === "win32" ? "codex.cmd" : "codex";
  const localCommand = path.join(rootDir, "node_modules", ".bin", localName);
  if (fs.existsSync(localCommand)) return localCommand;
  return "codex";
}

function writeExecutionFailure(jobDir, jobId, error) {
  writeStatus(jobDir, {
    ok: false,
    jobId,
    state: "codex-start-failed",
    updatedAt: new Date().toISOString(),
    message: `无法启动 Codex CLI：${error.message}`
  });
}

function writeStatus(jobDir, data) {
  fs.writeFileSync(path.join(jobDir, "status.json"), JSON.stringify(data, null, 2), "utf8");
}

function normalizeInput(payload) {
  const brand = payload.brand === "volkswagen-anhui" ? "volkswagen-anhui" : "wuling";
  return {
    brand,
    platform: payload.platform || "",
    placement: payload.placement || "",
    assetType: payload.assetType || "poster-cover",
    vehicle: payload.vehicle || "",
    imageSource: payload.imageSource || "official",
    vehicleImage: payload.vehicleImage || null,
    sceneElements: payload.sceneElements || "",
    copy: payload.copy || "",
    wuling: brand === "wuling" ? {
      logoOption: payload.logoOption || "B",
      style: payload.wulingStyle || ""
    } : null,
    volkswagenAnhui: brand === "volkswagen-anhui" ? {
      contentType: payload.dssoContentType || "product",
      routedStyle: payload.dssoStyle || "1"
    } : null
  };
}

function saveDataUrl(jobDir, image) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(image.dataUrl);
  if (!match) throw new Error("Invalid image upload");
  const extByMime = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/svg+xml": ".svg"
  };
  const ext = extByMime[match[1]] || path.extname(image.name || "").toLowerCase() || ".png";
  const fileName = "uploaded-vehicle" + ext;
  const filePath = path.join(jobDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(match[2], "base64"));
  return { fileName, relativePath: fileName };
}

function buildCodexPrompt(input, jobDir) {
  const brandName = input.brand === "wuling" ? "五菱" : "安徽大众";
  const brandRule = input.brand === "wuling"
    ? `五菱专属规则：Logo ${input.wuling.logoOption}；视觉风格：${input.wuling.style}。`
    : `安徽大众 DSSO 规则：内容类型 ${input.volkswagenAnhui.contentType}；自动匹配风格 ${input.volkswagenAnhui.routedStyle}；默认右上 VW 圆标 + 横向贯穿式午夜黄律动线框。`;
  const sourceRule = input.imageSource === "local"
    ? `车型素材使用任务目录中的本地上传图：${input.vehicleImage ? input.vehicleImage.savedPath : "未上传"}。`
    : "车型素材由 AI 从官方品牌网站检索，并记录用于生成的官方参考。";

  return [
    `使用 $automotive-marketing-materials Skill 创作一张汽车营销图片。`,
    "",
    `任务目录：${jobDir}`,
    `品牌：${brandName}`,
    `平台：${input.platform}`,
    `版位 / 尺寸：${input.placement}`,
    `物料类型：${input.assetType}`,
    `车型 / 颜色 / 角度：${input.vehicle}`,
    sourceRule,
    `画面元素 / 场景补充：${input.sceneElements || "无"}`,
    `画面文案：${input.copy}`,
    brandRule,
    "",
    "要求：",
    "1. 严格按 Skill 规则执行，不改写用户提供的画面文案。",
    "2. 如果使用官网找图，先检索官方车型、Logo、展示牌、车身铭牌等参考。",
    "3. 只需要交付最终图片。",
    "4. 请将最终图片保存到上述任务目录，文件名使用 output.png 或 output.jpg，便于网页自动显示。"
  ].join("\n");
}

function getJobStatus(jobId) {
  if (!/^[0-9a-f-]+$/i.test(jobId)) {
    throw new Error("Invalid job id");
  }
  const jobDir = path.join(jobsDir, jobId);
  if (!fs.existsSync(jobDir)) {
    return { ok: false, state: "not-found" };
  }
  const output = findOutput(jobDir);
  const status = readJson(path.join(jobDir, "status.json"), {});
  return {
    ok: true,
    jobId,
    state: output ? "done" : (status.state || "waiting-for-codex"),
    message: output ? "已检测到输出图片。" : (status.message || "等待输出图片。"),
    imageUrl: output ? `/jobs/${jobId}/${output}` : null,
    promptUrl: `/jobs/${jobId}/prompt.txt`,
    inputUrl: `/jobs/${jobId}/input.json`
  };
}

function findOutput(jobDir) {
  for (const fileName of config.outputFileNames) {
    if (fs.existsSync(path.join(jobDir, fileName))) return fileName;
  }
  return null;
}
