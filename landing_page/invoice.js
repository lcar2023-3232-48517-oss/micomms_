document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    console.log('🔍 Order ID:', orderId);
    
    fetch(`./get_invoice_data.php?order_id=${orderId}`)
    .then(response => response.json())
    .then(data => {
        console.log('✅ FULL DATA:', data); // ← SEE EXACT DATA
        
        // Fill ALL fields
        document.getElementById('invoiceTitle').textContent = `Invoice #${data.order?.order_id || 'N/A'}`;
        document.getElementById('orderId').textContent = `#${data.order?.order_id || 'N/A'}`;
        document.getElementById('orderDate').textContent = data.order?.order_date || 'N/A';
        document.getElementById('orderTotal').textContent = `₱${data.order?.order_total || 0}`;
        
        // DEBUG: Check if these elements exist
        console.log('sellerName element:', document.getElementById('sellerName'));
        console.log('clientName element:', document.getElementById('clientName'));
        
        // Fill names (safe fallback)
        document.getElementById('sellerName').textContent = data.seller_name || 'MiCOMMS Store';
        document.getElementById('sellerEmail').textContent = data.seller_email || 'support.center@micomms.co';
        document.getElementById('clientName').textContent = data.client_name || `User #${data.order.user_id}`;
        document.getElementById('clientEmail').textContent = data.client_email || 'user@micomms.com';
        document.getElementById('grandTotal').textContent = `₱${data.order?.order_total || 0}`;
        
        // Items
        const itemsContainer = document.getElementById('orderItems');
        if (data.items && data.items.length > 0) {
            itemsContainer.innerHTML = data.items.map(item => `
                <div class="item" style="color: var(--green-color); font-weight: 600;">
                    <span>${item.product_name || `Product #${item.product_id}`} × ${item.order_item_quantity}</span>
                    <span>₱${parseFloat(item.order_item_price_each).toLocaleString()} = ₱${parseFloat(item.order_item_subtotal).toLocaleString()}</span>
                </div>
            `).join('');
        }
        
        console.log('✅ INVOICE LOADED!');
    })
    .catch(error => {
        console.error('❌ ERROR:', error);
    });
});
