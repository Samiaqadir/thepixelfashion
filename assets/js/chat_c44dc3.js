/**
 * The Pixel Fashion — Native Chat Adapter
 * Neutralizes legacy Shopify Inbox launcher to prevent duplicate launcher buttons
 */
(function() {
  'use strict';
  // Define custom element if not defined so <shopify-chat> tags remain inert & hidden
  if (typeof customElements !== 'undefined' && !customElements.get('shopify-chat')) {
    customElements.define('shopify-chat', class extends HTMLElement {
      connectedCallback() {
        this.style.display = 'none';
        this.setAttribute('hidden', '');
      }
    });
  }
})();
