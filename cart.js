document.addEventListener('DOMContentLoaded', () => {
    // --- ФУНКЦИИ КОРЗИНЫ ---

    function showCustomNotification(message) {
        console.log("УВЕДОМЛЕНИЕ:", message);
        // alert(message); // <- Закомментировано, чтобы не было системного уведомления
    }

    function getCart() {
        const cartJson = localStorage.getItem('xa0_shop_cart');
        return cartJson ? JSON.parse(cartJson) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('xa0_shop_cart', JSON.stringify(cart));
        renderCart(); // Перерисовываем корзину после изменения
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            countElement.textContent = totalItems;
        }
    }

    function removeFromCart(productName, productSize) {
        let cart = getCart();
        cart = cart.filter(item => !(item.name === productName && item.size === productSize));
        saveCart(cart);
    }

    function renderCart() {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('empty-cart-message');
        const summary = document.querySelector('.cart-summary');
        let totalPrice = 0;

        container.innerHTML = '';

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            summary.style.display = 'none';
            return;
        } else {
            emptyMessage.style.display = 'none';
            summary.style.display = 'block';
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const itemHtml = document.createElement('div');
            itemHtml.classList.add('cart-item-row');
            itemHtml.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 100px; object-fit: cover;">
                <div class="item-details">
                    <p><strong>${item.name}</strong></p>
                    <p>Размер: ${item.size}</p>
                    <p>Цена: ${item.price} руб. x ${item.quantity}</p>
                </div>
                <p class="item-total">Всего: ${itemTotal} руб.</p>
                <button class="remove-item-btn" data-name="${item.name}" data-size="${item.size}">&times;</button>
            `;
            container.appendChild(itemHtml);
        });

        document.getElementById('cart-total-price').textContent = `${totalPrice} руб.`;

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const size = e.target.getAttribute('data-size');
                removeFromCart(name, size);
            });
        });
    }

    document.getElementById('checkout-button').addEventListener('click', () => {
        showCustomNotification('Заказ оформлен (имитация). Спасибо за покупку в XA0.shop!');
        localStorage.removeItem('xa0_shop_cart'); // Очищаем корзину
        renderCart();
    });

    updateCartCount();
    renderCart();
});
