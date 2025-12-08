# Stress Test Checklist

To ensure the client-side compression and stability patches are robust, perform the following tests:

1.  **Test 1: Heavy Payload Upload (12MB+ Panorama)**
    *   **Action:** Attempt to upload a high-resolution panorama or image larger than 10MB.
    *   **Expected Result:** The app should not crash. The UI should show "Compressing..." followed by the compressed image preview. The backend mock log should show a received size significantly smaller (approx 100-200KB) and return success.

2.  **Test 2: Non-Image File Handling**
    *   **Action:** Try to upload a `.pdf` or `.txt` file via the file picker.
    *   **Expected Result:** The application should handle the error gracefully (e.g., via `reader.onerror` or image load failure) and display "Upload Failed" or a relevant error message in the toast, without crashing the main thread.

3.  **Test 3: Network Timeout / Server Error (Simulation)**
    *   **Action:** Temporarily modify `pwa_mock_adapter.js` to return a 500 error or `throw` an exception for the `upload_image` action.
    *   **Expected Result:** The UI should display the "Sync Failed - Retrying..." (or similar error) toast notification. The user should be able to continue using the app.

4.  **Test 4: Rapid-Fire Uploads**
    *   **Action:** Quickly select and upload multiple images in succession without waiting for the previous one to finish.
    *   **Expected Result:** The app should handle the concurrency. The "Compressing..." state should handle state transitions correctly (e.g., not getting stuck in loading state). The backend should receive multiple requests.

5.  **Test 5: Offline Upload Attempt**
    *   **Action:** Disconnect the network (or simulate offline mode in DevTools) and attempt an upload.
    *   **Expected Result:** The compression should succeed (client-side), but the background upload will fail. The error boundary should catch this and display the "Sync Failed" toast. The app should remain responsive.
