# Frontend Conversion Progress

- [x] **C0: Inventory and Shared Foundation** — Extracted design tokens and created shared UI/layout components (Navbar, AdminShell, Footer, Button, Input, Select, Textarea, FileDrop, Stamp, TagCard, TicketStub, Tape, Ticker, StatTicket, EmptyState, ErrorState, Skeleton, Modal).
- [ ] **C1: Public and Auth Pages** — Landing, Login, Signup (multi-step), Verification (status-driven).
- [ ] **C2: App Pages** — Browse, Item Detail, Report Item, My Items, Claims, Notifications, Profile, Admin Pages, 404.
- [ ] **C3: Routing, Mock Hooks and Review Index** — Router integration, hooks for mock data, dev review index (/dev).

---

## Differences from the Stitch design

### C0 Foundation
1. **Fonts & Assets**: Replaced Google Fonts CDN and Material Symbols with `@fontsource/bricolage-grotesque` (headings/body) and `@fontsource/ibm-plex-mono` (metadata/labels/stamps) plus `lucide-react` monoline icons.
2. **Layout & Responsiveness**: Removed fixed canvas wrappers (`width: 1280px; height: 1754px; overflow: hidden`) and viewport height locks. Pages use fluid responsive containers (`max-w-screen-xl`, `mx-auto`, `px-4 md:px-6`) with normal scrolling.
3. **Mobile Adaptations**: Admin navigation transitions to a top tab strip on mobile; student navigation includes a bottom tab bar at <=390px viewports (Browse, My items, Report, Claims, Profile).
4. **Physical Detail System**: Extracted paper grain, luggage eyelets, hanging string, ticket stub perforations, tape strips, and brutalist hard-offset shadows into reusable components and utility classes.
