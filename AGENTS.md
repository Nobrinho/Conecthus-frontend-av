<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Convenções do projeto

Veja a seção **Arquitetura** do `README.md`. Em resumo:

- Rotas em `src/app` são finas; lógica de domínio fica em `src/features/<feature>` e é importada só pelo barrel `@/features/<feature>`.
- Features não importam umas das outras; código compartilhado vai para `src/components`, `src/lib` ou `src/hooks`.
- Toda chamada HTTP usa `http` de `@/lib/api` com um schema zod.
- Variáveis de ambiente são lidas apenas via `env` (`@/config/env`, públicas) ou `serverEnv` (`@/config/env.server`, segredos, só no servidor).
- Server Actions retornam `ActionResult` (`{ ok, ... }`) em vez de lançar erros.
- Antes de concluir: `npm run lint && npm run format:check && npm run typecheck && npm test`. Mudanças de UI/fluxo: rode também `npm run test:e2e` e mantenha `e2e/mock-api/server.mjs` em dia com os endpoints usados.
