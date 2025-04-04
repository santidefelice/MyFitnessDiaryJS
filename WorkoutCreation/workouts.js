import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {collection, addDoc, getDocs, getFirestore, doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";


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
const db = getFirestore(app)

const skillLevelEL = document.getElementById("skillLevel")
const splitChoiceEL = document.getElementById("splitChoice")
const exerciseTypeEL = document.getElementById("exerciseType")
const ageEL = document.getElementById("age")
const weightEL = document.getElementById("weight")
const heightEL = document.getElementById("height")
const genderEL = document.getElementById("gender")

const generateWorkoutBtnEL = document.getElementById("generateWorkoutBtn")

async function addUser(
  skillLevel,
  splitChoice,
  exerciseType,
  age,
  weight,
  height,
  gender,
  workoutText,
  calorieInfo
) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      skillLevel: skillLevel,
      splitChoice: splitChoice,
      exerciseType: exerciseType,
      age: age,
      weight: weight,
      height: height,
      gender: gender,

      workoutPlan: workoutText,

      maintenanceCalories: calorieInfo.maintenance,
      bulkingCalories: calorieInfo.bulking,
      cuttingCalories: calorieInfo.cutting,
    })
    console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}



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
]

const generateWorkout = (
  exerciseType,
  muscleGroups,
  exerciseCounts,
  sets,
  repsMin,
  repsMax
) => {
  let workoutPlan = ""
  for (let i = 0; i < muscleGroups.length; i++) {
    const muscleGroup = muscleGroups[i]
    const exerciseCount = exerciseCounts[i]

    if (exerciseCount > 0) {
      let filtered = exercises.filter(
        (ex) =>
          ex.code.charAt(0) == exerciseType && ex.code.charAt(1) == muscleGroup
      )

      let selectedExercises = []
      if (filtered.length <= exerciseCount) {
        selectedExercises = filtered
      } else {
        const shuffled = [...filtered].sort(() => 0.5 - Math.random())
        selectedExercises = shuffled.slice(0, exerciseCount)
      }

      selectedExercises.forEach((exercise) => {
        workoutPlan += `${exercise.name} - ${sets} sets of ${repsMin}-${repsMax} reps<br>`
      })
    }
  }
  return workoutPlan
}


// Calorie calculation function based on user details
const calculateCalories = (age, weight, height, gender, activityLevel) => {
  const heightInMeters = height / 100

  // Calculate BMR
  let bmr
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Apply activity multiplier based on skill level
  let tdee
  switch (activityLevel) {
    case 1: // Moderate exercise (3 days/week)
      tdee = bmr * 1.375
      break
    case 2: // Active (4 days/week)
      tdee = bmr * 1.55
      break
    case 3: // Very active (5 days/week)
      tdee = bmr * 1.725
      break
    default:
      tdee = bmr * 1.2 // Sedentary fallback
  }

  // Round to nearest 10
  tdee = Math.round(tdee / 10) * 10

  // Calculate bulking and cutting calories
  const bulkingCalories = Math.round((tdee + 300) / 10) * 10
  const cuttingCalories = Math.round((tdee - 500) / 10) * 10

  return {
    maintenance: tdee,
    bulking: bulkingCalories,
    cutting: cuttingCalories,
  }
}

document.getElementById("generateWorkoutBtn").addEventListener("click", async () => {
   const skillLevel = parseInt(document.getElementById("skillLevel").value);
   const splitChoice = parseInt(document.getElementById("splitChoice").value);
   const exerciseType = parseInt(document.getElementById("exerciseType").value);
  
  
   // Get user physical details
   const age = parseInt(document.getElementById("age").value);
   const weight = parseFloat(document.getElementById("weight").value);
   const height = parseFloat(document.getElementById("height").value);
   const gender = document.getElementById("gender").value;
  
   // Validate user inputs
   if (isNaN(age) || isNaN(weight) || isNaN(height)) {
       alert("Please enter valid age, weight, and height values");
       return;
   }


   let sets = 0, repsMin = 0, repsMax = 0, daysPerWeek = 0;


   switch (skillLevel) {
       case 1:
           sets = 3;
           repsMin = 8;
           repsMax = 12;
           daysPerWeek = 3;
           break;
       case 2:
           sets = 4;
           repsMin = 10;
           repsMax = 15;
           daysPerWeek = 4;
           break;
       case 3:
           sets = 4;
           repsMin = 8;
           repsMax = 15;
           daysPerWeek = 5;
           break;
       default:
           alert("Invalid skill level");
           return;
   }


   let workoutOutput = `Workout days per week: ${daysPerWeek}<br><br>`;
  
   switch (splitChoice) {
       case 1: // Pull, Push, Legs
           workoutOutput += "<strong>PULL:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [1, 2],
               skillLevel === 1 ? [2, 1] : skillLevel === 2 ? [3, 1] : [4, 2],
               sets,
               repsMin,
               repsMax
           );
          
           workoutOutput += "<br><strong>PUSH:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [3, 4, 5],
               skillLevel === 1 ? [1, 1, 1] : skillLevel === 2 ? [2, 1, 1] : [3, 2, 2],
               sets,
               repsMin,
               repsMax
           );
          
           workoutOutput += "<br><strong>LEGS:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [6, 7, 8, 9],
               skillLevel === 1 ? [1, 1, 1, 0] : skillLevel === 2 ? [1, 1, 1, 1] : [2, 1, 2, 1],
               sets,
               repsMin,
               repsMax
           );
           break;
          
       case 2: // Upper, Lower
           workoutOutput += "<strong>UPPER:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [1, 2, 3, 4, 5],
               skillLevel === 1 ? [1, 0, 1, 0, 1] : skillLevel === 2 ? [1, 1, 1, 0, 1] : [2, 1, 1, 1, 1],
               sets,
               repsMin,
               repsMax
           );
          
           workoutOutput += "<br><strong>LOWER:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [6, 7, 8, 9],
               skillLevel === 1 ? [1, 1, 1, 0] : skillLevel === 2 ? [1, 1, 1, 1] : [2, 2, 2, 1],
               sets,
               repsMin,
               repsMax
           );
           break;
          
       case 3: // Torso, Arms, Legs
           workoutOutput += "<strong>TORSO:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [1, 3],
               skillLevel === 1 ? [1, 2] : skillLevel === 2 ? [2, 2] : [3, 3],
               sets,
               repsMin,
               repsMax
           );
          
           workoutOutput += "<br><strong>ARMS:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [2, 4, 5],
               skillLevel === 1 ? [1, 1, 1] : skillLevel === 2 ? [1, 2, 1] : [2, 2, 2],
               sets,
               repsMin,
               repsMax
           );
          
           workoutOutput += "<br><strong>LEGS:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [6, 7, 8, 9],
               skillLevel === 1 ? [1, 1, 1, 0] : skillLevel === 2 ? [1, 1, 1, 1] : [2, 2, 2, 1],
               sets,
               repsMin,
               repsMax
           );
           break;
          
       case 4: // Full Body
           workoutOutput += "<strong>FULL BODY:</strong><br>";
           workoutOutput += generateWorkout(
               exerciseType,
               [1, 3, 5, 6, 7],
               skillLevel === 1 ? [1, 1, 0, 1, 0] : skillLevel === 2 ? [1, 1, 0, 1, 1] : [1, 1, 1, 1, 1],
               sets,
               repsMin,
               repsMax
           );
           break;
          
       default:
           alert("Invalid split choice");
           return;
   }


   // Calculate calorie needs based on user details and skill level
   const calorieInfo = calculateCalories(age, weight, height, gender, skillLevel);
  
   // Calorie information to the output
   workoutOutput += `<br><br><div class="calorie-info">`;
   workoutOutput += `<h3>Calorie Information</h3>`;
   workoutOutput += `<p>Based on your age (${age}), weight (${weight}kg), height (${height}cm), gender (${gender}) and activity level:</p>`;
   workoutOutput += `<ul>`;
   workoutOutput += `<li><strong>Maintenance Calories:</strong> ${calorieInfo.maintenance} calories/day</li>`;
   workoutOutput += `<li><strong>Bulking Calories:</strong> ${calorieInfo.bulking} calories/day</li>`;
   workoutOutput += `<li><strong>Cutting Calories:</strong> ${calorieInfo.cutting} calories/day</li>`;
   workoutOutput += `</ul></div>`;


   document.getElementById("workoutOutput").innerHTML = workoutOutput;

   try {
       const auth = getAuth();

       const checkAuth = () => {
           return new Promise((resolve) => {
               const unsubscribe = onAuthStateChanged(auth, (user) => {
                   unsubscribe(); // Stop listening after first response
                   resolve(user);
               });
           });
       };

       const user = await checkAuth();

       if (!user) {
           alert("You need to be logged in to generate and save a workout.");
           // Optionally redirect to login page
           window.location.href = "/Login/index.html";
           return;
       }

       const uid = user.uid;
       const userDocId = localStorage.getItem('userDocId');

       const workoutText = workoutOutput.toString().replace(/<[^>]*>?/gm, '');

       const workoutDocRef = await addDoc(collection(db, "workouts"), {
           uid: uid,  // User's auth ID
           userDocId: userDocId, // Reference to user document
           skillLevel: skillLevel,
           splitChoice: splitChoice,
           exerciseType: exerciseType,
           age: age,
           weight: weight,
           height: height,
           gender: gender,
           workoutPlan: workoutText,
           maintenanceCalories: calorieInfo.maintenance,
           bulkingCalories: calorieInfo.bulking,
           cuttingCalories: calorieInfo.cutting,
           createdAt: new Date()
       });

       if (userDocId) {
           try {
               const userRef = doc(db, "users", userDocId);
               await updateDoc(userRef, {
                   workouts: arrayUnion(workoutDocRef.id)
               });
               console.log("User document updated with workout reference");
           } catch (updateError) {
               console.error("Error updating user document:", updateError);
               // This error shouldn't prevent the workout from being saved
           }
       }

       alert("Workout and calorie information saved successfully!");

      // Parse exercises by workout type
      const exercisesByType = parseExercisesByType(workoutOutput);
      
      // Get today's day of the week
      const today = new Date();
      const dayIndex = today.getDay(); 
      const dayName = getDayNames()[dayIndex];
      
      // Create weekly workouts object
      let weeklyWorkouts = null;
      if (splitChoice !== 4) { // Not full body
        weeklyWorkouts = createWeeklyWorkoutPlan(
          splitChoice,
          skillLevel,
          exercisesByType
        );
      } else {
        const allExercises = Object.values(exercisesByType).flat();
        weeklyWorkouts = createFullBodyWeeklyPlan(
          skillLevel,
          allExercises
        );
      }
      
      // Set today's workout based on the weekly plan
      let todayWorkout;
      if (weeklyWorkouts && weeklyWorkouts[dayName]) {
        todayWorkout = weeklyWorkouts[dayName];
      } else {
        // Fallback if no workout is planned for today
        const allExercises = Object.values(exercisesByType).flat();
        todayWorkout = {
          title: `${getWorkoutSplitName(splitChoice)} Workout`,
          description: `${getSkillLevelName(skillLevel)} workout with ${allExercises.length} exercises`,
          exercises: allExercises,
          date: new Date().toISOString(),
          completed: false,
        };
      }

      window.parent.postMessage(
        {
            type: "workoutGenerated",
            workout: todayWorkout,
            weeklyWorkout: weeklyWorkouts,
        },
        "*"
      );
    } catch (error) {
      console.error("Error saving workout: ", error);
      alert("Failed to save workout. Please try again.");
    }
  });

// Parse exercises from workout HTML text by workout type
function parseExercisesByType(workoutHtml) {
  const exercisesByType = {
    Pull: [],
    Push: [],
    Legs: [],
    Upper: [],
    Lower: [],
    Torso: [],
    Arms: [],
    FullBody: []
  };
  
  // Split the HTML by workout type headers
  const sections = workoutHtml.split(/<strong>([^<]+):<\/strong><br>/);
  
  let currentType = null;
  for (let i = 0; i < sections.length; i++) {
    if (i % 2 === 1) { // This is a header
      currentType = sections[i].trim();
    } else if (i > 0 && currentType) { // This is content after a header
      const content = sections[i];
      const regex = /([^<>-]+) - (\d+) sets of (\d+)-(\d+) reps/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const exercise = {
          name: match[1].trim(),
          sets: parseInt(match[2]),
          repsMin: parseInt(match[3]),
          repsMax: parseInt(match[4]),
        };
        
        // Map the section header to our exercise type keys
        if (currentType === "PULL") exercisesByType.Pull.push(exercise);
        else if (currentType === "PUSH") exercisesByType.Push.push(exercise);
        else if (currentType === "LEGS") exercisesByType.Legs.push(exercise);
        else if (currentType === "UPPER") exercisesByType.Upper.push(exercise);
        else if (currentType === "LOWER") exercisesByType.Lower.push(exercise);
        else if (currentType === "TORSO") exercisesByType.Torso.push(exercise);
        else if (currentType === "ARMS") exercisesByType.Arms.push(exercise);
        else if (currentType === "FULL BODY") exercisesByType.FullBody.push(exercise);
      }
    }
  }
  
  return exercisesByType;
}

// Parse all exercises from workout HTML text (for backward compatibility)
function parseExercisesFromWorkoutText(workoutHtml) {
  const exercises = [];
  const regex = /([^<>-]+) - (\d+) sets of (\d+)-(\d+) reps/g;
  let match;

  while ((match = regex.exec(workoutHtml)) !== null) {
    exercises.push({
      name: match[1].trim(),
      sets: parseInt(match[2]),
      repsMin: parseInt(match[3]),
      repsMax: parseInt(match[4]),
    });
  }

  return exercises;
}

// Get workout split name based on the split choice
function getWorkoutSplitName(splitChoice) {
  switch (splitChoice) {
    case 1:
      return "Pull/Push/Legs"
    case 2:
      return "Upper/Lower"
    case 3:
      return "Torso/Arms/Legs"
    case 4:
      return "Full Body"
    default:
      return "Custom"
  }
}

// Get skill level name based on the level
function getSkillLevelName(skillLevel) {
  switch (skillLevel) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return "Custom"
  }
}

// Create weekly workout plan with proper distribution of workouts and rest days
function createWeeklyWorkoutPlan(splitChoice, skillLevel, exercisesByType) {
  const days = getDayNames();
  const weeklyWorkouts = {};
  const daysPerWeek = skillLevel === 1 ? 3 : skillLevel === 2 ? 4 : 5;
  
  let workoutTypes = [];
  switch (splitChoice) {
    case 1: 
      workoutTypes = ["Pull", "Push", "Legs"];
      break;
    case 2: 
      workoutTypes = ["Upper", "Lower"];
      break;
    case 3: 
      workoutTypes = ["Torso", "Arms", "Legs"];
      break;
    default:
      workoutTypes = ["FullBody"];
  }
  

  const workoutDayIndices = getWorkoutDayIndices(daysPerWeek, workoutTypes.length);
  
  // Initialize all days as rest days first
  for (let i = 0; i < days.length; i++) {
    weeklyWorkouts[days[i]] = {
      title: "Rest Day",
      description: "Recovery day - no planned workout",
      exercises: [],
      date: new Date().toISOString(),
      completed: false,
    };
  }
  
  // Assign workouts to workout days
  let typeIndex = 0;
  for (const dayIndex of workoutDayIndices) {
    const day = days[dayIndex];
    const workoutType = workoutTypes[typeIndex % workoutTypes.length];
    typeIndex++;
    
    // Get exercises for this workout type
    const exercisesForDay = exercisesByType[workoutType] || [];
    
    weeklyWorkouts[day] = {
      title: `${workoutType} Day`,
      description: `${getSkillLevelName(skillLevel)} ${workoutType} workout`,
      exercises: exercisesForDay,
      date: new Date().toISOString(),
      completed: false,
    };
  }
  
  return weeklyWorkouts;
}

// Create a full body weekly plan
function createFullBodyWeeklyPlan(skillLevel, exercises) {
  const days = getDayNames();
  const weeklyWorkouts = {};
  const daysPerWeek = skillLevel === 1 ? 3 : skillLevel === 2 ? 4 : 5;
  
  // Determine workout days for full body
  const workoutDayIndices = getWorkoutDayIndices(daysPerWeek, 1);
  
  // Initialize all days as rest days first
  for (let i = 0; i < days.length; i++) {
    weeklyWorkouts[days[i]] = {
      title: "Rest Day",
      description: "Recovery day - no planned workout",
      exercises: [],
      date: new Date().toISOString(),
      completed: false,
    };
  }
  
  // Assign full body workouts to workout days
  for (const dayIndex of workoutDayIndices) {
    const day = days[dayIndex];
    
    weeklyWorkouts[day] = {
      title: "Full Body Day",
      description: `${getSkillLevelName(skillLevel)} Full Body workout`,
      exercises: exercises,
      date: new Date().toISOString(),
      completed: false,
    };
  }
  
  return weeklyWorkouts;
}

// Helper function to determine which days of the week should be workout days
function getWorkoutDayIndices(daysPerWeek, splitLength) {
  // Start from Monday (index 1) for most workout plans
  const indices = [];
  
  switch (daysPerWeek) {
    case 3:
      if (splitLength === 3) {
        // Mon, Wed, Fri for 3-day splits
        indices.push(1, 3, 5);
      } else {
        // Mon, Wed, Fri for other splits with 3 days
        indices.push(1, 3, 5);
      }
      break;
    case 4:
      if (splitLength === 2) {
        // Mon, Tue, Thu, Fri for Upper/Lower
        indices.push(1, 2, 4, 5);
      } else {
        // Mon, Tue, Thu, Fri for other splits with 4 days
        indices.push(1, 2, 4, 5);
      }
      break;
    case 5:
      // Mon through Fri for 5-day splits
      indices.push(1, 2, 3, 4, 5);
      break;
    default:
      // Default to Mon, Wed, Fri
      indices.push(1, 3, 5);
  }
  
  return indices;
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
