
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Load local index.html
        url = 'file://' + os.path.abspath('index.html')
        print(f'Navigating to {url}')
        page.goto(url)

        # Wait for React to mount and data to load (simulated)
        page.wait_for_timeout(2000)

        # Initial Visitor View
        page.screenshot(path='verification/1_visitor_view.png')
        print('Captured Visitor View')

        # Login as Client (simulated via click since we can't type easily in non-input fields or if IDs changed)
        # Clicking Login button in header
        page.get_by_role('button', name='LOGIN').click()
        page.wait_for_selector('input[name="user"]')

        # Fill Login (using mocked client credentials from pwa_mock_adapter.js: 919999999999 / 123)
        page.fill('input[name="user"]', '919999999999')
        page.fill('input[name="pass"]', '123')
        page.click('button:has-text("ACCESS PORTAL")')

        # Wait for Client Home
        page.wait_for_timeout(2000)
        page.screenshot(path='verification/2_client_home.png')
        print('Captured Client Home')

        browser.close()

if __name__ == '__main__':
    run()
