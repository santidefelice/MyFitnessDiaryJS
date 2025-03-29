document.addEventListener("DOMContentLoaded", function () {
  // Sample data
  const userData = {
    name: "John Doe",
    profileImage: null,
  }

  const workoutsData = {
    //placeholder
    today: {
      title: "Upper Body Focus",
      duration: "45 min",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "8-10" },
        { name: "Shoulder Press", sets: 3, reps: "10-12" },
        { name: "Pull-ups", sets: 3, reps: "8-10" },
        { name: "Tricep Extensions", sets: 3, reps: "12-15" },
      ],
    },
    weeklyPlan: [
      { day: "Monday", title: "Upper Body Focus", completed: true },
      { day: "Tuesday", title: "Lower Body & Core", completed: true },
      { day: "Wednesday", title: "Rest Day", completed: true },
      { day: "Thursday", title: "HIIT Cardio", completed: false },
      { day: "Friday", title: "Full Body Strength", completed: false },
      { day: "Saturday", title: "Yoga & Mobility", completed: false },
      { day: "Sunday", title: "Rest Day", completed: false },
    ],
  }

  const dateElement = document.getElementById("currentDate")
  const today = new Date()
  dateElement.textContent = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  renderTodayWorkout(workoutsData.today)

  renderWeeklyPlan(workoutsData.weeklyPlan)

  // Profile button click handler
  const profileBtn = document.getElementById("profileBtn")
  profileBtn.addEventListener("click", function () {
    navigateToProfile()
  })

  // Add workout button click handler
  const addWorkoutBtn = document.getElementById("addWorkoutBtn")
  addWorkoutBtn.addEventListener("click", function () {
    openAddWorkoutForm()
  })

  const viewAllBtn = document.getElementById("viewAllBtn")
  viewAllBtn.addEventListener("click", function () {
    viewFullSchedule()
  })
})

/**
 * Renders today's workout from data
 * @param {Object} workout - The workout data
 */
function renderTodayWorkout(workout) {
  const workoutTimeElement = document.getElementById("workoutTime")
  const workoutCardElement = document.getElementById("todayWorkoutCard")

  // Set workout time
  workoutTimeElement.textContent = workout.time

  // Check if there's a workout today
  if (!workout) {
    renderEmptyTodayWorkout(workoutCardElement)
    return
  }

  // Create workout header
  const workoutHeader = document.createElement("div")
  workoutHeader.className = "workout-header"
  workoutHeader.innerHTML = `
        <div>
            <h3 class="workout-title">${workout.title}</h3>
            <p class="workout-duration">${workout.duration}</p>
        </div>
    `

  // Create exercise list
  const exerciseList = document.createElement("div")
  exerciseList.className = "exercise-list"

  let exerciseContent = '<h4 class="exercise-header">Exercises</h4>'

  if (workout.exercises && workout.exercises.length > 0) {
    workout.exercises.forEach((exercise) => {
      exerciseContent += `
                <div class="exercise-item">
                    <span>${exercise.name}</span>
                    <span class="exercise-details">${exercise.sets} sets × ${exercise.reps}</span>
                </div>
            `
    })
  } else {
    exerciseContent += "<p>No exercises added to this workout yet.</p>"
  }

  exerciseList.innerHTML = exerciseContent

  // Clear existing content and append new elements
  workoutCardElement.innerHTML = ""
  workoutCardElement.appendChild(workoutHeader)
  workoutCardElement.appendChild(exerciseList)

  // Add event listener to start button
  const startBtn = document.getElementById("startWorkoutBtn")
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      startWorkout(workout)
    })
  }
}

/**
 * Renders empty state for today's workout
 * @param {HTMLElement} container - The container element
 */
function renderEmptyTodayWorkout(container) {
  container.innerHTML = `
        <div class="empty-state">
            <p>No workout scheduled for today.</p>
            <button class="add-first-workout-btn" id="addFirstWorkoutBtn">Add Workout</button>
        </div>
    `

  const addBtn = document.getElementById("addFirstWorkoutBtn")
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      openAddWorkoutForm()
    })
  }
}

/**
 * Renders weekly workout plan
 * @param {Array} weeklyPlan - Array of weekly workouts
 */
function renderWeeklyPlan(weeklyPlan) {
  const weeklyListElement = document.getElementById("weeklyWorkoutsList")

  // Clear existing content
  weeklyListElement.innerHTML = ""

  // Check if there are workouts for the week
  if (!weeklyPlan || weeklyPlan.length === 0) {
    weeklyListElement.innerHTML = `
            <div class="empty-state">
                <p>No workouts planned for this week.</p>
                <button class="add-first-workout-btn" id="addFirstWeeklyWorkoutBtn">Plan Your Week</button>
            </div>
        `

    const addBtn = document.getElementById("addFirstWeeklyWorkoutBtn")
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        openAddWorkoutForm()
      })
    }

    return
  }

  // Add each workout to the list
  weeklyPlan.forEach((workout, index) => {
    const workoutItem = document.createElement("div")
    workoutItem.className = "weekly-item"
    workoutItem.dataset.index = index
    workoutItem.innerHTML = `
            <span class="weekly-day">${workout.day}</span>
            <span class="weekly-title">${workout.title}</span>
            <span class="weekly-status ${
              workout.completed ? "status-completed" : "status-upcoming"
            }"></span>
        `

    workoutItem.addEventListener("click", function () {
      viewWorkoutDetails(workout)
    })

    weeklyListElement.appendChild(workoutItem)
  })
}

/**
 * Navigate to user profile
 */
function navigateToProfile() {
  alert("Navigating to profile page...")
  // In a real app: window.location.href = '/profile';
}

/**
 * Open form to add a new workout
 */
function openAddWorkoutForm() {
  alert("Opening form to add a new workout...")
  // In a real app, this would open a modal or navigate to a form page
}

function viewFullSchedule() {
  alert("Viewing full weekly schedule...")
  // In a real app: window.location.href = '/schedule';
}

/**
 * View details of a specific workout
 * @param {Object} workout - The workout to view
 */
function viewWorkoutDetails(workout) {
  alert(`Viewing details for ${workout.day}'s workout: ${workout.title}`)
  // In a real app: window.location.href = `/workout/${workoutId}`;
}

function fetchWorkouts() {
  //API call
}
