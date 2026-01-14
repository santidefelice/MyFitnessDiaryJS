import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGvypWds4wB21gXvYF5z9CAedYYBF-qPM",
  authDomain: "myfitnessdiary-98de3.firebaseapp.com",
  databaseURL: "https://myfitnessdiary-98de3-default-rtdb.firebaseio.com",
  projectId: "myfitnessdiary-98de3",
  storageBucket: "myfitnessdiary-98de3.firebasestorage.app",
  messagingSenderId: "654598300156",
  appId: "1:654598300156:web:d185f121d6b680afcc1279"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const elements = {
  currentWeightInput: document.getElementById("current-weight-input"),
  goalWeightInput: document.getElementById("goal-weight-input"),
  goalTypeSelect: document.getElementById("goal-type-select"),
  monthSelect: document.getElementById("month-select"),
  monthWeightInput: document.getElementById("month-weight-input"),
  monthWeightSaveBtn: document.getElementById("month-weight-save-btn"),
  weightSaveBtn: document.getElementById("weight-save-btn"),
  exerciseSelect: document.getElementById("exercise-select"),
  currentStrength: document.getElementById("current-strength"),
  goalStrength: document.getElementById("goal-strength"),
  goalDescription: document.getElementById("goal-description"),
  exerciseColor: document.getElementById("exercise-color"),
  strengthSaveBtn: document.getElementById("strength-save-btn"),
  volumeSaveBtn: document.getElementById("volume-save-btn"),
  volumeInputSaveBtn: document.getElementById("volume-input-save-btn")
};

// Chart Instances
let weightChartInstance = null;
let volumeChart = null;

// Data Structures
const exerciseOptions = [
  // Back
  "Pullups", "Inverted Rows", "Face Pulls", "T-Bar Rows", "Lat Pulldowns",
  "Cable Rows", "Lat Prayers", "Cable Face Pulls", "Bent Over Barbell Rows",
  "Bench Assisted Single Arm Rows", "Dumbbell Pullovers", "Reverse Dumbbell Fly",
  // Biceps
  "Pelican Curls", "Ring Curls", "Face Away Cable Curls", "Preacher Curl Machine",
  "Standing Cable Curls", "Incline Dumbbell Curls", "Preacher Bar Curls",
  "Standing Barbell Curls", "Hammer Curls", "Reverse Grip Curls",
  // Chest
  "Dips", "Pushups", "Ring Flys", "Pec Deck Flys", "Vertical Chest Press",
  "Incline Dumbbell Press", "Dumbbell Flys", "Flat Bench Press", "Close Grip Bench Press",
  // Triceps
  "Bodyweight Skullcrushers", "Diamond Pushups", "Cable Tricep Pushdowns",
  "Cable Overhead Extensions", "Skullcrushers", "Overhead Tricep Extensions",
  // Shoulders
  "Pike Pushups", "Cable Lateral Raises", "Machine Overhead Press",
  "Lateral Raises", "Overhead Press", "Front Raise",
  // Quads
  "Pistol Squat", "Sissy Squat", "Leg Press", "Hack Squat",
  "Leg Extensions", "Front Squat", "Back Squat", "Goblet Squat",
  // Hamstrings
  "Nordics", "Leg Curls", "Romanian Deadlifts", "Deadlift",
  // Glutes
  "Split Squat", "Glute Bridges", "Hip Thrust Machine",
  "Bulgarian Split Squat", "Walking Lunges",
  // Calves
  "Bodyweight Calf Raises", "Machine Calf Raises", "Dumbbell Calf Raises"
];

const weightData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data: [null, null, null, null, null, null, null, null, null, null, null, null]
};

const volumeData = {
  weeks: [
    {
      label: 'Week of Mar 24 - Mar 30',
      data: {
        'Chest': 16, 'Back': 14, 'Shoulders': 12, 'Biceps': 10, 'Triceps': 10,
        'Quads': 18, 'Hamstrings': 18, 'Glutes': 18, 'Calves': 12
      }
    },
    {
      label: 'Week of Mar 17 - Mar 23',
      data: {
        'Chest': 12, 'Back': 14, 'Shoulders': 10, 'Biceps': 8, 'Triceps': 8,
        'Quads': 16, 'Hamstrings': 14, 'Glutes': 16, 'Calves': 10
      }
    },
    {
      label: 'Week of Mar 10 - Mar 16',
      data: {
        'Chest': 12, 'Back': 12, 'Shoulders': 9, 'Biceps': 8, 'Triceps': 8,
        'Quads': 15, 'Hamstrings': 12, 'Glutes': 15, 'Calves': 9
      }
    },
    {
      label: 'Week of Mar 3 - Mar 9',
      data: {
        'Chest': 10, 'Back': 10, 'Shoulders': 8, 'Biceps': 6, 'Triceps': 6,
        'Quads': 12, 'Hamstrings': 10, 'Glutes': 12, 'Calves': 8
      }
    }
  ]
};

// Default Data Creation
function createDefaultUserData() {
  return {
    name: "New User",
    memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    workoutsCompleted: 0,
    weightGoals: {
      currentWeight: 170,
      goalWeight: 170,
      goalType: "maintain"
    },
    monthlyWeights: [null, null, null, null, null, null, null, null, null, null, null, null],
    strengthGoals: [
      {
        id: 1,
        exercise: "Bench Press",
        current: 135,
        goal: 225,
        description: "Working toward two plates",
        color: "#4a6cf7"
      },
      {
        id: 2,
        exercise: "Squat",
        current: 185,
        goal: 315,
        description: "Building leg strength",
        color: "#ff6384"
      }
    ],
    volumeTargets: {
      "Chest": 12, "Back": 12, "Shoulders": 10, "Biceps": 8, "Triceps": 8,
      "Quads": 12, "Hamstrings": 12, "Glutes": 12, "Calves": 8
    }
  };
}

// ================= UTILITY FUNCTIONS ================= //

function showMessage(message, isError = false) {
  const messageElement = document.createElement('div');
  messageElement.className = isError ? 'error-message' : 'save-message';
  messageElement.textContent = message;

  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 500);
  }, 3000);
}

function createProgressCircle(canvasId, current, goal, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const percentage = (current / goal) * 100;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [percentage, 100 - percentage],
        backgroundColor: [color, '#eef0f6'],
        borderWidth: 0,
        cutout: '80%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90,
      circumference: 360,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
}

// ================= FIREBASE OPERATIONS ================= //

function loadUserDataFromFirebase(user) {
  const userDocRef = doc(db, "Progress", user.uid);
  
  getDoc(userDocRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const firebaseData = docSnap.data();
        
        // Update each section if it exists in the database
        ['weightGoals', 'strengthGoals', 'volumeTargets', 'monthlyWeights'].forEach(section => {
          if (firebaseData[section]) {
            window.userData[section] = firebaseData[section];
          }
        });

        if(userData.monthlyWeights) {
            weightData.data = [...userData.monthlyWeights];
        }
        
        refreshAllCharts();
        console.log("Loaded user data from Firebase");
      } else {
        console.log("No user data found in Firebase. Using defaults.");
      }
    })
    .catch((error) => {
      console.error("Error loading user data: ", error);
      showMessage(`Error loading data: ${error.message}`, true);
    });
}

function saveToFirebase(user, dataType) {
  if (!user) return;

  const userDocRef = doc(db, "Progress", user.uid);
  const dataToSave = { [dataType]: userData[dataType] };
  
  setDoc(userDocRef, dataToSave, { merge: true })
    .then(() => console.log(`${dataType} saved to Firebase`))
    .catch((error) => {
      console.error(`Error saving ${dataType}:`, error);
      showMessage(`Error saving data: ${error.message}`, true);
    });
}

// ================= CHART INITIALIZATION ================= //

function initializeWeightChart() {
  try {
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    if (!userData || !userData.weightGoals) {
      console.error("User data missing for weight chart");
      return;
    }

    if (weightChartInstance) {
      weightChartInstance.destroy();
    }

    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(74, 108, 247, 0.3)');
    gradientFill.addColorStop(1, 'rgba(74, 108, 247, 0.0)');

    if(userData.monthlyWeights) {
        weightData.data = [...userData.monthlyWeights];
    }

    // Filter out null values for display
    const filteredData = [];
    const filteredLabels = [];

    for (let i = 0; i < weightData.data.length; i++) {
      if (weightData.data[i] !== null) {
        filteredData.push(weightData.data[i]);
        filteredLabels.push(weightData.labels[i]);
      }
    }

    weightChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels,
        datasets: [{
          label: 'Weight (lbs)',
          data: filteredData,
          borderColor: '#4a6cf7',
          backgroundColor: gradientFill,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#4a6cf7',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            min: Math.min(...filteredData) - 5 || 150, // Fallback if array is empty
            max: Math.max(...filteredData) + 5 || 200, // Fallback if array is empty
            ticks: { stepSize: 5 }
          }
        }
      }
    });

    updateWeightInfoDisplay();
  } catch (error) {
    console.error("Error initializing weight chart:", error);
    showMessage("Error initializing weight chart", true);
  }
}

function initializeStrengthGoals() {
  try {
    if (!userData || !userData.strengthGoals) {
      console.error("User data missing for strength goals");
      return;
    }

    // Clear existing charts
    document.querySelectorAll('.strength-goals .strength-card').forEach(card => {
      card.parentNode.removeChild(card);
    });

    // Create a card for each strength goal
    const container = document.querySelector('.strength-goals');

    userData.strengthGoals.forEach(goal => {
      const card = document.createElement('div');
      card.className = 'card strength-card';
      card.innerHTML = `
        <h3>${goal.exercise}</h3>
        <div class="progress-circle-container">
          <canvas id="${goal.exercise.replace(/\s+/g, '')}Progress" class="progress-circle"></canvas>
          <div class="progress-text">
            <span class="current">${goal.current}</span>
            <span class="separator">/</span>
            <span class="goal">${goal.goal}</span>
          </div>
        </div>
        <p class="progress-label">${goal.description || ''}</p>
      `;
      container.appendChild(card);

      // Create progress circle
      createProgressCircle(
        `${goal.exercise.replace(/\s+/g, '')}Progress`,
        goal.current,
        goal.goal,
        goal.color
      );
    });
  } catch (error) {
    console.error("Error initializing strength goals:", error);
    showMessage("Error initializing strength goals", true);
  }
}

function initializeVolumeChart(currentWeekIndex, compareWeekIndex = null) {
  try {
    const ctx = document.getElementById('volumeChart').getContext('2d');

    if (!userData || !userData.volumeTargets || !volumeData || !volumeData.weeks) {
      console.error("Data missing for volume chart");
      return;
    }

    // Clear existing chart if any
    if (window.volumeChart instanceof Chart) {
      window.volumeChart.destroy();
    }

    const currentWeek = volumeData.weeks[currentWeekIndex];
    const muscleGroups = Object.keys(currentWeek.data);
    const currentData = Object.values(currentWeek.data);

    // Create datasets array
    const datasets = [
      {
        label: 'Current Week',
        data: currentData,
        backgroundColor: '#4a6cf7',
        borderColor: '#4a6cf7',
        borderWidth: 1
      }
    ];

    // Add target dataset
    const targetData = muscleGroups.map(muscle => userData.volumeTargets[muscle]);
    datasets.push({
      label: 'Target',
      data: targetData,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      borderDash: [5, 5]
    });

    // Add comparison data if available
    if (compareWeekIndex !== null && compareWeekIndex < volumeData.weeks.length) {
      const compareWeek = volumeData.weeks[compareWeekIndex];
      const compareData = muscleGroups.map(muscle => compareWeek.data[muscle]);

      datasets.push({
        label: 'Previous Week',
        data: compareData,
        backgroundColor: 'rgba(74, 108, 247, 0.3)',
        borderColor: 'rgba(74, 108, 247, 0.5)',
        borderWidth: 1
      });
    }

    window.volumeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: muscleGroups,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} sets`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Sets',
              font: { size: 12 }
            },
            ticks: { stepSize: 2 }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error initializing volume chart:", error);
    showMessage("Error initializing volume chart", true);
  }
}

// Function to refresh all charts and UI after data changes
function refreshAllCharts() {
  initializeWeightChart();
  initializeStrengthGoals();
  initializeVolumeChart(0);
}

// ================= EDIT FUNCTIONALITY ================= //

function initWeightGoalsEdit() {
  try {
    if (!userData || !userData.weightGoals) {
      console.error("User data missing for weight goals edit");
      return;
    }

    const { currentWeightInput, goalWeightInput, goalTypeSelect } = elements;
    const monthSelect = document.getElementById('month-select');

    // Set initial input values
    currentWeightInput.value = userData.weightGoals.currentWeight;
    goalWeightInput.value = userData.weightGoals.goalWeight;
    goalTypeSelect.value = userData.weightGoals.goalType;

    // Set the current month in the month select dropdown
    const currentMonth = new Date().getMonth();
    monthSelect.value = currentMonth;

    // Function to update goal type based on weight values
    function updateGoalType() {
      const currentWeight = parseInt(currentWeightInput.value);
      const goalWeight = parseInt(goalWeightInput.value);

      if (currentWeight > goalWeight) {
        goalTypeSelect.value = "loss";
      } else if (currentWeight < goalWeight) {
        goalTypeSelect.value = "gain";
      } else {
        goalTypeSelect.value = "maintain";
      }
    }

    // Add event listeners to weight inputs
    currentWeightInput.addEventListener('input', updateGoalType);
    goalWeightInput.addEventListener('input', updateGoalType);
  } catch (error) {
    console.error("Error initializing weight goals edit:", error);
  }
}

function initStrengthGoalsEdit() {
  try {
    if (!userData || !userData.strengthGoals) {
      console.error("User data missing for strength goals edit");
      return;
    }

    // Populate exercise select with options not already used
    initExerciseSelect();

    // Initialize color picker with default value
    elements.exerciseColor.value = "#4a6cf7"; // Default blue color

    // Render existing goals
    renderStrengthGoalsEdit();
  } catch (error) {
    console.error("Error initializing strength goals edit:", error);
  }
}

function initVolumeTargetsEdit() {
  try {
    if (!userData || !userData.volumeTargets) {
      console.error("User data missing for volume targets edit");
      return;
    }
    
    renderVolumeInputs();
  } catch (error) {
    console.error("Error initializing volume targets edit:", error);
  }
}

// ================= RENDER FUNCTIONS ================= //

function renderStrengthGoalsEdit() {
  const container = document.getElementById('current-goals-container');
  
  if (!container || !userData || !userData.strengthGoals) {
    console.error("Missing container or user data for strength goals");
    return;
  }
  
  container.innerHTML = '';

  userData.strengthGoals.forEach(goal => {
    const goalRow = document.createElement('div');
    goalRow.className = 'goal-edit-row';
    goalRow.innerHTML = `
      <div class="goal-edit-name">
        <span class="goal-color-preview" style="background-color: ${goal.color}"></span>
        <input type="text" class="exercise-name-edit" data-id="${goal.id}" value="${goal.exercise}" placeholder="Exercise name">
      </div>
      <div class="goal-edit-input">
        <input type="number" class="current-edit" data-id="${goal.id}" value="${goal.current}" placeholder="Current">
      </div>
      <div class="goal-edit-input">
        <input type="number" class="goal-edit" data-id="${goal.id}" value="${goal.goal}" placeholder="Goal">
      </div>
      <div class="goal-edit-input">
        <input type="color" class="color-edit" data-id="${goal.id}" value="${goal.color}">
      </div>
      <div class="goal-edit-input goal-edit-description">
        <input type="text" class="description-edit" data-id="${goal.id}" value="${goal.description || ''}" placeholder="Description">
      </div>
      <div class="goal-delete">
        <button class="btn delete-btn" data-id="${goal.id}">Delete</button>
      </div>
    `;
    container.appendChild(goalRow);

    // Add event listeners
    attachStrengthGoalEventListeners(goalRow, goal.id);
  });
}

function attachStrengthGoalEventListeners(goalRow, goalId) {
  // Delete button
  goalRow.querySelector('.delete-btn').addEventListener('click', function() {
    userData.strengthGoals = userData.strengthGoals.filter(g => g.id !== goalId);
    renderStrengthGoalsEdit();
    initExerciseSelect();
  });

  // Current weight input
  goalRow.querySelector('.current-edit').addEventListener('change', function() {
    const value = parseInt(this.value);
    const goal = userData.strengthGoals.find(g => g.id === goalId);
    if (goal) goal.current = value;
  });

  // Goal weight input
  goalRow.querySelector('.goal-edit').addEventListener('change', function() {
    const value = parseInt(this.value);
    const goal = userData.strengthGoals.find(g => g.id === goalId);
    if (goal) goal.goal = value;
  });

  // Color input
  goalRow.querySelector('.color-edit').addEventListener('change', function() {
    const value = this.value;
    const goal = userData.strengthGoals.find(g => g.id === goalId);
    if (goal) {
      goal.color = value;
      goalRow.querySelector('.goal-color-preview').style.backgroundColor = value;
    }
  });

  // Description input
  goalRow.querySelector('.description-edit').addEventListener('change', function() {
    const value = this.value;
    const goal = userData.strengthGoals.find(g => g.id === goalId);
    if (goal) goal.description = value;
  });

  // Exercise name input
  goalRow.querySelector('.exercise-name-edit').addEventListener('change', function() {
    const value = this.value.trim();
    const goal = userData.strengthGoals.find(g => g.id === goalId);
    if (goal && value) {
      goal.exercise = value;
      // Re-initialize exercise select to reflect the change
      initExerciseSelect();
    }
  });
}

function renderVolumeInputs() {
  const container = document.getElementById('volume-inputs');
  
  if (!container || !userData || !userData.volumeTargets) {
    console.error("Missing container or user data for volume inputs");
    return;
  }
  
  container.innerHTML = '';

  for (const muscle in userData.volumeTargets) {
    const row = document.createElement('div');
    row.className = 'volume-input-row';
    row.innerHTML = `
      <div class="volume-muscle-name">${muscle}</div>
      <div class="volume-input">
        <input type="number" class="volume-set-input" data-muscle="${muscle}" value="${userData.volumeTargets[muscle]}"> sets/week
      </div>
    `;
    container.appendChild(row);
  }
}

function renderVolumeWeeklyInputs(weekIndex) {
  const container = document.getElementById('volume-weekly-inputs');
  
  if (!container || !volumeData || !volumeData.weeks || !volumeData.weeks[weekIndex]) {
    console.error("Missing container or volume data for weekly inputs");
    return;
  }
  
  container.innerHTML = '';

  const currentWeek = volumeData.weeks[weekIndex];

  // Create input fields for each muscle group
  for (const muscle in currentWeek.data) {
    const row = document.createElement('div');
    row.className = 'volume-weekly-row';

    row.innerHTML = `
      <div class="volume-weekly-muscle">${muscle}</div>
      <div class="volume-weekly-input">
        <input type="number" class="volume-set-input" data-muscle="${muscle}" value="${currentWeek.data[muscle]}"> sets
      </div>
      <div class="volume-weekly-target">
        Target: ${userData.volumeTargets[muscle]} sets
      </div>
    `;

    container.appendChild(row);
  }
}

function initExerciseSelect() {
  const exerciseSelect = document.getElementById('exercise-select');
  const exerciseDatalist = document.getElementById('exercise-options');
  
  if (!exerciseSelect || !exerciseDatalist || !userData || !userData.strengthGoals) {
    console.error("Missing exercise select or user data");
    return;
  }
  
  // Clear the datalist
  exerciseDatalist.innerHTML = '';

  exerciseOptions.forEach(exercise => {
    // Only add exercises that aren't already in the goals list
    if (!userData.strengthGoals.some(goal => goal.exercise === exercise)) {
      const option = document.createElement('option');
      option.value = exercise;
      exerciseDatalist.appendChild(option);
    }
  });
}

// ================= EVENT HANDLERS ================= //

function updateWeightData(currentWeight) {
  // Get the current month
  const currentMonth = new Date().getMonth();

  // Update the weight data for the current month
  weightData.data[currentMonth] = currentWeight;

  //Update the userData.monthlyWeights array
  userData.monthlyWeights[currentMonth] = currentWeight;

  // Re-initialize the weight chart
  initializeWeightChart();

  const user = auth.currentUser;
  if(user) {
    saveToFirebase(user, 'monthlyWeights');
  }
}

function updateWeightInfoDisplay() {
  const goalValues = document.querySelectorAll('.goal-info .goal-value');
  
  if (!goalValues.length || !userData || !userData.weightGoals) {
    console.error("Missing goal values or user data");
    return;
  }

  // Update current weight display
  goalValues[0].textContent = `${userData.weightGoals.currentWeight} lbs`;

  // Update goal weight display
  goalValues[1].textContent = `${userData.weightGoals.goalWeight} lbs`;

  // Calculate progress based on starting weight (first entry) and current weight
  const startingWeight = weightData.data[0] || userData.weightGoals.currentWeight;
  const currentWeight = userData.weightGoals.currentWeight;
  const weightDiff = startingWeight - currentWeight;

  // Format the progress text based on the goal type
  let progressText = '';
  if (userData.weightGoals.goalType === 'loss') {
    progressText = `${weightDiff > 0 ? '-' : '+'}${Math.abs(weightDiff)} lbs`;
  } else if (userData.weightGoals.goalType === 'gain') {
    progressText = `${weightDiff < 0 ? '+' : '-'}${Math.abs(weightDiff)} lbs`;
  } else {
    // For maintain goal
    progressText = `${weightDiff > 0 ? '-' : '+'}${Math.abs(weightDiff)} lbs`;
  }

  // Update progress display
  if (goalValues[2]) {
    goalValues[2].textContent = progressText;
  }
}

function updateMonthWeightInput() {
  const monthSelect = document.getElementById('month-select');
  const monthWeightInput = document.getElementById('month-weight-input');
  
  if (!monthSelect || !monthWeightInput) {
    console.error("Missing month select or month weight input");
    return;
  }

  const selectedMonth = parseInt(monthSelect.value);
  const monthWeight = userData.monthlyWeights ? userData.monthlyWeights[selectedMonth] : null;

  // Set the input value if data exists, otherwise clear it
  monthWeightInput.value = monthWeight !== null ? monthWeight : '';
}

function openVolumeInputModal(weekIndex) {
  const modal = document.getElementById('volume-input-modal');
  const weekDisplay = document.getElementById('input-week-display');
  
  if (!modal || !weekDisplay) {
    console.error("Missing modal or week display element");
    return;
  }

  // Set the week display
  weekDisplay.textContent = volumeData.weeks[weekIndex].label;

  // Render input fields for each muscle group
  renderVolumeWeeklyInputs(weekIndex);

  // Show the modal
  modal.style.display = 'block';

  // Remove existing event listener to prevent duplicates
  const saveButton = document.getElementById('volume-input-save-btn');
  const oldSaveButton = saveButton.cloneNode(true);
  saveButton.parentNode.replaceChild(oldSaveButton, saveButton);

  // Add save button event listener
  oldSaveButton.addEventListener('click', function() {
    const inputsContainer = document.getElementById('volume-weekly-inputs');
    const inputs = inputsContainer.querySelectorAll('input');
    
    inputs.forEach(input => {
      const muscle = input.getAttribute('data-muscle');
      const value = parseInt(input.value) || 0;
      volumeData.weeks[weekIndex].data[muscle] = value;
    });

    // Update the chart
    initializeVolumeChart(weekIndex);

    // Close the modal
    modal.style.display = 'none';

    // Show success message
    showMessage('Weekly volume updated successfully!');
  });
}

// ================= SETUP FUNCTIONS ================= //

function initMonthlyWeightInput() {
  const monthSelect = document.getElementById('month-select');
  const monthWeightInput = document.getElementById('month-weight-input');
  const monthWeightSaveBtn = document.getElementById('month-weight-save-btn');
  
  if (!monthSelect || !monthWeightInput || !monthWeightSaveBtn) {
    console.error("Missing month input elements");
    return;
  }

  // Set the current month as the default selected month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  monthSelect.value = currentMonth;

  // Display the current weight for the selected month
  updateMonthWeightInput();

  // Add event listener to the month select dropdown
  monthSelect.addEventListener('change', updateMonthWeightInput);

  // Add event listener to save button
  monthWeightSaveBtn.addEventListener('click', function() {
    const selectedMonth = parseInt(monthSelect.value);
    const newWeight = parseFloat(monthWeightInput.value);

    if (!isNaN(newWeight) && newWeight > 0) {
      // Update weight data for the selected month
      weightData.data[selectedMonth] = newWeight;
      userData.monthlyWeights[selectedMonth] = newWeight;

      // If this is the current month, also update the current weight
      const currentMonth = new Date().getMonth();
      if (selectedMonth === currentMonth) {
        userData.weightGoals.currentWeight = newWeight;
      }

      // Update the chart and weight info display
      initializeWeightChart();

      //Save to Firebase if user is logged in
      const user = auth.currentUser;
        if (user) {
            saveToFirebase(user, 'monthlyWeights');
            if(selectedMonth === currentMonth) {
                saveToFirebase(user, 'weightGoals');
            }
        }

      // Show success message
      showMessage('Monthly weight updated successfully!');
    } else {
      showMessage('Please enter a valid weight value.', true);
    }
  });
}

function initModalHandlers() {
  // Get all modal elements
  const modals = document.querySelectorAll('.edit-modal');
  const closeButtons = document.querySelectorAll('.close-modal');

  // Get edit buttons
  const editButtons = {
    weight: document.getElementById('edit-weight-btn'),
    strength: document.getElementById('edit-strength-btn'),
    volume: document.getElementById('edit-volume-btn')
  };

  // Set up edit button click handlers
  Object.entries(editButtons).forEach(([type, button]) => {
    if (button) {
      button.addEventListener('click', function() {
        document.getElementById(`${type}-edit-modal`).style.display = 'block';

        if(type === 'strength') {
          initExerciseSelect();
          renderStrengthGoalsEdit();
        }
        else if(type === 'weight') {
          initWeightGoalsEdit();
        }
        else if(type === 'volume') {
          initVolumeTargetsEdit();
        }
          

      });
    }
  });

  // Close button handlers
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.edit-modal').style.display = 'none';
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

function initWeekNavigation() {
  let currentWeekIndex = 0;
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');
  const weekDisplay = document.getElementById('week-display');
  const inputVolumeBtn = document.getElementById('input-volume-btn');

  if (!prevWeekBtn || !nextWeekBtn || !weekDisplay || !inputVolumeBtn) {
    console.error("Missing week navigation elements");
    return;
  }

  function updateVolumeChart() {
    weekDisplay.textContent = volumeData.weeks[currentWeekIndex].label;

    // Compare with previous week if available
    const compareIndex = currentWeekIndex + 1;
    if (compareIndex < volumeData.weeks.length) {
      initializeVolumeChart(currentWeekIndex, compareIndex);
    } else {
      initializeVolumeChart(currentWeekIndex);
    }

    // Update button states
    prevWeekBtn.disabled = currentWeekIndex >= volumeData.weeks.length - 1;
    nextWeekBtn.disabled = currentWeekIndex <= 0;
  }

  prevWeekBtn.addEventListener('click', function() {
    if (currentWeekIndex < volumeData.weeks.length - 1) {
      currentWeekIndex++;
      updateVolumeChart();
    }
  });

  nextWeekBtn.addEventListener('click', function() {
    if (currentWeekIndex > 0) {
      currentWeekIndex--;
      updateVolumeChart();
    }
  });

  // Input button handler to open the volume input modal for the current week
  inputVolumeBtn.addEventListener('click', function() {
    openVolumeInputModal(currentWeekIndex);
  });

  // Initial update
  updateVolumeChart();
}

function setupSaveButtonListeners(user) {
  // Weight goals save button
  elements.weightSaveBtn.addEventListener("click", function() {
    // Get values from inputs
    const currentWeight = parseFloat(elements.currentWeightInput.value);
    const goalWeight = parseFloat(elements.goalWeightInput.value);
    const goalType = elements.goalTypeSelect.value;
    
    // Validate inputs
    if (isNaN(currentWeight) || isNaN(goalWeight)) {
      showMessage('Please enter valid weight values.', true);
      return;
    }
    
    // Update local data
    userData.weightGoals.currentWeight = currentWeight;
    userData.weightGoals.goalWeight = goalWeight;
    userData.weightGoals.goalType = goalType;
    
    // Update chart and UI
    updateWeightInfoDisplay();
    updateWeightData(currentWeight);
    
    // Save to Firebase if user is logged in
    if (user) {
      saveToFirebase(user, 'weightGoals');
    }
    
    // Close modal and show success message
    document.getElementById('weight-edit-modal').style.display = 'none';
    showMessage('Weight goals updated successfully!');
  });
  
  // Strength goals save button
  elements.strengthSaveBtn.addEventListener("click", function() {
    // Check if there's new exercise data to add
    const exercise = elements.exerciseSelect.value;
    const current = parseInt(elements.currentStrength.value);
    const goal = parseInt(elements.goalStrength.value);
    const description = elements.goalDescription.value;
    const color = elements.exerciseColor.value;

    // If all required fields are filled, add the new goal
    if (exercise && !isNaN(current) && !isNaN(goal)) {
      // Check if exercise already exists
      if (userData.strengthGoals.some(g => g.exercise === exercise)) {
        showMessage('This exercise already has a goal. Edit or delete the existing one first.', true);
      } else {
        // Add new goal to user data
        const newGoal = {
          id: Date.now(), // Simple way to generate a unique ID
          exercise: exercise,
          current: current,
          goal: goal,
          description: description,
          color: color
        };

        userData.strengthGoals.push(newGoal);

        // Clear form
        elements.exerciseSelect.value = '';
        elements.currentStrength.value = '';
        elements.goalStrength.value = '';
        elements.goalDescription.value = '';

        // Re-initialize exercise select to remove the added exercise
        initExerciseSelect();
      }
    }

    // Save to Firebase if user is logged in
    if (user) {
      saveToFirebase(user, 'strengthGoals');
    }

    // Re-initialize strength goals display
    initializeStrengthGoals();

    // Close modal
    document.getElementById('strength-edit-modal').style.display = 'none';

    // Show success message
    showMessage('Strength goals updated successfully!');
  });
  
  // Volume targets save button
  elements.volumeSaveBtn.addEventListener("click", function() {
    // Update user data from inputs
    const inputs = document.querySelectorAll('.volume-set-input');
    inputs.forEach(input => {
      const muscle = input.getAttribute('data-muscle');
      const value = parseInt(input.value);
      if (!isNaN(value)) {
        userData.volumeTargets[muscle] = value;
      }
    });

    // Save to Firebase if user is logged in
    if (user) {
      saveToFirebase(user, 'volumeTargets');
    }

    // Update volume chart to reflect new targets
    initializeVolumeChart(0);

    // Close modal
    document.getElementById('volume-edit-modal').style.display = 'none';

    // Show success message
    showMessage('Volume targets updated successfully!');
  });
}

// ================= INITIALIZATION ================= //

function initializeApps() {
  try {
    // Start with default data
    window.userData = createDefaultUserData();
    
    // Initialize everything with default data
    refreshAllCharts();
    
    initWeightGoalsEdit();
    initStrengthGoalsEdit();
    initVolumeTargetsEdit();
    initVolumeWeeklyInput();
    initModalHandlers();
    
    initWeekNavigation();
    initMonthlyWeightInput();
    
    // Then check Firebase for user data
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in: " + user.uid);
        
        // Load user's data from Firebase if it exists
        loadUserDataFromFirebase(user);
        
        // Set up save button listeners with proper callbacks
        setupSaveButtonListeners(user);
      } else {
        console.log("No user signed in. Using default data.");
        // Still allow editing with default data
        setupSaveButtonListeners(null);
      }
    });
  } catch (error) {
    console.error("Error initializing app:", error);
    showMessage("Error initializing application. Please refresh the page.", true);
  }
}

function initVolumeWeeklyInput() {
  // Event listener for the "Input Volume" button is set in initWeekNavigation
}

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
  } else {
    console.error("Current date element not found");
  }
}

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

function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebarText = document.querySelectorAll(
    "#sidebar .sidenav__text, #sidebar .sidenav__divider"
  );
  const isMobile = () => window.innerWidth < 768;
  
  // Initialize sidebar state differently based on screen size
  function initializeSidebar() {
    if (isMobile()) {
      // On mobile - check stored mobile preference
      const mobileState = localStorage.getItem("sidebarCollapsedMobile");
      const shouldBeCollapsed = mobileState === null ? true : mobileState === "true";
      
      if (shouldBeCollapsed) {
        // Collapse sidebar on mobile by default or if previously collapsed
        sidebar.classList.add("collapsed");
        sidebarText.forEach((element) => {
          element.classList.add("hidden-content");
        });
      } else {
        // Keep expanded if previously expanded
        sidebar.classList.remove("collapsed");
        sidebarText.forEach((element) => {
          element.classList.remove("hidden-content");
        });
      }
    } else {
      // On desktop - use original sidebar setup
      // Check if sidebar has a stored state in localStorage
      const sidebarExpanded = localStorage.getItem('sidebarExpanded') === 'true';
      
      if (!sidebarExpanded) {
        sidebar.classList.add("collapsed");
        sidebarText.forEach((element) => {
          element.classList.add("hidden-content");
        });
      } else {
        sidebar.classList.remove("collapsed");
        sidebarText.forEach((element) => {
          element.classList.remove("hidden-content");
        });
      }
    }
  }
  
  // Initialize on page load
  initializeSidebar();
  
  // Set up toggle button click handler
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      // Toggle sidebar collapsed state
      sidebar.classList.toggle("collapsed");
      
      // Toggle visibility of sidebar text elements
      sidebarText.forEach((element) => {
        element.classList.toggle("hidden-content");
      });
      
      // Store state in appropriate storage key based on device
      if (isMobile()) {
        localStorage.setItem("sidebarCollapsedMobile", sidebar.classList.contains("collapsed"));
      } else {
        localStorage.setItem('sidebarExpanded', !sidebar.classList.contains("collapsed"));
      }
    });
  }
  
  // Handle screen size changes
  let lastScreenSize = isMobile();
  
  window.addEventListener('resize', () => {
    const currentIsMobile = isMobile();
    
    // Only trigger when crossing the mobile/desktop threshold
    if (currentIsMobile !== lastScreenSize) {
      lastScreenSize = currentIsMobile;
      initializeSidebar();
      adjustMobileLayout();
    }
  });
  
  // Initial call to adjust mobile layout
  adjustMobileLayout();
}

// Function to apply mobile-specific adjustments
function adjustMobileLayout() {
  if (window.innerWidth < 768) {
    // Adjust content container sizes for mobile
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.style.height = '250px';
    }
    
    // Adjust progress circle sizes for mobile
    const circleContainers = document.querySelectorAll('.progress-circle-container');
    circleContainers.forEach(container => {
      container.style.width = '120px';
      container.style.height = '120px';
    });
    
    // Force chart redraw for mobile
    if (window.weightChartInstance) {
      setTimeout(() => {
        if (typeof window.weightChartInstance.resize === 'function') {
          window.weightChartInstance.resize();
        }
      }, 100);
    }
  }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  setupSidebarToggle();
  updateCurrentDate();
  initializeApps();
});