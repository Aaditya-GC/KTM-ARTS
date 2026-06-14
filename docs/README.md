# ThangkaHub Documentation

## Index

| File | Purpose | When to read |
|---|---|---|
| [PROJECT_RULES.md](PROJECT_RULES.md) | AI agent constitution — rules, conventions, anti-patterns | **Read first, before any code** |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Design tokens, component catalog, animation patterns | Before touching any UI |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full architecture, project structure, DB schema, routes, implementation phases | Before creating routes, components, or touching data |
| `../ThangkaHub Business Plan.pdf` | Original business plan (source of truth for product vision) | For understanding the product and scope decisions |

## Quick Start for AI Agents

1. Read `PROJECT_RULES.md` (6 min)
2. Skim `DESIGN_SYSTEM.md` for color tokens and component list (3 min)
3. Check `ARCHITECTURE.md` route/component list relevant to your task (2 min)
4. Read at least one existing file similar to what you're building
5. Start coding

## Project Summary

- **Product:** Premium marketplace for authentic Nepali Thangka art
- **Brand:** Kathmandu Arts (consumer), ThangkaHub (platform)
- **Stack:** Next.js 15, TypeScript, Tailwind 4, ShadCN UI, Supabase, Drizzle, Zustand
- **MVP:** Core marketplace + artist profiles + cart/checkout (2-week timeline)
- **Roles:** Client / Artist (admin-granted) / Admin
