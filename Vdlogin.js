document.addEventListener('DOMContentLoaded', function() {

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.color = '#ff4757';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        input.style.borderColor = '#ff4757';
        input.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.2)';

        setTimeout(() => {
            errorElement.textContent = '';
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        }, 3000);
    }

    function showCustomAlert(title, message) {
        const customAlert = document.getElementById('customAlert');
        const customAlertBox = customAlert.querySelector('.custom-alert-box');
        const customAlertTitle = document.getElementById('customAlertTitle');
        const customAlertMessage = document.getElementById('customAlertMessage');
        const customAlertBtn = document.getElementById('customAlertBtn');

        customAlertBox.classList.add('error'); // Add error class for styling
        customAlertTitle.textContent = title;
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';

        customAlertBtn.onclick = function() {
            customAlert.style.display = 'none';
            customAlertBox.classList.remove('error'); // Clean up class
        };
    }

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (email === '') {
                showError('login-email', 'Please enter your email.');
                return;
            }
            if (password === '') {
                showError('login-password', 'Please enter your password.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                showCustomAlert('Login failed', 'Incorrect email or password. Please try again.');
            }
        });
    }
});