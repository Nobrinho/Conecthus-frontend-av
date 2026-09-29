// API fake usada nos testes E2E: deixa os testes determinísticos e independentes da internet.
// O app é buildado com NEXT_PUBLIC_API_URL apontando para cá (ver playwright.config.ts).
import { createServer } from "node:http";

const port = Number(process.env.MOCK_API_PORT ?? 4010);

const posts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  userId: 1,
  title: i === 0 ? "Primeiro post de exemplo" : `Post de exemplo ${i + 1}`,
  body: `Conteúdo do post ${i + 1}.`,
}));

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  });
  res.end(data === undefined ? undefined : JSON.stringify(data));
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const detail = url.pathname.match(/^\/posts\/(\d+)$/);

  if (req.method === "OPTIONS") return send(res, 204);

  if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true });

  if (req.method === "GET" && url.pathname === "/posts") {
    const limit = Number(url.searchParams.get("_limit")) || posts.length;
    return send(res, 200, posts.slice(0, limit));
  }

  if (req.method === "GET" && detail) {
    const post = posts.find((p) => p.id === Number(detail[1]));
    return post ? send(res, 200, post) : send(res, 404, {});
  }

  if (req.method === "POST" && url.pathname === "/posts") {
    const body = await readJson(req);
    return send(res, 201, { id: 101, userId: 1, ...body });
  }

  send(res, 404, {});
}).listen(port, "127.0.0.1", () => {
  console.log(`Mock API listening on http://127.0.0.1:${port}`);
});
