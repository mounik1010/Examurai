document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthAndLoadUser();
    
    // Load user contributions
    loadUserContributions();
});

async function checkAuthAndLoadUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            displayUserInfo(user);
        } else {
            // User not authenticated, redirect to sign in
            window.location.href = 'signin.html';
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        window.location.href = 'signin.html';
    }
}

function displayUserInfo(user) {
    // Update profile information
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('userEmail').textContent = user.email;
    
    // Format join date
    const joinDate = new Date(user.joinedDate);
    const formattedDate = joinDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    document.getElementById('userJoined').textContent = `Joined on ${formattedDate}`;
    
    // Update stats
    document.getElementById('bookmarkCount').textContent = user.bookmarks ? user.bookmarks.length : 0;
    document.getElementById('contributionCount').textContent = user.contributions ? user.contributions.length : 0;
}

async function loadUserContributions() {
    try {
        const response = await fetch('/api/contributions');
        if (response.ok) {
            const contributions = await response.json();
            displayContributions(contributions);
        } else {
            console.error('Failed to load contributions');
        }
    } catch (error) {
        console.error('Error loading contributions:', error);
    }
}

function displayContributions(contributions) {
    const contributionsList = document.getElementById('contributionsList');
    const noContributions = document.getElementById('noContributions');
    
    if (contributions.length === 0) {
        contributionsList.style.display = 'none';
        noContributions.style.display = 'block';
    } else {
        contributionsList.style.display = 'block';
        noContributions.style.display = 'none';
        
        contributionsList.innerHTML = contributions.map(contribution => `
            <div class="contribution-item paper-card" style="margin-bottom: 1.5rem;">
                <div class="paper-title">${contribution.subject}</div>
                <div class="paper-meta">
                    <span><b>Branch:</b> ${contribution.course}</span> |
                    <span><b>Semester:</b> ${contribution.semester}</span> |
                    <span><b>Uploaded:</b> ${new Date(contribution.uploaded_at).toLocaleDateString()}</span>
                </div>
                <div class="paper-actions" style="margin-top: 0.5rem;">
                    <button class="download-btn beautiful-violet" onclick="downloadPaper(${contribution.id})"><i class="fas fa-download"></i> Download</button>
                </div>
            </div>
        `).join('');
    }
}

window.downloadPaper = function(paperId) {
    window.location.href = `/api/download/${paperId}`;
};

async function signOut() {
    try {
        const response = await fetch('/api/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Signed out successfully!', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            showNotification('Error signing out', 'error');
        }
    } catch (error) {
        console.error('Sign out error:', error);
        showNotification('Error signing out', 'error');
    }
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

// Make signOut function globally available
window.signOut = signOut; 