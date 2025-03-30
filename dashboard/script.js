document.addEventListener("DOMContentLoaded", function () {
  // Update current date
  const currentDateElement = document.getElementById("currentDate")
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  const today = new Date()
  currentDateElement.textContent = today.toLocaleDateString("en-US", options)

  // Today's workout data
  const todayWorkoutCard = document.getElementById("todayWorkoutCard")
  const todayWorkout = {
    //dummy values
    title: "Upper Body Strength",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "Pull-ups", sets: 3, reps: 8 },
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Bicep Curls", sets: 3, reps: 12 },
    ],
  }
  

  // Create today's workout content
  const workoutTitle = document.createElement("h3")
  workoutTitle.textContent = todayWorkout.title
  workoutTitle.className = "workout-title"
  todayWorkoutCard.appendChild(workoutTitle)

  const exerciseList = document.createElement("ul")
  exerciseList.className = "exercise-list-today"

  todayWorkout.exercises.forEach((exercise) => {
    const exerciseItem = document.createElement("li")
    exerciseItem.className = "exercise-item-today"
    exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`
    exerciseList.appendChild(exerciseItem)
  })

  todayWorkoutCard.appendChild(exerciseList)

  // Weekly workouts data
  const weeklyWorkoutsList = document.getElementById("weeklyWorkoutsList")
  const weeklyWorkouts = [
    {
      day: "Monday",
      title: "Upper Body",
      description: "Focus on chest, shoulders, and triceps",
      completed: true,
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8 },
        { name: "Incline Dumbbell Press", sets: 3, reps: 10 },
        { name: "Lateral Raises", sets: 3, reps: 12 },
        { name: "Tricep Pushdowns", sets: 3, reps: 12 },
      ],
    },
    {
      day: "Tuesday",
      title: "Lower Body",
      description: "Focus on quads, hamstrings, and calves",
      completed: true,
      exercises: [
        { name: "Barbell Squats", sets: 4, reps: 8 },
        { name: "Romanian Deadlifts", sets: 3, reps: 10 },
        { name: "Leg Extensions", sets: 3, reps: 12 },
        { name: "Calf Raises", sets: 4, reps: 15 },
      ],
    },
    {
      day: "Wednesday",
      title: "Rest Day",
      description: "Active recovery with light stretching",
      completed: true,
      exercises: [
        { name: "Foam Rolling", sets: 1, reps: "10 mins" },
        { name: "Dynamic Stretching", sets: 1, reps: "15 mins" },
        { name: "Yoga", sets: 1, reps: "20 mins" },
      ],
    },
    {
      day: "Thursday",
      title: "Back & Biceps",
      description: "Focus on back width, thickness, and biceps",
      completed: false,
      exercises: [
        { name: "Pull-ups", sets: 4, reps: 8 },
        { name: "Barbell Rows", sets: 3, reps: 10 },
        { name: "Lat Pulldowns", sets: 3, reps: 12 },
        { name: "Bicep Curls", sets: 3, reps: 12 },
      ],
    },
    {
      day: "Friday",
      title: "Lower Body",
      description: "Focus on glutes and hamstrings",
      completed: false,
      exercises: [
        { name: "Deadlifts", sets: 4, reps: 6 },
        { name: "Hip Thrusts", sets: 3, reps: 12 },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg" },
        { name: "Leg Curls", sets: 3, reps: 12 },
      ],
    },
    {
      day: "Saturday",
      title: "Cardio",
      description: "HIIT session for fat burning",
      completed: false,
      exercises: [
        { name: "Sprints", sets: 10, reps: "30 sec on, 30 sec off" },
        { name: "Jumping Jacks", sets: 3, reps: "45 seconds" },
        { name: "Burpees", sets: 3, reps: 15 },
        { name: "Mountain Climbers", sets: 3, reps: "45 seconds" },
      ],
    },
    {
      day: "Sunday",
      title: "Rest Day",
      description: "Complete rest",
      completed: false,
      exercises: [{ name: "Relaxation", sets: 1, reps: "All day" }],
    },
  ]

  //  weekly workouts content with cards
  weeklyWorkouts.forEach((workout, index) => {
    //  workout card
    const workoutCard = document.createElement("div")
    workoutCard.className = "workout-card"

    //  card header
    const cardHeader = document.createElement("div")
    cardHeader.className = "workout-card-header"

    const dayElement = document.createElement("div")
    dayElement.className = "workout-day"
    dayElement.textContent = workout.day

    const statusElement = document.createElement("div")
    statusElement.className = "workout-status"
    if (workout.completed) {
      statusElement.classList.add("completed")
    }

    cardHeader.appendChild(dayElement)
    cardHeader.appendChild(statusElement)
    workoutCard.appendChild(cardHeader)

    //  card body
    const cardBody = document.createElement("div")
    cardBody.className = "workout-card-body"

    const titleElement = document.createElement("h3")
    titleElement.className = "workout-title"
    titleElement.textContent = workout.title

    const descriptionElement = document.createElement("p")
    descriptionElement.className = "workout-description"
    descriptionElement.textContent = workout.description

    cardBody.appendChild(titleElement)
    cardBody.appendChild(descriptionElement)

    //  exercise list
    const exerciseList = document.createElement("ul")
    exerciseList.className = "exercise-list"
    exerciseList.id = `exercise-list-${index}`

    workout.exercises.forEach((exercise) => {
      const exerciseItem = document.createElement("li")
      exerciseItem.className = "exercise-item"
      exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${exercise.reps}`
      exerciseList.appendChild(exerciseItem)
    })

    cardBody.appendChild(exerciseList)

    // "See More" button
    const seeMoreBtn = document.createElement("button")
    seeMoreBtn.className = "see-more-btn"
    seeMoreBtn.textContent = "See Exercises"
    seeMoreBtn.dataset.targetId = `exercise-list-${index}`
    seeMoreBtn.addEventListener("click", function () {
      const targetList = document.getElementById(this.dataset.targetId)
      targetList.classList.toggle("visible")
      this.textContent = targetList.classList.contains("visible")
        ? "Hide Exercises"
        : "See Exercises"
    })

    cardBody.appendChild(seeMoreBtn)
    workoutCard.appendChild(cardBody)

    // Add card to the list
    weeklyWorkoutsList.appendChild(workoutCard)
  })

  // Add event listeners
  const profileBtn = document.getElementById("profileBtn")
  profileBtn.addEventListener("click", function () {
    alert("Profile settings")
  })

  const viewAllBtn = document.getElementById("viewAllBtn")
  viewAllBtn.addEventListener("click", function () {
    alert("View all workouts")
  })

  const addWorkoutBtn = document.getElementById("addWorkoutBtn")
  addWorkoutBtn.addEventListener("click", function () {
    alert("Add new workout")
  })
})
