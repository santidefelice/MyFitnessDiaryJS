import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
 apiKey: "AIzaSyCGvypWds4wB21gXvYF5z9CAedYYBF-qPM",
 authDomain: "myfitnessdiary-98de3.firebaseapp.com",
 databaseURL: "https://myfitnessdiary-98de3-default-rtdb.firebaseio.com",
 projectId: "myfitnessdiary-98de3",
 storageBucket: "myfitnessdiary-98de3.firebasestorage.app",
 messagingSenderId: "654598300156",
 appId: "1:654598300156:web:d185f121d6b680afcc1279"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const user = auth.currentUser;

const usernameEL = document.getElementById("user-name");
const emailEL = document.getElementById("email");
const signOutBtnEL = document.getElementById("logout-btn");
const createdAtEL = document.getElementById("created-at");

signOutBtnEL.addEventListener("click", authSignOut)

onAuthStateChanged(auth, (user) => {
    if (user) {
        showUserInfo(usernameEL, user);
    } else {
        console.log("Not Authenticated");
    }
})

function authSignOut() {
  signOut(auth).then(() => {
    //localStorage.clear();
    window.location.href = "/Login/index.html";
  }).catch((error) => {
    console.error("Sign out error:", error);
  });
}

function showUserInfo(element, user) {
  if (user.email) {
    // Extract everything before the @ symbol
    const username = user.email.split('@')[0];
    element.textContent = username;
  }
  else{
    element.textContent = "Guest";
  }

  if (user.email) {
    emailEL.textContent = user.email;
  }
  else{
    emailEL.textContent = "No email found";
  }

  if (user.metadata.creationTime) {
    const createdAt = new Date(user.metadata.creationTime);
    createdAtEL.textContent = "You've been a member since " + createdAt.toLocaleDateString() +"!";
  } else {
    createdAtEL.textContent = "No creation date found";
  }
}

function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebarText = document.querySelectorAll(
      "#sidebar .sidenav__text, #sidebar .sidenav__divider"
  );
  
  // Check for mobile viewport
  const isMobile = window.innerWidth <= 768;
  
  // Create mobile elements if on mobile
  if (isMobile) {
    setupMobileNavigation();
  }
  
  // Initialize sidebar state
  if (sidebar) {
      // On mobile, default to collapsed unless explicitly set to expanded
      // On desktop, default to expanded unless explicitly set to collapsed
      const defaultState = isMobile ? false : true;
      const sidebarExpanded = localStorage.getItem('sidebarExpanded') === null 
          ? defaultState 
          : localStorage.getItem('sidebarExpanded') === 'true';
      
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
  
  // Add touch swipe detection for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  }, false);
  
  function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for swipe to be registered
      
      if (touchEndX - touchStartX > swipeThreshold && touchStartX < 30) {
          // Right swipe near the left edge - expand sidebar
          if (sidebar && sidebar.classList.contains("collapsed")) {
              sidebar.classList.remove("collapsed");
              localStorage.setItem('sidebarExpanded', true);
              sidebarText.forEach((element) => {
                  element.classList.remove("hidden-content");
              });
          }
      } else if (touchStartX - touchEndX > swipeThreshold && sidebar && sidebar.contains(document.elementFromPoint(touchStartX, e.changedTouches[0].screenY))) {
          // Left swipe on sidebar - collapse sidebar
          if (!sidebar.classList.contains("collapsed")) {
              sidebar.classList.add("collapsed");
              localStorage.setItem('sidebarExpanded', false);
              sidebarText.forEach((element) => {
                  element.classList.add("hidden-content");
              });
          }
      }
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
      const currentIsMobile = window.innerWidth <= 768;
      
      // Only make changes if switching between mobile and desktop
      if (currentIsMobile !== isMobile) {
          // Refresh the page to properly apply styles
          // This is a simple way to handle major view changes
          location.reload();
      }
  });
}

function setupMobileNavigation() {
  // Create mobile header
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mobile-header';
  
  // Add title to header
  const mobileTitle = document.createElement('div');
  mobileTitle.className = 'mobile-header-title';
  mobileHeader.appendChild(mobileTitle);
  
  // Create mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '☰'; // Hamburger icon
  mobileHeader.appendChild(mobileMenuBtn);
  
  // Add header to document
  document.body.insertBefore(mobileHeader, document.body.firstChild);
  
  // Get the sidebar element
  const sidebar = document.getElementById('sidebar');
  
  // Add event listener to toggle menu
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-active');
    
    // Change button icon based on menu state
    if (sidebar.classList.contains('mobile-active')) {
      mobileMenuBtn.innerHTML = '✕'; // X icon when menu is open
    } else {
      mobileMenuBtn.innerHTML = '☰'; // Hamburger icon when menu is closed
    }
  });
  
  // Close menu when clicking on a link
  const menuLinks = sidebar.querySelectorAll('.sidenav__link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('mobile-active');
      mobileMenuBtn.innerHTML = '☰';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      sidebar.classList.remove('mobile-active');
      mobileMenuBtn.innerHTML = '☰';
    }
  });
}

// Initialize sidebar on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  setupSidebarToggle();
});