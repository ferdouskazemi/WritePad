# Changelog

## [Phase 1] — 2026-11-22

### Added
- All 11 Rubber Hose UI custom elements integrated in `public/rubber-hose-ui/`
- Typed React wrappers in `src/components/hose/` for all 11 controls
- 1930s paper film engine (`FilmFrame`) with GPU noise grain, dust particles, scratches, vignette, flicker, and gate wobble
- Film toggle support (`?nofilm` and `prefers-reduced-motion`)
- 5 paper themes: Cream (default), Newsprint, Kraft, Sepia reel, Night reel (with light paper control patches)
- Self-hosted open-source fonts: Literata, Vazirmatn, Noto Naskh Arabic, Patrick Hand, JetBrains Mono, Inter
- Full Pashto/Dari and English typography support with directional styling
- `/lab` test bench showcasing all 11 controls across all 5 themes with real-time `hose:line` speech bubble

## [Phase 0] — 2026-11-22

### Added
- Next.js 16 App Router + TypeScript strict scaffold
- Tailwind CSS
- ESLint
- Vitest for unit tests
- Playwright for e2e tests
- `.env.example` with all required keys
- README with phase checklist
