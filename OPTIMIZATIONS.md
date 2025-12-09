# Optimizations and Upgrades

Based on the test cycles and code analysis, the following optimizations and upgrades are recommended:

## 1. Stability & Error Handling
*   **Timeouts in Navigation:** The tests frequently timed out when clicking buttons like `HOME` or `ORDERS` in the Visitor and Client views. This suggests a potential race condition or slow rendering of the view state transition.
    *   *Optimization:* Implement a loading state or spinner during view transitions to give feedback and prevent interaction until the new view is ready.
    *   *Fix:* Ensure `navigate()` calls are synchronous or properly awaited if they involve async data fetching (currently `refreshData` is async but `navigate` is sync).

*   **Client Job List Loading:** The client view often failed to find the "Job List" (`FAIL: Job List Visible`).
    *   *Optimization:* Ensure the `data.jobs.filter` logic is performant. If the job list is large, paginate it.
    *   *Fix:* Verify that `user.id` matches the `clientId` in the seed data consistently.

## 2. User Experience (UX)
*   **Logout Visibility:** The logout button was reported as "not found easily" in the Client view tests.
    *   *Upgrade:* Move the logout button to a more prominent location in the Client view, perhaps in the footer or a dedicated profile header, similar to the Admin view.
    *   *Upgrade:* Add a confirmation dialog for logout to prevent accidental clicks.

*   **Feedback on Actions:** Actions like "Request Advance" or "Add Offer" rely on browser alerts (`window.alert`).
    *   *Upgrade:* Replace standard alerts with the existing Toast notification system (`window.showToast`) for a more integrated experience.

## 3. Feature Enhancements
*   **Offline Support:** The app uses a service worker (`sw.js`), but the `mockFetch` logic simulates network delays.
    *   *Upgrade:* Implement robust offline queueing for requests (e.g., saving a design or requesting an advance while offline) and syncing when online.

*   **Ledger Visualization:** The Ledger view is text-based.
    *   *Upgrade:* Add a simple chart (bar or line) to visualize Income vs. Expenses over time using CSS-only charts or a lightweight library (if allowed).

*   **CAD Enhancements:**
    *   *Upgrade:* Add "Undo/Redo" functionality to the CAD designer.
    *   *Upgrade:* Allow saving designs as "Drafts" locally before attaching to a job.

## 4. Code Quality & Maintenance
*   **Component Splitting:** The single-file `index.html` is becoming large.
    *   *Optimization:* Although "No Build Step" is a constraint, logical grouping within the file (or using ES modules if supported by the target environment) could improve readability.
    *   *Optimization:* Extract the mock data `SEED` into a separate file if not already done (it is in `pwa_mock_adapter.js`, which is good).

*   **Hardcoded Styles:** Some styles are inline.
    *   *Optimization:* Move more styles to the Tailwind config or the `<style>` block to maintain consistency and ease of theming.

## 5. Security (Mock)
*   **Role Validation:** The current checks are `user?.role === 'ADMIN'`.
    *   *Upgrade:* Implement a more robust permission system (e.g., `can(user, 'edit_job')`) to centralize access control logic, making it easier to add new roles (e.g., 'MANAGER') in the future.
