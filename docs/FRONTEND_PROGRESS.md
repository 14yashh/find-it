# Frontend Conversion Progress

- [x] **C0: Inventory and Shared Foundation** — Extracted design tokens and created shared UI/layout components (Navbar, AdminShell, Footer, Button, Input, Select, Textarea, FileDrop, Stamp, TagCard, TicketStub, Tape, Ticker, StatTicket, EmptyState, ErrorState, Skeleton, Modal).
- [x] **C1: Public and Auth Pages** — Landing (`/`), Login (`/login`), Multi-step Signup (`/signup` with step 1, step 2, success state), Status-driven Verification (`/verification` for pending, approved, and rejected states).
- [x] **C2: App Pages** — Browse (`/browse`), Item Detail (`/items/:id`), Report Item (`/items/new`, `/items/:id/edit`), Admin Verifications (`/admin/verifications`), My Items (`/my-items`), Claims (`/claims`), Notifications (`/notifications`), Profile (`/profile`), Admin Stats (`/admin`), Admin Items (`/admin/items`), Admin Claims (`/admin/claims`), Admin Users (`/admin/users`), and 404 (`*`).
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

### C2 App Pages
1. **Browse (`/browse`)**:
   - Standardized category filter to the exact 7 backend categories (Electronics, ID cards, Bags, Keys, Books, Clothing, Other).
   - Single-select category, Type filter (All / Lost / Found), and responsive tag grid collapsing cleanly to a 1-column list on 390px mobile viewports.
   - Tag cards display exactly one stamp (LOST or FOUND for open items; CLAIM PENDING, RETURNED, or EXPIRED otherwise).
2. **Item Detail (`/items/:id`)**:
   - Prop and state driven variants: Found vs. Lost item, Owner view vs. Claimant view, and Non-open items (Claim Pending, Returned, Expired).
   - Item detail rows strictly match backend fields: Tag No., Category, Where, When, Posted by (name and department). Removed custody/staff/storage bin metadata.
   - Claim form opens as a dedicated modal, displaying the found item's verification challenge question, testimony message, and optional image dropzone.
3. **Report / Edit Item (`/items/new` & `/items/:id/edit`)**:
   - Unified into a single component supporting both creation and update mode.
   - Restricted fields strictly to backend contract: Type (lost/found), Title, Description, Category, Location, Date occurred, optional Images, and Verification question (found items only).
4. **Claims Desk (`/claims`)**:
   - Added tabs for "Claims Made" and "Claims Received".
   - Approved claims feature an official perforated "Handover Details" ticket revealing depositor/claimant contact info (email, phone, department).
5. **Admin Suite (`/admin/*`)**:
   - Stat tickets on `/admin` display the 5 requested core registers: Pending verifications, Open items, Returned items, Total users, and Pending claims.
   - Admin Verifications enforces reason requirement for rejections with buttons "Approve student" and "Reject".
   - Built `/admin/items` (ledger management & expunge modal), `/admin/claims` (dispute audit & contact inspection), and `/admin/users` (directory lookup & disciplinary suspension).
6. **404 Not Found (`*`)**:
   - Created lost property docket ("This page got lost too.") with return links and missing ledger notice.

