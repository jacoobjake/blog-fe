# AGENTS.md

## Cursor Cloud specific instructions

### Service
Next.js 16 / React 19 (App Router) frontend on `:3000`. The public homepage is static story content; `/blogs` fetches published posts from the blog-api GraphQL endpoint. Requires the blog-api backend running (default `http://localhost:8000`).

### Runtime gotchas
- Requires `.env.local` with `NEXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8000`); both the server and browser fetchers throw if it is missing. `NEXT_PUBLIC_GRAPHQL_PATH` defaults to `/graphql`.
- Blog `json_content` is expected to be lz-string compressed. A blog created with a plain base64 body still shows on the `/blogs` listing but renders blank on the detail page — that is a test-data encoding mismatch, not an app bug.
- `npm run dev` runs the webpack dev server (`next dev --webpack`).
- `npm run lint` currently reports pre-existing lint errors in the repo; the tooling itself works (exit code non-zero is expected on the current codebase).
