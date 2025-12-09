# Manku Metal Works - PWA Optimization & Best Practices

This document outlines the optimization strategies and best practices implemented in the Manku Metal Works PWA, adhering to modern web standards and the specific "No Build Step" constraint of the Genesis Version.

## 1. Performance & Perceived Speed

### Optimistic UI & Loading States
- **Global Loader**: implemented a `Loader2` / `RefreshCw` spinner overlay that triggers during navigation events (`navigate` function).
- **Artificial Delay**: A 300ms simulated delay is added to navigation transitions. While counter-intuitive, this provides a "stable" feeling to the app, preventing layout thrashing and giving immediate feedback that an action is processing.
- **Lazy Rendering**: Complex views like `CadDesigner` and `FabricatorHUD` are only mounted when requested, keeping the initial DOM size small.

### Asset Management
- **CDN Usage**: Core libraries (React, Tailwind, Lucide, jsPDF) are loaded via reliable CDNs (Unpkg, cdnjs).
- **In-Browser Compilation**: Uses Babel Standalone for development flexibility. *Note: For production, pre-compilation is recommended to remove the runtime transformation overhead.*

## 2. PWA & Offline Capabilities

### Installability
- **Manifest.json**: Properly configured with `display: standalone`, icons, and theme colors to ensure the app feels native on iOS and Android.
- **Install Prompt**: The app listens for the `beforeinstallprompt` event and exposes a custom "INSTALL APP" button in the Visitor view, allowing users to easily add the app to their home screen.
- **iOS Support**: Specific meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`) are included for Safari compatibility.

### Offline Resilience
- **Self-Contained Logic**: The `pwa_mock_adapter.js` simulates a backend entirely within the browser, meaning the app functions fully offline once loaded (except for initial CDN fetch).
- **Local Storage**: All data (Jobs, Clients, Settings) is persisted in `localStorage`, preserving state across sessions and reloads without network requests.

## 3. User Experience (UX)

### Touch Targets & Accessibility
- **Mobile-First Design**: UI elements are sized for touch (min 44px height for buttons).
- **Input Types**: Usage of `type="tel"` and `type="number"` triggers the appropriate numeric keypads on mobile devices.
- **Feedback**: Interactive elements have `:active` states (scaling) and visual feedback (Toasts) for actions like "Saved" or "Uploaded".

### Role-Based Access Control (RBAC)
- **View Guarding**: The application rigorously checks `user.role` before rendering sensitive components.
  - **Admin**: Full access (Dashboard, Ledger, Tools).
  - **Client**: Restricted access (Home, Orders, Settings).
  - **Visitor**: Public access only.
- **Modal Logic**: prevents "modal stacking" by ensuring the Admin modal does not render on top of the Client's full-page Job Detail view.

## 4. Future Roadmap (Sprint 6+)

- **Service Worker**: Implement a genuine `sw.js` to cache the CDN assets for true offline start.
- **Image Optimization**: Enhance the `canvas` compression logic to support WebP formats for even smaller payloads.
- **Backend Migration**: Replace `pwa_mock_adapter.js` with a real Google Apps Script or Node.js backend.
