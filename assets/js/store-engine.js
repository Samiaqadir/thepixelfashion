/**
 * The Pixel Fashion — Complete Storefront Engine
 * Features:
 *  - E-Commerce Cart System (Add to cart, drawer slideout, quantity +/-)
 *  - Interactive Cash on Delivery Checkout (syncs with Admin Panel)
 *  - Interactive Live Predictive Search
 *  - Live Customer Support Chat Widget (WhatsApp + Interactive Bot + Quick Options)
 *  - Product Detail Page Enhancements (Image gallery switcher, variant selector, quantity stepper)
 *  - Announcement Bar carousel
 *  - Header menu & Mobile Drawer support
 *  - Header & Floating Admin Panel button
 */

(function() {
  'use strict';

  // 1. Determine relative path prefix to root
  const isSubfolder = window.location.pathname.includes('/collections/') || 
                      window.location.pathname.includes('/products/') || 
                      window.location.pathname.includes('/pages/');
  const rootPrefix = isSubfolder ? '../' : '';

  // 2. Global Product Catalog for Search & Quick Add
  const CATALOG = [
    {
      title: "Attack On Titan Scout Unisex Oversized T-Shirt",
      category: "Anime",
      price: 1999,
      comparePrice: 2799,
      image: rootPrefix + "assets/images/aot_scout_front.jpg",
      url: rootPrefix + "products/attack-on-titan-scout-unisex-oversized-t-shirt.html"
    },
    {
      title: "Itachi Uchiha Clan Unisex Oversized T-Shirt",
      category: "Anime",
      price: 1899,
      comparePrice: 2499,
      image: rootPrefix + "assets/images/black_oversized_front_836c18.png",
      url: rootPrefix + "products/itachi-uchiha-clan-unisex-oversized-t-shirt.html"
    },
    {
      title: "Google Developer Unisex Half Sleeve T-Shirt",
      category: "Programming",
      price: 1650,
      comparePrice: 2200,
      image: rootPrefix + "assets/images/FullSnackDeveloperHalfSleeveT-Shirt_b1a48639-4604-4198-a903-d9672bce0879_f5bf67.jpg",
      url: rootPrefix + "products/google-developer-half-sleeve-t-shirt.html"
    },
    {
      title: "Solo Leveling Level Up Unisex Oversized T-Shirt",
      category: "Anime",
      price: 1899,
      comparePrice: 2499,
      image: rootPrefix + "assets/images/blackoversizedfront_3_3198c3.png",
      url: rootPrefix + "products/solo-leveling-level-up-unisex-oversized-t-shirt.html"
    },
    {
      title: "Things I Hate Unisex Half Sleeve T-Shirt",
      category: "Programming",
      price: 1650,
      comparePrice: 2100,
      image: rootPrefix + "assets/images/ThingsIHateHalfSleeveT-Shirt_261b54.jpg",
      url: rootPrefix + "products/things-i-hate-half-sleeve-t-shirt.html"
    },
    {
      title: "Evolution of Goku Unisex Oversized T-Shirt",
      category: "Anime",
      price: 1899,
      comparePrice: 2500,
      image: rootPrefix + "assets/images/blackoversizedfront_2_3b4697.png",
      url: rootPrefix + "products/evolution-of-goku-unisex-oversized-t-shirt.html"
    },
    {
      title: "Real Madrid Unisex Half Sleeve T-Shirt",
      category: "Football",
      price: 1750,
      comparePrice: 2300,
      image: rootPrefix + "assets/images/white_front_1_274d55.png",
      url: rootPrefix + "products/real-madrid-unisex-half-sleeve-t-shirt.html"
    },
    {
      title: "Argentina Unisex Half Sleeve T-Shirt",
      category: "Football",
      price: 1750,
      comparePrice: 2300,
      image: rootPrefix + "assets/images/white_front_3_71a0dd.png",
      url: rootPrefix + "products/argentina-unisex-half-sleeve-t-shirt.html"
    },
    {
      title: "FC Barcelona Unisex Half Sleeve T-Shirt",
      category: "Football",
      price: 1750,
      comparePrice: 2300,
      image: rootPrefix + "assets/images/blackoversizedfront_1_12c546.png",
      url: rootPrefix + "products/barcelona-unisex-half-sleeve-t-shirt.html"
    },
    {
      title: "Portugal Unisex Half Sleeve T-Shirt",
      category: "Football",
      price: 1750,
      comparePrice: 2300,
      image: rootPrefix + "assets/images/white_front_41_696ea6.png",
      url: rootPrefix + "products/portugal-unisex-half-sleeve-t-shirt.html"
    },
    {
      title: "Kali Linux Unisex Half Sleeve T-Shirt",
      category: "Programming",
      price: 1699,
      comparePrice: 2200,
      image: rootPrefix + "assets/images/kalilinux_aa7e1f.png",
      url: rootPrefix + "products/kali-linux-half-sleeve-t-shirt.html"
    },
    {
      title: "Upwork Unisex Half Sleeve T-Shirt",
      category: "Programming",
      price: 1699,
      comparePrice: 2200,
      image: rootPrefix + "assets/images/DeclareVariablesHalfSleeveT-Shirt_70ce3c.jpg",
      url: rootPrefix + "products/upwork-unisex-hald-sleeve-t-shirt.html"
    },
    {
      title: "One Piece Monkey d Luffy Unisex Oversized T-Shirt",
      category: "Anime",
      price: 1899,
      comparePrice: 2499,
      image: rootPrefix + "assets/images/blackoversizedfront_2_60d0a0.png",
      url: rootPrefix + "products/one-piece-monkey-d-luffy-unisex-oversized-t-shirt.html"
    }
  ];

  // 3. Cart State Management
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('pixel_cart')) || [];
    } catch(e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('pixel_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawer();
  }

  function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex(c => c.title === item.title && c.size === item.size && c.color === item.color);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    saveCart(cart);
    openCartDrawer();
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }

  function updateItemQuantity(index, delta) {
    const cart = getCart();
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart(cart);
    }
  }

  function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function getCartCount() {
    return getCart().reduce((count, item) => count + item.quantity, 0);
  }

  function updateCartBadge() {
    const count = getCartCount();
    const badgeContainers = document.querySelectorAll('#cart-icon-bubble');
    badgeContainers.forEach(bubble => {
      let badge = bubble.querySelector('.cart-count-bubble');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'cart-count-bubble';
        bubble.appendChild(badge);
      }
      badge.innerHTML = `<span aria-hidden="true">${count}</span><span class="visually-hidden">${count} items</span>`;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // 4. Inject Dynamic Styles
  function injectStyles() {
    if (document.getElementById('pixel-store-styles')) return;
    const style = document.createElement('style');
    style.id = 'pixel-store-styles';
    style.textContent = `
      /* Header Admin Button */
      .header__admin-btn {
        display: inline-flex !important;
        align-items: center;
        gap: 6px;
        background: #121212;
        color: #fff !important;
        padding: 7px 14px;
        border-radius: 9999px;
        font-size: 1.25rem;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        margin-left: 10px;
        cursor: pointer;
        line-height: 1;
      }
      .header__admin-btn:hover {
        background: #2563eb;
        border-color: #3b82f6;
        color: #ffffff !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
      }



      /* Cart Count Bubble */
      .cart-count-bubble {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        background: #ef4444;
        color: white;
        height: 1.8rem;
        width: 1.8rem;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1;
      }

      /* Cart Drawer Styles */
      .pixel-cart-drawer-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .pixel-cart-drawer-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }

      .pixel-cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 440px;
        background: #ffffff;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        color: #121212;
      }
      .pixel-cart-drawer.active {
        transform: translateX(0);
      }

      .pixel-cart-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .pixel-cart-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
      }
      .pixel-cart-close {
        background: none;
        border: none;
        font-size: 2.2rem;
        cursor: pointer;
        color: #6b7280;
        line-height: 1;
      }
      .pixel-cart-close:hover {
        color: #111827;
      }

      .pixel-cart-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px;
      }

      .pixel-cart-item {
        display: flex;
        gap: 16px;
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid #f3f4f6;
      }
      .pixel-cart-item-img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
      }
      .pixel-cart-item-details {
        flex: 1;
      }
      .pixel-cart-item-title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
      }
      .pixel-cart-item-variant {
        font-size: 1.2rem;
        color: #6b7280;
        margin-bottom: 8px;
      }
      .pixel-cart-item-price {
        font-size: 1.4rem;
        font-weight: 700;
        color: #111827;
      }
      .pixel-cart-item-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 8px;
      }
      .pixel-qty-btn {
        width: 28px;
        height: 28px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .pixel-qty-btn:hover {
        background: #e5e7eb;
      }
      .pixel-cart-remove-btn {
        background: none;
        border: none;
        color: #ef4444;
        font-size: 1.2rem;
        cursor: pointer;
        text-decoration: underline;
      }

      .pixel-cart-footer {
        padding: 20px 24px;
        border-top: 1px solid #e5e7eb;
        background: #fafafa;
      }
      .pixel-cart-subtotal {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 14px;
      }
      .pixel-checkout-btn {
        width: 100%;
        background: #121212;
        color: #fff;
        padding: 14px;
        border-radius: 8px;
        font-size: 1.4rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .pixel-checkout-btn:hover {
        background: #3b82f6;
      }

      /* Checkout Modal */
      .pixel-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 10005;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .pixel-modal-card {
        width: 100%;
        max-width: 480px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        overflow: hidden;
        animation: pixelPop 0.2s ease-out;
      }
      @keyframes pixelPop {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .pixel-modal-header {
        padding: 18px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .pixel-modal-body {
        padding: 24px;
      }
      .pixel-input-group {
        margin-bottom: 14px;
      }
      .pixel-input-group label {
        display: block;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 5px;
        color: #374151;
      }
      .pixel-input-group input, .pixel-input-group select, .pixel-input-group textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1.35rem;
        font-family: inherit;
        box-sizing: border-box;
      }
      .pixel-input-group input:focus, .pixel-input-group textarea:focus {
        border-color: #3b82f6;
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }

      /* Search Results Popup */
      .pixel-search-results {
        max-height: 380px;
        overflow-y: auto;
        padding: 12px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        margin-top: 8px;
      }
      .pixel-search-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 6px;
        text-decoration: none;
        color: #111827;
        transition: background 0.15s ease;
      }
      .pixel-search-item:hover {
        background: #f3f4f6;
      }
      .pixel-search-thumb {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        object-fit: cover;
      }

      /* ======================================================== */
      /* SUPPRESS ANY SHOPIFY NATIVE CHAT ELEMENTS (ONE BUTTON ONLY) */
      /* ======================================================== */
      shopify-chat, #shopify-chat, [data-shopify-chat],
      iframe[src*="chat"], iframe[title*="Chat" i],
      .shopify-chat-container, .chat-launcher-container {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      /* Single Floating Chat Launcher Button (Matches Image 1 bottom pill) */
      .pixel-chat-launcher {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #000000;
        color: #ffffff;
        padding: 13px 24px;
        border-radius: 9999px;
        box-shadow: 0 10px 25px -4px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 9px;
        cursor: pointer;
        z-index: 99999;
        font-weight: 700;
        font-size: 15px;
        border: none;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        font-family: inherit;
      }
      .pixel-chat-launcher:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 15px 35px rgba(0,0,0,0.5);
      }
      .pixel-chat-launcher svg {
        width: 19px;
        height: 19px;
        fill: currentColor;
      }

      /* ======================================================== */
      /* CHAT WINDOW BOX (EXACT MATCH TO USER'S IMAGE 4) */
      /* ======================================================== */
      .pixel-chat-window {
        position: fixed;
        bottom: 84px;
        right: 24px;
        width: 410px;
        max-width: calc(100vw - 32px);
        background: radial-gradient(ellipse 90% 80% at 10% 90%, #eafbf0 0%, #ffffff 65%);
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.08);
        z-index: 99999;
        display: none;
        flex-direction: column;
        padding: 24px;
        box-sizing: border-box;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        animation: chatFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .pixel-chat-window.active {
        display: flex;
      }
      .pixel-chat-window.expanded {
        width: 580px;
        height: 640px;
        max-height: calc(100vh - 100px);
      }
      @keyframes chatFadeIn {
        from { opacity: 0; transform: translateY(14px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Top Bar: Sign In & Controls */
      .pixel-chat-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 22px;
      }
      .pixel-chat-signin-btn {
        background: #000000;
        color: #ffffff;
        border: none;
        border-radius: 9999px;
        padding: 7px 18px;
        font-size: 13.5px;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      .pixel-chat-signin-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .pixel-chat-top-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pixel-chat-circle-action {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid #e4e4e7;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #18181b;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .pixel-chat-circle-action:hover {
        background: #f4f4f5;
        border-color: #d4d4d8;
        transform: scale(1.05);
      }

      /* Home Content Area */
      .pixel-chat-body-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }
      .pixel-chat-hero-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        min-height: 155px;
        position: relative;
        margin-bottom: 18px;
      }
      .pixel-chat-greeting-title {
        font-size: 15.5px;
        font-weight: 500;
        color: #18181b;
        line-height: 1.45;
        max-width: 195px;
        padding-top: 6px;
      }

      /* Tilted Product Preview Cards (Image 4 Match) */
      .pixel-chat-tilted-cluster {
        position: relative;
        width: 175px;
        height: 160px;
        flex-shrink: 0;
      }
      .pixel-tilted-card {
        position: absolute;
        background: #ffffff;
        border-radius: 14px;
        padding: 8px;
        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.07);
        cursor: pointer;
        text-align: center;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        box-sizing: border-box;
      }
      .pixel-tilted-card:hover {
        transform: scale(1.06) rotate(0deg) !important;
        z-index: 10 !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
      }
      .card--back {
        right: 0;
        top: 24px;
        width: 106px;
        transform: rotate(8deg);
        z-index: 1;
      }
      .card--front {
        left: 0;
        top: 0;
        width: 112px;
        transform: rotate(-3deg);
        z-index: 2;
      }
      .card-thumb-wrap {
        width: 100%;
        height: 94px;
        border-radius: 8px;
        background: #f8fafc;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card-thumb-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .card-title-text {
        font-size: 10.5px;
        font-weight: 600;
        color: #18181b;
        line-height: 1.25;
        margin-top: 6px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Disclaimer */
      .pixel-chat-disclaimer {
        font-size: 11px;
        color: #71717a;
        line-height: 1.45;
        margin-bottom: 16px;
      }
      .pixel-chat-disclaimer a {
        color: #52525b;
        text-decoration: underline;
      }

      /* Quick Suggestion Chips */
      .pixel-chat-quick-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }
      .pixel-chat-chip {
        background: #ffffff;
        border: 1px solid #e4e4e7;
        border-radius: 9999px;
        padding: 7px 15px;
        font-size: 13px;
        font-weight: 500;
        color: #18181b;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        white-space: nowrap;
      }
      .pixel-chat-chip:hover {
        background: #f4f4f5;
        border-color: #d4d4d8;
        transform: translateY(-1px);
      }

      /* Bottom Pill Input */
      .pixel-chat-pill-form {
        display: flex;
        align-items: center;
        border: 1.5px solid #18181b;
        border-radius: 9999px;
        padding: 6px 14px;
        background: #ffffff;
        gap: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .pixel-chat-pill-form:focus-within {
        border-color: #000000;
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
      }
      .pixel-chat-clip-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #18181b;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.85;
        transition: opacity 0.15s ease;
      }
      .pixel-chat-clip-btn:hover {
        opacity: 1;
      }
      .pixel-chat-pill-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14.5px;
        font-family: inherit;
        color: #18181b;
        background: transparent;
        padding: 6px 0;
      }
      .pixel-chat-pill-input::placeholder {
        color: #52525b;
      }
      .pixel-chat-send-pill-btn {
        background: #000000;
        color: #ffffff;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .pixel-chat-send-pill-btn:hover {
        transform: scale(1.08);
        background: #2563eb;
      }

      /* Conversation View (Active messaging state) */
      .pixel-chat-conv-view {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 280px;
        max-height: 360px;
        margin-bottom: 16px;
      }
      .pixel-chat-conv-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid #e4e4e7;
        margin-bottom: 12px;
      }
      .pixel-chat-back-btn {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #18181b;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
      }
      .pixel-chat-back-btn:hover {
        background: #f4f4f5;
      }
      .pixel-chat-conv-title {
        font-size: 13px;
        font-weight: 700;
        color: #18181b;
      }
      .pixel-chat-messages {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-right: 4px;
      }
      .pixel-msg {
        max-width: 84%;
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.45;
        word-break: break-word;
      }
      .pixel-msg.bot {
        background: #ffffff;
        color: #18181b;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        border: 1px solid #e4e4e7;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      }
      .pixel-msg.user {
        background: #000000;
        color: #ffffff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  // 5. Inject Admin Panel Buttons (Header, Mobile Menu & Floating Pill)
  function injectAdminButtons() {
    const adminUrl = rootPrefix + 'admin/index.html';

    // A. Header Button
    const headerIcons = document.querySelector('.header__icons');
    if (headerIcons && !document.getElementById('header-admin-button')) {
      const adminBtn = document.createElement('a');
      adminBtn.id = 'header-admin-button';
      adminBtn.href = adminUrl;
      adminBtn.className = 'header__admin-btn link focus-inset';
      adminBtn.title = 'Open Store Admin Dashboard';
      adminBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Admin Panel</span>
      `;
      headerIcons.appendChild(adminBtn);
    }

    // B. Mobile Drawer Menu Button
    const menuDrawerNav = document.querySelector('.menu-drawer__menu');
    if (menuDrawerNav && !document.getElementById('drawer-admin-button')) {
      const li = document.createElement('li');
      li.id = 'drawer-admin-button';
      li.innerHTML = `
        <a href="${adminUrl}" class="menu-drawer__menu-item list-menu__item link link--text focus-inset" style="color:#3b82f6;font-weight:700;">
          <svg style="width:16px;height:16px;margin-right:8px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          ADMIN PANEL
        </a>
      `;
      menuDrawerNav.appendChild(li);
    }

    // C. Floating Quick Access Badge removed per user request (kept header button only)
  }

  // 6. Build Live Support Chat Widget (Matches Image 4 Shopify Inbox Design)
  function buildChatWidget() {
    if (document.getElementById('pixel-chat-launcher')) return;

    // Single Chat Launcher Trigger (Matches Image 1 bottom black pill)
    const launcher = document.createElement('div');
    launcher.id = 'pixel-chat-launcher';
    launcher.className = 'pixel-chat-launcher';
    launcher.title = 'Chat with The Pixel Fashion';
    launcher.innerHTML = `
      <svg class="pixel-chat-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <span>Chat</span>
    `;

    // Chat Window Popup (Exact replication of User Screenshot Image 4)
    const chatWindow = document.createElement('div');
    chatWindow.id = 'pixel-chat-window';
    chatWindow.className = 'pixel-chat-window';
    chatWindow.innerHTML = `
      <!-- Top Bar: Sign In Button & Utility Circles -->
      <div class="pixel-chat-topbar">
        <button type="button" class="pixel-chat-signin-btn" id="pixel-chat-signin-btn">Sign in</button>
        <div class="pixel-chat-top-actions">
          <button type="button" class="pixel-chat-circle-action" id="pixel-chat-expand-btn" title="Expand / Popout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button type="button" class="pixel-chat-circle-action" id="pixel-chat-close-btn" title="Minimize chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Body Container -->
      <div class="pixel-chat-body-wrap">
        <!-- Home Showcase View (Matches Image 4) -->
        <div id="pixel-chat-home-view">
          <div class="pixel-chat-hero-section">
            <div class="pixel-chat-greeting-title">
              👋 Hi, message us with any questions.<br>We're happy to help!
            </div>
            <div class="pixel-chat-tilted-cluster">
              <!-- Back Card: Real Madrid Unisex Zipper Hoodie -->
              <div class="pixel-tilted-card card--back" onclick="window.location.href='${rootPrefix}collections/football-hoodies.html'" title="Real Madrid Unisex Zipper Hoodie">
                <div class="card-thumb-wrap">
                  <img src="${rootPrefix}assets/images/zipperfront_1_c88083.png" alt="Real Madrid Unisex Zipper Hoodie">
                </div>
                <div class="card-title-text">Real Madrid Unisex Zipper Hoodie</div>
              </div>
              <!-- Front Card: Portugal Unisex Half Sleeve T-Shirt -->
              <div class="pixel-tilted-card card--front" onclick="window.location.href='${rootPrefix}products/portugal-unisex-half-sleeve-t-shirt.html'" title="Portugal Unisex Half Sleeve T-Shirt">
                <div class="card-thumb-wrap">
                  <img src="${rootPrefix}assets/images/whitefront_38_4afc25.png" alt="Portugal Unisex Half Sleeve T-Shirt">
                </div>
                <div class="card-title-text">Portugal Unisex Half Sleeve T-Shirt</div>
              </div>
            </div>
          </div>

          <div class="pixel-chat-disclaimer">
            Your messages are visible to The Pixel Fashion and to Shopify for the provision and improvement of the services. See <a href="${rootPrefix}pages/terms-and-conditions.html" target="_blank">privacy policy</a>.
          </div>

          <!-- Suggestion Chips matching Image 4 -->
          <div class="pixel-chat-quick-chips">
            <button type="button" class="pixel-chat-chip" data-msg="Track my order">Track my order</button>
            <button type="button" class="pixel-chat-chip" data-msg="What is the Delivery Time?">What is the Delivery Time?</button>
            <button type="button" class="pixel-chat-chip" data-msg="How to get customized items?">How to get customized items?</button>
          </div>
        </div>

        <!-- Active Conversation View (Swapped when user asks or chats) -->
        <div id="pixel-chat-conv-view" class="pixel-chat-conv-view" style="display: none;">
          <div class="pixel-chat-conv-bar">
            <button type="button" class="pixel-chat-back-btn" id="pixel-chat-back-home">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Back</span>
            </button>
            <span class="pixel-chat-conv-title">The Pixel Fashion Support</span>
          </div>
          <div class="pixel-chat-messages" id="pixel-chat-messages"></div>
        </div>
      </div>

      <!-- Bottom Pill Input (Matches Image 4) -->
      <form id="pixel-chat-form" class="pixel-chat-pill-form">
        <button type="button" class="pixel-chat-clip-btn" id="pixel-chat-clip-btn" title="Attach file or design">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        <input type="text" class="pixel-chat-pill-input" id="pixel-chat-input" placeholder="Ask anything..." autocomplete="off">
        <button type="submit" class="pixel-chat-send-pill-btn" title="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(chatWindow);

    // Toggle Chat visibility
    launcher.addEventListener('click', toggleChat);
    document.getElementById('pixel-chat-close-btn').addEventListener('click', toggleChat);

    // Expand / Popout toggle
    const expandBtn = document.getElementById('pixel-chat-expand-btn');
    expandBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('expanded');
    });

    // Sign in action
    document.getElementById('pixel-chat-signin-btn').addEventListener('click', () => {
      const email = prompt("Enter your email or phone to view your order history & save preferences:");
      if (email) {
        alert(`Logged in as ${email}. Your messages will be linked to your account!`);
      }
    });

    // Attachment clip
    document.getElementById('pixel-chat-clip-btn').addEventListener('click', () => {
      const wantWA = confirm("Attach design or image:\n\nWould you like to send your photos, custom artwork, or screenshots directly to our designers on WhatsApp (+92 333 4259294)?");
      if (wantWA) {
        window.open('https://wa.me/923334259294?text=Hi%20The%20Pixel%20Fashion,%20I%20have%20an%20attachment%20/%20custom%20design%20to%20share!', '_blank');
      }
    });

    // Back to home view button
    document.getElementById('pixel-chat-back-home').addEventListener('click', () => {
      document.getElementById('pixel-chat-conv-view').style.display = 'none';
      document.getElementById('pixel-chat-home-view').style.display = 'block';
    });

    // Quick chips click events
    chatWindow.querySelectorAll('.pixel-chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const msg = chip.getAttribute('data-msg');
        if (msg) handleUserMessage(msg);
      });
    });

    // Form submit
    document.getElementById('pixel-chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('pixel-chat-input');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserMessage(text);
    });

    // Continuously safeguard that any shopify-chat custom elements are suppressed
    document.querySelectorAll('shopify-chat').forEach(el => {
      el.style.display = 'none';
      el.setAttribute('hidden', '');
    });
  }

  function toggleChat() {
    const chatWin = document.getElementById('pixel-chat-window');
    if (!chatWin) return;
    chatWin.classList.toggle('active');
  }

  function showConversationView() {
    const homeView = document.getElementById('pixel-chat-home-view');
    const convView = document.getElementById('pixel-chat-conv-view');
    if (homeView && convView) {
      homeView.style.display = 'none';
      convView.style.display = 'flex';
    }
  }

  function appendChatMessage(text, sender) {
    showConversationView();
    const messages = document.getElementById('pixel-chat-messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = `pixel-msg ${sender}`;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleUserMessage(text) {
    appendChatMessage(text, 'user');
    
    // Auto-respond logic based on Pakistani street fashion inquiries
    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes('delivery') || lower.includes('time') || lower.includes('when')) {
        appendChatMessage(`🚚 <strong>Delivery Timeline:</strong><br><br>• Major Cities (Lahore, Karachi, Islamabad/Rawalpindi): <strong>2 to 3 working days</strong>.<br>• Rest of Pakistan: <strong>3 to 5 working days</strong>.<br><br>All orders include <strong>Free Cash on Delivery (COD)</strong>!`, 'bot');
      } else if (lower.includes('custom') || lower.includes('items') || lower.includes('design')) {
        appendChatMessage(`🎨 <strong>Customized T-Shirts & Hoodies:</strong><br><br>We print custom DTF and screen printed designs! Send your graphic, name, anime artwork, or jersey number to our design team on WhatsApp:<br><br><a href="https://wa.me/923334259294?text=Hi%20The%20Pixel%20Fashion,%20I%20want%20to%20order%20a%20custom%20item" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:4px;">💬 Chat with Designer on WhatsApp</a>`, 'bot');
      } else if (lower.includes('track') || lower.includes('order')) {
        let orders = [];
        try {
          orders = JSON.parse(localStorage.getItem('pixel_orders')) || [];
        } catch(e) {}
        
        if (orders.length > 0) {
          const latest = orders[0];
          appendChatMessage(`📦 <strong>Order Tracking Found:</strong><br><br>Order: <strong>#${latest.id}</strong><br>Items: ${latest.items}<br>Total: <strong>Rs. ${Number(latest.total).toLocaleString()}</strong><br>Status: <span style="display:inline-block;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:9999px;font-size:12px;font-weight:700;">${latest.status}</span><br><br>Need dispatch live updates? <a href="https://wa.me/923334259294?text=Hi%20The%20Pixel%20Fashion,%20checking%20status%20for%20order%20${latest.id}" target="_blank" style="color:#2563eb;font-weight:700;text-decoration:underline;">Click to track on WhatsApp</a>.`, 'bot');
        } else {
          appendChatMessage(`📦 <strong>Track Your Order:</strong><br><br>Please enter your <strong>Order ID</strong> (e.g. #PX-1049) or WhatsApp us at <strong>+92 333 4259294</strong> with your phone number and we will instantly give you tracking details!`, 'bot');
        }
      } else if (lower.includes('size') || lower.includes('chart') || lower.includes('fitting')) {
        appendChatMessage(`📏 <strong>Size Guide:</strong><br><br>• Small: 38" chest, 27" length<br>• Medium: 40" chest, 28" length<br>• Large: 42" chest, 29" length<br>• XL: 44" chest, 30" length<br>• XXL: 46" chest, 31" length<br><br>Our oversized t-shirts have a relaxed drop shoulder silhouette!`, 'bot');
      } else {
        appendChatMessage(`👋 Thanks for reaching out! Our team is available online to assist you.<br><br>Feel free to message here or get instant assistance on WhatsApp:<br><br><a href="https://wa.me/923334259294?text=${encodeURIComponent(text)}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:700;">💬 Chat on WhatsApp (+92 333 4259294)</a>`, 'bot');
      }
    }, 380);
  }

  function openWhatsApp(msg = "Hi The Pixel Fashion, I'd like to ask a question") {
    window.open(`https://wa.me/923334259294?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // 7. Build Cart Drawer HTML & Modals
  function buildCartUI() {
    if (document.getElementById('pixel-cart-drawer')) return;

    // Cart Drawer Markup
    const drawerHTML = `
      <div id="pixel-cart-overlay" class="pixel-cart-drawer-overlay"></div>
      <div id="pixel-cart-drawer" class="pixel-cart-drawer">
        <div class="pixel-cart-header">
          <h2 class="pixel-cart-title">Your Cart</h2>
          <button class="pixel-cart-close" id="pixel-cart-close-btn">&times;</button>
        </div>
        <div class="pixel-cart-body" id="pixel-cart-items-container">
          <!-- Injected via JS -->
        </div>
        <div class="pixel-cart-footer">
          <div class="pixel-cart-subtotal">
            <span>Subtotal:</span>
            <span id="pixel-cart-total-amount">Rs. 0</span>
          </div>
          <button class="pixel-checkout-btn" id="pixel-open-checkout-btn">
            Proceed to Cash on Delivery (COD)
          </button>
        </div>
      </div>

      <!-- Checkout Modal -->
      <div id="pixel-checkout-modal" class="pixel-modal-backdrop">
        <div class="pixel-modal-card">
          <div class="pixel-modal-header">
            <h3 style="font-size:1.6rem;font-weight:700;margin:0;">Cash on Delivery Checkout</h3>
            <button class="pixel-cart-close" id="pixel-close-checkout-btn">&times;</button>
          </div>
          <form id="pixel-checkout-form">
            <div class="pixel-modal-body">
              <div class="pixel-input-group">
                <label>Full Name *</label>
                <input type="text" id="cust-name" placeholder="e.g. Ali Ahmed" required>
              </div>
              <div class="pixel-input-group">
                <label>WhatsApp / Phone Number *</label>
                <input type="tel" id="cust-phone" placeholder="e.g. 03001234567" required>
              </div>
              <div class="pixel-input-group">
                <label>City *</label>
                <input type="text" id="cust-city" placeholder="e.g. Lahore, Karachi, Islamabad" required>
              </div>
              <div class="pixel-input-group">
                <label>Delivery Address *</label>
                <textarea id="cust-address" rows="2" placeholder="House/Street/Area" required></textarea>
              </div>
              <div style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:1.25rem;color:#4b5563;">
                🚚 <strong>Free Cash on Delivery</strong> across Pakistan. Pay when your parcel arrives!
              </div>
            </div>
            <div style="padding:16px 24px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:10px;">
              <button type="button" class="pixel-qty-btn" style="width:auto;padding:8px 16px;height:auto;" id="pixel-cancel-order-btn">Cancel</button>
              <button type="submit" class="pixel-checkout-btn" style="width:auto;padding:10px 22px;">Confirm Order (Rs. <span id="checkout-order-total">0</span>)</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = drawerHTML;
    document.body.appendChild(container);

    // Wire events
    document.getElementById('pixel-cart-close-btn').addEventListener('click', closeCartDrawer);
    document.getElementById('pixel-cart-overlay').addEventListener('click', closeCartDrawer);
    document.getElementById('pixel-open-checkout-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('pixel-close-checkout-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('pixel-cancel-order-btn').addEventListener('click', closeCheckoutModal);

    // Form submit
    document.getElementById('pixel-checkout-form').addEventListener('submit', handleCheckoutSubmit);

    // Wire Cart Icon Trigger in Header
    document.querySelectorAll('#cart-icon-bubble, a[href$="/cart"], a[href$="cart.html"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });
  }

  function renderCartDrawer() {
    const cart = getCart();
    const container = document.getElementById('pixel-cart-items-container');
    const totalEl = document.getElementById('pixel-cart-total-amount');
    const checkoutTotalEl = document.getElementById('checkout-order-total');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:48px 16px;color:#6b7280;">
          <svg style="width:48px;height:48px;margin-bottom:12px;color:#9ca3af;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p style="font-size:1.5rem;font-weight:600;margin-bottom:6px;color:#111827;">Your cart is empty</p>
          <p style="font-size:1.25rem;">Explore our street apparel and add your favorite designs!</p>
        </div>
      `;
      totalEl.innerText = 'Rs. 0';
      if (checkoutTotalEl) checkoutTotalEl.innerText = '0';
      document.getElementById('pixel-open-checkout-btn').style.display = 'none';
      return;
    }

    document.getElementById('pixel-open-checkout-btn').style.display = 'block';
    let html = '';
    cart.forEach((item, idx) => {
      html += `
        <div class="pixel-cart-item">
          <img src="${item.image}" class="pixel-cart-item-img" alt="${item.title}" onerror="this.src='${rootPrefix}assets/images/THE_PIXEL_FASHION_3_1d7deb.png'">
          <div class="pixel-cart-item-details">
            <div class="pixel-cart-item-title">${item.title}</div>
            <div class="pixel-cart-item-variant">Size: <strong>${item.size || 'M'}</strong></div>
            <div class="pixel-cart-item-price">Rs. ${Number(item.price).toLocaleString()}</div>
            <div class="pixel-cart-item-actions">
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="pixel-qty-btn" onclick="window.PixelStore.changeQty(${idx}, -1)">-</button>
                <span style="font-weight:700;font-size:1.3rem;">${item.quantity}</span>
                <button class="pixel-qty-btn" onclick="window.PixelStore.changeQty(${idx}, 1)">+</button>
              </div>
              <button class="pixel-cart-remove-btn" onclick="window.PixelStore.removeItem(${idx})">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    const total = getCartTotal();
    totalEl.innerText = 'Rs. ' + total.toLocaleString();
    if (checkoutTotalEl) checkoutTotalEl.innerText = total.toLocaleString();
  }

  function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('pixel-cart-overlay')?.classList.add('active');
    document.getElementById('pixel-cart-drawer')?.classList.add('active');
  }

  function closeCartDrawer() {
    document.getElementById('pixel-cart-overlay')?.classList.remove('active');
    document.getElementById('pixel-cart-drawer')?.classList.remove('active');
  }

  function openCheckoutModal() {
    closeCartDrawer();
    document.getElementById('pixel-checkout-modal').style.display = 'flex';
  }

  function closeCheckoutModal() {
    document.getElementById('pixel-checkout-modal').style.display = 'none';
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const cart = getCart();

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderId = 'PX-' + Math.floor(1000 + Math.random() * 9000);
    const itemsSummary = cart.map(i => `${i.title} (${i.size}) x ${i.quantity}`).join(', ');
    const total = getCartTotal();

    const newOrder = {
      id: orderId,
      customer: name,
      phone: phone,
      city: `${city}, ${address}`,
      items: itemsSummary,
      total: total,
      status: "Pending",
      payment: "COD",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('pixel_orders')) || [];
    } catch(err) {
      orders = [];
    }
    orders.unshift(newOrder);
    localStorage.setItem('pixel_orders', JSON.stringify(orders));

    saveCart([]);
    closeCheckoutModal();

    alert(`🎉 Congratulations ${name}!\n\nYour order #${orderId} has been confirmed via Cash on Delivery!\n\nTotal: Rs. ${total.toLocaleString()}\n\nYou can also view this order instantly in the Admin Panel.`);
  }

  // 8. Enhance Product Detail Page (Add to Cart, Variants, Gallery)
  function enhanceProductPage() {
    const isProductPage = window.location.pathname.includes('/products/');
    if (!isProductPage) return;

    let selectedSize = 'M';
    const variantRadios = document.querySelectorAll('input[type="radio"][name*="Size"], input[type="radio"][name*="size"], fieldset input[type="radio"]');
    variantRadios.forEach(radio => {
      if (radio.checked) selectedSize = radio.value;
      radio.addEventListener('change', () => {
        selectedSize = radio.value;
      });
    });

    const qtyInput = document.querySelector('input.quantity__input');
    const plusBtn = document.querySelector('button[name="plus"]');
    const minusBtn = document.querySelector('button[name="minus"]');

    if (plusBtn && qtyInput) {
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        qtyInput.value = parseInt(qtyInput.value || 1) + 1;
      });
    }
    if (minusBtn && qtyInput) {
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cur = parseInt(qtyInput.value || 1);
        if (cur > 1) qtyInput.value = cur - 1;
      });
    }

    const addForms = document.querySelectorAll('form[action*="/cart/add"], form[action*="cart"]');
    addForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pageTitle = document.querySelector('h1')?.innerText?.trim() || "The Pixel Fashion T-Shirt";
        const priceText = document.querySelector('.price-item--regular')?.innerText?.replace(/[^0-9]/g, '') || "1899";
        const price = parseInt(priceText) || 1899;
        const mainImg = document.querySelector('.product__media img')?.src || (rootPrefix + 'assets/images/THE_PIXEL_FASHION_3_1d7deb.png');
        const qty = parseInt(qtyInput?.value || 1);

        addToCart({
          title: pageTitle,
          price: price,
          size: selectedSize,
          image: mainImg,
          quantity: qty
        });
      });
    });

    const thumbnails = document.querySelectorAll('.thumbnail-list__item button, .thumbnail[data-target], .product__media-list li');
    const mainMediaImg = document.querySelector('.product__media img');
    if (thumbnails.length && mainMediaImg) {
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          const img = thumb.querySelector('img');
          if (img && img.src) {
            mainMediaImg.src = img.src;
          }
        });
      });
    }
  }

  function getFullCatalog() {
    let prods = [...CATALOG];
    try {
      const stored = JSON.parse(localStorage.getItem('pixel_products')) || [];
      stored.forEach(sp => {
        const handle = sp.handle || (sp.slug ? sp.slug.replace('products/', '').replace('.html', '') : sp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        const existingIdx = prods.findIndex(p => p.title.toLowerCase() === sp.title.toLowerCase());
        const imgPath = sp.image ? (sp.image.startsWith('http') ? sp.image : rootPrefix + sp.image.replace(/^\.\.\//, '')) : (rootPrefix + 'assets/images/THE_PIXEL_FASHION_3_1d7deb.png');
        const item = {
          title: sp.title,
          category: sp.category || 'Apparel',
          price: Number(sp.price) || 1899,
          comparePrice: Number(sp.comparePrice) || 2499,
          image: imgPath,
          url: rootPrefix + `products/${handle}.html`
        };
        if (existingIdx > -1) {
          prods[existingIdx] = item;
        } else {
          prods.unshift(item);
        }
      });
    } catch(e) {}
    return prods;
  }

  // 9. Enhance Storefront Search
  function enhanceSearch() {
    const searchInputs = document.querySelectorAll('#Search-In-Modal, input[name="q"]');
    searchInputs.forEach(input => {
      let resultsBox = null;
      
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (!resultsBox) {
          resultsBox = document.createElement('div');
          resultsBox.className = 'pixel-search-results';
          input.parentNode.appendChild(resultsBox);
        }

        if (query.length < 2) {
          resultsBox.style.display = 'none';
          return;
        }

        const matches = getFullCatalog().filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          resultsBox.innerHTML = `<div style="padding:12px;color:#6b7280;text-align:center;">No designs found for "${query}"</div>`;
          resultsBox.style.display = 'block';
          return;
        }

        let html = '';
        matches.slice(0, 5).forEach(m => {
          html += `
            <a href="${m.url}" class="pixel-search-item">
              <img src="${m.image}" class="pixel-search-thumb" alt="${m.title}" onerror="this.src='${rootPrefix}assets/images/THE_PIXEL_FASHION_3_1d7deb.png'">
              <div>
                <div style="font-weight:600;font-size:1.3rem;">${m.title}</div>
                <div style="font-size:1.2rem;color:#2563eb;font-weight:700;">Rs. ${m.price.toLocaleString()}</div>
              </div>
            </a>
          `;
        });

        resultsBox.innerHTML = html;
        resultsBox.style.display = 'block';
      });
    });
  }

  // 10. Announcement Bar Autoplay & Controls
  function enhanceAnnouncementBar() {
    const slides = document.querySelectorAll('.announcement-bar-slider .slideshow__slide');
    if (!slides.length) return;

    let current = 0;
    function showSlide(index) {
      slides.forEach((s, idx) => {
        s.style.display = idx === index ? 'block' : 'none';
      });
    }

    showSlide(current);

    const prevBtn = document.querySelector('.slider-button--prev');
    const nextBtn = document.querySelector('.slider-button--next');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
    }

    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 4500);
  }

  // 11. Footer Newsletter feedback
  function enhanceNewsletter() {
    const newsletterForms = document.querySelectorAll('form[action*="contact"], .newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          alert(`🎉 Thank you for subscribing to The Pixel Fashion VIP drops with ${input.value}!`);
          input.value = '';
        }
      });
    });
  }

  // Public methods on window
  window.PixelStore = {
    addToCart,
    removeItem: removeFromCart,
    changeQty: updateItemQuantity,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    openChat: toggleChat,
    openWhatsAppChat: () => openWhatsApp(),
    sendQuickChat: (msg) => handleUserMessage(msg)
  };

  // Bootstrap when DOM is ready
  function init() {
    injectStyles();
    injectAdminButtons();
    buildChatWidget();
    buildCartUI();
    updateCartBadge();
    enhanceProductPage();
    enhanceSearch();
    enhanceAnnouncementBar();
    enhanceNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
