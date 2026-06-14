# Project Rules — AI Agent Constitution

> **Read this first.** Every agent working on this codebase must internalize these rules. Violations create rework.

---

## 0. Project Context

**ThangkaHub** (consumer brand: **Kathmandu Arts**) is a premium marketplace for authentic Nepali Thangka art. It connects traditional artists in the Kathmandu Valley with global collectors.

**Stack:** Next.js 15 (App Router), TypeScript 5.7+, Tailwind CSS 4, ShadCN UI, Supabase (PostgreSQL + Auth + Storage), Drizzle ORM, Zod, Zustand, Khalti/eSewa/Stripe.

**Three roles:** Client (default on signup), Artist (admin grants this role), Admin.

**MVP focus:** Core marketplace (browse, search, filter, detail), artist profiles, story-driven artwork pages, cart + checkout. No custom commissions, no live sessions, no multi-currency beyond NPR/USD.

**Design:** Dark luxury aesthetic. See `docs/DESIGN_SYSTEM.md` for all tokens, components, and patterns.

**Architecture:** See `docs/ARCHITECTURE.md` for full project structure, routes, and data flow.

---

## 1. Before Writing ANY Code

### 1.1 Read First, Write Second
- **Read the file** you're about to edit. Never blind-edit.
- **Read at least one similar existing file** to understand the pattern before creating a new one.
- **Check `docs/DESIGN_SYSTEM.md`** if you're touching UI — use existing tokens, never invent new colors/spacing.
- **Check `docs/ARCHITECTURE.md`** if you're creating routes, components, or touching data.

### 1.2 Search Before Creating
- Before creating a new component, check if a similar one exists in `src/components/`.
- Before adding a utility, check `src/lib/utils/`.
- Before adding a hook, check `src/hooks/`.
- Before adding a type, check `src/types/`.

---

## 2. Code Quality — THE RULES

### 2.1 Comments
- **DEFAULT: NO COMMENTS.** Well-named functions and variables don't need them.
- **Only comment WHY**, never WHAT. If the code behavior would surprise a reader or there's a non-obvious constraint, add ONE short line.
- **Never** write JSDoc/TSDoc blocks on functions or components.
- **Never** write "This component renders..." or "// Handles the case where..."
- **Never** leave TODO comments without a tracking issue number: `// TODO(KTM-123): ...`

### 2.2 Abstraction
- **Three similar lines is better than a premature abstraction.** Don't DRY until the pattern appears 3+ times.
- **One-off operations don't need helpers.** No "just in case" utility functions.
- **Don't add features or parameters** because "someone might need them later."
- **Error handling:** Only handle errors that CAN happen. Don't wrap things in try/catch for "safety."

### 2.3 Dead Code
- **DELETE unused code.** Don't comment it out.
- **DELETE unused imports.** Don't leave them.
- **DELETE unused variables, types, exports.**
- If the commit removes something, it's gone. No `// removed` comments.

### 2.4 TypeScript
- **Strict mode.** No `any` without a documented reason.
- **Prefer inference** — don't type `const x: string = "hello"`.
- **Use Zod schemas** for all data entering the system (API routes, server actions, form inputs).
- **Share types** via `src/types/`, not inline type definitions.
- **Database types** come from Drizzle inference — don't duplicate them.

### 2.5 Imports
- **Order:** React/Next → third-party → internal aliases → relative
- **No barrel exports** from `src/components/ui/` (ShadCN already handles this)
- **No circular imports** — if you need a type in two places, put it in `src/types/`

---

## 3. Component Rules

### 3.1 Server vs Client Components
- **Default to Server Component.** Only add `"use client"` when you NEED interactivity (state, effects, event handlers, browser APIs).
- **Push client logic to leaf nodes.** A `"use client"` card button inside a server-rendered grid is fine.
- **Server Components can import Client Components** — the boundary is clean.

### 3.2 Component Structure
Every component follows this order:
```
1. "use client" directive (if needed)
2. Imports (ordered as above)
3. Type/interface definition
4. Component function
5. Export
```

### 3.3 Naming
- **Files:** kebab-case (`art-card.tsx`, `filter-sidebar.tsx`)
- **Components:** PascalCase (`ArtCard`, `FilterSidebar`)
- **Server actions:** camelCase, verb-first (`createArtwork`, `updateArtistProfile`)
- **Database columns:** snake_case (`artist_id`, `created_at`)
- **Variables/functions:** camelCase
- **Types/Interfaces:** PascalCase, no `I` prefix, no `T` prefix

### 3.4 Props
- **Destructure props inline** unless the type is reused elsewhere.
- **No `React.FC`** — just type the props parameter directly.
- **Required props first**, optional with defaults last.

### 3.5 Tailwind / Styling
- **Use the design system tokens.** `text-on-surface-variant` not `text-[#d0c5af]`. Check `docs/DESIGN_SYSTEM.md` for available tokens.
- **Never write inline styles** unless the value is truly dynamic (e.g., `style={{ transform: \`translateY(${offset}px)\` }}`).
- **No CSS modules.** Everything lives in `globals.css` or Tailwind utility classes.
- **Use `cn()` from `src/lib/utils/cn.ts`** for conditional classes. Never template-literal concatenation.
- **Dark mode:** The base theme IS dark. No `dark:` prefix needed on most things. Only use `dark:` when exceptionally overriding for light mode (drawer, modals that use light backgrounds).

### 3.6 ShadCN UI
- **Use ShadCN primitives** (`Button`, `Input`, `Select`, `Dialog`, `Sheet`, etc.) — never build custom versions.
- **Customize via ShadCN's variant system**, not by overriding ShadCN internals.
- **Gold button** is already defined in the design system — use `<GoldButton>` from `src/components/shared/gold-button.tsx`, not a raw ShadCN `Button`.

---

## 4. Data & State Rules

### 4.1 Data Fetching
- **Server Components** fetch data directly via Supabase server client in the component body. No `useEffect` fetches unless absolutely required.
- **Server Actions** handle all mutations (create, update, delete). No `fetch` from client to internal API routes.
- **API routes** (`src/app/api/`) are ONLY for external callbacks (payment webhooks, OAuth callbacks).
- **Revalidate with `revalidatePath()`** after mutations in Server Actions.

### 4.2 State Management
- **URL searchParams** for filter state (marketplace filters, search queries, pagination).
- **Zustand** for cart state only. Persisted to localStorage, synced to Supabase for logged-in users.
- **No React Context** for global state. Only use it for true provider-level concerns (theme, auth session).
- **Form state** handled by React Hook Form + Zod validation.

### 4.3 Supabase
- **Client component** → `createClient()` from `src/lib/supabase/client.ts` (anon key).
- **Server component** → `createClient()` from `src/lib/supabase/server.ts` (service role, RLS bypass OK for server-side queries).
- **RLS policies** handle row-level access control. Never write application-level checks when RLS can do it.
- **Never expose `service_role` key to the browser.** Server-only.

---

## 5. Git & Workflow

### 5.1 Commits
- **One logical change per commit.** Don't bundle unrelated changes.
- **Commit messages:** imperative mood, short summary line, blank line, then details if needed.
- **Examples:** `Add artwork upload form with multi-image support` / `Fix RLS policy preventing artist profile reads`
- **No `WIP` or `fix stuff` commits.**

### 5.2 Before Committing
- `tsc --noEmit` passes
- No lint errors
- The changed files make sense together (review your own diff)

### 5.3 Branching
- `main` is production. Never commit directly to it.
- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`

---

## 6. Verification — Before Saying "Done"

Every task is complete ONLY when:

1. **TypeScript compiles** with zero errors
2. **No new lint warnings** introduced
3. **The feature works** — golden path tested
4. **Loading state** is handled (skeleton or spinner)
5. **Empty state** is handled (no data yet, no results)
6. **Error state** is handled (graceful message, not white screen)
7. **Responsive** — mobile and desktop layouts both work
8. **The design tokens match** — colors, spacing, typography are from the system, not invented

If any of the above can't be verified, SAY SO. Don't claim success if you haven't checked.

---

## 7. Communication Rules

- **Be specific** about what file you changed and why.
- **If you hit a blocker**, state it immediately. Don't try to work around it silently.
- **If a task is too large** for your context window, say so and suggest how to split it.
- **Report what you actually did**, not what you intended to do. "I changed the cart button to..." not "I was going to change..."
- **No emoji** in code, commit messages, or documentation.
- **No fluff.** Short, direct updates. The user can read the diff.

---

## 8. Context Window Management

This project is built with AI coding agents that have limited context. Every file consumed is expensive.

### 8.1 When Creating New Files
- Create files that are **self-contained** — a component should tell you everything it does from its file alone.
- **Reference related files** in the first few lines if needed (e.g., `// Uses types from src/types/artwork.ts`), but keep it to ONE line.

### 8.2 When Editing Existing Files
- **Read only the section you need.** Use `offset` and `limit` parameters.
- **Don't re-read after editing** — if the Edit tool succeeded, the change is applied.
- **Make targeted edits.** Prefer multiple small `Edit` calls over rewriting entire files.

### 8.3 Task Decomposition
- Large tasks should be broken into **small, independently verifiable units.**
- Each unit should touch **at most 3-5 files.**
- If a task would touch 10+ files, break it down further.

### 8.4 Documentation Reference
- Reference `docs/DESIGN_SYSTEM.md` and `docs/ARCHITECTURE.md` rather than re-reading them. Both are comprehensive.
- The design system has tokens, components, and patterns. Trust it — don't re-extract rules from it.

---

## 9. Anti-Patterns — NEVER DO THESE

| Anti-pattern | Correct approach |
|---|---|
| Writing a comment that describes what code does | Rename the function/variable instead |
| Creating a `utils.ts` or `helpers.ts` dump file | Put utilities in `src/lib/utils/` with specific names |
| Using `any` "just for now" | Use `unknown` and narrow, or define the type |
| Copy-pasting a component and tweaking it | Extract the shared pattern or use composition |
| Adding a new color to Tailwind for one-off use | Use the existing token that's closest |
| Wrapping every `await` in try/catch | Let errors propagate to error boundaries |
| Creating a `data.ts` file with hardcoded seed data inside `src/` | Put seed data in `supabase/seed.sql` |
| Using `useEffect` for data fetching in a page | Use Server Components or Server Actions |
| Exporting a default AND named export from the same file | Pick one convention per file type (default for components, named for utils) |
| Creating a `<Wrapper>` or `<Container>` component | Use Tailwind classes directly |
| Using `!important` or inline styles to override | Fix the root cause in the component or design token |
| Leaving `console.log` in committed code | Remove before committing |
| Using `// eslint-disable` | Fix the lint issue or ask if the rule is wrong |
| Importing from `../../` three levels deep | Use path aliases: `@/components/`, `@/lib/` |

---

## 10. Path Aliases

```json
{
  "@/*": "./src/*",
  "@/components/*": "./src/components/*",
  "@/lib/*": "./src/lib/*",
  "@/hooks/*": "./src/hooks/*",
  "@/types/*": "./src/types/*"
}
```

Always use `@/` imports within `src/`. Never relative imports beyond one directory level.

---

## Quick Reference Card

| Situation | Action |
|---|---|
| New UI component | Check ShadCN first, then `src/components/shared/`, then create |
| New page | Follow route structure in ARCHITECTURE.md |
| Need a color/spacing | Check DESIGN_SYSTEM.md tokens |
| Need a DB query | Server Component or Server Action, use Drizzle |
| Need client state | Zustand for cart, URL params for filters, no context |
| Need a form | React Hook Form + Zod schema from `src/lib/validators/` |
| Need a type | `src/types/`, import from Drizzle inference if DB type |
| Hit a complex task | Decompose into 3-5 file chunks |
| Not sure about a pattern | Read an existing similar file |
