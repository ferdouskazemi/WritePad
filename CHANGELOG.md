# Changelog

## [Phase 6] — 2026-11-22

### Added
- High-DPI (2×) PNG screenshot export preserving paper textures, ink colors, and Persian/Pashto font shaping
- Scope selection (Whole note or Visible view) with optional subtle "Write Pad" watermark
- Direct copy to clipboard (`ClipboardItem`) and native mobile sharing (`navigator.share`)
- Direct download as `.md` (Markdown) and `.txt` (Plain text)
- Global keyboard shortcut (Ctrl+Shift+S) to launch export dialog
- Thermometer progress indicator (`<hose-progress>`) for long renders and toaster confirmation (`<hose-toast>`)

## [Phase 5] — 2026-11-22

### Added
- Multilingual interface supporting English (`en`), Dari (`fa`), and Pashto (`ps`) with zero missing keys test validation
- Full RTL layout mirroring for Dari and Pashto with separate UI and document direction handling
- Solar Hijri (هجری شمسی) calendar date formatting for Dari and Pashto
- Settings panel modal powered by Rubber Hose UI:
  - `<hose-tabs>` 4-section navigation (Appearance, Writing, Language, Account)
  - `<hose-slider>` for font size and line height adjustment
  - `<hose-checkbox>` for word count, spellcheck, and Persian digits
  - `<hose-toggle>` for film effects
  - `<hose-radio>` for paper themes and interface language selection

## [Phase 4] — 2026-11-22

### Added
- Auth.js with Google provider (`/api/auth/[...nextauth]`) and Prisma PostgreSQL adapter
- Full PostgreSQL schema in `prisma/schema.prisma` with User, Account, Session, Note, TabSession, and Settings models
- Bi-directional sync engine (`/api/sync`) with Dexie outbox queue
- Version conflict resolution: automatic conflict copy creation (`<title> (conflict copy)`) to prevent text loss
- Guest note merge: automatically merges local notes upon first Google sign-in with toast confirmation
- 30-day soft delete Trash management modal
- Plain theme (بدون پس‌زمینه): clean, distraction-free white sheet with zero background texture
- Floating mini selection formatting menu: dense toolbar removed; formatting opens right underneath selected text
- Immersive typing experience: header, tabs, and chrome smoothly fade away during typing

## [Phase 3] — 2026-11-22

### Added
- Custom 1930s folder-tab strip where the active tab stands up out of the rail
- Full keyboard shortcuts:
  - New tab (Ctrl+T / Alt+T)
  - Close tab (Ctrl+W / Alt+W)
  - Next / previous tab (Ctrl+Tab / Ctrl+Shift+Tab)
  - Reopen recently closed tab from history (Ctrl+Shift+T)
  - Jump to tab 1 through 9 (Ctrl+1..9)
- Middle-click to close tabs
- HTML5 Drag & Drop tab reordering
- Right-click context menu (Pin/Unpin, Rename, Duplicate, Close, Close Others)
- Tab session persistence and restoration via Dexie (`db.tabSession`)
- Smooth handling for 30+ open tabs with horizontal fade scroll and quick search drawer

## [Phase 2] — 2026-11-22

### Added
- Rich text editor powered by Tiptap (ProseMirror) with full markdown round-trip via `tiptap-markdown`
- Markdown source editor powered by CodeMirror 6 with ink tones syntax highlighting
- Split view with scroll synchronization between CodeMirror and rendered Tiptap preview
- 1930s hand-inked toolbar icons for headings, styles, lists, tasks, quotes, code, links, tables, rule, and undo/redo
- Automatic and manual text direction (Auto / LTR / RTL) with per-paragraph bidirectional formatting
- Persian and Pashto typography enhancements:
  - ZWNJ (U+200C) keybind on Shift+Space and preservation in word count
  - Optional typed Latin digits to Persian digits conversion (۱۲۳)
- Dexie (IndexedDB) local-first autosave on every keystroke
- Live statistics bar (word count, characters, paragraphs)

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
