document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthStatus();
    
    // Load user bookmarks
    loadUserBookmarks();
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            // User not authenticated, redirect to sign in
            window.location.href = 'signin.html';
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        window.location.href = 'signin.html';
    }
}

async function loadUserBookmarks() {
    try {
        const response = await fetch('/api/bookmarks');
        if (response.ok) {
            const bookmarks = await response.json();
            displayBookmarks(bookmarks);
        } else {
            console.error('Failed to load bookmarks');
        }
    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

function displayBookmarks(bookmarks) {
    const bookmarksContainer = document.querySelector('.bookmarks-container');
    
    if (!bookmarksContainer) {
        console.error('Bookmarks container not found');
        return;
    }
    
    if (bookmarks.length === 0) {
        bookmarksContainer.innerHTML = `
            <div class="no-bookmarks">
                <i class="fas fa-bookmark"></i>
                <h3>No bookmarks yet</h3>
                <p>Start browsing question papers and bookmark your favorites!</p>
                <button onclick="window.location.href='../index.html'" class="browse-btn">
                    Browse Papers
                </button>
            </div>
        `;
    } else {
        bookmarksContainer.innerHTML = `
            <div class="bookmarks-header">
                <h2>My Bookmarks (${bookmarks.length})</h2>
                <div class="bookmarks-actions">
                    <button onclick="clearAllBookmarks()" class="clear-btn">
                        <i class="fas fa-trash"></i> Clear All
                    </button>
                </div>
            </div>
            <div class="bookmarks-grid">
                ${bookmarks.map(bookmark => {
                    const displayName = bookmark.name || bookmark.original_name || bookmark.filename || 'Untitled Paper';
                    return `
                    <div class="bookmark-card" data-id="${bookmark.id}">
                        <div class="bookmark-content">
                            <h3>${displayName}</h3>
                            <p><strong>College:</strong> ${bookmark.college}</p>
                            <p><strong>Subject:</strong> ${bookmark.subject}</p>
                            <p><strong>Added:</strong> ${new Date(bookmark.addedAt).toLocaleDateString()}</p>
                        </div>
                        <div class="bookmark-actions">
                            <a href="/api/download/${bookmark.paper_id}" class="download-btn beautiful-violet" target="_blank">
                                <i class="fas fa-download"></i> Download
                            </a>
                            <button onclick="removeBookmark('${bookmark.id}')" class="remove-btn">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

async function removeBookmark(bookmarkId) {
    if (!confirm('Are you sure you want to remove this bookmark?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Bookmark removed successfully!', 'success');
            loadUserBookmarks(); // Reload bookmarks
        } else {
            showNotification('Failed to remove bookmark', 'error');
        }
    } catch (error) {
        console.error('Error removing bookmark:', error);
        showNotification('Error removing bookmark', 'error');
    }
}

async function clearAllBookmarks() {
    if (!confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('/api/bookmarks');
        if (response.ok) {
            const bookmarks = await response.json();
            
            // Remove all bookmarks one by one
            for (const bookmark of bookmarks) {
                await fetch(`/api/bookmarks/${bookmark.id}`, {
                    method: 'DELETE'
                });
            }
            
            showNotification('All bookmarks cleared successfully!', 'success');
            loadUserBookmarks(); // Reload bookmarks
        }
    } catch (error) {
        console.error('Error clearing bookmarks:', error);
        showNotification('Error clearing bookmarks', 'error');
    }
}

function viewPaper(paperId) {
    // In a real application, you would implement paper viewing logic
    showNotification('Paper viewing functionality will be implemented soon!', 'info');
}

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

// Make functions globally available
window.removeBookmark = removeBookmark;
window.clearAllBookmarks = clearAllBookmarks;
window.viewPaper = viewPaper; 