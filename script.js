document.addEventListener('DOMContentLoaded', () => {

    // --- ФУНКЦИИ КОРЗИНЫ ---
    function getCart() {
        const cartJson = localStorage.getItem('xa0_shop_cart');
        return cartJson ? JSON.parse(cartJson) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('xa0_shop_cart', JSON.stringify(cart));
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

    function addToCart(productDetails) {
        const cart = getCart();
        const existingItemIndex = cart.findIndex(item =>
            item.name === productDetails.name && item.size === productDetails.size
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({...productDetails, quantity: 1});
        }
        saveCart(cart);
    }

    // --- ФУНКЦИЯ КАСТОМНОГО УВЕДОМЛЕНИЯ ---
    const notificationPopup = document.getElementById('notification-popup');
    function showCustomNotification(message) {
        notificationPopup.textContent = message;
        notificationPopup.classList.add('show');

        setTimeout(() => {
            notificationPopup.classList.remove('show');
        }, 2000);
    }


    // --- 1. Mobile Menu Toggle (Hamburger) ---
    const header = document.querySelector('header');
    header.insertAdjacentHTML('beforeend', '<div class="menu-toggle">☰</div>');
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    // --- 2. Auth Modal Logic (ИСПРАВЛЕНО) ---
    const authModalContainer = document.getElementById('authModal');
    const loginLink = document.getElementById('loginLink');
    const closeAuthButton = document.querySelector('.close-auth-button');
    const showLoginButton = document.getElementById('showLogin');
    const showRegisterButton = document.getElementById('showRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModalContainer.style.display = 'flex';
        setTimeout(() => authModalContainer.classList.add('is-visible'), 10);
        // При открытии всегда показываем форму Входа по умолчанию
        showLoginForm();
    });

    function closeAuthModal() {
        authModalContainer.classList.remove('is-visible');
        setTimeout(() => { authModalContainer.style.display = "none"; }, 300);
    }
    closeAuthButton.addEventListener('click', closeAuthModal);

    // Новые функции для переключения форм
    function showLoginForm() {
        loginForm.classList.add('visible');
        registerForm.classList.remove('visible');
        showLoginButton.classList.add('active');
        showRegisterButton.classList.remove('active');
    }

    function showRegisterForm() {
        registerForm.classList.add('visible');
        loginForm.classList.remove('visible');
        showRegisterButton.classList.add('active');
        showLoginButton.classList.remove('active');
    }

    // Обработчики кнопок переключения
    showLoginButton.addEventListener('click', showLoginForm);
    showRegisterButton.addEventListener('click', showRegisterForm);


    // --- 3. Promo Modal Logic (Telegram) ---
    const promoModalContainer = document.getElementById('telegramPromoModal');
    const closePromoButton = document.querySelector('.close-promo-button');

    function openPromoModal() {
        if (!sessionStorage.getItem('promoShown')) {
            setTimeout(() => {
                promoModalContainer.style.display = 'flex';
                setTimeout(() => promoModalContainer.classList.add('is-visible'), 10);
                sessionStorage.setItem('promoShown', 'true');
            }, 3000);
        }
    }
    function closePromoModal() {
        promoModalContainer.classList.remove('is-visible');
        setTimeout(() => { promoModalContainer.style.display = "none"; }, 300);
    }
    window.addEventListener('load', openPromoModal);
    closePromoButton.addEventListener('click', closePromoModal);


    // --- 4. Product Modals & Cart Logic ---
    const productItems = document.querySelectorAll('.product-item');
    const productModalContainer = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const closeProductModal = document.querySelector('#productModal .close-button');
    const sizeOptionsContainer = document.querySelector(".size-options");

    function openProductModal(event) {
        const item = event.currentTarget;
        const name = item.getAttribute('data-name');
        const price = item.getAttribute('data-price');
        const imageSrc = item.getAttribute('data-image');
        const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

        modalImage.src = imageSrc;
        modalName.textContent = name;
        modalPrice.textContent = "Цена: " + price + " руб.";

        sizeOptionsContainer.innerHTML = '';
        availableSizes.forEach(size => {
            const button = document.createElement('button');
            button.classList.add('size-btn');
            button.textContent = size;
            button.addEventListener('click', selectSize);
            sizeOptionsContainer.appendChild(button);
        });

        productModalContainer.style.display = 'flex';
        setTimeout(() => productModalContainer.classList.add('is-visible'), 10);
    }

    function selectSize(event) {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    function closeProductModalFunc() {
        productModalContainer.classList.remove('is-visible');
        setTimeout(() => { productModalContainer.style.display = "none"; }, 300);
    }

    productItems.forEach(item => { item.addEventListener('click', openProductModal); });
    closeProductModal.addEventListener('click', closeProductModalFunc);

    window.addEventListener('click', (event) => {
        if (event.target == authModalContainer) { closeAuthModal(); }
        if (event.target == promoModalContainer) { closePromoModal(); }
        if (event.target == productModalContainer) { closeProductModalFunc(); }
    });

    const addToCartButton = document.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", () => {
        const selectedSizeBtn = document.querySelector('.size-btn.active');
        if (!selectedSizeBtn) {
            showCustomNotification("Пожалуйста, выберите размер.");
            return;
        }

        const priceText = document.getElementById('modalPrice').textContent;
        const priceMatch = priceText.match(/Цена: (\d+) руб\./);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        const productDetails = {
            name: modalName.textContent,
            price: price,
            size: selectedSizeBtn.textContent,
            image: modalImage.src
        };

        addToCart(productDetails);
        showCustomNotification("Успешно добавлено в корзину!");
        closeProductModalFunc();
    });

    // --- JS ДЛЯ НОВОГОДНЕГО ВАЙБА (СНЕГОПАД) ---
    const MAX_SNOWFLAKES = 40;
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '·';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 10 + 5 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = Math.random() * 15 + 10 + 'px';
        document.body.appendChild(snowflake);
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            if (document.querySelectorAll('.snowflake').length < MAX_SNOWFLAKES) { createSnowflake(); }
        });
    }

    window.addEventListener('load', () => {
        updateCartCount();
        if (window.innerWidth > 768) {
             for (let i = 0; i < MAX_SNOWFLAKES; i++) {
                setTimeout(createSnowflake, Math.random() * 5000);
            }
        }
    });
});
