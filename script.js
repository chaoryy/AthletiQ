// Activity level slider
const activitySlider = document.getElementById("activity");
const activityValue = document.getElementById("activity-value");

const activityLabels = {
    1: "Very Low",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Very High"
};

activitySlider.addEventListener("input", () => {
    activityValue.textContent = activityLabels[activitySlider.value];
});


// Goal selection
const goalButtons = document.querySelectorAll("#goal-group button");
let selectedGoal = null;

goalButtons.forEach(button => {
    button.addEventListener("click", () => {
        goalButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedGoal = button.getAttribute("data-goal");
    });
});

// Formula selection
const formulaButtons = document.querySelectorAll("#formula-group button");
let selectedFormula = null;

formulaButtons.forEach(button => {
    button.addEventListener("click", () => {
        formulaButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedFormula = button.getAttribute("data-formula");
    });
});

// Calculate calories
document.getElementById("calculate").addEventListener("click", function () {
    const height = parseInt(document.getElementById("height").value);
    const weight = parseInt(document.getElementById("weight").value);
    const age = parseInt(document.getElementById("age").value);
    const activity = parseFloat(activitySlider.value);

    if (!height || !weight || !age || !selectedGoal || !selectedFormula) {
        document.getElementById("result").textContent = "Please fill in all fields!";
        return;
    }

    let bmr;

    if (selectedFormula === "mifflin") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (selectedFormula === "harris") {
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    }

    const activityMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9][activity - 1];
    let calories = bmr * activityMultiplier;

    if (selectedGoal === "lose") calories -= 500;
    if (selectedGoal === "gain") calories += 500;

    document.getElementById("result").textContent = `Your daily calorie intake: ${Math.round(calories)} kcal`;
});

document.querySelectorAll(".btn-group button").forEach(button => {
    button.addEventListener("click", function() {
        // Убираем активный класс со всех кнопок в этой группе
        this.parentElement.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
        // Добавляем активный класс к нажатой кнопке
        this.classList.add("active");
    });
});


/*output*/
document.getElementById("calculate").addEventListener("click", function () {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;
    const age = parseInt(document.getElementById("age").value);
    const activity = parseInt(document.getElementById("activity").value);
    const goal = document.querySelector("#goal-group button.active")?.dataset.goal || "maintain";
    const formula = document.querySelector("#formula-group button.active")?.dataset.formula || "mifflin";

    if (!weight || !height || !age) {
        alert("Please enter valid data!");
        return;
    }

    // 1. BMI Calculation
    const bmi = (weight / (height * height)).toFixed(1);
    document.querySelector(".bmi-value").textContent = bmi;

    // 2. Base Metabolism Calculation
    let bmr = formula === "mifflin"
        ? (10 * weight) + (6.25 * (height * 100)) - (5 * age) + 5
        : 66 + (13.75 * weight) + (5 * (height * 100)) - (6.8 * age);

    // 3. Activity Multiplier
    const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = bmr * activityMultipliers[activity - 1];

    // 4. Adjust for Goal
    const goalAdjustments = { lose: 0.85, maintain: 1, gain: 1.15 };
    const dailyCalories = Math.round(tdee * goalAdjustments[goal]);

    document.querySelector(".calories-value").textContent = `${dailyCalories} kcal`;

    // 5. Macronutrient Breakdown
    const protein = Math.round((dailyCalories * 0.15) / 4);
    const fat = Math.round((dailyCalories * 0.25) / 9);
    const carbs = Math.round((dailyCalories * 0.60) / 4);

    document.querySelector(".protein").textContent = `${protein} g`;
    document.querySelector(".fat").textContent = `${fat} g`;
    document.querySelector(".carbs").textContent = `${carbs} g`;
});
