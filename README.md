# Rabs Industries Frontend

A scalable, modular React + Vite dashboard for industrial AI monitoring and management.

## Features

- Modular folder structure (atomic design, separation of concerns)
- Redux for state management
- Centralized API service with axios and interceptors
- Responsive UI with Material UI
- Form validation with React Hook Form/Yup (suggested)
- ESLint & Prettier for code quality
- Lazy loading and performance optimizations

## Folder Structure (Recommended)

```
src/
  assets/        # images, icons
  components/    # reusable UI components (atoms, molecules, organisms)
  pages/         # route-level components
  features/      # domain-specific modules (optional)
  hooks/         # custom React hooks
  services/      # API handling (axios)
  utils/         # helper functions
  constants/     # static data, enums
  context/       # React Context APIs (if used)
  routes/        # routing setup
  store/         # Redux store or context
  theme/         # MUI/custom themes
```

## API Integration Example

See `src/services/api.js` for centralized axios setup with interceptors.

## Forms & Validation

- Use [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) for scalable, validated forms.

## Accessibility

- Use semantic HTML, ARIA roles, and keyboard navigation in all components.

## Linting & Formatting

- ESLint config: `.eslintrc.json`
- Prettier config: `.prettierrc`

## Testing

- Use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Jest](https://jestjs.io/) for unit/integration tests.
- Example:
  ```js
  import { render, screen } from '@testing-library/react';
  import Login from './pages/Auth/Login';
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
  ```

## Contribution

- Follow atomic/component-driven design
- Keep code DRY, modular, and well-documented

---
