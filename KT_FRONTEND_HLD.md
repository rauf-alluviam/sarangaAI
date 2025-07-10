# Frontend High-Level Design (HLD)

## Architecture Overview
- **App.jsx** is the entry point, setting up routes and layout.
- **Component Hierarchy:**
  - `App.jsx` → `Sidebar`/`Navbar` → `Pages` (Dashboard, Detection, Boards, etc.)
  - Each page may use multiple components and Redux state.

## Main Pages/Screens
- **Dashboard**: Analytics, quick actions, camera list
- **Detection**: Fire, Smoke, PPE, Truck, BracketD/E
- **Boards**: FgStock, StoreStock, Production, Rejection, Complaint, ToolManage
- **Auth**: Login, Signup, Password Reset
- **UserProfile**: Profile, Management, Temp Password

## Navigation Flow
- Uses **React Router** for route-based navigation
- Protected routes for authenticated access
- Sidebar/Topbar for module navigation

## API Interaction Strategy
- **Axios** for all API calls
- API endpoints and tokens are managed via `import.meta.env.VITE_BACKEND_API` and Redux state
- API logic is in `src/Redux/Actions/` and directly in some page components
- Error and success handled via Notistack

---
