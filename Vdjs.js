/**
 * =============================================
 * MAIN CART FUNCTIONALITY - Xử lý giỏ hàng chính
 * =============================================
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // USER AUTH & NAVIGATION - Xác thực người dùng và điều hướng
    // =============================================
    
    // Update navigation based on login status
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const navProfile = document.getElementById('nav-profile');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navLogout = document.getElementById('nav-logout');

    if (loggedInUser) {
        if (navProfile) navProfile.style.display = 'block';
        if (navLogout) navLogout.style.display = 'block';
        if (navLogin) navLogin.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
    } else {
        if (navProfile) navProfile.style.display = 'none';
        if (navLogout) navLogout.style.display = 'none';
        if (navLogin) navLogin.style.display = 'block';
        if (navRegister) navRegister.style.display = 'block';
    }

    // Logout functionality
    if (navLogout) {
        navLogout.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            // Using a custom alert if available, otherwise fallback to standard alert
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi tài khoản.', () => {
                     window.location.href = 'index.html';
                });
            } else {
                alert('Bạn đã đăng xuất thành công.');
                window.location.href = 'index.html';
            }
        });
    }

    // =============================================
    // DROPDOWN MENUS - Xử lý menu dropdown
    // =============================================

    // User dropdown toggle
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function(event) {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                // Toggle display
                const isVisible = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isVisible ? 'none' : 'block';
                event.stopPropagation();
            }
        });
    }
    
    // Cart dropdown toggle
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartDropdownMenu = document.querySelector('.cart-dropdown-menu');
    if(cartDropdown) {
        cartDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            if(cartDropdownMenu) cartDropdownMenu.classList.toggle('show');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-dropdown .dropdown-menu');
        if (userMenu && !userDropdown.contains(event.target)) {
            userMenu.style.display = 'none';
        }
        
        const cartMenu = document.querySelector('.cart-dropdown-menu');
        if (cartMenu && !cartDropdown.contains(event.target)) {
            cartMenu.classList.remove('show');
        }
    });

    // =============================================
    // CART FUNCTIONALITY - Xử lý giỏ hàng
    // =============================================
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountElement = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    
    function updateCartUI() {
        if (!cartItemsContainer || !cartCountElement || !totalPriceElement) return;

        let cartCount = 0;
        let cartTotal = 0;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Giỏ hàng trống</div>';
        } else {
            cart.forEach(item => {
                cartCount += item.quantity;
                cartTotal += item.price * item.quantity;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} ₫</div>
                        <div class="cart-item-quantity">
                            <button class="decrease-qty" data-name="${item.name}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-qty" data-name="${item.name}">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        
        cartCountElement.textContent = cartCount;
        totalPriceElement.textContent = cartTotal.toLocaleString() + ' ₫';
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        animateCartCounter();
    }

    function updateQuantity(productName, change) {
        const product = cart.find(item => item.name === productName);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                cart = cart.filter(item => item.name !== productName);
            }
        }
        updateCartUI();
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const product = {
                img: productCard.querySelector('img').src,
                name: productCard.querySelector('h3').textContent,
                price: parseInt(productCard.querySelector('.price').textContent.replace(/\D/g, '')),
            };
            addToCart(product);
        });
    });

    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('increase-qty')) {
            updateQuantity(e.target.dataset.name, 1);
        }
        if (e.target.classList.contains('decrease-qty')) {
            updateQuantity(e.target.dataset.name, -1);
        }
    });

    function animateCartCounter() {
        if(cartCountElement) {
            cartCountElement.classList.add('updated');
            setTimeout(() => {
                cartCountElement.classList.remove('updated');
            }, 500);
        }
    }

    // Initial Cart UI update
    updateCartUI();

    // =============================================
    // PRODUCT DETAIL MODAL FUNCTIONALITY
    // =============================================
    
    const modal = document.getElementById('product-detail-modal');
    if(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const detailLinks = document.querySelectorAll('.product-card .description');

        detailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const card = this.closest('.product-card');
                const productName = card.querySelector('h3').textContent;
                const productImgSrc = card.querySelector('img').src;
                const productDescription = card.dataset.description;

                modal.querySelector('#modal-product-name').textContent = productName;
                modal.querySelector('#modal-product-img').src = productImgSrc;
                modal.querySelector('#modal-product-description').textContent = productDescription;
                
                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // =============================================
    // PRODUCT SEARCH FUNCTIONALITY - Chức năng tìm kiếm sản phẩm
    // =============================================

    const searchInput = document.getElementById('product-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const productCards = document.querySelectorAll('.all-products-grid .product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // =============================================
    // OTHER FUNCTIONALITIES - Các chức năng khác
    // =============================================
    
    // Smooth scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});