// API fake usada nos testes E2E: espelha os endpoints do backend NestJS
// (/api/v1/auth/* e /api/v1/users*) em memória, para os testes serem
// determinísticos e independentes do banco. O app aponta para cá via API_URL
// (ver playwright.config.ts). `POST /__reset` restaura os dados iniciais.
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

const port = Number(process.env.MOCK_API_PORT ?? 4010);
const PREFIX = "/api/v1";
const PAGE_SIZE = 15;
const PASSWORD = "abc123";
const RESET_TOKEN = "token-valido";

const SAMPLE_NAMES = [
  "Adriano Machado Souza",
  "Ana Beatriz Carvalho",
  "Bruno Henrique Lima",
  "Camila Rocha Andrade",
  "Daniel Ferreira Costa",
  "Eduarda Martins Pires",
  "Felipe Augusto Ramos",
  "Gabriela Nunes Barbosa",
  "Heitor Cardoso Mendes",
  "Isabela Freitas Duarte",
  "João Pedro Albuquerque",
  "Karina Moreira Batista",
  "Lucas Gabriel Monteiro",
  "Mariana Lopes Correia",
  "Natália Ribeiro Farias",
  "Raimundo Neto Abreu Teixeira",
];

let users = [];
let passwords = new Map();

function reset() {
  const createdAt = "2024-05-08T12:00:00.000Z";
  users = [
    {
      id: randomUUID(),
      name: "Millena Souza",
      email: "millena.souza@wenlock.com",
      registration: "100001",
      createdAt,
      updatedAt: null,
    },
    ...SAMPLE_NAMES.map((name, index) => ({
      id: randomUUID(),
      name,
      email: `usuario${index + 1}@wenlock.com`,
      registration: String(200001 + index),
      createdAt,
      updatedAt: null,
    })),
  ];
  passwords = new Map(users.map((user) => [user.id, PASSWORD]));
}
reset();

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const jwt = (payload, ttlSeconds) =>
  `${b64({ alg: "none" })}.${b64({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds })}.fake`;
const tokensFor = (user) => ({
  accessToken: jwt({ sub: user.id }, 15 * 60),
  refreshToken: jwt({ sub: user.id, jti: randomUUID() }, 7 * 24 * 60 * 60),
  tokenType: "Bearer",
  expiresIn: 900,
});

function subjectOf(token) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).sub;
  } catch {
    return undefined;
  }
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(data === undefined ? undefined : JSON.stringify(data));
}

const error = (res, status, message, field) =>
  send(res, status, { statusCode: status, message, error: "Error", field });

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const RULES = {
  name: /^\p{L}+(?: \p{L}+)*$/u,
  registration: /^\d{4,10}$/,
  password: /^[A-Za-z0-9]{6}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

function validate(body, partial) {
  const messages = [];
  for (const field of ["name", "email", "registration", "password"]) {
    const value = body[field];
    if (value === undefined && (partial || field === "password")) {
      if (!partial && field === "password") messages.push("A senha é obrigatória");
      continue;
    }
    if (typeof value !== "string" || !RULES[field].test(value)) messages.push(`${field} inválido`);
  }
  return messages;
}

function conflict(body, ignoreId) {
  if (body.email && users.some((u) => u.email === body.email.toLowerCase() && u.id !== ignoreId))
    return ["Já existe um usuário com este e-mail", "email"];
  if (
    body.registration &&
    users.some((u) => u.registration === body.registration && u.id !== ignoreId)
  )
    return ["Já existe um usuário com esta matrícula", "registration"];
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const path = url.pathname.startsWith(PREFIX) ? url.pathname.slice(PREFIX.length) : url.pathname;
  const method = req.method ?? "GET";

  if (method === "GET" && path === "/health") return send(res, 200, { ok: true });
  if (method === "POST" && path === "/__reset") {
    reset();
    return send(res, 204);
  }

  // ------------------------------------------------------------------ auth
  if (method === "POST" && path === "/auth/login") {
    const { login, password } = await readJson(req);
    const user = users.find((u) => u.email === login || u.registration === login);
    if (!user || passwords.get(user.id) !== password)
      return error(res, 401, "Usuário/Senha inválido(a)");
    return send(res, 200, { user, tokens: tokensFor(user) });
  }
  if (method === "POST" && path === "/auth/refresh") {
    const { refreshToken } = await readJson(req);
    const user = users.find((u) => u.id === subjectOf(refreshToken ?? ""));
    return user
      ? send(res, 200, { user, tokens: tokensFor(user) })
      : error(res, 401, "Sessão inválida");
  }
  if (method === "POST" && path === "/auth/logout") return send(res, 204);
  if (method === "POST" && path === "/auth/forgot-password") {
    const { email } = await readJson(req);
    return users.some((u) => u.email === email)
      ? send(res, 204)
      : error(res, 404, "E-mail não cadastrado");
  }
  if (method === "POST" && path === "/auth/reset-password") {
    const { token, password } = await readJson(req);
    if (token !== RESET_TOKEN) return error(res, 400, "Link de recuperação inválido ou expirado");
    passwords.set(users[0].id, password);
    return send(res, 204);
  }

  // Daqui para baixo tudo exige Bearer válido.
  const token = (req.headers.authorization ?? "").replace(/^Bearer /, "");
  const actor = users.find((u) => u.id === subjectOf(token));
  if (!actor) return error(res, 401, "Não autenticado");

  if (method === "GET" && path === "/auth/me") return send(res, 200, actor);

  // ----------------------------------------------------------------- users
  if (method === "GET" && path === "/users") {
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const filtered = users
      .filter((u) => u.name.toLowerCase().includes(search))
      .sort((a, b) => a.name.localeCompare(b.name));
    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / PAGE_SIZE);
    return send(res, 200, {
      data: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      meta: {
        total,
        page,
        limit: PAGE_SIZE,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  }

  if (method === "POST" && path === "/users") {
    const body = await readJson(req);
    const messages = validate(body, false);
    if (messages.length) return error(res, 400, messages);
    const clash = conflict(body);
    if (clash) return error(res, 409, ...clash);
    const user = {
      id: randomUUID(),
      name: body.name,
      email: body.email.toLowerCase(),
      registration: body.registration,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    users.push(user);
    passwords.set(user.id, body.password);
    return send(res, 201, user);
  }

  const detail = path.match(/^\/users\/([\w-]+)$/);
  if (detail) {
    const user = users.find((u) => u.id === detail[1]);
    if (!user) return error(res, 404, "Usuário não encontrado");

    if (method === "GET") return send(res, 200, user);
    if (method === "DELETE") {
      users = users.filter((u) => u.id !== user.id);
      return send(res, 204);
    }
    if (method === "PATCH") {
      const body = await readJson(req);
      const messages = validate(body, true);
      if (messages.length) return error(res, 400, messages);
      const clash = conflict(body, user.id);
      if (clash) return error(res, 409, ...clash);
      const { password, ...rest } = body;
      Object.assign(user, rest, { updatedAt: new Date().toISOString() });
      if (password) passwords.set(user.id, password);
      return send(res, 200, user);
    }
  }

  error(res, 404, "Not Found");
}).listen(port, "127.0.0.1", () => {
  console.log(`Mock API listening on http://127.0.0.1:${port}${PREFIX}`);
});
