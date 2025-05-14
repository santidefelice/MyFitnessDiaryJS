function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar")
    const toggleBtn = document.getElementById("toggle-btn")
    const sidebarContent = document.querySelectorAll(
      "#sidebar > *:not(#toggle-btn)"
    )
  
    if (sidebar) {
      sidebar.classList.add("collapsed")
  
      sidebarContent.forEach((element) => {
        element.classList.add("hidden-content")
      })
    }
  
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed")
  
        sidebarContent.forEach((element) => {
          element.classList.toggle("hidden-content")
        })
      })
    }
  }