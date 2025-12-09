from playwright.sync_api import sync_playwright, expect
import time

def verify_upload_logic():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the App
        print("Loading App...")
        page.goto("http://localhost:8080/index.html")
        page.wait_for_load_state("networkidle")

        # 2. Login as Admin to get to the Quote Screen
        print("Logging in...")
        page.get_by_role("button", name="LOGIN").click()
        page.fill("input[name='user']", "admin")
        page.fill("input[name='pass']", "admin")
        page.get_by_role("button", name="ACCESS PORTAL").click()

        # 3. Open a Job to see Quote button
        print("Navigating to Quote...")
        page.get_by_text("Gearbox Mount").click()
        page.get_by_role("button", name="QUOTE").click()

        # 4. Check for Placeholder
        placeholder = page.get_by_text("SNAP BROKEN PART")
        expect(placeholder).to_be_visible()
        print("Upload Placeholder Visible.")

        # 5. Simulate Upload via Console (since we can't easily drag-drop a fake file in headless without setup)
        # We will inject a script to call window.nexusApi.upload with a fake Blob
        print("Testing Upload Logic via Console...")

        result = page.evaluate("""async () => {
            try {
                // Create a fake image blob (1x1 pixel)
                const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
                const res = await fetch("data:image/png;base64," + base64);
                const blob = await res.blob();
                const file = new File([blob], "test.png", { type: "image/png" });

                // Call API
                const compressed = await window.nexusApi.upload(file);
                return { success: true, length: compressed.length };
            } catch (e) {
                return { success: false, error: e.toString() };
            }
        }""")

        if result["success"]:
            print(f"Upload Success! Compressed Base64 Length: {result['length']}")
        else:
            print(f"Upload Failed: {result['error']}")
            exit(1)

        # 6. Test Error Handling (Invalid File)
        print("Testing Invalid File Type...")
        error_result = page.evaluate("""async () => {
            try {
                const file = new File(["fake pdf content"], "test.pdf", { type: "application/pdf" });
                await window.nexusApi.upload(file);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.toString() };
            }
        }""")

        if not error_result["success"] and "Invalid file type" in error_result["error"]:
            print("Invalid File Rejected Correctly.")
        else:
            print(f"Invalid File Test Failed (Should have rejected): {error_result}")
            exit(1)

        browser.close()

if __name__ == "__main__":
    verify_upload_logic()
