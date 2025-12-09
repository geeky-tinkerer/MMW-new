# Manku Metal Works - OPS ERP (Genesis Version)

This repository contains the Genesis Version of the **Manku Metal Works (MMW) Secure Ops**, a Progressive Web Application (PWA) designed for fabrication workshop management.

## Overview

The application is a single-file React PWA that serves as an operational dashboard for the workshop. It integrates several key utilities for fabricators, including job management, client tracking, and on-site tools.

## Key Features

1.  **Dashboard & BI**:
    - Real-time view of Income and Expenses.
    - **Ledger View**: Detailed list of financial transactions (Income vs Expenses).
    - **Latest Transactions**: Quick snapshot of recent financial activity.
    - Active Jobs tracking with status indicators.

2.  **Fabricator HUD (AR View)**:
    - Augmented Reality (AR) style interface using the device camera.
    - Horizon tilt indicator based on device orientation.
    - **Grid Overlay**: Adjustable grid (with slider control) for on-site sizing and alignment.

3.  **Fabricator Tools Suite**:
    - **CAD Designer**: Simple concept designer with shapes (Rect, Circle, Line, Text), measurements, and PDF export. Integrated with Jobs and Templates.
    - **Calculators**: Pie Cut, Triangle, Radius, Weight, Arc, Tap Drill chart, Unit Converter.
    - **Quick Notes**: Persisted scratchpad.

4.  **Role-Based Access Control**:
    - **Admin**: Full access to Tools, Ledger, Settings, and detailed Job logs (Material, Work, Financials).
    - **Client**: Restricted view. Can see public Job Notes and Progress Photos (Gallery). Cannot see internal logs or costs.
    - **Visitor**: Public showcase gallery, Current Offers, and Appointment Request form.

5.  **Client Management**:
    - Directory of clients with contact details and job history.
    - **Offers & Events**: Admins can manage promotional offers visible to Visitors.

6.  **Job Management**:
    - Track status (Pending, Active, Done).
    - **Job Notes**: Admins can add notes and toggle visibility for Clients.
    - **Request Advance**: Clients can request advance payments directly from the job card.
    - **Quote Generator**: Generates a professional A4-sized estimate/quote (PDF printable).

7.  **PWA Features**:
    - "Install App" prompt for Visitors to add the app to their home screen.
    - Offline-capable UI (static assets).

## Technical Details

-   **Stack**: React 18, Tailwind CSS, Lucide Icons, jsPDF.
-   **Architecture**: Single HTML file deployment (`index.html`) using Babel standalone for JSX compilation.
-   **Theme Engine**: Custom Tailwind configuration with a "Rust & Oil" industrial theme.
-   **Data**: Uses an internal Mock Adapter (`pwa_mock_adapter.js`) to simulate API calls and data persistence (localStorage) for the demo.
-   **PWA Ready**: `manifest.json` included for full-screen standalone mode.

## Usage

Simply open `index.html` in a modern web browser. For the best experience (especially for the HUD features), use a mobile device with camera and accelerometer access.

### Mock Credentials
-   **Admin Login**: `admin` / `admin`
-   **Client Login**: `919999999999` / `123` (Ramesh Engineer)

### Mock Data Seed
The application initializes with seed data including:
-   **Jobs**: Sample jobs like "Chassis Bracket" and "Gearbox Mount".
-   **Clients**: "Ramesh Engineer" (Tata Motors), "Suresh Patil" (Mahindra).
-   **Inventory**: Sheets, Tubes, Angle Irons.
-   **Templates**: Standard Gate designs.

## Deployment

Deploy the `index.html` and `pwa_mock_adapter.js` files to any static file server or CDN. No build process is required as it uses in-browser compilation (Genesis Version specific).
