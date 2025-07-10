# Frontend Low-Level Design (LLD)

## Component-Level Details
- **Reusable Components:** Button, Input, Label, Sidebar, Navbar
- **Props/State:** Passed via React props, managed with hooks and Redux

## Folder-by-Folder
- `component/`: UI elements (Sidebar, Navbar, CameraActions, UI controls)
- `pages/`: Feature screens (Detection, Boards, Auth, Dashboard, etc.)
- `Redux/`: Store, Actions, Reducers for each domain (auth, camera, stock, etc.)
- `utils/`: Helper functions (colors, password validation)
- `assets/`: Images, icons, static data

## Styling
- **Material UI** for most UI
- **Sass/CSS** for custom styles
- Theme setup in `main.jsx` with MUI's `ThemeProvider`

## Reusable Component Design
- Buttons, Inputs, Labels in `component/ui/`
- Sidebar/Sidebar2/MidSidebar for navigation

---
