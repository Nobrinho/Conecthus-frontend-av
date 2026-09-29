# frontend-nextjs-template

Template base de frontend com **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **TanStack Query**, **Zod** e **Vitest**.

## Começando

```bash
nvm use            # Node 22+
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

## Scripts

| Script                 | O que faz                                      |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento (Turbopack)        |
| `npm run build`        | Build de produção                              |
| `npm run start`        | Sobe o build de produção                       |
| `npm run lint`         | ESLint (regras do Next + TypeScript)           |
| `npm run typecheck`    | Gera os tipos de rota e roda `tsc --noEmit`    |
| `npm run format`       | Formata com Prettier (ordena classes Tailwind) |
| `npm test`             | Testes com Vitest + Testing Library            |
| `npm run format:check` | Verifica a formatação (usado no CI)            |
| `npm run test:e2e`     | Testes E2E com Playwright (build de produção)  |
| `npm run test:e2e:ui`  | Playwright em modo interativo (UI)             |

## Arquitetura

Organização **feature-based**: o `app/` só cuida de roteamento e composição; a lógica de negócio vive em `features/`.

```
src/
├── app/                    # Rotas (App Router) — finas, só compõem features
│   ├── (site)/             # Route group com Header/Footer (não altera a URL)
│   │   ├── layout.tsx
│   │   ├── page.tsx        # /
│   │   ├── loading.tsx     # Skeleton do grupo
│   │   ├── error.tsx       # Error boundary do grupo
│   │   └── posts/          # /posts e /posts/[id]
│   ├── api/health/         # Route Handler: GET /api/health
│   ├── layout.tsx          # Root layout: fontes, metadata, providers
│   ├── not-found.tsx
│   ├── global-error.tsx
│   └── globals.css         # Tailwind + design tokens (claro/escuro)
├── features/               # Módulos de domínio, isolados entre si
│   └── posts/
│       ├── api/            # Chamadas HTTP + query keys
│       ├── components/     # Componentes da feature (+ testes colocalizados)
│       ├── hooks/          # Hooks React Query
│       ├── types.ts        # Schemas zod + tipos inferidos
│       └── index.ts        # API pública da feature
├── components/
│   ├── ui/                 # Componentes genéricos (Button, Spinner, Container)
│   └── layout/             # Header, Footer
├── config/                 # env (validado com zod), site, rotas
├── lib/                    # Infra: cliente HTTP, QueryClient, utils (cn)
├── hooks/                  # Hooks genéricos reutilizáveis
├── providers/              # Providers globais (React Query...)
├── types/                  # Tipos globais compartilhados
├── test/                   # Setup e helpers de teste
└── proxy.ts                # Antigo middleware: headers de segurança
e2e/                        # Testes E2E (Playwright) + API fake
```

### Regras de dependência

```
app  →  features  →  components / lib / hooks / config
```

- `app/` pode importar de qualquer camada; nada importa de `app/`.
- Uma feature **não importa outra feature** diretamente. Se algo é compartilhado, suba para `components/`, `lib/` ou `hooks/`.
- Fora da feature, importe **apenas pelo barrel**: `@/features/posts` (nunca `@/features/posts/components/...`).
- `components/ui` não conhece regras de negócio.

### Busca de dados

- **Server Components** (padrão): chame a API da feature diretamente, ex. `await postsApi.getById(id)` — veja `app/(site)/posts/[id]/page.tsx`.
- **Client Components**: use hooks do TanStack Query, ex. `usePosts()` — veja `features/posts/components/post-list.tsx`.
- Todas as requisições passam por `lib/api/http-client.ts`, que valida a resposta com **zod** e lança `ApiError` padronizado.
- Query keys ficam centralizadas em `features/<feature>/api/query-keys.ts`.

### Escrita de dados (mutations)

Veja `features/posts/actions.ts` + `hooks/use-create-post.ts`:

- A **Server Action** valida a entrada com zod, chama a API (podendo usar segredos do servidor), faz `revalidatePath` e **retorna** `{ ok, data } | { ok: false, error, fieldErrors }` em vez de lançar erro (em produção o Next.js esconde a mensagem de erros lançados).
- O hook `useCreatePost` usa `useMutation` com a action e invalida as queries da feature no sucesso.

> A API de exemplo (jsonplaceholder) aceita o POST mas não persiste — o novo post não aparece na lista.

### Variáveis de ambiente

| Arquivo                    | Uso                                    | Onde pode ser importado     |
| -------------------------- | -------------------------------------- | --------------------------- |
| `src/config/env.ts`        | `NEXT_PUBLIC_*` (vão para o navegador) | Qualquer lugar              |
| `src/config/env.server.ts` | Segredos (tokens, chaves)              | Só servidor (`server-only`) |

Importar `env.server.ts` em um Client Component **quebra o build** — é intencional. Ao adicionar uma variável:

1. Adicione no schema e no objeto passado ao `parse` do arquivo correspondente;
2. Documente em `.env.example`.

### Criando uma nova feature

```
src/features/<nome>/
├── api/<nome>.api.ts     # funções que usam `http` + schema zod
├── api/query-keys.ts
├── hooks/use-<nome>.ts   # "use client" + useQuery/useMutation
├── components/
├── types.ts
└── index.ts              # exporte só o que é público
```

Depois crie a rota em `src/app/(site)/<nome>/page.tsx` consumindo `@/features/<nome>`.

### Testes

Testes ficam ao lado do código (`*.test.ts(x)`). Use `renderWithProviders` de `@/test/utils` para componentes que dependem de React Query. Nos testes, `server-only` é substituído por um módulo vazio (ver `vitest.config.mts`).

### Testes E2E (Playwright)

Ficam em `e2e/*.spec.ts`. Na primeira vez, instale o navegador: `npx playwright install chromium`.

O `npm run test:e2e` sobe dois servidores automaticamente (ver `playwright.config.ts`):

1. **API fake** (`e2e/mock-api/server.mjs`, porta 4010): respostas fixas, então os testes não dependem da internet nem de dados que mudam;
2. **App em produção** (`next build && next start`, porta 3100), buildado com `NEXT_PUBLIC_API_URL` apontando para a API fake. Isso cobre tanto as chamadas feitas no navegador quanto as do servidor (Server Components e Server Actions).

Para simular falhas só no navegador, use `page.route` (exemplo em `e2e/posts.spec.ts`). Ao adicionar endpoints na feature, adicione a rota correspondente na API fake.

> O E2E sobrescreve a pasta `.next` com um build apontando para a API fake. Rode `npm run build` de novo antes de `npm run start` normal.

Para usar um Chromium já instalado na máquina em vez do baixado pelo Playwright, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Qualidade automatizada

- **Pre-commit** (Husky + lint-staged): roda `eslint --fix` e `prettier --write` nos arquivos alterados. É instalado automaticamente pelo `npm install` (script `prepare`).
- **CI** (`.github/workflows/ci.yml`): em todo PR e push na `main`, roda lint, formatação, typecheck, testes e build (job `checks`) e os testes E2E (job `e2e`, que publica o relatório do Playwright quando falha).
