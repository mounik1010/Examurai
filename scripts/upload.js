document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthStatus();
    
    // Initialize upload form
    initializeUploadForm();
    
    // Initialize file upload preview
    initializeFileUpload();
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

function initializeUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('college', document.getElementById('college').value);
        formData.append('branch', document.getElementById('branch').value);
        formData.append('semester', document.getElementById('semester').value);
        formData.append('subject', document.getElementById('subject').value);
        
        const fileInput = document.getElementById('paper');
        if (fileInput.files.length > 0) {
            formData.append('paper', fileInput.files[0]);
        }
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = uploadForm.querySelector('.upload-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Uploading...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/upload-paper', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message, 'success');
                uploadForm.reset();
                resetFileUpload();
            } else {
                showNotification(result.error || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Upload failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(formData) {
    const name = formData.get('name');
    const college = formData.get('college');
    const branch = formData.get('branch');
    const semester = formData.get('semester');
    const subject = formData.get('subject');
    const paper = formData.get('paper');
    
    if (!name || !college || !branch || !semester || !subject || !paper) {
        showNotification('Please fill in all fields and select a file', 'error');
        return false;
    }
    
    if (paper.size > 20 * 1024 * 1024) {
        showNotification('File size must be less than 20MB', 'error');
        return false;
    }
    
    if (paper.type !== 'application/pdf') {
        showNotification('Only PDF files are allowed', 'error');
        return false;
    }
    
    return true;
}

function initializeFileUpload() {
    const fileInput = document.getElementById('paper');
    const fileInfo = document.querySelector('.file-info');
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            
            fileInfo.innerHTML = `
                <span>${file.name}</span>
                <small>Size: ${fileSize} MB</small>
            `;
            
            // Validate file type
            if (file.type !== 'application/pdf') {
                showNotification('Only PDF files are allowed', 'error');
                this.value = '';
                resetFileUpload();
            }
            
            // Validate file size
            if (file.size > 20 * 1024 * 1024) {
                showNotification('File size must be less than 20MB', 'error');
                this.value = '';
                resetFileUpload();
            }
        } else {
            resetFileUpload();
        }
    });
}

function resetFileUpload() {
    const fileInfo = document.querySelector('.file-info');
    fileInfo.innerHTML = `
        <span>Choose a file</span>
        <small>Max size: 20MB</small>
    `;
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