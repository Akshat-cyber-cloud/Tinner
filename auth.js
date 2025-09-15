// Authentication JavaScript
let currentStep = 1;
let formData = {
    basicInfo: {},
    photos: [],
    interests: []
};

// Initialize the authentication system
document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
    initFormValidation();
    initPhotoUpload();
    initInterestSelection();
    initBioCounter();
});

// Initialize authentication system
function initAuthSystem() {
    // Check if user is already logged in
    if (localStorage.getItem('userToken')) {
        redirectToDashboard();
    }
    
    // Initialize step navigation
    updateProgressIndicator();
    
    // Add form submission handlers
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Photo upload functionality
function initPhotoUpload() {
    const photoInputs = document.querySelectorAll('.photo-input');
    photoInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            handlePhotoUpload(this, e);
        });
    });
    
    const removeButtons = document.querySelectorAll('.remove-photo');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            removePhoto(this);
        });
    });
}

// Interest selection
function initInterestSelection() {
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedInterests();
        });
    });
}

// Bio character counter
function initBioCounter() {
    const bioTextarea = document.getElementById('bio');
    const bioCount = document.getElementById('bio-count');
    
    if (bioTextarea && bioCount) {
        bioTextarea.addEventListener('input', function() {
            const count = this.value.length;
            bioCount.textContent = count;
            
            if (count > 450) {
                bioCount.style.color = '#ff6b6b';
            } else {
                bioCount.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        });
    }
}

// Step navigation
function nextStep(step) {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        showStep(step);
        updateProgressIndicator();
    }
}

function prevStep(step) {
    showStep(step);
    updateProgressIndicator();
}

function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.auth-step');
    steps.forEach(stepElement => {
        stepElement.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${step}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStep = step;
        
        // Update preview if on review step
        if (step === 4) {
            updateProfilePreview();
        }
    }
}

function updateProgressIndicator() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Form validation
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional step-specific validation
    if (currentStep === 2) {
        if (formData.photos.length < 3) {
            showError('Please upload at least 3 photos');
            isValid = false;
        }
    }
    
    if (currentStep === 3) {
        if (formData.interests.length < 3) {
            showError('Please select at least 3 interests');
            isValid = false;
        }
    }
    
    if (currentStep === 4) {
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            showError('Please accept the terms and conditions');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (field.id === 'password' && value.length < 8) {
            errorMessage = 'Password must be at least 8 characters';
            isValid = false;
        }
        
        if (field.id === 'confirmPassword') {
            const password = document.getElementById('password').value;
            if (value !== password) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
        }
    }
    
    // Age validation
    if (field.id === 'age' && value) {
        const age = parseInt(value);
        if (age < 18 || age > 30) {
            errorMessage = 'Age must be between 18 and 30';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ff6b6b';
    field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6b6b';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showError(message) {
    // Create or update error message
    let errorElement = document.querySelector('.global-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'global-error';
        errorElement.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
        `;
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorElement) {
            errorElement.remove();
        }
    }, 5000);
}

// Photo upload handling
function handlePhotoUpload(input, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
    }
    
    const photoId = input.dataset.photo;
    const photoItem = document.getElementById(`photo-${photoId}`);
    const placeholder = photoItem.querySelector('.photo-placeholder');
    const preview = photoItem.querySelector('.photo-preview');
    const removeBtn = photoItem.querySelector('.remove-photo');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        removeBtn.style.display = 'block';
        
        // Store photo data
        formData.photos[photoId - 1] = {
            file: file,
            dataUrl: e.target.result
        };
    };
    
    reader.readAsDataURL(file);
}

function removePhoto(button) {
    const photoItem = button.closest('.photo-upload-item');
    const photoId = photoItem.id.split('-')[1];
    const placeholder = photoItem.querySelector('.photo-placeholder');
    const preview = photoItem.querySelector('.photo-preview');
    const input = photoItem.querySelector('.photo-input');
    
    // Reset photo item
    preview.style.display = 'none';
    placeholder.style.display = 'flex';
    button.style.display = 'none';
    input.value = '';
    
    // Remove from form data
    delete formData.photos[photoId - 1];
}

// Interest selection
function updateSelectedInterests() {
    const selectedInterests = [];
    const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedInterests.push(checkbox.value);
    });
    
    formData.interests = selectedInterests;
}

// Save current step data
function saveCurrentStepData() {
    if (currentStep === 1) {
        const basicInfoForm = document.getElementById('basic-info-form');
        const formDataObj = new FormData(basicInfoForm);
        
        formData.basicInfo = {};
        for (let [key, value] of formDataObj.entries()) {
            formData.basicInfo[key] = value;
        }
    }
}

// Update profile preview
function updateProfilePreview() {
    // Update name
    const previewName = document.getElementById('preview-name');
    if (previewName && formData.basicInfo.firstName && formData.basicInfo.lastName) {
        previewName.textContent = `${formData.basicInfo.firstName} ${formData.basicInfo.lastName}`;
    }
    
    // Update age and gender
    const previewAgeGender = document.getElementById('preview-age-gender');
    if (previewAgeGender && formData.basicInfo.age && formData.basicInfo.gender) {
        previewAgeGender.textContent = `${formData.basicInfo.age}, ${formData.basicInfo.gender}`;
    }
    
    // Update university and major
    const previewUniversity = document.getElementById('preview-university');
    if (previewUniversity && formData.basicInfo.university && formData.basicInfo.major) {
        previewUniversity.textContent = `${formData.basicInfo.university}, ${formData.basicInfo.major}`;
    }
    
    // Update location
    const previewLocation = document.getElementById('preview-location');
    if (previewLocation && formData.basicInfo.location) {
        previewLocation.textContent = formData.basicInfo.location;
    }
    
    // Update bio
    const previewBioText = document.getElementById('preview-bio-text');
    if (previewBioText && formData.basicInfo.bio) {
        previewBioText.textContent = formData.basicInfo.bio;
    }
    
    // Update main photo
    const previewMainPhoto = document.getElementById('preview-main-photo');
    if (previewMainPhoto && formData.photos[0]) {
        const img = previewMainPhoto.querySelector('img');
        const noPhoto = previewMainPhoto.querySelector('.no-photo');
        
        if (img) {
            img.src = formData.photos[0].dataUrl;
            img.style.display = 'block';
            noPhoto.style.display = 'none';
        }
    }
    
    // Update additional photos
    const previewAdditionalPhotos = document.getElementById('preview-additional-photos');
    if (previewAdditionalPhotos) {
        previewAdditionalPhotos.innerHTML = '';
        
        for (let i = 1; i < formData.photos.length; i++) {
            if (formData.photos[i]) {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'additional-photo';
                photoDiv.innerHTML = `<img src="${formData.photos[i].dataUrl}" alt="Photo ${i + 1}">`;
                previewAdditionalPhotos.appendChild(photoDiv);
            }
        }
    }
    
    // Update interests
    const previewInterests = document.getElementById('preview-interests');
    if (previewInterests) {
        previewInterests.innerHTML = '';
        
        formData.interests.forEach(interest => {
            const interestDiv = document.createElement('div');
            interestDiv.className = 'preview-interest';
            interestDiv.textContent = interest;
            previewInterests.appendChild(interestDiv);
        });
    }
}

// Create account
async function createAccount() {
    if (!validateCurrentStep()) {
        return;
    }
    
    showLoading(true);
    
    try {
        // Prepare form data
        const accountData = {
            ...formData.basicInfo,
            interests: formData.interests,
            photos: formData.photos.map(photo => photo.dataUrl) // Convert to base64 for demo
        };
        
        // Try to connect to backend first
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Store user data
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            showSuccess('Account created successfully!');
            
            // Redirect to dashboard
            setTimeout(() => {
                redirectToDashboard();
            }, 2000);
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to create account');
        }
    } catch (error) {
        console.error('Signup error:', error);
        
        // Check if it's a network error (backend not running)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            // Fallback to demo mode
            handleDemoMode(accountData);
        } else {
            showError('Network error. Please try again.');
        }
    } finally {
        showLoading(false);
    }
}

// Demo mode when backend is not available
function handleDemoMode(accountData) {
    // Create demo user data
    const demoUser = {
        id: Date.now().toString(),
        ...accountData,
        profileComplete: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    // Generate demo token
    const demoToken = 'demo_token_' + Date.now();
    
    // Store in localStorage for demo
    localStorage.setItem('userToken', demoToken);
    localStorage.setItem('userData', JSON.stringify(demoUser));
    localStorage.setItem('demoMode', 'true');
    
    showSuccess('Demo account created! (Backend not running - using demo mode)');
    
    // Redirect to dashboard
    setTimeout(() => {
        redirectToDashboard();
    }, 2000);
}

// Sign in
async function handleSignIn(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Store user data
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            showSuccess('Welcome back!');
            
            // Redirect to dashboard
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
        } else {
            const error = await response.json();
            showError(error.message || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Signin error:', error);
        
        // Check if it's a network error (backend not running)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            // Demo mode sign in
            handleDemoSignIn(email, password);
        } else {
            showError('Network error. Please try again.');
        }
    } finally {
        showLoading(false);
    }
}

// Demo mode sign in
function handleDemoSignIn(email, password) {
    // Check if user exists in localStorage (from previous demo signup)
    const existingUser = localStorage.getItem('userData');
    
    if (existingUser) {
        const userData = JSON.parse(existingUser);
        
        // Simple demo validation (in real app, this would be server-side)
        if (userData.email === email && password.length >= 8) {
            // Update last login
            userData.lastLogin = new Date().toISOString();
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('demoMode', 'true');
            
            showSuccess('Welcome back! (Demo mode)');
            
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
        } else {
            showError('Invalid email or password (Demo mode)');
        }
    } else {
        showError('No account found. Please sign up first. (Demo mode)');
    }
}

// Forgot password
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            showSuccess('Password reset link sent to your email');
            hideForgotPassword();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to send reset link');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Modal functions
function showForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Utility functions
function showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

function showSuccess(message) {
    // Create success message
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(46, 213, 115, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(46, 213, 115, 0.3);
    `;
    document.body.appendChild(successElement);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

function redirectToDashboard() {
    // For demo purposes, redirect to main page
    // In a real app, this would go to the user dashboard
    window.location.href = 'index.html';
}

// Social login (demo)
function handleSocialLogin(provider) {
    showLoading(true);
    
    // Simulate social login
    setTimeout(() => {
        showLoading(false);
        showSuccess(`Signing in with ${provider}...`);
        
        // In a real app, this would handle OAuth
        setTimeout(() => {
            redirectToDashboard();
        }, 2000);
    }, 2000);
}

// Add social login event listeners
document.addEventListener('DOMContentLoaded', function() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
    }
});
