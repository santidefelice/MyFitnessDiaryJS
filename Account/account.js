import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";


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