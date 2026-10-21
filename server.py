import http.server
import socketserver
import os
import urllib.parse
import sys

PORT = 8080
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        pass

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PixelFashionHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''

        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/products/create':
            try:
                import json
                data = json.loads(body.decode('utf-8'))
                title = data.get('title', 'Pixel Fashion Product')
                handle = data.get('handle') or title.lower().replace(' ', '-').replace('/', '-')
                price = int(data.get('price', 1899))
                compare = int(data.get('comparePrice', price * 1.3))
                image = data.get('image') or 'assets/images/THE_PIXEL_FASHION_3_1d7deb.png'
                desc = data.get('description', '')

                self.generate_product_html(handle, title, price, compare, image, desc)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok', 'handle': handle, 'url': f'/products/{handle}.html'}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
                return

        # Gracefully handle internal Shopify telemetry and pixel events with 200 OK
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')

    def generate_product_html(self, handle, title, price, compare, image, desc):
        import re
        products_dir = os.path.join(DIRECTORY, 'products')
        target_path = os.path.join(products_dir, f"{handle}.html")
        if os.path.exists(target_path):
            return target_path

        template_path = os.path.join(products_dir, 'itachi-uchiha-clan-unisex-oversized-t-shirt.html')
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()

        saving = compare - price
        discount_percent = int((saving / compare) * 100) if compare > price else 25
        norm_img = image.replace('../', '')

        page = template
        page = re.sub(r'<title>.*?</title>', f'<title>{title} \u2013 The Pixel Fashion</title>', page, flags=re.DOTALL)
        page = page.replace('Itachi Uchiha Clan Unisex Oversized T-Shirt', title)
        page = page.replace('itachi-uchiha-clan-unisex-oversized-t-shirt', handle)
        page = re.sub(r'Rs\.1,850\s*PKR', f'Rs.{price:,} PKR', page)
        page = re.sub(r'Rs\.2,500\s*PKR', f'Rs.{compare:,} PKR', page)
        page = re.sub(r'Save Rs\.650\s*PKR', f'Save Rs.{saving:,} PKR', page)
        page = page.replace('29% OFF', f'{discount_percent}% OFF')
        page = page.replace('../assets/images/black_oversized_front_836c18.png', f"../{norm_img}")
        page = page.replace('assets/images/black_oversized_front_836c18.png', f"../{norm_img}")
        page = page.replace('../assets/images/blackoversizedback_3_69c7c6.png', f"../{norm_img}")
        page = page.replace('assets/images/blackoversizedback_3_69c7c6.png', f"../{norm_img}")

        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(page)
        return target_path

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def translate_path(self, path):
        # Clean query strings and fragments
        parsed = urllib.parse.urlparse(path)
        clean_path = urllib.parse.unquote(parsed.path)

        # 0. Intercept and route Shopify customer account & authentication redirects locally
        if clean_path.startswith('/customer_authentication') or clean_path.startswith('/account'):
            return os.path.join(DIRECTORY, 'account.html')
        
        local_path = super().translate_path(clean_path)
        
        # 1. If file exists as is, serve it
        if os.path.exists(local_path):
            return local_path
            
        # 2. Try appending .html (Clean URL support)
        if not local_path.endswith('.html'):
            html_candidate = local_path + '.html'
            if os.path.exists(html_candidate):
                return html_candidate

        # 3. Handle /products/<slug> variations
        if '/products/' in clean_path:
            slug = clean_path.split('/products/')[-1].split('?')[0].replace('.html', '')
            candidate = os.path.join(DIRECTORY, 'products', f"{slug}.html")
            if os.path.exists(candidate):
                return candidate
            else:
                # Auto generate on the fly
                title = slug.replace('-', ' ').title()
                return self.generate_product_html(slug, title, 1899, 2499, 'assets/images/black_oversized_front_836c18.png', '')
                
        # 4. Handle /collections/<slug> variations
        if '/collections/' in clean_path:
            slug = clean_path.split('/collections/')[-1].split('?')[0].replace('.html', '')
            candidate = os.path.join(DIRECTORY, 'collections', f"{slug}.html")
            if os.path.exists(candidate):
                return candidate

        return local_path

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            # Check if this was a product or collection link
            parsed = urllib.parse.urlparse(self.path)
            clean_path = parsed.path
            
            # If requesting a product that doesn't exist, redirect or fallback to products list or homepage
            if '/products/' in clean_path:
                self.send_response(302)
                self.send_header('Location', '/index.html')
                self.end_headers()
                return

            if '/collections/' in clean_path:
                self.send_response(302)
                self.send_header('Location', '/index.html')
                self.end_headers()
                return

            if 'account' in clean_path or 'customer_authentication' in clean_path:
                self.send_response(302)
                self.send_header('Location', '/account.html')
                self.end_headers()
                return

        super().send_error(code, message, explain)

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), PixelFashionHandler) as httpd:
        print(f"Server started on http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    run_server()
