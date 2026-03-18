document.addEventListener('DOMContentLoaded', function() {
    // Initialize view options
    const viewButtons = document.querySelectorAll('.view-options button');
    const resultsGrid = document.querySelector('.results-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (this.querySelector('i').classList.contains('fa-list')) {
                resultsGrid.classList.add('list-view');
            } else {
                resultsGrid.classList.remove('list-view');
            }
        });
    });

    // Initialize search functionality
    const searchInput = document.querySelector('.search-bar input');
    const collegeCards = document.querySelectorAll('.college-card');
    const branchCards = document.querySelectorAll('.branch-card');
    const subjectCards = document.querySelectorAll('.subject-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        collegeCards.forEach(card => {
            const collegeName = card.querySelector('h3').textContent.toLowerCase();
            if (collegeName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        branchCards.forEach(card => {
            const branchName = card.querySelector('h3').textContent.toLowerCase();
            if (branchName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        subjectCards.forEach(card => {
            const subjectName = card.querySelector('h3').textContent.toLowerCase();
            if (subjectName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Initialize filter functionality
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterGroup = this.closest('.filter-group');
            const filterType = filterGroup.querySelector('h3').textContent.toLowerCase();
            
            // Get all checked filters in this group
            const checkedFilters = Array.from(filterGroup.querySelectorAll('input:checked'))
                .map(input => input.parentElement.textContent.trim().toLowerCase());

            if (filterType.includes('location')) {
                filterByLocation(checkedFilters);
            } else if (filterType.includes('branch')) {
                filterByBranch(checkedFilters);
            } else if (filterType.includes('subject')) {
                filterBySubject(checkedFilters);
            } else if (filterType.includes('status')) {
                filterByStatus(checkedFilters);
            }
        });
    });

    function filterByLocation(locations) {
        collegeCards.forEach(card => {
            const collegeName = card.querySelector('h3').textContent.toLowerCase();
            const shouldShow = locations.some(location => collegeName.includes(location));
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    function filterByBranch(branches) {
        branchCards.forEach(card => {
            const branchName = card.querySelector('h3').textContent.toLowerCase();
            const shouldShow = branches.some(branch => branchName.includes(branch));
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    function filterBySubject(subjects) {
        subjectCards.forEach(card => {
            const subjectName = card.querySelector('h3').textContent.toLowerCase();
            const shouldShow = subjects.some(subject => subjectName.includes(subject));
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    function filterByStatus(statuses) {
        collegeCards.forEach(card => {
            const verifiedTag = card.querySelector('.verified-tag');
            const isVerified = verifiedTag && statuses.includes('verified papers');
            const isRecent = card.classList.contains('recent') && statuses.includes('recently added');
            
            if (statuses.length === 0 || isVerified || isRecent) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Fetch and display uploaded papers
    // async function fetchAndDisplayPapers() { ... }
    // function renderPapers(papers) { ... }
    // Fetch and display uploaded branch papers
    // async function fetchAndDisplayBranchPapers() { ... }
    // function renderBranchPapers(papers) { ... }
    // Fetch and display uploaded subject papers
    // async function fetchAndDisplaySubjectPapers() { ... }
    // function renderSubjectPapers(papers) { ... }

    // Call on load
    // fetchAndDisplayPapers();
    // fetchAndDisplayBranchPapers();
    // fetchAndDisplaySubjectPapers();

    // Navigation for cards
    document.querySelectorAll('.branch-card[data-branch]').forEach(card => {
        card.addEventListener('click', function() {
            const branch = card.getAttribute('data-branch');
            window.location.href = `branch.html?branch=${encodeURIComponent(branch)}`;
        });
    });
    document.querySelectorAll('.subject-card[data-subject]').forEach(card => {
        card.addEventListener('click', function() {
            const subject = card.getAttribute('data-subject');
            window.location.href = `subject.html?subject=${encodeURIComponent(subject)}`;
        });
    });
}); 