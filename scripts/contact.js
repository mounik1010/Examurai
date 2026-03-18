document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form data
        if (!validateForm(formData)) {
            return;
        }
        
        try {
            const response = await fetch('/api/submit-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage();
                contactForm.reset();
            } else {
                showNotification(result.error || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message', 'error');
        }
    });
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Validate name
        if (data.name === '') {
            showError('name', 'Please enter your name');
            isValid = false;
        } else {
            clearError('name');
        }
        
        // Validate email
        if (data.email === '') {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!validateEmail(data.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }
        
        // Validate subject
        if (data.subject === '') {
            showError('subject', 'Please enter a subject');
            isValid = false;
        } else {
            clearError('subject');
        }
        
        // Validate message
        if (data.message === '') {
            showError('message', 'Please enter your message');
            isValid = false;
        } else {
            clearError('message');
        }
        
        return isValid;
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove any existing error message
        clearError(fieldId);
        
        // Add new error message
        field.parentNode.appendChild(errorDiv);
        field.classList.add('invalid');
    }
    
    // Clear error message
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = field.parentNode.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.classList.remove('invalid');
    }
    
    // Show success message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Message sent successfully!';
        
        contactForm.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // Add input validation on blur
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const fieldData = {
                [this.id]: this.value.trim()
            };
            validateForm(fieldData);
        });
    });
}); 