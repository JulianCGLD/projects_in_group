// Password visibility toggles
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'bi bi-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'bi bi-eye';
    }
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const eyeIconConfirm = document.getElementById('eyeIconConfirm');
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        eyeIconConfirm.className = 'bi bi-eye-slash';
    } else {
        confirmPasswordInput.type = 'password';
        eyeIconConfirm.className = 'bi bi-eye';
    }
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength++;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Check for numbers
    if (/\d/.test(password)) strength++;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function updatePasswordStrength(password) {
    const strength = checkPasswordStrength(password);
    const strengthIndicator = document.querySelector('.password-strength');
    
    if (!strengthIndicator) {
        // Create strength indicator if it doesn't exist
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        document.getElementById('password').parentElement.parentElement.appendChild(indicator);
    }
    
    const indicator = document.querySelector('.password-strength');
    
    if (password.length === 0) {
        indicator.style.display = 'none';
        return;
    }
    
    indicator.style.display = 'block';
    
    if (strength <= 2) {
        indicator.className = 'password-strength weak';
    } else if (strength <= 3) {
        indicator.className = 'password-strength medium';
    } else {
        indicator.className = 'password-strength strong';
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Colombian format)
function validatePhone(phone) {
    const phoneRegex = /^(\+57\s?)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Real-time validation
document.getElementById('password').addEventListener('input', function() {
    updatePasswordStrength(this.value);
    validatePasswordMatch();
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    validatePasswordMatch();
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    if (email && !validateEmail(email)) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    } else if (email) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    const phone = this.value;
    if (phone && !validatePhone(phone)) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    } else if (phone) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    }
});

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordInput.classList.remove('is-valid');
    } else if (confirmPassword && password === confirmPassword) {
        confirmPasswordInput.classList.add('is-valid');
        confirmPasswordInput.classList.remove('is-invalid');
    }
}

// Form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Reset previous validation states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid');
    });
    
    let isValid = true;
    let errorMessage = '';
    
    // Validate required fields
    if (!firstName) {
        document.getElementById('firstName').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El nombre es obligatorio.';
    }
    
    if (!lastName) {
        document.getElementById('lastName').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El apellido es obligatorio.';
    }
    
    if (!email) {
        document.getElementById('email').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(email)) {
        document.getElementById('email').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El formato del correo electrónico no es válido.';
    }
    
    if (!phone) {
        document.getElementById('phone').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El teléfono es obligatorio.';
    } else if (!validatePhone(phone)) {
        document.getElementById('phone').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'El formato del teléfono no es válido. Usa el formato: +57 300 123 4567';
    }
    
    if (!password) {
        document.getElementById('password').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'La contraseña es obligatoria.';
    } else if (password.length < 8) {
        document.getElementById('password').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    }
    
    if (!confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'Debes confirmar tu contraseña.';
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        isValid = false;
        errorMessage = 'Las contraseñas no coinciden.';
    }
    
    if (!termsAccepted) {
        isValid = false;
        errorMessage = 'Debes aceptar los términos y condiciones.';
    }
    
    if (isValid) {
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Simulate registration process and redirect
        setTimeout(() => {
            successModal.hide();
            // Redirect to login page or main page
            window.location.href = 'log_in.html';
        }, 3000);
    } else {
        // Show error modal
        document.getElementById('errorMessage').textContent = errorMessage;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});

// Add floating label effect
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('57')) {
            value = '+57 ' + value.substring(2);
        } else if (!value.startsWith('+57')) {
            value = '+57 ' + value;
        }
        
        // Format the number: +57 300 123 4567
        if (value.length > 7) {
            value = value.substring(0, 4) + ' ' + value.substring(4, 7) + ' ' + value.substring(7, 10) + ' ' + value.substring(10, 14);
        }
    }
    
    this.value = value;
});

// Initialize password strength indicator
document.addEventListener('DOMContentLoaded', function() {
    const passwordGroup = document.getElementById('password').parentElement.parentElement;
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.display = 'none';
    passwordGroup.appendChild(strengthIndicator);
});