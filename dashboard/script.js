import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, addDoc, collection, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Current user
let currentUser = null;

document.addEventListener("DOMContentLoaded", function () {
  updateCurrentDate()
  initializeWeeklyLayout()
  setupEventListeners()
  setupSidebarToggle()
  listenForWorkoutMessages()
  
  // Initialize authentication listener
  initializeAuth()
})

function initializeAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User signed in:", user.uid)
      currentUser = user
      
      // Load user's workout data from Firebase
      loadWorkoutsFromFirebase(user)
    } else {
      console.log("No user signed in. User must log in to use the app.")
      currentUser = null
      
      // Display message to prompt user to sign in
      showSignInMessage()
    }
  })
}

// Display a message prompting user to sign in
function showSignInMessage() {
  const todayWorkoutCard = document.getElementById("todayWorkoutCard")
  if (todayWorkoutCard) {
    todayWorkoutCard.innerHTML = `
      <h3 class="workout-title">Sign In Required</h3>
      <p>Please sign in to view and save your workouts.</p>
      <button id="signInBtn" class="sign-in-btn">Sign In</button>
    `
    
    const signInBtn = document.getElementById("signInBtn")
    if (signInBtn) {
      signInBtn.addEventListener("click", function() {
        // Implement your sign-in logic here
        alert("Please implement sign-in functionality")
      })
    }
  }
  
  // Also update weekly workouts view
  const weeklyWorkoutsList = document.getElementById("weeklyWorkoutsList")
  if (weeklyWorkoutsList) {
    const workoutCards = weeklyWorkoutsList.querySelectorAll('.workout-card')
    workoutCards.forEach(card => {
      const cardBody = card.querySelector('.workout-card-body')
      if (cardBody) {
        const titleElement = cardBody.querySelector('.workout-title')
        if (titleElement) {
          titleElement.textContent = "Sign In Required"
        }
        
        const descriptionElement = cardBody.querySelector('.workout-description')
        if (descriptionElement) {
          descriptionElement.textContent = "Please sign in to view workouts"
        }
      }
    })
  }
}

// Firebase Data Operations
async function loadWorkoutsFromFirebase(user) {
  try {
    const userDocRef = doc(db, "workouts", user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      // Load today's workout if it exists
      if (userData.todayWorkout) {
        const workoutData = userData.todayWorkout
        
        // Check if the workout is from today
        const workoutDate = new Date(workoutData.date)
        const today = new Date()
        
        if (isSameDay(workoutDate, today)) {
          updateTodayWorkout(workoutData)
          updateWeeklyWorkout(workoutData)
        } else {
          displayNoWorkoutMessage()
        }
      } else {
        displayNoWorkoutMessage()
      }
      
      // Load weekly workouts if they exist
      if (userData.weeklyWorkouts) {
        const weeklyWorkouts = userData.weeklyWorkouts
        
        // Update UI with the weekly workouts
        Object.keys(weeklyWorkouts).forEach((day) => {
          updateDayWorkout(day, weeklyWorkouts[day])
        })
      }
      
      console.log("Successfully loaded workouts from Firebase")
    } else {
      // No existing data for this user, initialize their document
      await setDoc(userDocRef, {
        createdAt: new Date().toISOString(),
        weeklyWorkouts: {},
      })
      console.log("Created new user document in Firebase")
      displayNoWorkoutMessage()
    }
  } catch (error) {
    console.error("Error loading workouts from Firebase:", error)
    showMessage("Failed to load workouts from server.", true)
    displayNoWorkoutMessage()
  }
}

function displayNoWorkoutMessage() {
  const todayWorkoutCard = document.getElementById("todayWorkoutCard")
  if (todayWorkoutCard) {
    todayWorkoutCard.innerHTML = `
      <h3 class="workout-title">No Workout Planned</h3>
      <p>Click the "Edit" button to generate a workout plan!.</p>
    `
  }
}

function saveToFirebase(dataType, data) {
  if (!currentUser) {
    console.log("No user signed in. Cannot save data.")
    showMessage("Please sign in to save your workout.", true)
    return Promise.reject(new Error("No user signed in"))
  }
  
  const userDocRef = doc(db, "workouts", currentUser.uid)
  const dataToSave = { [dataType]: data }
  
  return setDoc(userDocRef, dataToSave, { merge: true })
    .then(() => {
      console.log(`${dataType} saved to Firebase successfully`)
      showMessage("Workout saved successfully!", false)
      return true
    })
    .catch((error) => {
      console.error(`Error saving ${dataType} to Firebase:`, error)
      showMessage("Error saving workout. Please try again.", true)
      throw error
    })
}

// Utility function for showing messages
function showMessage(message, isError = false) {
  // Create a floating message element if it doesn't exist
  let messageElement = document.getElementById("floating-message")
  
  if (!messageElement) {
    messageElement = document.createElement("div")
    messageElement.id = "floating-message"
    document.body.appendChild(messageElement)
  }
  
  // Set class based on message type
  messageElement.className = isError ? "error-message" : "success-message"
  messageElement.textContent = message
  messageElement.style.display = "block"
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = "0"
    setTimeout(() => {
      messageElement.style.display = "none"
      messageElement.style.opacity = "1"
    }, 500)
  }, 3000)
}

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
      if (!currentUser) {
        showMessage("Please sign in to add workouts", true)
        return
      }
      
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
      // Check if user is logged in
      if (!currentUser) {
        showMessage("Please sign in to save your workout", true)
        return
      }
      
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
  if (!currentUser) {
    showMessage("Please sign in to save your workouts", true)
    return
  }
  
  // Save to Firebase
  saveToFirebase('weeklyWorkouts', weeklyWorkouts)
    .catch(error => {
      console.error("Error saving weekly workouts:", error)
    })
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
      if (!currentUser) {
        showMessage("Please sign in to mark workouts as completed", true)
        return
      }
      
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
  if (!currentUser) {
    showMessage("Please sign in to update workout status", true)
    return
  }
  
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

      // Get the latest data from Firebase
      const userDocRef = doc(db, "workouts", currentUser.uid)
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data()
            if (userData.weeklyWorkouts && userData.weeklyWorkouts[dayName]) {
              // Update the data
              const updatedWeeklyWorkouts = {
                ...userData.weeklyWorkouts
              }
              updatedWeeklyWorkouts[dayName].completed = true
              
              // Save the updated data back to Firebase
              saveToFirebase('weeklyWorkouts', updatedWeeklyWorkouts)
            }
          }
        })
        .catch((error) => {
          console.error("Error updating weekly workout status:", error)
          showMessage("Failed to update workout status", true)
        })
    }
  }
}

function saveWorkoutData(workoutData) {
  if (!currentUser) {
    showMessage("Please sign in to save workout data", true)
    return
  }
  
  if (!workoutData.date) {
    workoutData.date = new Date().toISOString()
  }

  // Save today's workout to Firebase
  saveToFirebase('todayWorkout', workoutData)
    .then(() => {
      // After saving today's workout, update the weekly workouts
      const today = new Date()
      const dayIndex = today.getDay()
      const dayName = getDayNames()[dayIndex]
      
      // Get the current weekly workouts from Firebase
      const userDocRef = doc(db, "workouts", currentUser.uid)
      return getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data()
            const weeklyWorkouts = userData.weeklyWorkouts || {}
            
            // Update the current day's workout
            weeklyWorkouts[dayName] = workoutData
            
            // Save the updated weekly workouts
            return saveToFirebase('weeklyWorkouts', weeklyWorkouts)
          } else {
            // If no document exists yet, create a new weekly workouts object
            const weeklyWorkouts = {
              [dayName]: workoutData
            }
            return saveToFirebase('weeklyWorkouts', weeklyWorkouts)
          }
        })
    })
    .catch((error) => {
      console.error("Error saving workout data:", error)
      showMessage("Failed to save workout data", true)
    })

  console.log("Workout data save initiated")
}

// Add some CSS for the floating message
document.head.insertAdjacentHTML('beforeend', `
  <style>
    #floating-message {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      display: none;
      transition: opacity 0.5s ease;
    }
    
    .success-message {
      background-color: #4caf50;
      color: white;
    }
    
    .error-message {
      background-color: #f44336;
      color: white;
    }
    
    .sign-in-btn {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .sign-in-btn:hover {
      background-color: #0b7dda;
    }
  </style>
`);