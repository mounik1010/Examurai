document.addEventListener('DOMContentLoaded', function() {
    const emailSignInForm = document.getElementById('emailSignInForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const googleSignInBtn = document.getElementById('googleSignIn');

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Handle email sign-in form submission
    emailSignInForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Reset error message
        emailError.textContent = '';
        
        // Validate email
        if (!email) {
            emailError.textContent = 'Please enter your email address';
            return;
        }
        
        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return;
        }
        
        // Show loading state
        const submitBtn = emailSignInForm.querySelector('.signin-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        try {
            // Generate a simple password (in production, you'd want proper password handling)
            const password = 'examurai2024';
            
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Signed in successfully!', 'success');
                
                // Redirect to account page after a short delay
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            } else {
                showNotification(result.error || 'Sign in failed', 'error');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            showNotification('Sign in failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle Google sign-in
    googleSignInBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Google sign-in will be implemented soon!', 'info');
    });

    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        
        if (email === '') {
            emailError.textContent = '';
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
        } else {
            emailError.textContent = '';
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification.success {
                    background-color: #38A169;
                }
                .notification.error {
                    background-color: #E53E3E;
                }
                .notification.info {
                    background-color: #4299E1;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}); 