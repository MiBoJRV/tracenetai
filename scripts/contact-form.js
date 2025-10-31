// Contact form validation and submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Wait for intlTelInput to be available
    if (typeof window.intlTelInput === 'undefined') {
        console.log('Waiting for intlTelInput to load...');
        setTimeout(() => {
            if (typeof window.intlTelInput !== 'undefined') {
                initContactForm();
            } else {
                console.error('intlTelInput failed to load');
            }
        }, 500);
        return;
    }
    
    initContactForm();
});

function initContactForm() {
    // Add loader styles
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            width: 20px;
            height: 20px;
            border: 2px solid #FFF;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            margin-left: 10px;
            vertical-align: middle;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .btn-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .form-error-message {
            color: #eb162b;
            background-color: rgba(235, 22, 43, 0.1);
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-size: 14px;
        }

        .error-message {
            color: white;
            background-color: #eb162b;
            font-size: 12px;
            margin-top: 5px;
            display: block;
            text-align: left;
            width: 100%;
            position: absolute;
            bottom: 0;
            z-index: 9;
            display: flex;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .form-group input.error {
            border-color: #eb162b !important;
            box-shadow: 0 0 0 2px rgba(235, 22, 43, 0.2) !important;
        }
    `;
    document.head.appendChild(style);

    const form = document.getElementById('contactForm');
    const submitButton = form?.querySelector('.submit-btn');

    // Exit if form is not found
    if (!form || !submitButton) {
        console.error('Contact form or submit button not found');
        return;
    }

    // Initially disable button
    submitButton.disabled = true;
    submitButton.classList.add('disabled');

    // Initialize phone input
    const phoneInput = document.getElementById('phone');
    let iti = null;

    function initPhoneInputWhenReady() {
        if (!phoneInput) return;
        if (window.intlTelInput) {
            if (phoneInput.classList.contains('iti-initialized')) return;
            
            // Find or create the phone input wrapper
            const phoneInputWrapper = phoneInput.closest('.phone-input-wrapper') || phoneInput.parentElement;
            
            iti = window.intlTelInput(phoneInput, {
                loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js"),
                initialCountry: "auto",
                geoIpLookup: callback => {
                    fetch("https://ipwho.is/")
                        .then(res => res.json())
                        .then(data => callback(data.country_code))
                        .catch(() => callback("us"));
                },
                strictMode: true,
                separateDialCode: true,
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js"
            });
            phoneInput.classList.add('iti-initialized');
            
            // Ensure phone field is not marked as touched after initialization
            // Clear any potential error states
            setTimeout(() => {
                clearError(phoneInput);
            }, 100);
        } else {
            setTimeout(initPhoneInputWhenReady, 100);
        }
    }
    initPhoneInputWhenReady();

    const fields = {
        firstName: form.querySelector('input[name="first_name"]'),
        lastName: form.querySelector('input[name="last_name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: phoneInput,
        message: form.querySelector('textarea[name="message"]')
    };

    // Verify all required fields are found
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(fieldName => !fields[fieldName]);
    if (missingFields.length > 0) {
        console.error('Missing form fields:', missingFields);
        return;
    }

    // Create error message elements for each field
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field && fieldName !== 'message') {
            let errorDiv = null;
            if (fieldName === 'phone') {
                // For phone field, add error div to the form-group
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    errorDiv = formGroup.querySelector('.error-message');
                    if (!errorDiv) {
                        errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        formGroup.style.position = 'relative';
                        formGroup.appendChild(errorDiv);
                    }
                }
            } else if (fieldName === 'firstName' || fieldName === 'lastName') {
                // For firstName and lastName fields with position: static
                const formGroup = field.closest('.form-group');
                const formRow = field.closest('.form-row');
                if (formGroup) {
                    errorDiv = formGroup.querySelector('.error-message');
                    if (!errorDiv) {
                        errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        // Don't set position: relative on form-group, use form-row if available
                        if (formRow) {
                            // Form-row already has position: relative in CSS
                            formGroup.appendChild(errorDiv);
                        } else {
                            formGroup.style.position = 'relative';
                            formGroup.appendChild(errorDiv);
                        }
                    }
                }
            } else {
                // For other fields, add error div to the form-group
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    errorDiv = formGroup.querySelector('.error-message');
                    if (!errorDiv) {
                        errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        formGroup.style.position = 'relative';
                        formGroup.appendChild(errorDiv);
                    }
                }
            }
            // Ensure error div is hidden by default
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }
            // Clear any existing error state on field
            field.classList.remove('error');
        }
    });

    // Validation rules
    const validators = {
        firstName: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'First name is required';
            if (trimmed.length < 2) return 'Must be at least 2 characters long';
            return '';
        },
        lastName: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Last name is required';
            if (trimmed.length < 2) return 'Must be at least 2 characters long';
            return '';
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? '' : 'Please enter a valid email address';
        },
        phone: (value) => {
            if (!iti) return 'Phone initialization failed';
            if (!value || value.trim() === '') return 'Phone number is required';
            return iti.isValidNumber() ? '' : 'Please enter a valid phone number';
        },
        message: (value) => {
            // Message is optional, no validation needed
            return '';
        }
    };

    // Show error message
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup ? formGroup.querySelector('.error-message') : null;
            
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'flex';
            field.classList.add('error');
        }
    }

    // Clear error message
    function clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup ? formGroup.querySelector('.error-message') : null;
            
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            field.classList.remove('error');
        }
    }

    // Track if user has interacted with fields
    const fieldTouched = {};

    // Validate single field
    function validateField(fieldName, value, showErrors = true) {
        const field = fields[fieldName];
        if (!field) return false;

        const error = validators[fieldName](value);
        if (error) {
            if (showErrors && fieldTouched[fieldName]) {
                showError(field, error);
            }
            return false;
        }
        if (showErrors) {
            clearError(field);
        }
        return true;
    }

    // Check if form is valid
    function isFormValid() {
        let valid = true;
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (!field) return;
            const value = field.tagName === 'TEXTAREA' ? field.value : (field.type === 'checkbox' ? field.checked : field.value);
            if (validators[fieldName] && validators[fieldName](value) !== '') valid = false;
        });
        return valid;
    }

    function updateButtonState() {
        if (isFormValid()) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
    }

    // Add input event listeners for real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('input', function() {
                fieldTouched[fieldName] = true;
                validateField(fieldName, this.value);
                updateButtonState();
            });
            field.addEventListener('change', function() {
                fieldTouched[fieldName] = true;
                validateField(fieldName, this.value);
                updateButtonState();
            });
        }
    });

    // Add event listeners for phone field with intlTelInput
    // Use a flag to track if initialization events are complete
    let phoneInitEventsProcessed = false;
    setTimeout(() => {
        phoneInitEventsProcessed = true;
    }, 300);
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Only validate after initialization events are processed and user actually types
            if (phoneInitEventsProcessed && this.value.trim()) {
                fieldTouched['phone'] = true;
                validateField('phone', this.value);
            } else if (phoneInitEventsProcessed && !this.value.trim() && fieldTouched['phone']) {
                // If user cleared the field, still validate
                validateField('phone', this.value);
            }
            updateButtonState();
        });
        phoneInput.addEventListener('blur', function() {
            // Only mark as touched if user actually entered something
            if (this.value.trim()) {
                fieldTouched['phone'] = true;
                validateField('phone', this.value);
            } else if (fieldTouched['phone']) {
                // If field was touched but now empty, validate
                validateField('phone', this.value);
            }
            updateButtonState();
        });
        phoneInput.addEventListener('countrychange', function() {
            // Only validate if field was already touched by user (not during init)
            if (phoneInitEventsProcessed && fieldTouched['phone']) {
                validateField('phone', this.value);
            }
            updateButtonState();
        });
    }

    // Clear all errors on page load
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field && fieldName !== 'message') {
            clearError(field);
        }
    });
    
    // Check on page load and after phone input initialization
    updateButtonState();
    
    // Update button state after phone input is fully initialized and clear any errors
    setTimeout(() => {
        if (phoneInput) {
            clearError(phoneInput);
        }
        updateButtonState();
    }, 400);

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Clear any existing error messages
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Mark all fields as touched before validation
        Object.keys(fields).forEach(fieldName => {
            fieldTouched[fieldName] = true;
        });
        
        let isValid = true;

        // Validate all fields
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const value = field.tagName === 'TEXTAREA' ? field.value : (field.type === 'checkbox' ? field.checked : field.value);
            if (!validateField(fieldName, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Get the full international phone number
            const fullNumber = iti ? iti.getNumber() : fields.phone.value;

            // Use separate first and last name fields
            const firstName = fields.firstName.value.trim();
            const lastName = fields.lastName ? fields.lastName.value.trim() : '';
            const messageText = fields.message ? fields.message.value.trim() : '';
            
            // Build description with message
            let description = 'Contact form submission';
            if (messageText) {
                description += '\nMessage: ' + messageText;
            }

            // Prepare data for submission
            const data = {
                ApiKey: 'TVRRNE9ETmZOelkyWHpFME9EZ3pYdz09',
                ApiPassword: 'D3l069fwxV',
                CampaignID: '19654',
                FirstName: firstName,
                LastName: lastName,
                Email: fields.email.value.trim(),
                PhoneNumber: fullNumber.trim().replace(/\s+/g, ''),
                Page: 'ICO-CA',
                Description: description
            };

            const requestBody = Object.entries(data)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            // Show loader and disable button
            submitButton.disabled = true;
            const originalContent = submitButton.innerHTML;
            submitButton.innerHTML = '<div class="btn-content">Sending</div>';

            // Send data to API
            fetch('https://tracker.pablos.team/repost.php?act=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    // Show error message for non-OK responses
                    showFormError('Server error occurred. Please try again later.');
                    // Restore button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalContent;
                    throw new Error('Network response was not ok');
                })
                .then(responseJson => {
                    if (responseJson.ret_code === '200') {
                        localStorage.setItem('responseJson', JSON.stringify(responseJson));
                        
                        // Redirect to th.html in the same window
                        window.location.href = 'th.html';
                    } else {
                        // Show error message for non-200 ret_code
                        showFormError(responseJson.ret_message || 'An error occurred. Please try again.');
                        // Restore button state
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalContent;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFormError('An error occurred while sending your message. Please try again later.');
                    // Restore button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalContent;
                });
        }
    });

    // Show form error message
    function showFormError(message) {
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.textContent = message;

        form.appendChild(errorMessage);
    }
}