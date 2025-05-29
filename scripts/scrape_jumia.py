import requests
from bs4 import BeautifulSoup
import time
import csv

categories = {
    "Kitchen & Dining": [
        "Dinnerware set", "Cutlery set", "Drinking glasses", "Mugs", "Cookware set",
        "Frying pan", "Cooking utensils", "Cutting board", "Chef’s knife", "Food storage containers",
        "Blender", "Microwave oven", "Electric kettle", "Toaster", "Rice cooker",
        "Pressure cooker", "Dish rack", "Mixing bowls", "Measuring cups", "Baking tray"
    ],
    "Bedroom": [
        "Bed frame", "Mattress", "Bedsheet set", "Pillows", "Duvet", "Pillowcases",
        "Wardrobe", "Laundry basket"
    ],
    "Living Room": [
        "Sofa", "Coffee table", "TV", "TV stand", "Curtains", "Floor rug", "Throw pillows"
    ],
    "Bathroom": [
        "Towels", "Bath mat", "Shower curtain", "Soap dispenser", "Toothbrush holder", "Laundry hamper"
    ],
    "Cleaning & Home Care": [
        "Broom", "Mop", "Vacuum cleaner", "Iron", "Ironing board", "Waste bin", "Clothes drying rack"
    ],
    "Miscellaneous": [
        "Wall clock", "Extension cord", "First aid kit"
    ]
}

BASE_URL = "https://www.jumia.com.ng/catalog/?q="

def clean_price(price_str):
    # Remove currency symbol and commas, return as integer
    return int(''.join(filter(str.isdigit, price_str)))

def get_products(search_term, n=5):
    url = BASE_URL + requests.utils.quote(search_term)
    headers = {'User-Agent': 'Mozilla/5.0'}
    resp = requests.get(url, headers=headers)
    soup = BeautifulSoup(resp.text, 'html.parser')
    products = []
    for item in soup.select('.prd')[:n]:
        name = item.select_one('.name').text.strip() if item.select_one('.name') else ''
        price = item.select_one('.prc').text.strip() if item.select_one('.prc') else ''
        price = clean_price(price) if price else None
        link = item.select_one('a.core')['href'] if item.select_one('a.core') else ''
        image_url = item.select_one('img.img')['data-src'] if item.select_one('img.img') and item.select_one('img.img').has_attr('data-src') else ''
        desc = ''
        prod_url = ''
        if link:
            prod_url = 'https://www.jumia.com.ng' + link
            prod_resp = requests.get(prod_url, headers=headers)
            prod_soup = BeautifulSoup(prod_resp.text, 'html.parser')
            desc_tag = prod_soup.select_one('.-pdesc .markup')
            desc = desc_tag.text.strip() if desc_tag else ''
            time.sleep(1)  # Be polite to Jumia's servers
        products.append({
            'name': name,
            'price': price,
            'description': desc,
            'category': '',
            'item_type': '',
            'image_url': image_url,
            'source_url': prod_url
        })
    return products

all_products = []

for category, items in categories.items():
    for item in items:
        print(f"Scraping: {item} ({category})")
        products = get_products(item)
        for prod in products:
            prod['category'] = category
            prod['item_type'] = item
            all_products.append(prod)
        time.sleep(2)  # Be polite to Jumia's servers

# Save to CSV
with open('products_for_db.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'price', 'description', 'category', 'item_type', 'image_url', 'source_url'])
    writer.writeheader()
    writer.writerows(all_products)

print("Done! Saved to products_for_db.csv")