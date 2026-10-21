import glob
import re
import os
import json

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    products_dir = os.path.join(workspace, 'products')
    os.makedirs(products_dir, exist_ok=True)

    template_file = os.path.join(products_dir, 'itachi-uchiha-clan-unisex-oversized-t-shirt.html')
    if not os.path.exists(template_file):
        existing = glob.glob(os.path.join(products_dir, '*.html'))
        if existing:
            template_file = existing[0]
        else:
            print("No template found!")
            return

    with open(template_file, 'r', encoding='utf-8') as f:
        template_html = f.read()

    # Dictionary to store product info
    products = {}

    # 1. Parse meta tags from all collection files and index.html
    html_files = glob.glob(os.path.join(workspace, 'collections', '*.html')) + [os.path.join(workspace, 'index.html')]
    
    for fpath in html_files:
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Extract from meta JSON
        meta_matches = re.findall(r'var\s+meta\s*=\s*(\{.+?\});', content, re.DOTALL)
        for mm in meta_matches:
            try:
                data = json.loads(mm)
                if 'products' in data:
                    for p in data['products']:
                        h = p.get('handle')
                        if h and h not in products:
                            var0 = p.get('variants', [{}])[0]
                            pr = var0.get('price', 155000)
                            if pr:
                                price_val = pr // 100
                            else:
                                price_val = 1550
                            
                            products[h] = {
                                'handle': h,
                                'title': p.get('name') or p.get('title') or h.replace('-', ' ').title(),
                                'price': price_val,
                                'compare_price': int(price_val * 1.35),
                                'images': []
                            }
            except Exception as e:
                pass

        # Extract from Shopify analytics events if available
        # e.g., "products": [{"title": "...", "url": "/products/...", "image": {...}}]
        events_match = re.search(r'\"productVariants\":\s*\[(.+?)\]\s*\}\s*\]\s*\]', content, re.DOTALL)
        if events_match:
            try:
                # Find product title & url & images
                items = re.findall(r'\"product\":\{([^\}]+)\}.*?\"image\":\{([^\}]+)\}', events_match.group(0))
                for p_str, img_str in items:
                    m_url = re.search(r'\"url\":\"[^\"]*products/([^\"]+)\"', p_str)
                    m_title = re.search(r'\"title\":\"([^\"]+)\"', p_str)
                    m_img = re.search(r'\"src\":\"([^\"]+)\"', img_str)
                    if m_url:
                        h = m_url.group(1).replace('.html', '')
                        img = m_img.group(1).replace('\\/', '/') if m_img else ''
                        if img.startswith('//'):
                            # Find local file name in assets/images/
                            img_filename = img.split('/')[-1].split('?')[0]
                            local_candidates = glob.glob(os.path.join(workspace, 'assets', 'images', f"*{img_filename[:15]}*"))
                            if local_candidates:
                                img = 'assets/images/' + os.path.basename(local_candidates[0])
                        if h not in products:
                            products[h] = {
                                'handle': h,
                                'title': m_title.group(1) if m_title else h.replace('-', ' ').title(),
                                'price': 1550,
                                'compare_price': 2200,
                                'images': [img] if img else []
                            }
                        elif img and img not in products[h]['images']:
                            products[h]['images'].append(img)
            except Exception:
                pass

        # Extract from product card elements in DOM
        card_matches = re.finditer(r'<li[^>]*class="[^"]*grid__item[^"]*"[^>]*>(.+?)</li>', content, re.DOTALL)
        for cm in card_matches:
            c = cm.group(1)
            m_link = re.search(r'href="[^"]*products/([a-zA-Z0-9\-_]+)(?:\.html)?"', c)
            if not m_link:
                continue
            h = m_link.group(1)
            
            m_title = re.search(r'class="card__heading[^"]*"[^>]*>\s*<a[^>]*>\s*([^<]+?)\s*</a>', c, re.DOTALL)
            title = m_title.group(1).strip() if m_title else h.replace('-', ' ').title()

            imgs = re.findall(r'src="([^"]*(?:png|jpg|jpeg|webp))"', c)
            clean_imgs = []
            for img in imgs:
                clean = re.sub(r'^\.\./', '', img)
                if clean not in clean_imgs:
                    clean_imgs.append(clean)

            m_price = re.search(r'class="price-item price-item--sale[^"]*"[^>]*>\s*Rs\.?([0-9,]+)', c)
            price = int(m_price.group(1).replace(',', '')) if m_price else 1550

            m_reg = re.search(r'class="price-item price-item--regular[^"]*"[^>]*>\s*Rs\.?([0-9,]+)', c)
            compare = int(m_reg.group(1).replace(',', '')) if m_reg else int(price * 1.35)

            if h not in products:
                products[h] = {
                    'handle': h,
                    'title': title,
                    'price': price,
                    'compare_price': compare,
                    'images': clean_imgs
                }
            else:
                if title and products[h]['title'] == h.replace('-', ' ').title():
                    products[h]['title'] = title
                if clean_imgs and not products[h]['images']:
                    products[h]['images'] = clean_imgs
                if price != 1550:
                    products[h]['price'] = price
                    products[h]['compare_price'] = compare

    print(f"Collected {len(products)} products total from workspace collections and pages.")

    # Find existing products on disk
    existing_files = set(os.path.basename(p) for p in glob.glob(os.path.join(products_dir, '*.html')))

    # Let's inspect default placeholder image if product has no image
    default_img = 'assets/images/THE_PIXEL_FASHION_3_1d7deb.png'

    generated_count = 0
    for handle, info in products.items():
        fname = f"{handle}.html"
        if fname in existing_files:
            continue

        title = info['title']
        price = info['price']
        compare = info['compare_price']
        saving = compare - price
        discount_percent = int((saving / compare) * 100) if compare > price else 25

        img1 = info['images'][0] if info['images'] else default_img
        img2 = info['images'][1] if len(info['images']) > 1 else img1

        # Build custom product page using template
        page = template_html

        # Replace Title
        page = re.sub(r'<title>.*?</title>', f'<title>{title} – The Pixel Fashion</title>', page, flags=re.DOTALL)
        page = page.replace('Itachi Uchiha Clan Unisex Oversized T-Shirt', title)
        
        # Replace handle in links & canonical
        page = page.replace('itachi-uchiha-clan-unisex-oversized-t-shirt', handle)

        # Replace prices
        # Rs.1,850 PKR -> Rs.{price:,} PKR
        page = re.sub(r'Rs\.1,850\s*PKR', f'Rs.{price:,} PKR', page)
        page = re.sub(r'Rs\.2,500\s*PKR', f'Rs.{compare:,} PKR', page)
        page = re.sub(r'Save Rs\.650\s*PKR', f'Save Rs.{saving:,} PKR', page)
        page = page.replace('29% OFF', f'{discount_percent}% OFF')

        # Replace images
        page = page.replace('../assets/images/black_oversized_front_836c18.png', f"../{img1}")
        page = page.replace('assets/images/black_oversized_front_836c18.png', f"../{img1}")
        page = page.replace('../assets/images/blackoversizedback_3_69c7c6.png', f"../{img2}")
        page = page.replace('assets/images/blackoversizedback_3_69c7c6.png', f"../{img2}")

        target_path = os.path.join(products_dir, fname)
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(page)
        
        generated_count += 1

    print(f"Successfully generated {generated_count} missing product pages into {products_dir}.")

if __name__ == '__main__':
    main()
