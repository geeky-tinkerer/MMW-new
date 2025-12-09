# Nexus ERP Stress Test Checklist

To ensure the new image compression and upload resilience logic works under harsh "garage conditions", run the following tests.

## 1. Large File Upload (The "Panorama" Test)
*   **Action:** Try to upload a file > 10MB (e.g., a high-res panorama or a raw photo).
*   **Expected Result:**
    *   The app should NOT crash.
    *   The "Snap-to-Quote" alert should appear quickly (Optimistic UI).
    *   In the console, the compressed base64 string should be logged (if debugging) and should be significantly smaller than the original.

## 2. Invalid File Type (The "PDF" Test)
*   **Action:** Try to upload a `.pdf` or `.docx` file instead of an image.
*   **Expected Result:**
    *   The upload should be rejected immediately.
    *   Promise should reject with "Invalid file type".
    *   UI should handle this gracefully (catch block).

## 3. Network Failure (The "Faraday Cage" Test)
*   **Action:**
    *   Open DevTools -> Network -> Offline.
    *   Attempt an upload.
*   **Expected Result:**
    *   The Promise should still resolve (Optimistic UI says "Processed").
    *   The *background* upload mock should fail.
    *   A Red Toast Notification ("Sync Failed") should appear at the bottom of the screen.

## 4. Rapid Fire Uploads (The "Burst Mode" Test)
*   **Action:** Select and upload 5 images in quick succession (or click the upload button repeatedly if using a script).
*   **Expected Result:**
    *   The UI should not freeze.
    *   Each upload should be processed independently.
    *   No race conditions in the `toast` state (last message might override, which is acceptable, but app shouldn't break).

## 5. Corrupted Image Test
*   **Action:** Create a text file, rename it to `fake.jpg`, and try to upload it.
*   **Expected Result:**
    *   The `img.onload` will likely fail or `reader` might read it but `drawImage` might fail.
    *   The code has an `img.onerror` handler -> Ensure it triggers and rejects the promise.
    *   User should see an error, app should not crash.
