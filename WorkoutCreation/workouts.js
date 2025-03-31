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
    { name: "Dumbbell Calf Raises", code: "39" }
];

const generateWorkout = (exerciseType, muscleGroups, exerciseCounts, sets, repsMin, repsMax) => {
    let workoutPlan = "";
    for (let i = 0; i < muscleGroups.length; i++) {
        const muscleGroup = muscleGroups[i];
        const exerciseCount = exerciseCounts[i];
        
        if (exerciseCount > 0) {
            let filtered = exercises.filter(ex => ex.code.charAt(0) == exerciseType && ex.code.charAt(1) == muscleGroup);
            
            // Randomly select the specified number of exercises
            let selectedExercises = [];
            if (filtered.length <= exerciseCount) {
                selectedExercises = filtered;
            } else {
                // Shuffle the array and take the first exerciseCount elements
                const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                selectedExercises = shuffled.slice(0, exerciseCount);
            }
            
            selectedExercises.forEach(exercise => {
                workoutPlan += `${exercise.name} - ${sets} sets of ${repsMin}-${repsMax} reps<br>`;
            });
        }
    }
    return workoutPlan;
}

// Calorie calculation function based on user details
const calculateCalories = (age, weight, height, gender, activityLevel) => {
    // Convert height from cm to meters for BMR calculation
    const heightInMeters = height / 100;
    
    // Calculate BMR 
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Apply activity multiplier based on skill level
    let tdee;
    switch (activityLevel) {
        case 1: // Moderate exercise (3 days/week)
            tdee = bmr * 1.375;
            break;
        case 2: // Active (4 days/week)
            tdee = bmr * 1.55;
            break;
        case 3: // Very active (5 days/week)
            tdee = bmr * 1.725;
            break;
        default:
            tdee = bmr * 1.2; // Sedentary fallback
    }
    
    // Round to nearest 10
    tdee = Math.round(tdee / 10) * 10;
    
    // Calculate bulking and cutting calories
    const bulkingCalories = Math.round((tdee + 300) / 10) * 10;
    const cuttingCalories = Math.round((tdee - 500) / 10) * 10;
    
    return {
        maintenance: tdee,
        bulking: bulkingCalories,
        cutting: cuttingCalories
    };
}

const updateDashboard = (workoutOutput) => {
    // Parse the generated workout HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = workoutOutput;
    
    // Extract days per week
    const daysPerWeekMatch = workoutOutput.match(/Workout days per week: (\d+)/);
    const daysPerWeek = daysPerWeekMatch ? parseInt(daysPerWeekMatch[1]) : 3;
    
    // Extract all workout sections (PULL, PUSH, LEGS, etc.)
    const sections = tempDiv.querySelectorAll('strong');
    const workoutSections = [];
    
    for (let i = 0; i < sections.length; i++) {
        const sectionTitle = sections[i].textContent.replace(':', '');
        const sectionExercises = [];
        
        // Find all exercises in this section
        let nextBr = sections[i].nextSibling;
        while (nextBr) {
            if (nextBr.nodeType === 1 && nextBr.tagName === 'BR') {
                let exerciseLine = nextBr.nextSibling;
                if (exerciseLine && exerciseLine.nodeType === 3) { // Text node
                    const line = exerciseLine.textContent.trim();
                    if (line && line.includes(' - ')) {
                        const parts = line.split(' - ');
                        const name = parts[0].trim();
                        if (parts[1] && parts[1].includes(' sets of ')) {
                            const setsPart = parts[1].split(' sets of ');
                            const sets = parseInt(setsPart[0]);
                            const reps = setsPart[1].replace(' reps', '');
                            
                            sectionExercises.push({ name, sets, reps });
                        }
                    }
                }
            }
            
            if (nextBr.nodeType === 1 && (nextBr.tagName === 'STRONG' || nextBr.tagName === 'DIV')) {
                break;
            }
            
            nextBr = nextBr.nextSibling;
        }
        
        let nextNode = sections[i].nextSibling;
        if (nextNode && nextNode.nodeType === 3) { 
            const lines = nextNode.textContent.split('\n');
            lines.forEach(line => {
                line = line.trim();
                if (line && line.includes(' - ')) {
                    const parts = line.split(' - ');
                    const name = parts[0].trim();
                    if (parts[1] && parts[1].includes(' sets of ')) {
                        const setsPart = parts[1].split(' sets of ');
                        const sets = parseInt(setsPart[0]);
                        const reps = setsPart[1].replace(' reps', '');
                        
                        sectionExercises.push({ name, sets, reps });
                    }
                }
            });
        }
        
        const lines = workoutOutput.split('<br>');
        let collectingForSection = false;
        
        lines.forEach(line => {
            line = line.trim();
            if (line.includes(`<strong>${sectionTitle}:</strong>`)) {
                collectingForSection = true;
                return;
            }
            
            if (collectingForSection && line.includes('<strong>')) {
                collectingForSection = false;
                return;
            }
            
            if (collectingForSection && line && line.includes(' - ')) {
                const parts = line.split(' - ');
                const name = parts[0].trim();
                if (parts[1] && parts[1].includes(' sets of ')) {
                    const setsPart = parts[1].split(' sets of ');
                    const sets = parseInt(setsPart[0]);
                    const reps = setsPart[1].replace(' reps', '');
                    
                
                    const existingIndex = sectionExercises.findIndex(ex => ex.name === name);
                    if (existingIndex === -1) {
                        sectionExercises.push({ name, sets, reps });
                    }
                }
            }
        });
        
        if (sectionExercises.length > 0) {
            workoutSections.push({
                title: sectionTitle,
                exercises: sectionExercises
            });
        }
    }
    
    console.log("Parsed workout sections:", workoutSections);
    
    let calorieInfo = null;
    const calorieSection = tempDiv.querySelector('.calorie-info');
    if (calorieSection) {
        const calorieItems = calorieSection.querySelectorAll('li');
        calorieInfo = {};
        
        calorieItems.forEach(item => {
            const text = item.textContent;
            if (text.includes('Maintenance')) {
                const calories = parseInt(text.match(/\d+/)[0]);
                calorieInfo.maintenance = calories;
            } else if (text.includes('Bulking')) {
                const calories = parseInt(text.match(/\d+/)[0]);
                calorieInfo.bulking = calories;
            } else if (text.includes('Cutting')) {
                const calories = parseInt(text.match(/\d+/)[0]);
                calorieInfo.cutting = calories;
            }
        });
    }
    
    
    if (workoutSections.length === 0) {
        const exerciseLines = workoutOutput.split('<br>').filter(line => 
          line.includes(' - ') && !line.includes('Workout days per week:'));
        
        const extractedExercises = [];
        exerciseLines.forEach(line => {
          if (line && line.includes(' - ')) {
            const parts = line.split(' - ');
            const name = parts[0].trim();
            if (parts[1] && parts[1].includes(' sets of ')) {
              const setsPart = parts[1].split(' sets of ');
              const sets = parseInt(setsPart[0]);
              const reps = setsPart[1].replace(' reps', '');
              
              extractedExercises.push({ name, sets, reps });
            }
          }
        });
        
        if (extractedExercises.length > 0) {
            workoutSections.push({
                title: "Workout",
                exercises: extractedExercises
            });
        }
    }
    

    const today = new Date();
    const currentDayIndex = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Create workouts for the week
    const weeklyWorkouts = {};
    
    //  distribute workouts based on number of sections and days per week
    if (workoutSections.length === 0) {
        console.error("No workout sections found");
        return;
    }
    
    // Create a workout for today first
    const todayName = dayNames[currentDayIndex];
    let todayWorkoutSection = workoutSections[0]; // Default to first section
    
    // For today's workout, use the first section
    weeklyWorkouts[todayName] = {
        title: todayWorkoutSection.title,
        description: `${todayWorkoutSection.title} workout`,
        exercises: todayWorkoutSection.exercises,
        date: today.toISOString(),
        completed: false,
        calorieInfo: calorieInfo
    };
    
    //  distributing workouts
    let dayIncrement = Math.floor(7 / workoutSections.length);
    if (dayIncrement < 1) dayIncrement = 1;
    
    // Distribute the rest of the workouts across the week
    let currentSectionIndex = 1; 
    for (let i = 1; i < 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const dayName = dayNames[nextDayIndex];
        
        // If we've used all workout sections, cycle back to the beginning
        if (currentSectionIndex >= workoutSections.length) {
            currentSectionIndex = 0;
        }
        
        // Only assign workouts up to the specified days per week
        if (i < daysPerWeek) {
            const section = workoutSections[currentSectionIndex];
            
            weeklyWorkouts[dayName] = {
                title: section.title,
                description: `${section.title} workout`,
                exercises: section.exercises,
                date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
                completed: false,
                calorieInfo: calorieInfo
            };
            
            // Advance to the next section for the next day
            currentSectionIndex++;
        } else {
            // Rest days
            weeklyWorkouts[dayName] = {
                title: "Rest Day",
                description: "Recovery day",
                exercises: [],
                date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
                completed: false
            };
        }
    }
    
    console.log("Generated weekly workouts:", weeklyWorkouts);
    
    // Send the workout data to the parent window
    window.parent.postMessage({
        type: 'workoutGenerated',
        workout: weeklyWorkouts[todayName], // Today's workout
        weeklyWorkouts: weeklyWorkouts // All workouts for the week
    }, '*');
    
    // Also update the local workout output display
    document.getElementById("workoutOutput").innerHTML = workoutOutput;
};
// Update the status in the weekly workout list
const updateWeeklyWorkoutStatus = (dashboardWindow) => {
    const today = new Date();
    const dayIndex = today.getDay(); 
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
    
    const weeklyWorkoutsList = dashboardWindow.document.getElementById("weeklyWorkoutsList");
    if (weeklyWorkoutsList) {
      const workoutCards = weeklyWorkoutsList.querySelectorAll('.workout-card');
      workoutCards.forEach(card => {
        const dayElement = card.querySelector('.workout-day');
        if (dayElement && dayElement.textContent === dayName) {
          const statusElement = card.querySelector('.workout-status');
          if (statusElement) {
            statusElement.classList.add('completed');
          }
        }
      });
    }
};

// Update weekly workout data
const updateWeeklyWorkout = (dashboardWindow, workoutData) => {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
    
    const weeklyWorkoutsList = dashboardWindow.document.getElementById("weeklyWorkoutsList");
    if (weeklyWorkoutsList) {
      const workoutCards = weeklyWorkoutsList.querySelectorAll('.workout-card');
      
      workoutCards.forEach(card => {
        const dayElement = card.querySelector('.workout-day');
        if (dayElement && dayElement.textContent === dayName) {
          // Update title
          const titleElement = card.querySelector('.workout-title');
          if (titleElement) {
            titleElement.textContent = workoutData.title;
          }
          
          // Update description
          const descriptionElement = card.querySelector('.workout-description');
          if (descriptionElement) {
            descriptionElement.textContent = "Generated workout";
          }
          
          // Update exercise list
          const exerciseListId = card.querySelector('.see-more-btn')?.dataset.targetId;
          if (exerciseListId) {
            const exerciseList = dashboardWindow.document.getElementById(exerciseListId);
            if (exerciseList) {
              exerciseList.innerHTML = '';
              
              workoutData.exercises.forEach(exercise => {
                const exerciseItem = dashboardWindow.document.createElement("li");
                exerciseItem.className = "exercise-item";
                exerciseItem.textContent = `${exercise.name}: ${exercise.sets} sets x ${exercise.reps}`;
                exerciseList.appendChild(exerciseItem);
              });
            }
          }
        }
      });
    }
};

document.getElementById("generateWorkoutBtn").addEventListener("click", () => {
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

    const calorieInfo = calculateCalories(age, weight, height, gender, skillLevel);
    
    workoutOutput += `<br><br><div class="calorie-info">`;
    workoutOutput += `<h3>Calorie Information</h3>`;
    workoutOutput += `<p>Based on your age (${age}), weight (${weight}kg), height (${height}cm), gender (${gender}) and activity level:</p>`;
    workoutOutput += `<ul>`;
    workoutOutput += `<li><strong>Maintenance Calories:</strong> ${calorieInfo.maintenance} calories/day</li>`;
    workoutOutput += `<li><strong>Bulking Calories:</strong> ${calorieInfo.bulking} calories/day</li>`;
    workoutOutput += `<li><strong>Cutting Calories:</strong> ${calorieInfo.cutting} calories/day</li>`;
    workoutOutput += `</ul></div>`;

    document.getElementById("workoutOutput").innerHTML = workoutOutput;
    
    updateDashboard(workoutOutput);
}); 