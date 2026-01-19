# Skitii - Adaptive Music Therapy Platform

A React-based music therapy platform designed for cancer patients. The app adapts music in real-time based on Heart Rate Variability (HRV) monitoring to help manage pain and anxiety.

---

## Quick Start

```bash
npm install
npm run dev
```

**Live Demo:** [Add your Vercel/Netlify link here]

## Test Credentials

| Patient ID | PIN  | Name          |
|------------|------|---------------|
| PT001      | 1234 | Rajesh Kumar  |
| PT002      | 5678 | Priya Sharma  |
| PT003      | 9012 | Amit Patel    |

---

## Features Implemented

### Authentication (Part 1.1 & 1.2)
- Patient ID + numeric PIN login (4-6 digits)
- Protected routes with automatic redirect to login
- Session persistence on page refresh using sessionStorage
- Logout button always visible (important for shared hospital devices)
- Generic error messages to prevent user enumeration attacks
- PIN is never stored - cleared immediately after validation

### HRV Monitoring (Part 1.3)
- Real-time HRV value display in milliseconds
- Color-coded status indicators:
  - 🔴 Red: <30ms (Elevated Stress)
  - 🟢 Green: 30-60ms (Normal)
  - 🔵 Blue: >60ms (Relaxed)
- Trend arrow showing if HRV is improving, declining, or stable
- Simulated device connection status
- Patient name displayed (condition is never shown)
- Supportive stress alert with breathing exercise when HRV stays low

### Adaptive Music Player (Part 2)
- Large touch targets: 80px play/pause, 60px skip buttons
- Track information: title, therapy goal, BPM, key, mood, duration
- Progress bar with elapsed and total time
- Volume slider with mute toggle
- **Adaptive music logic:**
  - HRV <30ms → Switches to calming music (<60 BPM)
  - HRV 30-60ms → Maintains current track or gentle transitions
  - HRV >60ms → Can introduce slightly more engaging music (60-80 BPM)
- Visual alert when music adapts due to HRV changes
- Upcoming queue showing recommended tracks

### Session Analytics (Part 3)
- Session timer with start/end controls
- Real-time metrics dashboard: average, min, max HRV, and variability
- Rolling 5-minute HRV line chart with color-coded zones
- Pain score tracker (0-10 slider) with emoji feedback
- Session progress indicator showing pain reduction
- **Export functionality:** Download full session as JSON including:
  - All HRV readings with timestamps
  - Pain score history
  - Music played with durations

### Session History (Part 3)
- List of past sessions with summary cards
- Each card shows: date/time, duration, average HRV
- Expandable details revealing:
  - Min/Avg/Max HRV metrics
  - Pain score change (start → end) with improvement indicator
  - List of tracks played during session

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # LoginForm, ProtectedRoute
│   ├── hrv/           # HRVDisplay, HRVChart, StressAlert, DeviceStatus
│   ├── music/         # MusicPlayer, PlayerControls, TrackInfo, Queue
│   ├── analytics/     # PainScoreTracker, SessionMetrics, ExportButton
│   └── history/       # SessionCard, SessionList
├── contexts/          # AuthContext, HRVContext, MusicContext, SessionContext
├── pages/             # LoginPage, SessionPage, HistoryPage
├── services/          # hrvSimulator, musicAdapter
├── data/              # mockPatients, mockTracks, mockSessionHistory
└── types/             # TypeScript interfaces
```

---

## Part 0: Architecture & Security Thinking

### Q1: Token & Authentication Security

**Where will you store authentication tokens?**

I chose to store the user session in **memory (React state)** with **sessionStorage** as persistence. Here's my reasoning:

- **Why sessionStorage over localStorage:** sessionStorage clears when the browser tab closes. This is critical for shared hospital devices where the next patient shouldn't see the previous patient's data.
- **Why not cookies:** For this frontend-only demo, sessionStorage is simpler. In production with a real backend, I'd use HttpOnly cookies with secure flags to prevent XSS attacks.
- **PIN handling:** The PIN is never stored anywhere - not in state, not in storage. It's used once for validation and discarded immediately.

**Trade-off:** Users need to re-login if they close the tab, but patient security takes priority over convenience.

### Q2: Data Structure & Scale

**How will you store HRV data and handle 100+ sessions?**

For HRV readings coming every 3 seconds in 20-40 minute sessions (400-800 readings per session):

- **Current session:** Kept in React state with a rolling window of 100 readings (5 minutes). Older readings are automatically dropped to prevent memory bloat.
- **Historical data:** For the demo, sessions are stored in memory. For production, I'd implement:
  - Paginated session list (load 10 at a time)
  - Lazy-load session details on expand
  - Backend API with database storage
  - IndexedDB for offline capability

### Q3: State Management Architecture

**How will you manage auth and session state?**

I used **React Context API** with 4 separate contexts:

1. `AuthContext` - User authentication state
2. `HRVContext` - Real-time HRV readings and device status
3. `MusicContext` - Playback state, current track, queue
4. `SessionContext` - Timer, pain scores, export data

**Why Context over Redux:** For this scope, Context is sufficient and has less boilerplate. I'd consider Redux/Zustand if:
- We had deeply nested state updates
- Multiple components needed to dispatch complex async actions
- The app grew beyond 5-6 major features

### Q4: Healthcare Data Handling

**What data should never be shown on the UI?**

The patient's **medical condition** (cancer type and stage) is never displayed on the UI or stored in the browser. This includes:
- Never in the header/greeting
- Never in session exports
- Never logged to console
- Not stored in sessionStorage

**Why healthcare data is different from fitness data:**
- **Legal:** Healthcare data has strict regulations (HIPAA in US, similar laws in India)
- **Discrimination risk:** Someone seeing "Stage 3 Cancer" could affect how they treat the patient
- **Emotional impact:** Patients shouldn't be reminded of their diagnosis constantly while trying to relax
- **Shared devices:** Hospital tablets are used by multiple patients - one patient shouldn't see another's condition

### Q5: Performance Under Stress

**What could cause UI lag with HRV updates every 3 seconds?**

Potential issues and my solutions:

| Problem | Solution Implemented |
|---------|---------------------|
| Chart re-rendering on every reading | `React.memo` with custom comparison - only re-renders when data length changes |
| Data transformation on every render | `useMemo` for chart data mapping |
| Animation overhead | Disabled Recharts animations (`isAnimationActive={false}`) |
| Growing array in memory | Rolling window caps at 100 readings |
| Multiple context updates triggering cascading re-renders | Separated contexts so HRV updates don't re-render auth components |

---

## Part 4: Code Review & Security (Bonus)

I reviewed the hypothetical code issues mentioned in the assignment. Here's what I identified and how I addressed each in my implementation:

| Issue Found | Security/Performance Risk | How I Fixed It |
|-------------|--------------------------|----------------|
| Hardcoded API keys | Anyone viewing source code can steal credentials | No API keys in frontend; would use env variables in production |
| Separate "Patient ID not found" and "Incorrect PIN" errors | Allows attackers to enumerate valid patient IDs | Single generic message: "Invalid credentials" |
| Storing PIN in localStorage | XSS attack could steal PINs; shared devices expose data | PIN never stored - used once and discarded |
| Storing condition in localStorage | Privacy violation - visible in browser dev tools | Condition excluded from SafeUser type, never leaves backend |
| Displaying condition on UI | Privacy - other people nearby could see it | Only patient name shown in greeting |
| Missing useEffect cleanup | Memory leak from orphaned intervals | All intervals have `return () => clearInterval()` |
| No chart memoization | UI freezes with frequent updates | `React.memo` + `useMemo` + disabled animations |
| Console.log with sensitive data | Debug logs could expose patient info | No sensitive data in any console statements |

---

## Part 5: Healthcare Design Reflection (Bonus)

### Patient-Centric Design Choices

My target user: A cancer patient in a hospital bed, possibly experiencing pain or fatigue, using a shared tablet.

| Design Decision | Reasoning |
|----------------|-----------|
| 80px play button, 60px other controls | Patients undergoing chemotherapy may have tremors or reduced fine motor control |
| Calming blue/green color palette | Red is associated with alerts/danger - we use it sparingly and only for HRV status |
| Single-column layout on session page | Reduces cognitive load when patient is tired or in pain |
| "Pain Level" instead of "VAS Score" | Avoid medical jargon - this should feel like a wellness app, not a clinical tool |
| Emoji feedback for pain scores | More intuitive than numbers alone; adds warmth |
| Logout always visible in header | Shared hospital devices - next patient shouldn't see previous data |
| Gentle stress alert message | "Let's take a moment" instead of "WARNING: High stress detected" |
| Breathing exercise in stress modal | Actionable guidance, not just an alert |
| Session persists on refresh | Don't lose 20 minutes of data because of accidental page refresh |

### Data Safety Summary

- ✅ PIN never stored (memory only during validation)
- ✅ Condition never exposed to frontend
- ✅ sessionStorage clears on tab close
- ✅ Generic auth errors prevent enumeration
- ✅ No sensitive data in console logs
- ✅ Export excludes condition field

### What I'd Build With 2 More Hours

1. **Guided breathing overlay** - An animated breathing circle that appears during stress alerts, guiding 4-7-8 breathing
2. **Dark mode toggle** - Hospital rooms are often dimly lit; high contrast white screens can be uncomfortable
3. **Session notes field** - Let patients add a brief note about how they're feeling

### Production Readiness Checklist

For real-world deployment, I'd add:

- [ ] Real backend API with JWT authentication
- [ ] Actual Bluetooth integration (Web Bluetooth API for Chileaf CL837)
- [ ] Database for session persistence (PostgreSQL + Prisma)
- [ ] HTTPS enforcement
- [ ] Rate limiting on login attempts
- [ ] Comprehensive error boundaries
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Sentry for error monitoring
- [ ] Analytics (privacy-respecting, no PII)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks |
| TypeScript | Type safety and better DX |
| Vite | Fast development server and builds |
| React Router v6 | Client-side routing with protected routes |
| Recharts | Performant charting library |
| Tailwind CSS | Utility-first styling |
| Context API | State management |

---

## Assumptions Made

1. **Single device per session** - No need for real-time sync across devices
2. **Mock audio playback** - Simulated progress, no actual audio files
3. **Simulated HRV** - Random values within realistic ranges; real integration would use Web Bluetooth
4. **In-memory session storage** - Sessions clear on tab close (acceptable for demo; production needs database)
5. **Tablet-first design** - Optimized for 768px-1024px; responsive but tablet is primary target
6. **Modern browser** - ES6+ features, no IE11 support needed

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

*Built with empathy for cancer patients - prioritizing security, clarity, and calmness over flashy features.*
