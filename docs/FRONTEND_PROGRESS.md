# Frontend Conversion Progress

- [x] **C0: Inventory and Shared Foundation** — Extracted design tokens and created shared UI/layout components (Navbar, AdminShell, Footer, Button, Input, Select, Textarea, FileDrop, Stamp, TagCard, TicketStub, Tape, Ticker, StatTicket, EmptyState, ErrorState, Skeleton, Modal).
- [x] **C1: Public and Auth Pages** — Landing (`/`), Login (`/login`), Multi-step Signup (`/signup` with step 1, step 2, success state), Status-driven Verification (`/verification` for pending, approved, and rejected states).
- [ ] **C2: App Pages** — Browse, Item Detail, Report Item, My Items, Claims, Notifications, Profile, Admin Pages, 404.
- [ ] **C3: Routing, Mock Hooks and Review Index** — Router integration, hooks for mock data, dev review index (/dev).

---

## Differences from the Stitch design

### C0 Foundation
1. **Fonts & Assets**: Replaced Google Fonts CDN and Material Symbols with `@fontsource/bricolage-grotesque` (headings/body) and `@fontsource/ibm-plex-mono` (metadata/labels/stamps) plus `lucide-react` monoline icons.
2. **Layout & Responsiveness**: Removed fixed canvas wrappers (`width: 1280px; height: 1754px; overflow: hidden`) and viewport height locks. Pages use fluid responsive containers (`max-w-screen-xl`, `mx-auto`, `px-4 md:px-6`) with normal scrolling.
3. **Mobile Adaptations**: Admin navigation transitions to a top tab strip on mobile; student navigation includes a bottom tab bar at <=390px viewports (Browse, My items, Report, Claims, Profile).
4. **Physical Detail System**: Extracted paper grain, luggage eyelets, hanging string, ticket stub perforations, tape strips, and brutalist hard-offset shadows into reusable components and utility classes.

### C1 Public & Auth Pages
1. **Landing Page (`/`)**:
   - Removed fake statistics row and hardcoded Google image links.
   - Replaced temporary web images with structured CSS evidence tags.
   - Enforced privacy restriction overlay: sample tags are blurred under a "Log in to browse full archive" barrier.
2. **Login Page (`/login`)**:
   - Removed "Forgot password" links (per Rule 5).
   - Centered docket container using responsive `min-h-screen` without viewport height locks.
   - Added demo review quick-fill selectors for approved, pending, and admin roles.
3. **Signup Page (`/signup`)**:
   - Unified `signup-1.html` and `signup-2.html` into a single stateful component (Step 1 -> Step 2 -> Success Confirmation).
   - Normalized form fields strictly to backend contract: Full Name, Email, Password (min 8 chars), Department, Year, optional Phone, and Document Upload. Omitted roll number, residence, and email-domain hints.
4. **Verification Page (`/verification`)**:
   - Unified `verification-pending.html`, `verification-approved.html`, and `verification-rejected.html` into a unified status-driven view (`pending` | `approved` | `rejected`).
   - Removed demo "stamp simulator" and "browse as guest" button; implemented "Refresh status", "Log out", and for rejected status, a document resubmission upload form with auto-reset to pending.
