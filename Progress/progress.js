document.getElementById('btn-profile').addEventListener('click', function() {
    setActiveTab('profile');
});

document.getElementById('btn-billing').addEventListener('click', function() {
    setActiveTab('billing');
});

document.getElementById('btn-security').addEventListener('click', function() {
    setActiveTab('security');
});

document.getElementById('btn-notifications').addEventListener('click', function() {
    setActiveTab('notifications');
});

function setActiveTab(tabName) {
    // Remove active class from all buttons
    document.querySelectorAll('.account-panel .sidebar button').forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-content').forEach(function(tab) {
        tab.classList.remove('active');
    });
    
    // Add active class to selected button and tab
    document.getElementById('btn-' + tabName).classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebarText = document.querySelectorAll(
        "#sidebar .sidenav__text, #sidebar .sidenav__divider"
    );
    
    // Initialize sidebar state
    if (sidebar) {
        // Check if sidebar has a stored state in localStorage
        const sidebarExpanded = localStorage.getItem('sidebarExpanded') === 'true';
        
        if (!sidebarExpanded) {
            sidebar.classList.add("collapsed");
            sidebarText.forEach((element) => {
                element.classList.add("hidden-content");
            });
        }
    }
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            // Toggle sidebar collapsed state
            sidebar.classList.toggle("collapsed");
            
            // Track if sidebar is now expanded
            const isExpanded = !sidebar.classList.contains("collapsed");
            
            // Store state in localStorage for persistence
            localStorage.setItem('sidebarExpanded', isExpanded);
            
            // Toggle visibility of sidebar text elements
            sidebarText.forEach((element) => {
                element.classList.toggle("hidden-content");
            });
        });
    }
}

// Initialize sidebar on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    setupSidebarToggle();
});