document.addEventListener('DOMContentLoaded', function() {
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        // Cập nhật regex để hỗ trợ nhiều đầu số hơn
        const re = /(84|0[1-9])+([0-9]{8})\b/;
        return re.test(phone);
    }
    
    function validateName(name) {
        // Kiểm tra tên có ít nhất 2 từ, mỗi từ ít nhất 2 ký tự
        const nameParts = name.trim().split(/\s+/);
        if (nameParts.length < 2) {
            return { isValid: false, message: 'Full name must have at least 2 words' };
        }
        
        for (let part of nameParts) {
            if (part.length < 2) {
                return { isValid: false, message: 'Each word in the full name must have at least 2 characters' };
            }
            // Kiểm tra không chứa ký tự đặc biệt hoặc số
            if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(part)) {
                return { isValid: false, message: 'Full name can only contain letters and spaces' };
            }
        }
        
        return { isValid: true, message: '' };
    }
    
    function validatePassword(password) {
        const errors = [];
        
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least 1 uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least 1 lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least 1 number');
        }
        
        if (errors.length > 0) {
            return { isValid: false, message: errors.join(', ') };
        }
        
        return { isValid: true, message: '' };
    }
    
    function validateEmailDomain(email) {
        const domain = email.split('@')[1];
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com'];
        return commonDomains.includes(domain.toLowerCase());
    }
    
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
        }, 5000); // Tăng thời gian hiển thị lỗi lên 5 giây
    }
    
    function showSuccess(inputId) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        let successElement = formGroup.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            formGroup.appendChild(successElement);
        }
        successElement.textContent = '✓ Valid';
        successElement.style.color = '#28a745';
        successElement.style.fontSize = '14px';
        successElement.style.marginTop = '5px';
        input.style.borderColor = '#28a745';
        input.style.boxShadow = '0 0 0 2px rgba(40, 167, 69, 0.2)';
        setTimeout(() => {
            successElement.textContent = '';
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        }, 3000);
    }

    function showCustomAlert(title, message, callback) {
        const customAlert = document.getElementById('customAlert');
        const customAlertTitle = document.getElementById('customAlertTitle');
        const customAlertMessage = document.getElementById('customAlertMessage');
        const customAlertBtn = document.getElementById('customAlertBtn');

        customAlertTitle.textContent = title;
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';

        customAlertBtn.onclick = function() {
            customAlert.style.display = 'none';
            if (callback) {
                callback();
            }
        };
    }
    
    // Real-time validation
    function setupRealTimeValidation() {
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const phoneInput = document.getElementById('reg-phone');
        const passwordInput = document.getElementById('reg-password');
        const confirmPasswordInput = document.getElementById('reg-confirm-password');
        
        // Validation cho tên
        nameInput.addEventListener('blur', function() {
            const name = this.value.trim();
            if (name !== '') {
                const nameValidation = validateName(name);
                if (nameValidation.isValid) {
                    showSuccess('reg-name');
                } else {
                    showError('reg-name', nameValidation.message);
                }
            }
        });
        
        // Validation cho email
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email !== '') {
                if (!validateEmail(email)) {
                    showError('reg-email', 'Please enter a valid email');
                } else if (!validateEmailDomain(email)) {
                    showError('reg-email', 'Email domain is not supported');
                } else {
                    showSuccess('reg-email');
                }
            }
        });
        
        // Validation cho số điện thoại
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone !== '') {
                if (!validatePhone(phone)) {
                    showError('reg-phone', 'Please enter a valid phone number');
                } else {
                    showSuccess('reg-phone');
                }
            }
        });
        
        // Validation cho mật khẩu
        passwordInput.addEventListener('blur', function() {
            const password = this.value;
            if (password !== '') {
                const passwordValidation = validatePassword(password);
                if (passwordValidation.isValid) {
                    showSuccess('reg-password');
                } else {
                    showError('reg-password', passwordValidation.message);
                }
            }
        });
        
        // Validation cho xác nhận mật khẩu
        confirmPasswordInput.addEventListener('blur', function() {
            const confirmPassword = this.value;
            const password = passwordInput.value;
            if (confirmPassword !== '') {
                if (confirmPassword !== password) {
                    showError('reg-confirm-password', 'Passwords do not match');
                } else {
                    showSuccess('reg-confirm-password');
                }
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Setup real-time validation
        setupRealTimeValidation();
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Kiểm tra tên
            if (name === '') {
                showError('reg-name', 'Please enter your full name');
                return;
            }
            const nameValidation = validateName(name);
            if (!nameValidation.isValid) {
                showError('reg-name', nameValidation.message);
                return;
            }
            
            // Kiểm tra email
            if (!validateEmail(email)) {
                showError('reg-email', 'Please enter a valid email');
                return;
            }
            if (!validateEmailDomain(email)) {
                showError('reg-email', 'Email domain is not supported');
                return;
            }
            
            // Kiểm tra số điện thoại
            if (!validatePhone(phone)) {
                showError('reg-phone', 'Please enter a valid phone number');
                return;
            }
            
            // Kiểm tra mật khẩu
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                showError('reg-password', passwordValidation.message);
                return;
            }
            
            // Kiểm tra xác nhận mật khẩu
            if (password !== confirmPassword) {
                showError('reg-confirm-password', 'Passwords do not match');
                return;
            }
            
            // Kiểm tra email đã tồn tại
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showError('reg-email', 'This email has already been registered');
                return;
            }
            
            // Rate limiting - kiểm tra số lần đăng ký trong 1 giờ
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            const recentRegistrations = JSON.parse(localStorage.getItem('recentRegistrations') || '[]');
            const validRegistrations = recentRegistrations.filter(time => now - time < oneHour);
            
            if (validRegistrations.length >= 5) {
                showCustomAlert('Notification', 'You have registered too many times. Please try again after 1 hour.');
                return;
            }
            
            // Thêm thời gian đăng ký hiện tại
            validRegistrations.push(now);
            localStorage.setItem('recentRegistrations', JSON.stringify(validRegistrations));
            
            // Lưu thông tin người dùng
            users.push({ name, email, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            showCustomAlert('Registration Successful!', 'Congratulations! Your account has been registered successfully. Redirecting to login page.', function() {
                window.location.href = 'Vdlogin.html';
            });
        });
    }
}); 