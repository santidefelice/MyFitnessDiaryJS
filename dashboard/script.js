
document.addEventListener("DOMContentLoaded", function () {
  updateCurrentDate()
  initializeWeeklyLayout()
  loadSavedWorkouts()
  setupEventListeners()
  setupSidebarToggle()
  listenForWorkoutMessages()
  checkTodayWorkout()
})

function updateCurrentDate() {
  const currentDateElement = document.getElementById("currentDate")
  if (currentDateElement) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  } else {
    console.error("Current date element not found")
  }
}

function initializeWeeklyLayout() {
  const weeklyWorkoutsList = document.getElementById("weeklyWorkoutsList")
  if (!weeklyWorkoutsList) return

  weeklyWorkoutsList.innerHTML = ""

  const dayNames = getDayNames()

  dayNames.forEach((day, index) => {
    const workoutCard = createWorkoutCard(day, index)
    weeklyWorkoutsList.appendChild(workoutCard)
  })
}

function getDayNames() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
}

function createWorkoutCard(day, index) {
  const workoutCard = document.createElement("div")
  workoutCard.className = "workout-card"
  workoutCard.dataset.day = day

  const cardHeader = document.createElement("div")
  cardHeader.className = "workout-card-header"

  const dayElement = document.createElement("div")
  dayElement.className = "workout-day"
  dayElement.textContent = day

  const statusElement = document.createElement("div")
  statusElement.className = "workout-status"

  cardHeader.appendChild(dayElement)
  cardHeader.appendChild(statusElement)
  workoutCard.appendChild(cardHeader)

  const cardBody = document.createElement("div")
  cardBody.className = "workout-card-body"

  const titleElement = document.createElement("h3")
  titleElement.className = "workout-title"
  titleElement.textContent = "No Workout Planned"

  const descriptionElement = document.createElement("p")
  descriptionElement.className = "workout-description"
  descriptionElement.textContent = "Generate a workout to see details"

  cardBody.appendChild(titleElement)
  cardBody.appendChild(descriptionElement)

  const exerciseList = document.createElement("ul")
  exerciseList.className = "exercise-list"
  exerciseList.id = `exercise-list-${index}`
  cardBody.appendChild(exerciseList)

  const seeMoreBtn = document.createElement("button")
  seeMoreBtn.className = "see-more-btn"
  seeMoreBtn.textContent = "See Exercises"
  seeMoreBtn.dataset.targetId = `exercise-list-${index}`
  seeMoreBtn.addEventListener("click", function () {
    const targetList = document.getElementById(this.dataset.targetId)
    if (targetList) {
      targetList.classList.toggle("visible")
      this.textContent = targetList.classList.contains("visible")
        ? "Hide Exercises"
        : "See Exercises"
    }
  })

  cardBody.appendChild(seeMoreBtn)
  workoutCard.appendChild(cardBody)

  return workoutCard
}

function loadSavedWorkouts() {
  const savedTodayWorkout = localStorage.getItem("todayWorkout")
  if (savedTodayWorkout) {
    try {
      const workoutData = JSON.parse(savedTodayWorkout)

      if (!workoutData.date) {
        workoutData.date = new Date().toISOString()
        localStorage.setItem("todayWorkout", JSON.stringify(workoutData))
      }

      const workoutDate = new Date(workoutData.date)
      const today = new Date()

      if (isSameDay(workoutDate, today)) {
        updateTodayWorkout(workoutData)
        updateWeeklyWorkout(workoutData)
      } else {
        console.log(
          "Saved workout is not from today, not displaying it as today's workout"
        )
      }
    } catch (error) {
      console.error("Error loading saved today's workout:", error)
    }
  } else {
    console.log("No saved workout found for today")
  }

  const savedWeeklyWorkouts = localStorage.getItem("weeklyWorkouts")
  if (savedWeeklyWorkouts) {
    try {
      const weeklyData = JSON.parse(savedWeeklyWorkouts)

      Object.keys(weeklyData).forEach((day) => {
        const workoutData = weeklyData[day]
        updateDayWorkout(day, workoutData)
      })
    } catch (error) {
      console.error("Error loading saved weekly workouts:", error)
    }
  } else {
    console.log("No saved weekly workouts found")
  }
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function setupEventListeners() {
  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", function () {
      alert("Profile settings")
    })
  } else {
    console.error("Profile button element not found")
  }

  const viewAllBtn = document.getElementById("viewAllBtn")
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", function () {
      alert("View all workouts")
    })
  } else {
    console.error("View all button element not found")
  }

  const addWorkoutBtn = document.getElementById("addWorkoutBtn")
  if (addWorkoutBtn) {
    addWorkoutBtn.addEventListener("click", function () {
      const modal = document.getElementById("workoutGeneratorModal")
      if (modal) {
        modal.style.display = "flex"
      } else {
        console.error("Workout generator modal element not found")
      }
    })
  } else {
    console.error("Add workout button element not found")
  }

  const closeModal = document.getElementById("closeModal")
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      const modal = document.getElementById("workoutGeneratorModal")
      if (modal) {
        modal.style.display = "none"
      }
    })
  } else {
    console.error("Close modal button element not found")
  }

  window.onclick = function (event) {
    const modal = document.getElementById("workoutGeneratorModal")
    if (modal && event.target === modal) {
      modal.style.display = "none"
    }
  }
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

function listenForWorkoutMessages() {
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "workoutGenerated") {
      const workoutData = event.data.workout
      const weeklyWorkouts = event.data.weeklyWorkouts

      console.log("Received workout data:", workoutData)
      console.log("Received weekly workouts:", weeklyWorkouts)

      if (!workoutData.date) {
        workoutData.date = new Date().toISOString()
      }

      updateTodayWorkout(workoutData)

      if (weeklyWorkouts) {
        saveWeeklyWorkouts(weeklyWorkouts)

        const dayNames = getDayNames()
        dayNames.forEach((day) => {
          if (weeklyWorkouts[day]) {
            updateDayWorkout(day, weeklyWorkouts[day])
          }
        })
      } else {
        updateWeeklyWorkout(workoutData)
      }

      saveWorkoutData(workoutData)

      const modal = document.getElementById("workoutGeneratorModal")
      if (modal) {
        modal.style.display = "none"
      } else {
        console.error("Modal element not found when trying to close it")
      }
    }
  })
}

function saveWeeklyWorkouts(weeklyWorkouts) {
  localStorage.setItem("weeklyWorkouts", JSON.stringify(weeklyWorkouts))
}

function updateTodayWorkout(workoutData) {
  const todayWorkoutCard = document.getElementById("todayWorkoutCard")
  if (!todayWorkoutCard) {
    console.error("Today's workout card element not found")
    return
  }

  console.log("Updating today's workout with data:", workoutData)

  todayWorkoutCard.innerHTML = ""

  const workoutTitle = document.createElement("h3")
  workoutTitle.textContent = workoutData.title || "Today's Workout"
  workoutTitle.className = "workout-title"
  todayWorkoutCard.appendChild(workoutTitle)

  if (workoutData.exercises && workoutData.exercises.length > 0) {
    const exerciseList = document.createElement("ul")
    exerciseList.className = "exercise-list-today"

    workoutData.exercises.forEach((exercise) => {
      const exerciseItem = document.createElement("li")
      exerciseItem.className = "exercise-item-today"

      if (exercise.sets && exercise.reps) {
        exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`
      } else if (exercise.sets && (exercise.repsMin || exercise.repsMax)) {
        const repsText =
          exercise.repsMin && exercise.repsMax
            ? `${exercise.repsMin}-${exercise.repsMax}`
            : exercise.repsMin || exercise.repsMax
        exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${repsText} reps`
      } else {
        exerciseItem.textContent = exercise.name
      }

      exerciseList.appendChild(exerciseItem)
    })

    todayWorkoutCard.appendChild(exerciseList)
  } else {
    const noExercisesMsg = document.createElement("p")
    noExercisesMsg.className = "no-exercises"
    noExercisesMsg.textContent = "No exercises added yet."
    todayWorkoutCard.appendChild(noExercisesMsg)
  }

  const completeBtn = document.createElement("button")
  completeBtn.className = "complete-workout-btn"
  completeBtn.textContent = workoutData.completed
    ? "Completed"
    : "Mark as Completed"
  completeBtn.disabled = workoutData.completed

  if (workoutData.completed) {
    completeBtn.classList.add("completed")
  } else {
    completeBtn.addEventListener("click", function () {
      workoutData.completed = true

      saveWorkoutData(workoutData)

      completeBtn.textContent = "Completed"
      completeBtn.disabled = true
      completeBtn.classList.add("completed")

      updateWeeklyWorkoutStatus()
    })
  }

  todayWorkoutCard.appendChild(completeBtn)
}

function updateWeeklyWorkout(workoutData) {
  const today = new Date()
  const dayIndex = today.getDay()
  const dayNames = getDayNames()
  const dayName = dayNames[dayIndex]

  console.log("Updating weekly workout for day:", dayName)

  updateDayWorkout(dayName, workoutData)
}

function updateDayWorkout(dayName, workoutData) {
  const weeklyWorkoutsList = document.getElementById("weeklyWorkoutsList")
  if (!weeklyWorkoutsList) {
    console.error("Weekly workouts list element not found")
    return
  }

  const workoutCard = weeklyWorkoutsList.querySelector(
    `.workout-card[data-day="${dayName}"]`
  )
  if (!workoutCard) {
    console.error(`Workout card for day ${dayName} not found`)
    return
  }

  console.log(`Found workout card for day ${dayName}:`, workoutCard)

  if (workoutData.completed) {
    const statusElement = workoutCard.querySelector(".workout-status")
    if (statusElement) {
      statusElement.classList.add("completed")
    }
  }

  const titleElement = workoutCard.querySelector(".workout-title")
  if (titleElement) {
    titleElement.textContent = workoutData.title || "Workout"
  }

  const descriptionElement = workoutCard.querySelector(".workout-description")
  if (descriptionElement) {
    const today = new Date()
    const dayIndex = today.getDay()
    const currentDayName = getDayNames()[dayIndex]

    if (dayName === currentDayName) {
      descriptionElement.textContent = "Today's workout"
    } else {
      descriptionElement.textContent =
        workoutData.description || "Generated workout"
    }
  }

  if (workoutData.exercises && workoutData.exercises.length > 0) {
    const seeMoreBtn = workoutCard.querySelector(".see-more-btn")
    if (seeMoreBtn) {
      const exerciseListId = seeMoreBtn.dataset.targetId
      if (exerciseListId) {
        const exerciseList = document.getElementById(exerciseListId)
        if (exerciseList) {
          exerciseList.innerHTML = ""

          workoutData.exercises.forEach((exercise) => {
            const exerciseItem = document.createElement("li")
            exerciseItem.className = "exercise-item"

            if (exercise.sets && exercise.reps) {
              exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`
            } else if (
              exercise.sets &&
              (exercise.repsMin || exercise.repsMax)
            ) {
              const repsText =
                exercise.repsMin && exercise.repsMax
                  ? `${exercise.repsMin}-${exercise.repsMax}`
                  : exercise.repsMin || exercise.repsMax
              exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${repsText} reps`
            } else {
              exerciseItem.textContent = exercise.name
            }

            exerciseList.appendChild(exerciseItem)
          })
        }
      }
    }
  }
}

function updateWeeklyWorkoutStatus() {
  const today = new Date()
  const dayIndex = today.getDay()
  const dayName = getDayNames()[dayIndex]

  const weeklyWorkoutsList = document.getElementById("weeklyWorkoutsList")
  if (!weeklyWorkoutsList) return

  const workoutCard = weeklyWorkoutsList.querySelector(
    `.workout-card[data-day="${dayName}"]`
  )
  if (workoutCard) {
    const statusElement = workoutCard.querySelector(".workout-status")
    if (statusElement) {
      statusElement.classList.add("completed")

      const savedWeeklyWorkouts = localStorage.getItem("weeklyWorkouts")
      if (savedWeeklyWorkouts) {
        try {
          const weeklyData = JSON.parse(savedWeeklyWorkouts)
          if (weeklyData[dayName]) {
            weeklyData[dayName].completed = true
            localStorage.setItem("weeklyWorkouts", JSON.stringify(weeklyData))
          }
        } catch (error) {
          console.error("Error updating weekly workout status:", error)
        }
      }
    }
  }
}

function saveWorkoutData(workoutData) {
  if (!workoutData.date) {
    workoutData.date = new Date().toISOString()
  }

  localStorage.setItem("todayWorkout", JSON.stringify(workoutData))

  const today = new Date()
  const dayIndex = today.getDay()
  const dayName = getDayNames()[dayIndex]

  let weeklyWorkouts = {}
  const savedWeeklyWorkouts = localStorage.getItem("weeklyWorkouts")
  if (savedWeeklyWorkouts) {
    try {
      weeklyWorkouts = JSON.parse(savedWeeklyWorkouts)
    } catch (error) {
      console.error("Error parsing saved weekly workouts:", error)
    }
  }

  weeklyWorkouts[dayName] = workoutData

  localStorage.setItem("weeklyWorkouts", JSON.stringify(weeklyWorkouts))

  console.log("Workout data saved successfully")
}

function checkTodayWorkout() {
  const todayWorkoutCard = document.getElementById("todayWorkoutCard")
  if (!todayWorkoutCard) return

  const savedTodayWorkout = localStorage.getItem("todayWorkout")
  if (!savedTodayWorkout) {
    todayWorkoutCard.innerHTML = `
      <h3 class="workout-title">No Workout Planned</h3>
      <p>Click the "Add Workout" button to generate a workout for today.</p>
    `
    return
  }

  try {
    const workoutData = JSON.parse(savedTodayWorkout)
    const workoutDate = new Date(workoutData.date || new Date())
    const today = new Date()

    if (!isSameDay(workoutDate, today)) {
      todayWorkoutCard.innerHTML = `
        <h3 class="workout-title">No Workout Planned</h3>
        <p>Click the "Add Workout" button to generate a workout for today.</p>
      `
    }
  } catch (error) {
    console.error("Error checking today's workout:", error)
    todayWorkoutCard.innerHTML = `
      <h3 class="workout-title">Error Loading Workout</h3>
      <p>There was a problem loading your workout. Please try generating a new one.</p>
    `
  }
}
