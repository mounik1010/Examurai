document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating cards animation
    initializeFloatingCards();
    
    // Initialize swipeable cards for all sections
    initializeSwipeableCards('.college-cards');
    initializeSwipeableCards('.branch-cards');
    initializeSwipeableCards('.subject-cards');
    
    // Initialize query form
    initializeQueryForm();
    
    // Initialize filter buttons
    initializeFilterButtons();
    
    // Add hover effects for cards
    addCardHoverEffects();
    
    // Handle missing images
    handleMissingImages();
    
    // Check authentication status
    checkAuthStatus();
    
    // Update navigation based on auth status
    updateNavigation();
});

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            window.currentUser = user;
            updateNavigation();
        } else {
            window.currentUser = null;
            updateNavigation();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        window.currentUser = null;
        updateNavigation();
    }
}

function updateNavigation() {
    const signInBtn = document.querySelector('.sign-in-btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (window.currentUser) {
        // User is signed in
        if (signInBtn) {
            signInBtn.style.display = 'none';
        }
        
        // Update account link to go directly to account page
        navLinks.forEach(link => {
            if (link.textContent === 'Account') {
                link.href = 'pages/account.html';
            }
            if (link.textContent === 'Bookmarks') {
                link.href = 'pages/bookmarks.html';
            }
            if (link.textContent === 'Contributions') {
                link.href = 'pages/upload.html';
            }
        });
    } else {
        // User is not signed in
        if (signInBtn) {
            signInBtn.style.display = 'block';
        }
        
        // Update account, bookmarks, and contributions links to go to signin
        navLinks.forEach(link => {
            if (['Account', 'Bookmarks', 'Contributions'].includes(link.textContent)) {
                link.href = 'pages/signin.html';
            }
        });
    }
}

// Floating cards animation
function initializeFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, index) => {
        card.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

// Swipeable cards functionality
function initializeSwipeableCards(selector) {
    const container = document.querySelector(`.swipe-container:has(${selector})`);
    if (!container) return;
    
    const cards = document.querySelector(selector);
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

// Query form functionality
function initializeQueryForm() {
    const queryForm = document.querySelector('.query-section');
    if (!queryForm) return;
    
    const queryInput = queryForm.querySelector('.query-input');
    const queryTextarea = queryForm.querySelector('.query-textarea');
    const submitButton = queryForm.querySelector('.submit-query');

    submitButton.addEventListener('click', async () => {
        const searchQuery = queryInput.value.trim();
        const description = queryTextarea.value.trim();

        if (!searchQuery && !description) {
            showNotification('Please enter a search query or description', 'error');
            return;
        }

        try {
            const response = await fetch('/api/submit-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchQuery, description })
            });

            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message, 'success');
                queryInput.value = '';
                queryTextarea.value = '';
            } else {
                showNotification(result.error || 'Failed to submit query', 'error');
            }
        } catch (error) {
            console.error('Error submitting query:', error);
            showNotification('Failed to submit query', 'error');
        }
    });
}

// Filter buttons functionality
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'pages/filters.html';
        });
    });
}

// Add hover effects for cards
function addCardHoverEffects() {
    // College cards
    document.querySelectorAll('.college-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Branch cards
    document.querySelectorAll('.branch-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Subject cards
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Handle missing images
function handleMissingImages() {
    // Handle college logos
    document.querySelectorAll('.college-logo img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20fill%3D%22%236B46C1%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3Ctext%20fill%3D%22%23FFFFFF%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20x%3D%2250%22%20y%3D%2250%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ELogo%3C%2Ftext%3E%3C%2Fsvg%3E';
            this.alt = 'College Logo Placeholder';
        });
    });
    
    // Handle subject background images
    document.querySelectorAll('.subject-card').forEach(card => {
        const bgImage = card.style.backgroundImage;
        if (bgImage && bgImage.includes('url(')) {
            const url = bgImage.match(/url\(['"]?(.*?)['"]?\)/)[1];
            const img = new Image();
            img.onerror = function() {
                card.style.backgroundImage = 'none';
                card.style.backgroundColor = 'var(--primary-color)';
            };
            img.src = url;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

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

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Global navigation functions
window.navigateToHome = function() {
    window.location.href = '/';
};

window.navigateToContact = function() {
    window.location.href = '/pages/contact.html';
};

window.navigateToFilters = function() {
    window.location.href = '/pages/filters.html';
};

window.navigateToSignIn = function() {
    window.location.href = '/pages/signin.html';
};

// Add hover effects for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add hover effects for tech cards
document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Handle card clicks
document.querySelectorAll('.college-card, .branch-card, .subject-card').forEach(card => {
    card.addEventListener('click', () => {
        // Add your card click logic here
        console.log('Card clicked:', card.textContent);
    });
}); 