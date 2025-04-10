document.addEventListener("DOMContentLoaded", function () {
    updateCurrentDate();
    setupSidebarToggle();
    populateExercises();
    setupEventListeners();
  });
  
  function updateCurrentDate() {
    const currentDateElement = document.getElementById("currentDate");
    if (currentDateElement) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const today = new Date();
      currentDateElement.textContent = today.toLocaleDateString("en-US", options);
    }
  }
  
  function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebarContent = document.querySelector(".sidebar-content");
  
    if (sidebar) {
      sidebar.classList.add("collapsed");
  
      if (sidebarContent) {
        sidebarContent.classList.add("hidden-content");
      }
    }
  
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
  
        if (sidebarContent) {
          sidebarContent.classList.toggle("hidden-content");
        }
      });
    }
  }
  
  // Exercise data
  const exercises = [
    { name: "Pullups", code: "11" },
    { name: "Inverted Rows", code: "11" },
    { name: "Pelican Curls", code: "12" },
    { name: "Ring Curls", code: "12" },
    { name: "Dips", code: "13" },
    { name: "Pushups", code: "13" },
    { name: "Ring Flys", code: "13" },
    { name: "Bodyweight Skullcrushers", code: "14" },
    { name: "Diamond Pushups", code: "14" },
    { name: "Pike Pushups", code: "15" },
    { name: "Face Pulls", code: "11" },
    { name: "Pistol Squat", code: "16" },
    { name: "Sissy Squat", code: "16" },
    { name: "Nordics", code: "17" },
    { name: "Split Squat", code: "18" },
    { name: "Glute Bridges", code: "18" },
    { name: "Bodyweight Calf Raises", code: "19" },
    // machines
    { name: "T-Bar Rows", code: "21" },
    { name: "Lat Pulldowns", code: "21" },
    { name: "Cable Rows", code: "21" },
    { name: "Lat Prayers", code: "21" },
    { name: "Face Away Cable Curls", code: "22" },
    { name: "Preacher Curl Machine", code: "22" },
    { name: "Standing Cable Curls", code: "22" },
    { name: "Pec Deck Flys", code: "23" },
    { name: "Vertical Chest Press", code: "23" },
    { name: "Cable Tricep Pushdowns", code: "24" },
    { name: "Cable Overhead Extensions", code: "24" },
    { name: "Cable Lateral Raises", code: "25" },
    { name: "Machine Overhead Press", code: "25" },
    { name: "Cable Face Pulls", code: "21" },
    { name: "Leg Press", code: "26" },
    { name: "Hack Squat", code: "26" },
    { name: "Leg Extensions", code: "26" },
    { name: "Leg Curls", code: "27" },
    { name: "Hip Thrust Machine", code: "28" },
    { name: "Machine Calf Raises", code: "29" },
    // free weights
    { name: "Bent Over Barbell Rows", code: "31" },
    { name: "Bench Assisted Single Arm Rows", code: "31" },
    { name: "Dumbbell Pullovers", code: "31" },
    { name: "Incline Dumbbell Curls", code: "32" },
    { name: "Preacher Bar Curls", code: "32" },
    { name: "Standing Barbell Curls", code: "32" },
    { name: "Hammer Curls", code: "32" },
    { name: "Reverse Grip Curls", code: "32" },
    { name: "Incline Dumbbell Press", code: "33" },
    { name: "Dumbbell Flys", code: "33" },
    { name: "Flat Bench Press", code: "33" },
    { name: "Close Grip Bench Press", code: "33" },
    { name: "Skullcrushers", code: "34" },
    { name: "Overhead Tricep Extensions", code: "34" },
    { name: "Lateral Raises", code: "35" },
    { name: "Overhead Press", code: "35" },
    { name: "Reverse Dumbbell Fly", code: "31" },
    { name: "Front Raise", code: "35" },
    { name: "Front Squat", code: "36" },
    { name: "Back Squat", code: "36" },
    { name: "Goblet Squat", code: "36" },
    { name: "Romanian Deadlifts", code: "37" },
    { name: "Deadlift", code: "37" },
    { name: "Bulgarian Split Squat", code: "38" },
    { name: "Walking Lunges", code: "38" },
    { name: "Dumbbell Calf Raises", code: "39" },
  ];
  
  function populateExercises() {
    // Clear any existing content
    const exerciseContainers = document.querySelectorAll('.exercise-list-container');
    exerciseContainers.forEach(container => {
      container.innerHTML = '';
    });
  
    // Group exercises by muscle group
    const groupedExercises = {};
    
    // Initialize groups 1-9 for the muscle groups
    for (let i = 1; i <= 9; i++) {
      groupedExercises[i] = [];
    }
    
    // Populate muscle group arrays with exercises
    exercises.forEach(exercise => {
      const muscleGroupCode = exercise.code.charAt(1);
      if (!groupedExercises[muscleGroupCode]) {
        groupedExercises[muscleGroupCode] = [];
      }
      groupedExercises[muscleGroupCode].push(exercise);
    });
    
    // Populate each category container
    for (let muscleGroupCode in groupedExercises) {
      const container = document.getElementById(`exercises-${muscleGroupCode}`);
      if (container) {
        if (groupedExercises[muscleGroupCode].length === 0) {
          const noExercisesMsg = document.createElement('div');
          noExercisesMsg.className = 'no-exercises';
          noExercisesMsg.textContent = 'No exercises in this category';
          container.appendChild(noExercisesMsg);
        } else {
          groupedExercises[muscleGroupCode].forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.dataset.name = exercise.name;
            exerciseItem.dataset.code = exercise.code;
            exerciseItem.dataset.type = exercise.code.charAt(0); // For filtering
            
            exerciseItem.innerHTML = `
              <div class="exercise-name">${exercise.name}</div>
              <div class="exercise-action">+</div>
            `;
            
            exerciseItem.addEventListener('click', function() {
              openExerciseModal(exercise);
            });
            
            container.appendChild(exerciseItem);
          });
        }
      }
    }
  }
  
  function openExerciseModal(exercise) {
    const modal = document.getElementById('exerciseModal');
    const nameElement = document.getElementById('exerciseDetailName');
    const typeElement = document.getElementById('exerciseDetailType');
    const muscleElement = document.getElementById('exerciseDetailMuscle');
    
    if (modal && nameElement && typeElement && muscleElement) {
      nameElement.textContent = exercise.name;
      
      // Determine exercise type and muscle group from code
      const typeCode = exercise.code.charAt(0);
      const muscleCode = exercise.code.charAt(1);
      
      let type = '';
      switch (typeCode) {
        case '1': type = 'Bodyweight'; break;
        case '2': type = 'Machine'; break;
        case '3': type = 'Free Weight'; break;
        default: type = 'Unknown';
      }
      
      let muscle = '';
      switch (muscleCode) {
        case '1': muscle = 'Back'; break;
        case '2': muscle = 'Biceps'; break;
        case '3': muscle = 'Chest'; break;
        case '4': muscle = 'Triceps'; break;
        case '5': muscle = 'Shoulders'; break;
        case '6': muscle = 'Quadriceps'; break;
        case '7': muscle = 'Hamstrings'; break;
        case '8': muscle = 'Glutes'; break;
        case '9': muscle = 'Calves'; break;
        default: muscle = 'Unknown';
      }
      
      typeElement.textContent = `Type: ${type}`;
      muscleElement.textContent = `Muscle Group: ${muscle}`;
      
      modal.style.display = 'flex';
    }
  }
  
  function setupEventListeners() {
    // Close modal
    const closeBtn = document.getElementById('closeExerciseModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        document.getElementById('exerciseModal').style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('exerciseModal');
    if (modal) {
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
    
    // Add exercise to workout
    const addToWorkoutBtn = document.getElementById('addToWorkout');
    if (addToWorkoutBtn) {
      addToWorkoutBtn.addEventListener('click', function() {
        const exerciseName = document.getElementById('exerciseDetailName').textContent;
        addExerciseToWorkout(exerciseName);
        document.getElementById('exerciseModal').style.display = 'none';
      });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchExercises');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterExercises(searchTerm);
      });
    }
    
    // Clear search button
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterExercises('');
      });
    }
    
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.dataset.category;
        filterByType(category);
        
        // Update active state of filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  function filterExercises(searchTerm) {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
      const name = item.dataset.name.toLowerCase();
      if (name.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    
    // Update empty category messages
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      const container = category.querySelector('.exercise-list-container');
      const visibleExercises = Array.from(container.querySelectorAll('.exercise-item')).filter(item => {
        return item.style.display !== 'none';
      });
      
      const noExercisesMsg = container.querySelector('.no-exercises');
      
      if (visibleExercises.length === 0) {
        if (!noExercisesMsg) {
          const newMsg = document.createElement('div');
          newMsg.className = 'no-exercises';
          newMsg.textContent = 'No matching exercises';
          container.appendChild(newMsg);
        } else {
          noExercisesMsg.textContent = 'No matching exercises';
        }
      } else if (noExercisesMsg) {
        noExercisesMsg.remove();
      }
    });
    
    // Hide categories with no visible exercises
    updateCategoryVisibility();
  }
  
  function filterByType(typeCode) {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
      const itemTypeCode = item.dataset.code.charAt(0);
      
      if (typeCode === 'all' || itemTypeCode === typeCode) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    
    // Update empty category messages and category visibility
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      const container = category.querySelector('.exercise-list-container');
      const visibleExercises = Array.from(container.querySelectorAll('.exercise-item')).filter(item => {
        return item.style.display !== 'none';
      });
      
      const noExercisesMsg = container.querySelector('.no-exercises');
      
      if (visibleExercises.length === 0) {
        if (!noExercisesMsg) {
          const newMsg = document.createElement('div');
          newMsg.className = 'no-exercises';
          newMsg.textContent = 'No exercises of this type';
          container.appendChild(newMsg);
        } else {
          noExercisesMsg.textContent = 'No exercises of this type';
        }
      } else if (noExercisesMsg) {
        noExercisesMsg.remove();
      }
    });
    
    // Hide categories with no visible exercises
    updateCategoryVisibility();
  }
  
  function updateCategoryVisibility() {
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      const container = category.querySelector('.exercise-list-container');
      const visibleExercises = Array.from(container.querySelectorAll('.exercise-item')).filter(item => {
        return item.style.display !== 'none';
      });
      
      if (visibleExercises.length === 0 && !container.querySelector('.no-exercises')) {
        // Add "no exercises" message if there's none
        const newMsg = document.createElement('div');
        newMsg.className = 'no-exercises';
        newMsg.textContent = 'No matching exercises';
        container.appendChild(newMsg);
      }
    });
  }
  
  function addExerciseToWorkout(exerciseName) {
    // This is just a stub - you'll need to implement this based on your workout functionality
    console.log(`Adding ${exerciseName} to workout`);
    alert(`Added ${exerciseName} to workout`);
  }

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