from playwright.sync_api import sync_playwright, expect
import time

def verify_nexus_prime():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 412, "height": 915}) # Mobile viewport
        page = context.new_page()

        # 1. Load the App
        print("Loading App...")
        page.goto("http://localhost:8080/index.html")
        page.wait_for_load_state("networkidle")

        # 2. Login as Admin
        print("Logging in as Admin...")
        page.get_by_role("button", name="LOGIN").click()
        page.fill("input[name='user']", "admin")
        page.fill("input[name='pass']", "admin")
        page.get_by_role("button", name="ACCESS PORTAL").click()

        # Verify Dashboard Load (Financial Intelligence)
        print("Verifying Dashboard...")
        expect(page.get_by_text("FINANCIAL COMPASS")).to_be_visible()
        expect(page.get_by_text("REVENUE PROGRESS")).to_be_visible()
        expect(page.get_by_text("CONVERSION RATE")).to_be_visible()
        page.screenshot(path="/home/jules/verification/1_dashboard.png")

        # 3. Verify Sales Pipeline
        print("Verifying Sales Pipeline...")
        page.get_by_role("button").nth(1).click() # 2nd button is CLIENTS/Sales
        expect(page.get_by_text("SALES PIPELINE")).to_be_visible()
        expect(page.get_by_text("COLD LEADS")).to_be_visible()
        page.screenshot(path="/home/jules/verification/2_sales_pipeline.png")

        # 4. Verify IPC Checklist (Operations)
        print("Verifying IPC Checklist...")
        page.get_by_role("button").nth(0).click() # Back to Dash (1st button is Dash)

        # Click on an Active Job (e.g., Gearbox Mount which is ACTIVE)
        page.get_by_text("Gearbox Mount").click()
        expect(page.get_by_text("PROCESS CHECKLIST (IPC)")).to_be_visible()

        # Try to mark DONE without QC
        print("Testing IPC Blocker...")
        # Current status is ACTIVE. Clicking it should try to toggle to DONE.
        page.on("dialog", lambda dialog: dialog.accept()) # Handle alert
        page.get_by_text("ACTIVE", exact=True).click()
        # Ideally we'd verify the alert text, but for visual we just check the checklist is there

        # Check the boxes
        page.locator("input[type='checkbox']").nth(2).check() # Create
        page.locator("input[type='checkbox']").nth(3).check() # QC

        page.screenshot(path="/home/jules/verification/3_ipc_checklist.png")

        # Close modal
        page.get_by_text("X").first.click()

        # 5. Verify Engineering Hub (Tools & Save)
        print("Verifying Engineering Hub...")
        # Open Tools (Ruler Icon)
        # Note: Ruler icon is inside the header, not the bottom nav.
        # It has an SVG, might be hard to select by role. It is the first button in the header right side.
        # The header buttons are: Tools, Hud, Logout.
        # Tools button has onClick setTools(true)
        # We can find it by the SVG or class.

        # Let's try finding the element by the Ruler icon's parent button
        # It's inside a div with class "flex gap-2".

        # Alternative: Just click the button that contains the Ruler SVG.
        # Or simpler: The first button in the .flex.gap-2 container in header.
        page.locator(".flex.gap-2 > button").first.click()

        expect(page.get_by_text("FABRICATOR SUITE")).to_be_visible()
        expect(page.get_by_text("Save to Job...")).to_be_visible()
        page.screenshot(path="/home/jules/verification/4_tools_save.png")

        browser.close()
        print("Verification Complete.")

if __name__ == "__main__":
    verify_nexus_prime()
