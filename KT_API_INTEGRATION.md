# API Integration Guide

## Where & How API Calls Are Made

- **API calls** use **Axios**
- Endpoints are built using `import.meta.env.VITE_BACKEND_API`
- API logic is in `src/Redux/Actions/` (e.g., `authAction.js`, `cameraAction.js`, `complaintAction.js`, `fgStockActions.js`, `storeStockAction.js`, `toolManagementActions.js`)
- Some direct API calls in page components (e.g., `Fire.jsx`, `Rejection.jsx`)

## Authentication Handling

- Token is stored in localStorage as `rabsToken` after login
- Token is read and set in Redux state
- Token is sent in `Authorization: Bearer <token>` header for all protected endpoints

## Error Handling

- Errors are caught in `catch` blocks and shown via Notistack or alerts
- Redux actions dispatch failure types on error

## Pagination/Filter/Sort

- Filtering and sorting handled via query params in API calls (see Detection/Boards pages)
- Example: `/snapdate_count-daywise/:year/:month/:day?camera_id=...&category=...`

## Swargar API Documentation

- (Add link here)
- Used throughout Redux actions and Detection/Boards pages

---
