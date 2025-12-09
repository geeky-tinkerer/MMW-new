from playwright.sync_api import sync_playwright, expect
import time

def screenshot_snap_quote():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the App
        print("Loading App...")
        page.goto("http://localhost:8080/index.html")
        page.wait_for_load_state("networkidle")

        # 2. Login as Admin
        print("Logging in...")
        page.get_by_role("button", name="LOGIN").click()
        page.fill("input[name='user']", "admin")
        page.fill("input[name='pass']", "admin")
        page.get_by_role("button", name="ACCESS PORTAL").click()

        # 3. Open a Job to see Quote button
        print("Navigating to Quote...")
        page.get_by_text("Gearbox Mount").click()
        page.get_by_role("button", name="QUOTE").click()

        # 4. Trigger the toast (simulate error or success)
        # We can simulate the upload error to see the red toast
        page.evaluate("""
            window.dispatchEvent(new CustomEvent('nexus-upload-error', {
                detail: { message: "Test Toast: Sync Failed", type: "error" }
            }));
        """)

        # 5. Screenshot
        time.sleep(1) # Wait for animation
        page.screenshot(path="/home/jules/verification/toast_test.png")
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    screenshot_snap_quote()
