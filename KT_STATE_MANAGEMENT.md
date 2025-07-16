# State Management Guide

## Redux Usage

- **Redux** is used for global state (auth, cameras, stock, complaints, tools, etc.)
- Store setup in `src/Redux/store.js`
- Actions in `src/Redux/Actions/`
- Reducers in `src/Redux/Reducers/`
- Thunks for async logic (API calls)

## Folder Structure

- `Redux/store.js` — Store config
- `Redux/Actions/` — All async and sync actions
- `Redux/Reducers/` — State slices for each domain

## Example

- Auth: `authReducer.js`, `authAction.js`
- Cameras: `cameraReducers.js`, `cameraAction.js`

---
