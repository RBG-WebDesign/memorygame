# Testing Guide - Samsung Memory Flip Game

This guide explains how to test the application, from manual verification to automated test suites.

## 1. Manual Testing

### Browser Testing
To test the game manually in your browser:

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000).
3. Verify the game flow:
   - Click **Start Game**.
   - Watch the card preview (all cards show briefly).
   - Try matching pairs and observing the scoring/combo feedback.
   - Complete a level to see the win screen.

### Mobile Testing (Capacitor)
If you have Android Studio or Xcode installed:

- **Android**: `npm run cap:open:android`
- **iOS**: `npm run cap:open:ios`

---

## 2. Automated Unit Testing (Vitest)

We use **Vitest** for testing core business logic (Game Engine, Scoring, State Management).

### Run Tests once:
```bash
npm test
```

### Run Tests in Watch Mode (Interactive):
```bash
npx vitest
```

### Run Tests with UI:
```bash
npm run test:ui
```

---

## 3. End-to-End Testing (Playwright)

We use **Playwright** to ensure the entire application works correctly from a user's perspective.

### Run Smoketests:
```bash
npx playwright test
```

### Run with UI (Trace Viewer):
```bash
npx playwright test --ui
```

---

## 4. Project Structure

- `src/game/__tests__`: Logic tests for engine and scoring.
- `src/store/__tests__`: Tests for the Zustand game store.
- `tests/`: End-to-end smoke tests.
- `src/test-setup.ts`: Global test configuration.
