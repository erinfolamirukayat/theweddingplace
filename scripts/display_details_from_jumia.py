from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def scrape_jumia_product_selenium(product_url):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)

    driver.get(product_url)
    time.sleep(5)  # Wait for JS to load

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Product name
    name_tag = soup.select_one('h1.-fs20.-pts.-pbxs')
    name = name_tag.text.strip() if name_tag else ''

    # Price (use the selector you found)
    price_tag = soup.select_one('span.-b.-ubpt.-tal.-fs24.-prxs')
    price = price_tag.text.strip() if price_tag else None

    # Description
    desc_tag = soup.select_one('.-pdesc .markup')
    description = desc_tag.text.strip() if desc_tag else ''

    # Main image
    image_tag = soup.select_one('img.-fw.-fh')
    image_url = image_tag['data-src'] if image_tag and image_tag.has_attr('data-src') else (image_tag['src'] if image_tag and image_tag.has_attr('src') else '')

    driver.quit()

    print({
        'name': name,
        'price': price,
        'description': description,
        'image_url': image_url,
        'source_url': product_url
    })

# Example usage:
scrape_jumia_product_selenium("https://www.jumia.com.ng/better-homes-16-piece-dinner-set-291379485.html")