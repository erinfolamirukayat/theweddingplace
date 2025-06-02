import requests
from bs4 import BeautifulSoup
import time
import os
import psycopg2
from supabase import create_client, Client
from urllib.parse import urlparse

# --- CONFIGURATION ---

# Supabase
SUPABASE_URL = "https://wmhidpsitmleveitrtju.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGlkcHNpdG1sZXZlaXRydGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODYyODg5OSwiZXhwIjoyMDY0MjA0ODk5fQ.Tn-HQg8ih_kBp6CVbqxkJNpsDRLhw-X9qQ0K_rjt1h0"
BUCKET_NAME = "wedding-registry-product-images"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Neon (Postgres)
import urllib.parse as up
DATABASE_URL = os.environ.get("DATABASE_URL") or "postgresql://neondb_owner:npg_qnaTE8F4eNXG@ep-square-math-a50vdl7g-pooler.us-east-2.aws.neon.tech/wedding_registry?sslmode=require"
up.uses_netloc.append("postgres")
url = up.urlparse(DATABASE_URL)
conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)
cur = conn.cursor()

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
    try:
        return float(''.join(filter(lambda c: c.isdigit() or c == '.', price_str.replace(',', ''))))
    except:
        return None

def upload_image_to_supabase(image_url, product_name):
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            ext = os.path.splitext(urlparse(image_url).path)[-1]
            file_name = f"{product_name.replace(' ', '_')}{ext}"
            file_path = f"{BUCKET_NAME}/{file_name}"
            # Upload to Supabase Storage
            supabase.storage.from_(BUCKET_NAME).upload(file_name, response.content, {"content-type": response.headers['Content-Type']})
            # Get public URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
            return public_url
    except Exception as e:
        print(f"Failed to upload image: {e}")
    return ""

def get_products(search_term, n=5):
    url = BASE_URL + requests.utils.quote(search_term)
    headers = {'User-Agent': 'Mozilla/5.0'}
    resp = requests.get(url, headers=headers)
    print(resp.status_code)
    print(resp.text[:1000])  # Print the first 1000 characters of the HTML
    soup = BeautifulSoup(resp.text, 'html.parser')
    print(f"Soup content: {len(soup)}")
    products = []
    for item in soup.select('.prd')[:n]:
        print(f"Item: {item}")
        name = item.select_one('.name').text.strip() if item.select_one('.name') else ''
        price = item.select_one('.prc').text.strip() if item.select_one('.prc') else ''
        price = clean_price(price) if price else None
        link = item.select_one('a.core')['href'] if item.select_one('a.core') else ''
        image_url = item.select_one('img.img')['data-src'] if item.select_one('img.img') and item.select_one('img.img').has_attr('data-src') else ''
        desc = ''
        prod_url = ''
        supabase_image_url = ''
        if link:
            prod_url = 'https://www.jumia.com.ng' + link
            prod_resp = requests.get(prod_url, headers=headers)
            prod_soup = BeautifulSoup(prod_resp.text, 'html.parser')
            desc_tag = prod_soup.select_one('.-pdesc .markup')
            desc = desc_tag.text.strip() if desc_tag else ''
            time.sleep(1)
        if image_url:
            supabase_image_url = upload_image_to_supabase(image_url, name)
            time.sleep(1)
        print(f"Uploaded image to Supabase: {supabase_image_url}, name: {name}, price: {price}")
        suggested_amount = price
        products.append({
            'name': name,
            'category': '',
            'description': desc,
            'price': price,
            'image_url': supabase_image_url,
            'suggested_amount': suggested_amount
        })
    return products

for category, items in categories.items():
    for item in items:
        # print(f"Scraping: {item} ({category})")
        products = get_products(item)
        for prod in products:
            prod['category'] = category
            cur.execute(
                """
                INSERT INTO products (name, category, description, price, image_url, suggested_amount)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (prod['name'], prod['category'], prod['description'], prod['price'], prod['image_url'], prod['suggested_amount'])
            )
            conn.commit()
        time.sleep(2)

cur.close()
conn.close()
print("Done! All products inserted into Neon DB.")