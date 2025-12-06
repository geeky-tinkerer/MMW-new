# Manku Metal Works - OPS ERP (Genesis Version)

This repository contains the Genesis Version of the **Manku Metal Works (MMW) Secure Ops**, a Progressive Web Application (PWA) designed for fabrication workshop management.

## Overview

The application is a single-file React PWA that serves as an operational dashboard for the workshop. It integrates several key utilities for fabricators, including job management, client tracking, and on-site tools.

## Key Features

1.  **Dashboard**:
    - Real-time view of Income and Expenses.
    - Active Jobs tracking with status indicators.
    - Quick access to generate quotes for specific jobs.

2.  **Fabricator HUD**:
    - Augmented Reality (AR) style interface using the device camera.
    - Horizon tilt indicator based on device orientation.
    - Adjustable grid overlay for sizing estimation.

3.  **Fabricator Tools Suite**:
    - **Pie Cut Calculator**: Calculate cut angles for pipe bending based on diameter, total angle, and number of segments.
    - **Triangle Calculator**: (Placeholder/Extension point).

4.  **Quote Generator**:
    - Generates a professional A4-sized estimate/quote.
    - Printable PDF format.
    - Auto-populates job and client details.

5.  **Client Management**:
    - Directory of clients with contact details and job history.

6.  **Inventory Module**:
    - (Coming Soon) Placeholder for tracking material stock.

## Technical Details

-   **Stack**: React 18, Tailwind CSS, Lucide Icons.
-   **Architecture**: Single HTML file deployment (`index.html`) using Babel standalone for JSX compilation.
-   **Theme Engine**: Custom Tailwind configuration with a "Rust & Oil" industrial theme.
-   **Data**: Uses an internal Mock Adapter (`window.mockFetch`) to simulate API calls and data persistence for the demo.
-   **PWA Ready**: Viewport configuration for mobile devices and theme colors.

## Usage

Simply open `index.html` in a modern web browser. For the best experience (especially for the HUD features), use a mobile device with camera and accelerometer access.

### Mock Data Seed
The application initializes with the following seed data:
-   **Jobs**: A sample job "Chassis Bracket" for Tata Motors.
-   **Clients**: "Ramesh Engineer" from Tata Motors.
-   **Inventory**: 15 sheets of "MS Sheet 2mm".

## Deployment

Deploy the `index.html` file to any static file server or CDN. No build process is required as it uses in-browser compilation (Genesis Version specific).
