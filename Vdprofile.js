document.addEventListener('DOMContentLoaded', function() {
    // --- AUTHENTICATION & DATA RETRIEVAL ---
    const loggedInUserJSON = sessionStorage.getItem('loggedInUser');

    if (!loggedInUserJSON) {
        showCustomAlert('Notification', 'Please login to view your profile page.', false);
        window.location.href = 'Vdlogin.html';
        return;
    }

    const loggedInUser = JSON.parse(loggedInUserJSON);
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];

    // --- UI POPULATION ---
    function populateProfileData() {
        if (!loggedInUser) return;

        document.getElementById('profile-name').textContent = loggedInUser.name;
        document.getElementById('profile-email').textContent = loggedInUser.email;

        const nameParts = loggedInUser.name.split(' ');
        const lastName = nameParts.pop() || '';
        const firstName = nameParts.join(' ');

        document.getElementById('first-name').value = firstName;
        document.getElementById('last-name').value = lastName;
        document.getElementById('email').value = loggedInUser.email;
        document.getElementById('phone').value = loggedInUser.phone || '';
        document.getElementById('birthday').value = loggedInUser.birthday || '';
        document.getElementById('gender').value = loggedInUser.gender || '';
        document.getElementById('address').value = loggedInUser.address || '';
        document.getElementById('city').value = loggedInUser.city || '';
        document.getElementById('district').value = loggedInUser.district || '';
        document.getElementById('notes').value = loggedInUser.notes || '';

        // Avatar: để trống nếu chưa có
        const avatarImg = document.getElementById('profile-avatar');
        if (loggedInUser.avatar) {
            avatarImg.src = loggedInUser.avatar;
        } else {
            avatarImg.src = '';
        }

        // Make email readonly as it's the identifier
        const emailInput = document.getElementById('email');
        emailInput.readOnly = true;
        emailInput.style.backgroundColor = '#eee';
        emailInput.style.cursor = 'not-allowed';
    }

    // --- CUSTOM ALERT FUNCTION ---
    function showCustomAlert(title, message, isSuccess = true) {
        const customAlert = document.getElementById('customAlert');
        const customAlertBox = customAlert.querySelector('.custom-alert-box');
        const customAlertTitle = document.getElementById('customAlertTitle');
        const customAlertMessage = document.getElementById('customAlertMessage');
        const customAlertBtn = document.getElementById('customAlertBtn');

        customAlertTitle.textContent = title;
        customAlertMessage.textContent = message;
        
        // Style for success or error
        if (isSuccess) {
            customAlertBox.classList.remove('error');
        } else {
            customAlertBox.classList.add('error');
        }

        customAlert.style.display = 'flex';

        customAlertBtn.onclick = function() {
            customAlert.style.display = 'none';
        };
    }

    // --- Show modal if missing info ---
    function isProfileIncomplete() {
        return !loggedInUser.birthday || !loggedInUser.address || !loggedInUser.city || !loggedInUser.district;
    }

    function showCompleteProfileModal() {
        const modal = document.getElementById('completeProfileModal');
        modal.style.display = 'flex';
        document.getElementById('completeProfileBtn').onclick = function() {
            modal.style.display = 'none';
        };
    }

    // --- TAB MANAGEMENT ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // --- ACTION HANDLERS (GLOBAL) ---
    window.saveChanges = function() {
        const activeTabId = document.querySelector('.tab-btn.active').dataset.tab;
        if (activeTabId === 'personal') {
            savePersonalInfo();
        } else if (activeTabId === 'security') {
            savePassword();
        }
    };

    window.resetForm = function() {
        populateProfileData();
        document.getElementById('security-form').reset();
    };

    window.deleteAccount = function() {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        allUsers = allUsers.filter(u => u.email !== loggedInUser.email);
        localStorage.setItem('users', JSON.stringify(allUsers));
        sessionStorage.removeItem('loggedInUser');
        showCustomAlert('Success', 'Your account has been deleted.', true);
        setTimeout(() => window.location.href = 'index.html', 1500);
    };

    // --- AVATAR UPLOAD ---
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarDataUrl = event.target.result;
                    
                    // Update UI
                    document.getElementById('profile-avatar').src = avatarDataUrl;

                    // Update data in memory
                    loggedInUser.avatar = avatarDataUrl;
                    const userIndex = allUsers.findIndex(u => u.email === loggedInUser.email);
                    if (userIndex !== -1) {
                        allUsers[userIndex].avatar = avatarDataUrl;
                    }

                    // Save to storage
                    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    localStorage.setItem('users', JSON.stringify(allUsers));
                    
                    showCustomAlert('Success!', 'Profile picture has been updated!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- HELPER FUNCTIONS ---
    function savePersonalInfo() {
        const userIndex = allUsers.findIndex(u => u.email === loggedInUser.email);
        if (userIndex === -1) {
            showCustomAlert('Error', 'User not found.', false);
            return;
        }

        // Get all data from the personal info form
        const newFirstName = document.getElementById('first-name').value.trim();
        const newLastName = document.getElementById('last-name').value.trim();
        const newFullName = `${newFirstName} ${newLastName}`.trim();
        const newPhone = document.getElementById('phone').value.trim();
        const newBirthday = document.getElementById('birthday').value;
        const newGender = document.getElementById('gender').value;
        const newAddress = document.getElementById('address').value.trim();
        const newCity = document.getElementById('city').value.trim();
        const newDistrict = document.getElementById('district').value.trim();
        const newNotes = document.getElementById('notes').value.trim();

        // Update the user object in the main user list
        const updatedUser = {
            ...allUsers[userIndex],
            name: newFullName,
            phone: newPhone,
            birthday: newBirthday,
            gender: newGender,
            address: newAddress,
            city: newCity,
            district: newDistrict,
            notes: newNotes,
        };
        allUsers[userIndex] = updatedUser;

        // Update the currently logged-in user object for the session
        Object.assign(loggedInUser, updatedUser);

        // Save updated data to both storages
        localStorage.setItem('users', JSON.stringify(allUsers));
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        populateProfileData();
        showCustomAlert('Success!', 'Personal information updated successfully!');
    }

    function savePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showCustomAlert('Error', 'Please fill in all password fields.', false);
            return;
        }
        if (newPassword.length < 6) {
            showCustomAlert('Error', 'New password must be at least 6 characters long.', false);
            return;
        }
        if (newPassword !== confirmPassword) {
            showCustomAlert('Error', 'New passwords do not match.', false);
            return;
        }

        const userIndex = allUsers.findIndex(u => u.email === loggedInUser.email);
        if (allUsers[userIndex].password !== currentPassword) {
            showCustomAlert('Error', 'Current password is incorrect.', false);
            return;
        }

        allUsers[userIndex].password = newPassword;
        loggedInUser.password = newPassword;
        localStorage.setItem('users', JSON.stringify(allUsers));
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        document.getElementById('security-form').reset();
        showCustomAlert('Success!', 'Password changed successfully!');
    }

    // Initial load
    populateProfileData();
    if (isProfileIncomplete()) {
        showCompleteProfileModal();
    }
}); 