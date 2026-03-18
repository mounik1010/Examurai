// Demo admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

const loginSection = document.getElementById('loginSection');
const panelSection = document.getElementById('panelSection');
const loginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const papersTableBody = document.getElementById('papersTableBody');
const viewModal = document.getElementById('viewModal');
const pdfViewer = document.getElementById('pdfViewer');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            loginSection.style.display = 'none';
            panelSection.style.display = 'block';
            loadPapers();
        } else {
            const data = await res.json();
            loginError.textContent = data.error || 'Login failed.';
        }
    } catch (err) {
        loginError.textContent = 'Network error.';
    }
});

async function loadPapers() {
    papersTableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    try {
        const res = await fetch('/api/admin/papers');
        if (res.status === 401) {
            // Not logged in as admin
            loginSection.style.display = 'block';
            panelSection.style.display = 'none';
            loginError.textContent = 'Session expired or not logged in. Please log in as admin.';
            return;
        }
        if (!res.ok) throw new Error('Failed to fetch papers');
        const papers = await res.json();
        if (!papers.length) {
            papersTableBody.innerHTML = '<tr><td colspan="7">No unapproved papers found.</td></tr>';
            return;
        }
        papersTableBody.innerHTML = '';
        papers.forEach(paper => {
            const displayName = paper.name || paper.original_name || paper.filename || 'Untitled Paper';
            const fileUrl = `/uploads/${paper.filename}`;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${displayName}</td>
                <td>${paper.user_email || '-'}</td>
                <td>${new Date(paper.uploaded_at).toLocaleString()}</td>
                <td><a href="${fileUrl}" class="download-btn" target="_blank"><i class="fas fa-download"></i> Download</a></td>
                <td><button class="view-btn" onclick="viewPaper('${fileUrl}')"><i class="fas fa-eye"></i> View</button></td>
                <td><button class="approve-btn" onclick="approvePaper(${paper.id})"><i class="fas fa-check"></i> Approve</button></td>
                <td><button class="remove-btn" onclick="removePaper(${paper.id})"><i class="fas fa-times"></i> Remove</button></td>
            `;
            papersTableBody.appendChild(tr);
        });
    } catch (err) {
        papersTableBody.innerHTML = `<tr><td colspan="7">Server/database error. Please try again later.</td></tr>`;
    }
}

window.viewPaper = function(fileUrl) {
    pdfViewer.src = fileUrl;
    viewModal.style.display = 'flex';
};

window.closeModal = function() {
    pdfViewer.src = '';
    viewModal.style.display = 'none';
};

window.approvePaper = async function(paperId) {
    if (!confirm('Approve this paper?')) return;
    try {
        const res = await fetch(`/api/admin/papers/${paperId}/approve`, { method: 'POST' });
        if (res.ok) {
            loadPapers();
        } else {
            alert('Failed to approve paper.');
        }
    } catch (err) {
        alert('Network error.');
    }
};

window.removePaper = async function(paperId) {
    if (!confirm('Are you sure you want to remove this paper?')) return;
    try {
        const res = await fetch(`/api/admin/papers/${paperId}/remove`, { method: 'DELETE' });
        if (res.ok) {
            loadPapers();
        } else {
            alert('Failed to remove paper.');
        }
    } catch (err) {
        alert('Network error.');
    }
};

// Close modal on outside click
window.onclick = function(event) {
    if (event.target === viewModal) {
        closeModal();
    }
}; 