

// Sample data - In a real app, this would come from your database
const userData = {
    name: "John Doe",
    memberSince: "January 2025",
    workoutsCompleted: 47,
    weightGoals: {
        currentWeight: 185,
        goalWeight: 175,
        goalType: "loss" // "loss", "gain", or "maintain"
    },
    strengthGoals: [
        {
            id: 1,
            exercise: "Bench Press",
            current: 185,
            goal: 225,
            description: "One Plate to Two Plate",
            color: "#4a6cf7" // Adding color to existing goals
        },
        {
            id: 2,
            exercise: "Squat",
            current: 225,
            goal: 315,
            description: "Two Plate to Three Plate",
            color: "#ff6384"
        },
        {
            id: 3,
            exercise: "Deadlift",
            current: 275,
            goal: 405,
            description: "Progress to Four Plate",
            color: "#36a2eb"
        }
    ],
    volumeTargets: {
        "Chest": 15,
        "Back": 15,
        "Shoulders": 12,
        "Biceps": 10,
        "Triceps": 10,
        "Quads": 16,
        "Hamstrings": 16,
        "Glutes": 16,
        "Calves": 10
    }
};

// All exercises organized by muscle group (without grouping structure)
const exerciseOptions = [
    // Back
    "Pullups",
    "Inverted Rows",
    "Face Pulls",
    "T-Bar Rows",
    "Lat Pulldowns",
    "Cable Rows",
    "Lat Prayers",
    "Cable Face Pulls",
    "Bent Over Barbell Rows",
    "Bench Assisted Single Arm Rows",
    "Dumbbell Pullovers",
    "Reverse Dumbbell Fly",
    
    // Biceps
    "Pelican Curls",
    "Ring Curls",
    "Face Away Cable Curls",
    "Preacher Curl Machine",
    "Standing Cable Curls",
    "Incline Dumbbell Curls",
    "Preacher Bar Curls",
    "Standing Barbell Curls",
    "Hammer Curls",
    "Reverse Grip Curls",
    
    // Chest
    "Dips",
    "Pushups",
    "Ring Flys",
    "Pec Deck Flys",
    "Vertical Chest Press",
    "Incline Dumbbell Press",
    "Dumbbell Flys",
    "Flat Bench Press",
    "Close Grip Bench Press",
    
    // Triceps
    "Bodyweight Skullcrushers",
    "Diamond Pushups",
    "Cable Tricep Pushdowns",
    "Cable Overhead Extensions",
    "Skullcrushers",
    "Overhead Tricep Extensions",
    
    // Shoulders
    "Pike Pushups",
    "Cable Lateral Raises",
    "Machine Overhead Press",
    "Lateral Raises",
    "Overhead Press",
    "Front Raise",
    
    // Quads
    "Pistol Squat",
    "Sissy Squat",
    "Leg Press",
    "Hack Squat",
    "Leg Extensions",
    "Front Squat",
    "Back Squat",
    "Goblet Squat",
    
    // Hamstrings
    "Nordics",
    "Leg Curls",
    "Romanian Deadlifts",
    "Deadlift",
    
    // Glutes
    "Split Squat",
    "Glute Bridges",
    "Hip Thrust Machine",
    "Bulgarian Split Squat",
    "Walking Lunges",
    
    // Calves
    "Bodyweight Calf Raises",
    "Machine Calf Raises",
    "Dumbbell Calf Raises"
];

const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [null, null, null, null, null, null, null, null, null, null, null, null] // Added null for months with no data yet
};

// Updated volume data structure to support weekly input
const volumeData = {
    // First element is current week, then previous weeks
    weeks: [
        {
            label: 'Week of Mar 24 - Mar 30',
            data: {
                'Chest': 16,
                'Back': 14,
                'Shoulders': 12,
                'Biceps': 10,
                'Triceps': 10,
                'Quads': 18,
                'Hamstrings': 18,
                'Glutes': 18,
                'Calves': 12
            }
        },
        {
            label: 'Week of Mar 17 - Mar 23',
            data: {
                'Chest': 12,
                'Back': 14,
                'Shoulders': 10,
                'Biceps': 8,
                'Triceps': 8,
                'Quads': 16,
                'Hamstrings': 14,
                'Glutes': 16,
                'Calves': 10
            }
        },
        {
            label: 'Week of Mar 10 - Mar 16',
            data: {
                'Chest': 12,
                'Back': 12,
                'Shoulders': 9,
                'Biceps': 8,
                'Triceps': 8,
                'Quads': 15,
                'Hamstrings': 12,
                'Glutes': 15,
                'Calves': 9
            }
        },
        {
            label: 'Week of Mar 3 - Mar 9',
            data: {
                'Chest': 10,
                'Back': 10,
                'Shoulders': 8,
                'Biceps': 6,
                'Triceps': 6,
                'Quads': 12,
                'Hamstrings': 10,
                'Glutes': 12,
                'Calves': 8
            }
        }
    ]
};

// Store the weight chart instance globally so we can update it
let weightChartInstance = null;

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and visualizations
    initializeWeightChart();
    initializeStrengthGoals();
    initializeVolumeChart(0); // Start with current week (index 0)
    
    // Initialize edit functionality
    initWeightGoalsEdit();
    initStrengthGoalsEdit();
    initVolumeTargetsEdit();
    initVolumeWeeklyInput();
    initModalHandlers();
    
    // Set up week navigation
    initWeekNavigation();
    
    // Initialize monthly weight input
    initMonthlyWeightInput();
});

// ================= CHART INITIALIZATION ================= //

// Weight Progress Chart
function initializeWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (weightChartInstance) {
        weightChartInstance.destroy();
    }
    
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(74, 108, 247, 0.3)');
    gradientFill.addColorStop(1, 'rgba(74, 108, 247, 0.0)');
    
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
                legend: {
                    display: false
                },
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
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: Math.min(...filteredData) - 5,
                    max: Math.max(...filteredData) + 5,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
    
    // Update weight values in the info section
    updateWeightInfoDisplay();
}

// Strength Goals Circle Charts
function initializeStrengthGoals() {
    // Clear existing charts if they exist
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
            goal.color // Use the goal's color
        );
    });
}

function renderVolumeWeeklyInputs(weekIndex) {
    const container = document.getElementById('volume-weekly-inputs');
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

// ================= UTILITY FUNCTIONS ================= //

// Show save message function
function showSaveMessage(message) {
    // Create a floating save message
    const messageElement = document.createElement('div');
    messageElement.className = 'save-message';
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        
        // Remove from DOM after fade out
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
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

// Volume Chart (Sets per Muscle Group)
function initializeVolumeChart(currentWeekIndex, compareWeekIndex = null) {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    
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
    if (compareWeekIndex !== null) {
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
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Sets',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });
}

// Week navigation initialization
function initWeekNavigation() {
    let currentWeekIndex = 0;
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const weekDisplay = document.getElementById('week-display');
    const inputVolumeBtn = document.getElementById('input-volume-btn');
    
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
}

// ================= EDIT MODAL HANDLERS ================= //

function initModalHandlers() {
    // Get all modal elements
    const modals = document.querySelectorAll('.edit-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Get edit buttons
    const weightEditBtn = document.getElementById('edit-weight-btn');
    const strengthEditBtn = document.getElementById('edit-strength-btn');
    const volumeEditBtn = document.getElementById('edit-volume-btn');
    
    // Weight edit modal
    weightEditBtn.addEventListener('click', function() {
        document.getElementById('weight-edit-modal').style.display = 'block';
    });
    
    // Strength edit modal
    strengthEditBtn.addEventListener('click', function() {
        document.getElementById('strength-edit-modal').style.display = 'block';
    });
    
    // Volume edit modal
    volumeEditBtn.addEventListener('click', function() {
        document.getElementById('volume-edit-modal').style.display = 'block';
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

// ================= WEIGHT GOALS EDITING ================= //

function initWeightGoalsEdit() {
    const currentWeightInput = document.getElementById('current-weight-input');
    const goalWeightInput = document.getElementById('goal-weight-input');
    const goalTypeSelect = document.getElementById('goal-type-select');
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
    
    // Save button
    document.getElementById('weight-save-btn').addEventListener('click', function() {
        const currentWeight = parseInt(currentWeightInput.value);
        const goalWeight = parseInt(goalWeightInput.value);
        const goalType = goalTypeSelect.value;
        
        // Update user data
        userData.weightGoals.currentWeight = currentWeight;
        userData.weightGoals.goalWeight = goalWeight;
        userData.weightGoals.goalType = goalType;
        
        // Update chart and weight info display
        updateWeightData(currentWeight);
        
        // Close modal
        document.getElementById('weight-edit-modal').style.display = 'none';
        
        // Show success message
        showSaveMessage('Weight goals updated successfully!');
    });
}

// ================= MONTHLY WEIGHT INPUT ================= //

function initMonthlyWeightInput() {
    const monthSelect = document.getElementById('month-select');
    const monthWeightInput = document.getElementById('month-weight-input');
    const monthWeightSaveBtn = document.getElementById('month-weight-save-btn');
    
    // Set the current month as the default selected month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    monthSelect.value = currentMonth;
    
    // Display the current weight for the selected month
    updateMonthWeightInput();
    
    // Add event listener to the month select dropdown
    monthSelect.addEventListener('change', updateMonthWeightInput);
    
    // Function to update the weight input based on selected month
    function updateMonthWeightInput() {
        const selectedMonth = parseInt(monthSelect.value);
        const monthWeight = weightData.data[selectedMonth];
        
        // Set the input value if data exists, otherwise clear it
        if (monthWeight !== null) {
            monthWeightInput.value = monthWeight;
        } else {
            monthWeightInput.value = '';
        }
    }
    
    // Add event listener to save button
    monthWeightSaveBtn.addEventListener('click', function() {
        const selectedMonth = parseInt(monthSelect.value);
        const newWeight = parseFloat(monthWeightInput.value);
        
        if (!isNaN(newWeight) && newWeight > 0) {
            // Update weight data for the selected month
            weightData.data[selectedMonth] = newWeight;
            
            // If this is the current month, also update the current weight
            const currentMonth = new Date().getMonth();
            if (selectedMonth === currentMonth) {
                userData.weightGoals.currentWeight = newWeight;
            }
            
            // Update the chart and weight info display
            initializeWeightChart();
            
            // Show success message
            showSaveMessage('Monthly weight updated successfully!');
        } else {
            alert('Please enter a valid weight value.');
        }
    });
}

// Update weight data for the chart
function updateWeightData(currentWeight) {
    // Get the current month
    const currentMonth = new Date().getMonth();
    
    // Update the weight data for the current month
    weightData.data[currentMonth] = currentWeight;
    
    // Re-initialize the weight chart
    initializeWeightChart();
}

// Update weight info display
function updateWeightInfoDisplay() {
    const goalValues = document.querySelectorAll('.goal-info .goal-value');
    
    // Update current weight display
    goalValues[0].textContent = `${userData.weightGoals.currentWeight} lbs`;
    
    // Update goal weight display
    goalValues[1].textContent = `${userData.weightGoals.goalWeight} lbs`;
    
    // Calculate progress based on starting weight (first entry) and current weight
    const startingWeight = weightData.data[0];
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
    goalValues[2].textContent = progressText;
}

// ================= STRENGTH GOALS EDITING ================= //

function initStrengthGoalsEdit() {
    // Populate exercise select
    const exerciseSelect = document.getElementById('exercise-select');
    exerciseSelect.innerHTML = '<option value="">Select an exercise</option>';
    
    exerciseOptions.forEach(exercise => {
        // Only add exercises that aren't already in the goals list
        if (!userData.strengthGoals.some(goal => goal.exercise === exercise)) {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        }
    });
    
    // Initialize color picker with default value
    const colorPicker = document.getElementById('exercise-color');
    colorPicker.value = "#4a6cf7"; // Default blue color
    
    // Render existing goals
    renderStrengthGoalsEdit();
    
    // Remove the "Add Goal" button event listener as it's now unnecessary
    const addGoalBtn = document.getElementById('add-goal-btn');
    if (addGoalBtn) {
        // Remove it from the DOM since we don't need it anymore
        addGoalBtn.parentNode.removeChild(addGoalBtn);
    }
    
    // Save button
    document.getElementById('strength-save-btn').addEventListener('click', function() {
        // Check if there's new exercise data to add
        const exercise = document.getElementById('exercise-select').value;
        const current = document.getElementById('current-strength').value;
        const goal = document.getElementById('goal-strength').value;
        const description = document.getElementById('goal-description').value;
        const color = document.getElementById('exercise-color').value;
        
        // If all required fields are filled, add the new goal
        if (exercise && current && goal) {
            // Check if exercise already exists
            if (userData.strengthGoals.some(g => g.exercise === exercise)) {
                alert('This exercise already has a goal. Edit or delete the existing one first.');
            } else {
                // Add new goal to user data
                const newGoal = {
                    id: Date.now(), // Simple way to generate a unique ID
                    exercise: exercise,
                    current: parseInt(current),
                    goal: parseInt(goal),
                    description: description,
                    color: color
                };
                
                userData.strengthGoals.push(newGoal);
                
                // Clear form
                document.getElementById('exercise-select').value = '';
                document.getElementById('current-strength').value = '';
                document.getElementById('goal-strength').value = '';
                document.getElementById('goal-description').value = '';
                
                // Re-initialize exercise select to remove the added exercise
                initExerciseSelect();
            }
        }
        
        // Re-initialize strength goals display
        initializeStrengthGoals();
        
        // Close modal
        document.getElementById('strength-edit-modal').style.display = 'none';
        
        // Show success message
        showSaveMessage('Strength goals updated successfully!');
    });
}

// Function to initialize the exercise select dropdown
function initExerciseSelect() {
    const exerciseSelect = document.getElementById('exercise-select');
    exerciseSelect.innerHTML = '<option value="">Select an exercise</option>';
    
    exerciseOptions.forEach(exercise => {
        // Only add exercises that aren't already in the goals list
        if (!userData.strengthGoals.some(goal => goal.exercise === exercise)) {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        }
    });
}

function renderStrengthGoalsEdit() {
    const container = document.getElementById('current-goals-container');
    container.innerHTML = '';
    
    userData.strengthGoals.forEach(goal => {
        const goalRow = document.createElement('div');
        goalRow.className = 'goal-edit-row';
        goalRow.innerHTML = `
            <div class="goal-edit-name">
                <span class="goal-color-preview" style="background-color: ${goal.color}"></span>
                ${goal.exercise}
            </div>
            <div class="goal-edit-input">
                <input type="number" class="current-edit" data-id="${goal.id}" value="${goal.current}">
            </div>
            <div class="goal-edit-input">
                <input type="number" class="goal-edit" data-id="${goal.id}" value="${goal.goal}">
            </div>
            <div class="goal-edit-input">
                <input type="color" class="color-edit" data-id="${goal.id}" value="${goal.color}">
            </div>
            <div class="goal-delete">
                <button class="btn delete-btn" data-id="${goal.id}">Delete</button>
            </div>
        `;
        container.appendChild(goalRow);
        
        // Add event listener to the delete button we just created
        goalRow.querySelector('.delete-btn').addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            userData.strengthGoals = userData.strengthGoals.filter(g => g.id !== id);
            renderStrengthGoalsEdit();
            
            // Re-initialize exercise select to include the removed exercise
            initExerciseSelect();
        });
        
        // Add event listeners to update values when changed
        goalRow.querySelector('.current-edit').addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const value = parseInt(this.value);
            const goal = userData.strengthGoals.find(g => g.id === id);
            if (goal) goal.current = value;
        });
        
        goalRow.querySelector('.goal-edit').addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const value = parseInt(this.value);
            const goal = userData.strengthGoals.find(g => g.id === id);
            if (goal) goal.goal = value;
        });
        
        goalRow.querySelector('.color-edit').addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const value = this.value;
            const goal = userData.strengthGoals.find(g => g.id === id);
            if (goal) {
                goal.color = value;
                goalRow.querySelector('.goal-color-preview').style.backgroundColor = value;
            }
        });
    });
}

// ================= VOLUME TARGETS EDITING ================= //

function initVolumeTargetsEdit() {
    renderVolumeInputs();
    
    // Save button
    document.getElementById('volume-save-btn').addEventListener('click', function() {
        // Update user data from inputs
        const inputs = document.querySelectorAll('.volume-set-input');
        inputs.forEach(input => {
            const muscle = input.getAttribute('data-muscle');
            userData.volumeTargets[muscle] = parseInt(input.value);
        });
        
        // Update volume chart to reflect new targets
        initializeVolumeChart(0);
        
        // Close modal
        document.getElementById('volume-edit-modal').style.display = 'none';
        
        // Show success message
        showSaveMessage('Volume targets updated successfully!');
    });
}

function renderVolumeInputs() {
    const container = document.getElementById('volume-inputs');
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

// ================= WEEKLY VOLUME INPUT ================= //

function initVolumeWeeklyInput() {
    // Event listener for the "Input Volume" button is set in initWeekNavigation
}

function openVolumeInputModal(weekIndex) {
    const modal = document.getElementById('volume-input-modal');
    const weekDisplay = document.getElementById('input-week-display');
    const inputsContainer = document.getElementById('volume-weekly-inputs');
    
    // Set the week display
    weekDisplay.textContent = volumeData.weeks[weekIndex].label;
    
    // Render input fields for each muscle group
    renderVolumeWeeklyInputs(weekIndex);
    
    // Show the modal
    modal.style.display = 'block';
    
    // Add save button event listener
    document.getElementById('volume-input-save-btn').addEventListener('click', function saveHandler() {
        // Save the input values to volumeData
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
        showSaveMessage('Weekly volume updated successfully!');
        
        // Remove this handler to prevent multiple bindings
        this.removeEventListener('click', saveHandler);
    });
}

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