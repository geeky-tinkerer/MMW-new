from playwright.sync_api import sync_playwright, expect
import time

def verify_meta_tags():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the App
        print("Loading App...")
        page.goto("http://localhost:8080/index.html")
        page.wait_for_load_state("networkidle")

        # 2. Verify Manifest Link
        print("Verifying Manifest Link...")
        manifest_link = page.locator('link[rel="manifest"]')
        expect(manifest_link).to_have_attribute("href", "manifest.json")
        print("Manifest Linked.")

        # 3. Verify iOS Meta Tags
        print("Verifying iOS Meta Tags...")
        ios_capable = page.locator('meta[name="apple-mobile-web-app-capable"]')
        expect(ios_capable).to_have_attribute("content", "yes")
        print("iOS Meta Tag Verified.")

        # 4. Screenshot the head? (Not visible, but we verify app loads)
        page.screenshot(path="/home/jules/verification/meta_verification.png")
        print("App loads with new tags.")

        browser.close()

if __name__ == "__main__":
    verify_meta_tags()
