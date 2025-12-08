# Nexus Prime - Strategic Roadmap

Based on the code review and the "Frugal ERP" vision for Manku Metal Works, the following 5 features have been identified as high-impact upgrades for the next development cycle.

## 1. Digital Signature Pad (Canvas Integration)
* **Goal:** Legitimize the IPC Checklist "Identify" phase.
* **Problem:** Currently, "Client Signed Off" is just a checkbox.
* **Solution:** Add a `<canvas>` based signature pad in the Job Details view.
* **Tech:** `react-signature-canvas` (or vanilla JS canvas implementation to keep single-file).
* **Storage:** Save signature as Base64 string in `job.checklist.signature`.

## 2. QR Code Integration (Asset & Job Tracking)
* **Goal:** Rapid access to data in the workshop ("Greasy Hands" speed).
* **Problem:** Searching for a job or inventory item by typing is slow on mobile.
* **Solution:**
  * Generate QR Codes for each Job ID (printable label).
  * Add a QR Scanner button to the HUD (using `html5-qrcode` or similar).
  * Scanning a job QR instantly opens the Job Detail modal.
  * Scanning an inventory QR allows quick stock adjustments.

## 3. Voice Memos (Audio Logs)
* **Goal:** Capture details when hands are dirty.
* **Problem:** typing complex notes on a phone while welding/cutting is impractical.
* **Solution:** Add a "Record Note" button to Job Details.
* **Tech:** HTML5 MediaRecorder API.
* **Storage:** Store audio blobs in IndexedDB (via `api.js`) or upload to Drive if backend connected.

## 4. Multi-Language Support (Localization)
* **Goal:** Accessibility for the entire workforce.
* **Problem:** The interface is English-only, but the workshop staff likely speaks Hindi/Marathi.
* **Solution:** Implement a simple i18n dictionary.
* **Features:** Toggle button in Settings (EN / HI / MR). All UI labels map to the selected language key.

## 5. Client Portal Lite (ReadOnly Link)
* **Goal:** Reduce "What's the status?" phone calls.
* **Problem:** Clients constantly call to check if fabrication is done.
* **Solution:** Generate a "Shareable Link" (hashed URL) for each job.
* **View:** A simplified, read-only version of the Job Card showing Status, Photos (Showcase), and ETA.
* **Tech:** URL Parameter handling in `index.html` (e.g., `?view=CLIENT_TRACK&id=...`).
