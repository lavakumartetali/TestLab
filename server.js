import crypto from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(currentDir, "dist");
const hasProductionBuild = process.env.NODE_ENV === "production" || process.argv.includes("--production");

if (hasProductionBuild && !existsSync(path.join(distDir, "index.html"))) {
  throw new Error("Production frontend not found. Run `npm run build` before `npm start`.");
}

app.disable("x-powered-by");
const allowedOrigins = process.env.CORS_ORIGINS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins?.length ? allowedOrigins : true,
}));
app.use(express.json({ limit: "100kb" }));

let nextUserId = 13;
let users = [
  { id: 1, name: "Olivia Chen", email: "olivia.chen@example.com", role: "QA Engineer", department: "Engineering", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Noah Patel", email: "noah.patel@example.com", role: "Product Manager", department: "Product", status: "Active", joined: "2023-11-02" },
  { id: 3, name: "Ava Williams", email: "ava.williams@example.com", role: "Automation Tester", department: "Engineering", status: "Pending", joined: "2024-03-19" },
  { id: 4, name: "Liam Garcia", email: "liam.garcia@example.com", role: "UX Designer", department: "Design", status: "Active", joined: "2023-08-24" },
  { id: 5, name: "Sophia Kim", email: "sophia.kim@example.com", role: "Data Analyst", department: "Analytics", status: "Inactive", joined: "2022-12-05" },
  { id: 6, name: "Ethan Brown", email: "ethan.brown@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2024-02-12" },
  { id: 7, name: "Mia Johnson", email: "mia.johnson@example.com", role: "QA Engineer", department: "Quality", status: "Pending", joined: "2023-05-30" },
  { id: 8, name: "Lucas Martin", email: "lucas.martin@example.com", role: "Support Lead", department: "Support", status: "Active", joined: "2022-09-14" },
  { id: 9, name: "Amelia Davis", email: "amelia.davis@example.com", role: "Product Designer", department: "Design", status: "Inactive", joined: "2024-04-01" },
  { id: 10, name: "James Wilson", email: "james.wilson@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2023-06-21" },
  { id: 11, name: "Isabella Moore", email: "isabella.moore@example.com", role: "Recruiter", department: "People", status: "Active", joined: "2024-01-29" },
  { id: 12, name: "Benjamin Lee", email: "benjamin.lee@example.com", role: "Data Analyst", department: "Analytics", status: "Pending", joined: "2023-10-10" },
];

const demoAccount = { email: "demo@testlab.dev", password: "Test123!", name: "Jordan Davis" };
const sendError = (res, status, message, details) => res.status(status).json({
  error: { status, message, ...(details ? { details } : {}) },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "TestLab API", timestamp: new Date().toISOString(), uptimeSeconds: Math.floor(process.uptime()) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return sendError(res, 400, "Email and password are required.");
  }
  if (email.trim().toLowerCase() !== demoAccount.email || password !== demoAccount.password) {
    return sendError(res, 401, "Invalid email or password.");
  }
  return res.json({
    token: crypto.randomBytes(24).toString("hex"),
    tokenType: "Bearer",
    user: { name: demoAccount.name, email: demoAccount.email },
  });
});

app.get("/api/users", (req, res) => {
  const search = String(req.query.search ?? "").trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const allowedSorts = new Set(["name", "role", "department", "status", "joined"]);
  const sort = String(req.query.sort ?? "");
  const order = req.query.order === "desc" ? -1 : 1;
  const matching = users.filter((user) => Object.values(user).some((value) => String(value).toLowerCase().includes(search)));
  if (allowedSorts.has(sort)) {
    matching.sort((a, b) => String(a[sort]).localeCompare(String(b[sort])) * order);
  }
  const start = (page - 1) * limit;
  res.json({
    data: matching.slice(start, start + limit),
    pagination: { page, limit, total: matching.length, totalPages: Math.ceil(matching.length / limit) },
  });
});

app.post("/api/users", (req, res) => {
  const { name, email, role, department, status } = req.body ?? {};
  if (![name, email, role, department].every((value) => typeof value === "string" && value.trim())) {
    return sendError(res, 400, "Name, email, role, and department are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return sendError(res, 400, "Email must be a valid email address.");
  }
  if (users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
    return sendError(res, 409, "A user with this email already exists.");
  }
  const user = {
    id: nextUserId++,
    name: name.trim(),
    email: email.trim(),
    role: role.trim(),
    department: department.trim(),
    status: status === "Pending" || status === "Inactive" ? status : "Active",
    joined: new Date().toISOString().slice(0, 10),
  };
  users.push(user);
  return res.status(201).location(`/api/users/${user.id}`).json({ data: user });
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));
  if (!user) return sendError(res, 404, `User ${req.params.id} was not found.`);
  return res.json({ data: user });
});

app.put("/api/users/:id", (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index < 0) return sendError(res, 404, `User ${req.params.id} was not found.`);
  const { name, email, role, department, status } = req.body ?? {};
  if (![name, email, role, department].every((value) => typeof value === "string" && value.trim())) {
    return sendError(res, 400, "Name, email, role, and department are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return sendError(res, 400, "Email must be a valid email address.");
  }
  const duplicate = users.some((user) => user.id !== Number(req.params.id) && user.email.toLowerCase() === email.trim().toLowerCase());
  if (duplicate) return sendError(res, 409, "A user with this email already exists.");
  users[index] = { ...users[index], name: name.trim(), email: email.trim(), role: role.trim(), department: department.trim(), status: ["Active", "Pending", "Inactive"].includes(status) ? status : "Active" };
  return res.json({ data: users[index] });
});

app.patch("/api/users/:id", (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index < 0) return sendError(res, 404, `User ${req.params.id} was not found.`);
  const allowedFields = ["name", "email", "role", "department", "status"];
  const updates = Object.fromEntries(Object.entries(req.body ?? {}).filter(([key]) => allowedFields.includes(key)));
  if (!Object.keys(updates).length) return sendError(res, 400, "Provide at least one supported field to update.");
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value !== "string" || !value.trim()) return sendError(res, 400, `${key} must be a non-empty string.`);
    updates[key] = value.trim();
  }
  if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) return sendError(res, 400, "Email must be a valid email address.");
  if (updates.status && !["Active", "Pending", "Inactive"].includes(updates.status)) return sendError(res, 400, "Status must be Active, Pending, or Inactive.");
  if (updates.email && users.some((user) => user.id !== Number(req.params.id) && user.email.toLowerCase() === updates.email.toLowerCase())) {
    return sendError(res, 409, "A user with this email already exists.");
  }
  users[index] = { ...users[index], ...updates };
  return res.json({ data: users[index] });
});

app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index < 0) return sendError(res, 404, `User ${req.params.id} was not found.`);
  users.splice(index, 1);
  return res.status(204).end();
});

app.all("/api/test/echo", (req, res) => {
  res.json({
    method: req.method,
    path: req.originalUrl,
    query: req.query,
    headers: req.headers,
    body: req.body ?? null,
  });
});

app.get("/api/test/headers", (req, res) => {
  res.json({ headers: req.headers });
});

app.all("/api/test/delay/:milliseconds", async (req, res) => {
  const delay = Number(req.params.milliseconds);
  if (!Number.isInteger(delay) || delay < 0 || delay > 10000) {
    return sendError(res, 400, "Delay must be an integer from 0 to 10000 milliseconds.");
  }
  await new Promise((resolve) => setTimeout(resolve, delay));
  return res.json({ delayed: true, delayMilliseconds: delay, method: req.method, timestamp: new Date().toISOString() });
});

app.all("/api/test/status/:code", (req, res) => {
  const status = Number(req.params.code);
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    return sendError(res, 400, "Test status must be an HTTP error code from 400 to 599.");
  }
  return sendError(res, status, `Intentional ${status} response for API testing.`);
});

app.all("/api/test/error", (_req, res) => sendError(res, 500, "Intentional server error for API testing."));

app.get("/api/test/download/sample.csv", (_req, res) => {
  res.type("text/csv").attachment("testlab-sample.csv").send("id,name,email,status\n1,Alex Morgan,alex@example.com,Active\n2,Jamie Lee,jamie@example.com,Pending\n3,Taylor Kim,taylor@example.com,Active\n");
});

app.get("/api/test/download/sample.json", (_req, res) => {
  res.attachment("testlab-sample.json").json([
    { id: 1, name: "Alex Morgan", role: "QA Engineer" },
    { id: 2, name: "Jamie Lee", role: "Developer" },
  ]);
});

app.use("/api", (req, res) => sendError(res, 404, `No API route matches ${req.method} ${req.originalUrl}.`));

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return sendError(res, 400, "Request body contains invalid JSON.");
  }
  console.error("Unhandled API error:", error);
  return sendError(res, 500, "An unexpected server error occurred.");
});

if (hasProductionBuild) {
  app.use(express.static(distDir));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(distDir, "index.html")));
}

app.listen(port, () => {
  console.log(`TestLab API listening at http://localhost:${port}`);
  if (hasProductionBuild) console.log(`Serving the production frontend from ${distDir}`);
});
