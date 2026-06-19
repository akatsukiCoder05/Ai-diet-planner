import { useState, useEffect } from "react";
import "./App.css";
const API_URL =
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : (import.meta.env.VITE_API_URL || "https://ai-diet-planner-uko9.onrender.com");

const DIET_PRESET_PLANS = {
  cutting: {
    title: "Cutting Protocol (Calorie Deficit)",
    metrics: "Target: 1,800 kcal | P: 150g | C: 130g | F: 50g",
    focus: "Fat Loss & Muscle Retention",
    meals: [
      { name: "Egg White Veggie Omelet", time: "08:00 AM", calories: "350 kcal", protein: "35g", carbs: "8g", fats: "18g", details: "4 egg whites, 1 whole egg, baby spinach, button mushrooms, and 1/4 sliced avocado. Served with green tea." },
      { name: "Grilled Herb Chicken Breast", time: "01:00 PM", calories: "500 kcal", protein: "45g", carbs: "35g", fats: "8g", details: "150g skinless chicken breast, 100g steamed broccoli, and 75g cooked quinoa with fresh lemon juice." },
      { name: "Greek Yogurt & Protein Bowl", time: "05:00 PM", calories: "400 kcal", protein: "35g", carbs: "12g", fats: "22g", details: "200g fat-free plain Greek yogurt, 1 scoop vanilla whey protein, 50g mixed fresh blueberries/raspberries, and 10g chia seeds." },
      { name: "Lemon Baked Salmon Fillet", time: "08:00 PM", calories: "550 kcal", protein: "35g", carbs: "75g", fats: "2g", details: "150g wild-caught salmon fillet baked with asparagus spears and 120g roasted red potatoes." }
    ]
  },
  maintaining: {
    title: "Isocaloric Maintenance",
    metrics: "Target: 2,400 kcal | P: 160g | C: 240g | F: 70g",
    focus: "Energy Balance & Conditioning",
    meals: [
      { name: "Power Banana Oatmeal Bowl", time: "08:00 AM", calories: "550 kcal", protein: "20g", carbs: "75g", fats: "15g", details: "60g rolled oats cooked in almond milk, 1 sliced banana, 15g natural peanut butter, and a pinch of cinnamon." },
      { name: "Mediterranean Turkey Wrap", time: "01:00 PM", calories: "650 kcal", protein: "40g", carbs: "55g", fats: "20g", details: "1 large whole wheat tortilla, 120g sliced turkey breast, 2 tbsp organic hummus, baby spinach, and sliced cucumbers." },
      { name: "Whey Shake & Almond Ingestion", time: "05:00 PM", calories: "450 kcal", protein: "35g", carbs: "25g", fats: "15g", details: "1 scoop chocolate whey protein blended with 250ml milk, 1 red apple, and 20g roasted almonds." },
      { name: "Grilled Sirloin Steak Bowl", time: "08:00 PM", calories: "750 kcal", protein: "45g", carbs: "85g", fats: "20g", details: "150g lean sirloin steak, 150g jasmine rice, roasted green beans, and 1 tsp extra virgin olive oil." }
    ]
  },
  bulking: {
    title: "Hypertrophy Bulking Protocol",
    metrics: "Target: 3,200 kcal | P: 180g | C: 380g | F: 90g",
    focus: "Muscle Mass Gain & Recovery",
    meals: [
      { name: "Heavyweight Eggs & Toast", time: "08:00 AM", calories: "800 kcal", protein: "40g", carbs: "80g", fats: "30g", details: "4 whole eggs scrambled in grass-fed butter, 3 slices of thick whole wheat toast, and 1 whole large avocado." },
      { name: "Beef & Avocado Jasmine Bowl", time: "01:00 PM", calories: "950 kcal", protein: "50g", carbs: "110g", fats: "30g", details: "180g lean ground beef (90/10), 200g cooked jasmine rice, steamed broccoli, and 1/2 avocado." },
      { name: "Anabolic Shake & Honey Oats", time: "05:00 PM", calories: "550 kcal", protein: "40g", carbs: "65g", fats: "12g", details: "1.5 scoops whey protein, 50g instant oats, 1 tbsp organic honey, and 15g natural peanut butter blended with cold water." },
      { name: "Double Chicken & Pasta", time: "08:00 PM", calories: "900 kcal", protein: "50g", carbs: "125g", fats: "18g", details: "180g grilled chicken strips, 150g durum wheat pasta, 100g marinara sauce, and 2 slices of garlic bread." }
    ]
  }
};

const WORKOUT_ROUTINES = {
  "Lose Weight": {
    Monday: {
      focus: "HIIT Cardio & Core",
      exercises: [
        { name: "Jumping Jacks", detail: "3 sets x 45 seconds" },
        { name: "Bodyweight Squats", detail: "3 sets x 20 reps" },
        { name: "Mountain Climbers", detail: "3 sets x 30 seconds" },
        { name: "Plank Hold", detail: "3 sets x 45 seconds" },
        { name: "Burpees", detail: "3 sets x 10 reps" }
      ]
    },
    Tuesday: {
      focus: "Upper Body Strength",
      exercises: [
        { name: "Standard Pushups", detail: "3 sets x 12 reps" },
        { name: "Incline Pushups", detail: "3 sets x 15 reps" },
        { name: "Chair Dips", detail: "3 sets x 10 reps" },
        { name: "Dumbbell Bent-Over Rows", detail: "3 sets x 12 reps" },
        { name: "Superman Hold", detail: "3 sets x 30 seconds" }
      ]
    },
    Wednesday: {
      focus: "Active Recovery & Mobility",
      exercises: [
        { name: "Slow Brisk Walk", detail: "20-30 minutes" },
        { name: "Cat-Cow Stretch", detail: "10 slow breathing cycles" },
        { name: "Child's Pose Hold", detail: "60 seconds" },
        { name: "Downward Facing Dog", detail: "3 sets x 30 seconds" },
        { name: "Hamstring Stretch", detail: "30 seconds per leg" }
      ]
    },
    Thursday: {
      focus: "Lower Body Conditioning",
      exercises: [
        { name: "Walking Lunges", detail: "3 sets x 12 reps per leg" },
        { name: "Glute Bridges", detail: "3 sets x 15 reps" },
        { name: "Sumo Squats", detail: "3 sets x 15 reps" },
        { name: "Calf Raises", detail: "3 sets x 20 reps" },
        { name: "Wall Sit Hold", detail: "3 sets x 45 seconds" }
      ]
    },
    Friday: {
      focus: "Full Body Burner",
      exercises: [
        { name: "Jump Squats", detail: "3 sets x 15 reps" },
        { name: "Pike Pushups", detail: "3 sets x 8 reps" },
        { name: "Plank Shoulder Taps", detail: "3 sets x 30 seconds" },
        { name: "Bicycle Crunches", detail: "3 sets x 20 reps" },
        { name: "High Knees", detail: "3 sets x 45 seconds" }
      ]
    },
    Saturday: {
      focus: "Stamina Cardio",
      exercises: [
        { name: "Jogging or Cycling", detail: "30 minutes moderate pace" },
        { name: "Core Russian Twists", detail: "3 sets x 20 reps" },
        { name: "Flutter Kicks", detail: "3 sets x 30 seconds" },
        { name: "Cobra Stretch", detail: "3 sets x 30 seconds" }
      ]
    },
    Sunday: {
      focus: "Full Rest",
      exercises: [
        { name: "Hydrate & Foam Roll", detail: "Light stretching if sore" },
        { name: "Mindful Breathing / Meditation", detail: "10-15 minutes" }
      ]
    }
  },
  "Gain Muscle": {
    Monday: {
      focus: "Chest & Triceps",
      exercises: [
        { name: "Dumbbell Flat Bench Press", detail: "4 sets x 10 reps (Heavy)" },
        { name: "Incline Dumbbell Flyes", detail: "3 sets x 12 reps" },
        { name: "Diamond Pushups", detail: "3 sets x max reps" },
        { name: "Tricep Overhead Extension", detail: "3 sets x 12 reps" },
        { name: "Bench Dips", detail: "3 sets x 15 reps" }
      ]
    },
    Tuesday: {
      focus: "Back & Biceps",
      exercises: [
        { name: "Pullups or Lat Pulldowns", detail: "4 sets x 8-10 reps" },
        { name: "Bent-Over Dumbbell Rows", detail: "3 sets x 10 reps" },
        { name: "Single-Arm Rows", detail: "3 sets x 12 reps per arm" },
        { name: "Incline Dumbbell Bicep Curls", detail: "3 sets x 10 reps" },
        { name: "Hammer Curls", detail: "3 sets x 12 reps" }
      ]
    },
    Wednesday: {
      focus: "Legs & Core Strength",
      exercises: [
        { name: "Barbell or Dumbbell Goblet Squats", detail: "4 sets x 8 reps" },
        { name: "Romanian Deadlifts", detail: "3 sets x 10 reps" },
        { name: "Dumbbell Step-Ups", detail: "3 sets x 12 reps per leg" },
        { name: "Hanging Leg Raises", detail: "3 sets x 12 reps" },
        { name: "Standing Calf Raises", detail: "4 sets x 15 reps" }
      ]
    },
    Thursday: {
      focus: "Shoulders & Upper Traps",
      exercises: [
        { name: "Overhead Dumbbell Press", detail: "4 sets x 8 reps" },
        { name: "Lateral Raises", detail: "4 sets x 12-15 reps" },
        { name: "Dumbbell Front Raises", detail: "3 sets x 12 reps" },
        { name: "Rear Delt Face Pulls", detail: "3 sets x 15 reps" },
        { name: "Dumbbell Shrugs", detail: "3 sets x 12 reps" }
      ]
    },
    Friday: {
      focus: "Arms & Core Hypertrophy",
      exercises: [
        { name: "Barbell Curls", detail: "3 sets x 10 reps" },
        { name: "Close-Grip Pushups", detail: "3 sets x max reps" },
        { name: "Concentration Curls", detail: "3 sets x 12 reps" },
        { name: "Tricep Kickbacks", detail: "3 sets x 12 reps" },
        { name: "Plank with Hip Dips", detail: "3 sets x 45 seconds" }
      ]
    },
    Saturday: {
      focus: "Active Cardio & Recovery",
      exercises: [
        { name: "Light Jog or Swimming", detail: "20-25 minutes" },
        { name: "Decline Crunches", detail: "3 sets x 15 reps" },
        { name: "Ab Wheel Rollouts", detail: "3 sets x 10 reps" }
      ]
    },
    Sunday: {
      focus: "Complete Rest Day",
      exercises: [
        { name: "Nutrition Prep & Hydrate", detail: "Eat surplus protein" },
        { name: "Sleep & Muscle Repair", detail: "Aim for 8+ hours sleep" }
      ]
    }
  },
  "Maintain Weight": {
    Monday: {
      focus: "Full Body Strength",
      exercises: [
        { name: "Goblet Squats", detail: "3 sets x 12 reps" },
        { name: "Pushups", detail: "3 sets x 15 reps" },
        { name: "Dumbbell Rows", detail: "3 sets x 12 reps" },
        { name: "Plank Hold", detail: "3 sets x 60 seconds" }
      ]
    },
    Tuesday: {
      focus: "Cardio Endurance",
      exercises: [
        { name: "Steady Jog / Run", detail: "30 minutes moderate pace" },
        { name: "Jumping Jacks", detail: "3 sets x 50 reps" },
        { name: "Bird-Dog Pose", detail: "3 sets x 12 reps per side" }
      ]
    },
    Wednesday: {
      focus: "Core & Flexibility",
      exercises: [
        { name: "Bicycle Crunches", detail: "3 sets x 20 reps" },
        { name: "Side Planks", detail: "3 sets x 30 seconds per side" },
        { name: "Sun Salutation Yoga Flow", detail: "15 minutes" }
      ]
    },
    Thursday: {
      focus: "Lower Body & Glutes",
      exercises: [
        { name: "Reverse Lunges", detail: "3 sets x 12 reps per leg" },
        { name: "Glute Bridges", detail: "3 sets x 15 reps" },
        { name: "Calf Raises", detail: "3 sets x 20 reps" },
        { name: "Supermans", detail: "3 sets x 12 reps" }
      ]
    },
    Friday: {
      focus: "Upper Body Endurance",
      exercises: [
        { name: "Incline Pushups", detail: "3 sets x 12 reps" },
        { name: "Dumbbell Shoulder Press", detail: "3 sets x 12 reps" },
        { name: "Bicep Curls to Overhead Press", detail: "3 sets x 10 reps" },
        { name: "Tricep Dips", detail: "3 sets x 12 reps" }
      ]
    },
    Saturday: {
      focus: "Outdoor Activity",
      exercises: [
        { name: "Hiking, Cycling, or Swimming", detail: "45-60 minutes" },
        { name: "Cobra & Child's Pose stretching", detail: "10 minutes" }
      ]
    },
    Sunday: {
      focus: "Rest & Reset",
      exercises: [
        { name: "Active stretching & breathing", detail: "Relax muscles" }
      ]
    }
  },
  "Improve Health": {
    Monday: {
      focus: "Joint Mobility & Cardio",
      exercises: [
        { name: "Brisk Outdoor Walk", detail: "30 minutes" },
        { name: "Arm & Shoulder Circles", detail: "10 forward, 10 backward" },
        { name: "Gentle Hamstring Stretch", detail: "3 sets x 30 seconds" }
      ]
    },
    Tuesday: {
      focus: "Gentle Strength Development",
      exercises: [
        { name: "Wall Pushups", detail: "3 sets x 10 reps" },
        { name: "Chair Squats (sit to stand)", detail: "3 sets x 12 reps" },
        { name: "Glute Bridges", detail: "3 sets x 12 reps" },
        { name: "Cat-Cow Stretch", detail: "8 slow breathing reps" }
      ]
    },
    Wednesday: {
      focus: "Balance & Core Stability",
      exercises: [
        { name: "Single-Leg Balance", detail: "3 sets x 30 seconds per leg" },
        { name: "Bird-Dog Exercise", detail: "3 sets x 10 reps" },
        { name: "Dead Bug Exercise", detail: "3 sets x 10 reps" },
        { name: "Standing Side Stretch", detail: "3 sets x 20 seconds" }
      ]
    },
    Thursday: {
      focus: "Flexibility & Posture",
      exercises: [
        { name: "Cobra Stretch", detail: "3 sets x 20 seconds" },
        { name: "Chest Opener Stretch", detail: "3 sets x 30 seconds" },
        { name: "Seated Twist Stretch", detail: "30 seconds per side" },
        { name: "Light neck rolls & stretches", detail: "5 minutes" }
      ]
    },
    Friday: {
      focus: "Heart Health Stimulation",
      exercises: [
        { name: "Brisk Walk or Stationery Bike", detail: "25-30 minutes" },
        { name: "Bodyweight squats", detail: "2 sets x 10 reps" },
        { name: "Supermans (prone extensions)", detail: "2 sets x 10 reps" }
      ]
    },
    Saturday: {
      focus: "Recreational Movement",
      exercises: [
        { name: "Gardening, Swimming, or Casual Biking", detail: "30-45 minutes" },
        { name: "Deep breathing & relaxation walk", detail: "10 minutes" }
      ]
    },
    Sunday: {
      focus: "Full Body Rejuvenation",
      exercises: [
        { name: "Deep Breathing / Meditation", detail: "15 minutes" },
        { name: "Mindful water intake", detail: "Aim for 3 Liters today" }
      ]
    }
  }
};

// Clean ingredient strings to find the core keyword for image queries
function getIngredientQuery(ing) {
  if (!ing) return "food";
  let clean = ing.toLowerCase()
    .replace(/^[\d\s./½⅓¼¾\-–—x×*+&,]+/g, "")
    .replace(/\b(slices|slice|cups|cup|tablespoons|tablespoon|tbsps|tbsp|teaspoons|teaspoon|tsps|tsp|grams|gram|g|ounces|oz|pieces|piece|ml|liters|l|can|cans|pinch|pinches|handful|handfuls|bag|bags|pack|packs|to taste|for serving|cloves|clove|sprigs|sprig|heads|head|cloves|chopped|sliced|diced|mashed|halved|divided|fresh|organic|ripe|cooked|dried|powder|ground|raw|whole)\b/g, "")
    .replace(/[.,:;()]/g, "")
    .trim();
  
  const words = clean.split(/\s+/).filter(w => w.length > 1 && w !== "and" && w !== "of" && w !== "with");
  if (words.length === 0) return "food";
  return words.slice(0, 2).join(",");
}
function App() {
  const [formData, setFormData] = useState({
    age: "", gender: "Male", activityLevel: "Active (Moderate)",
    height: "", weight: "", goal: "Lose Weight",
  });
  const [dietPlan, setDietPlan]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [activeNav, setActiveNav]     = useState("plan");

  // AI Recipes States
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeResponse, setRecipeResponse] = useState("");
  const [parsedRecipe, setParsedRecipe] = useState(null);

  // Workout States
  const [workoutGoal, setWorkoutGoal] = useState("Lose Weight");
  const [activeWorkoutDay, setActiveWorkoutDay] = useState("Monday");
  const [checkedExercises, setCheckedExercises] = useState({});

  // Rest Timer States
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTotal, setTimerTotal] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Preferences States
  const [preferences, setPreferences] = useState({
    dietType: "Standard",
    exclusions: [],
    customExclusions: ""
  });

  const [waterConsumed, setWaterConsumed] = useState(0);

  // 3D Kinetic Core States
  const [animationMode, setAnimationMode] = useState("sync");
  const [blastActive, setBlastActive] = useState(false);
  const [videoChannel, setVideoChannel] = useState("saute");
  const [showAdvancedPlanOptions, setShowAdvancedPlanOptions] = useState(false);
  const [activePresetPlan, setActivePresetPlan] = useState(null);

  const activeExercises = WORKOUT_ROUTINES[workoutGoal]?.[activeWorkoutDay]?.exercises || [];
  const completedExercisesCount = activeExercises.filter(
    (ex, i) => checkedExercises[`${workoutGoal}-${activeWorkoutDay}-${i}`]
  ).length;
  const completionPct = activeExercises.length > 0 ? (completedExercisesCount / activeExercises.length) * 100 : 0;

  const getSpeedMultiplier = () => {
    if (animationMode === "zen") return 0.35;
    if (animationMode === "overdrive") return 3.0;
    // sync: scales speed from 0.5 (idle) up to 2.5 (completed)
    return 0.5 + (completionPct / 100) * 2.0;
  };

  const playKineticBlastSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.8);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.8);

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.9);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.9);
      osc2.stop(audioCtx.currentTime + 0.9);
    } catch (e) {
      console.warn("AudioContext blast sweep block: ", e);
    }
  };

  const triggerKineticBlast = () => {
    if (blastActive) return;
    setBlastActive(true);
    playKineticBlastSound();
    setTimeout(() => {
      setBlastActive(false);
    }, 1000);
  };

  // Auto-sync workout goal when form goal changes
  useEffect(() => {
    if (formData.goal) {
      if (formData.goal === "Lose Weight") setWorkoutGoal("Lose Weight");
      else if (formData.goal === "Gain Muscle") setWorkoutGoal("Gain Muscle");
      else if (formData.goal === "Maintain Weight") setWorkoutGoal("Maintain Weight");
      else if (formData.goal === "Improve Health") setWorkoutGoal("Improve Health");
    }
  }, [formData.goal]);

  // Audio synthesizer beep code
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("AudioContext block: ", e);
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Recipe Parser
  function parseRecipeText(content) {
    const r = {
      title: "AI Generated Recipe",
      calories: "—",
      protein: "0",
      carbs: "0",
      fats: "0",
      prepTime: "—",
      cookTime: "—",
      ingredients: [],
      instructions: [],
      nutritionInfo: ""
    };
    if (!content) return r;

    const lines = content.split("\n");
    let currentSection = "";

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const normalized = trimmed.replace(/[#*_\-:]/g, "").trim().toUpperCase();

      if (trimmed.startsWith("TITLE:")) {
        r.title = trimmed.replace("TITLE:", "").trim();
        return;
      }
      if (normalized === "STATS" || normalized === "RECIPE STATS" || normalized === "MACROS") {
        currentSection = "stats";
        return;
      }
      if (normalized === "INGREDIENTS" || normalized === "RECIPE INGREDIENTS") {
        currentSection = "ingredients";
        return;
      }
      if (normalized === "INSTRUCTIONS" || normalized === "RECIPE INSTRUCTIONS" || normalized === "STEPS" || normalized === "PREPARATION") {
        currentSection = "instructions";
        return;
      }
      if (normalized === "NUTRITION INFO" || normalized === "NUTRITION" || normalized === "HEALTH BENEFITS" || normalized === "NUTRITIONAL INFO") {
        currentSection = "nutrition";
        return;
      }

      const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•") || trimmed.startsWith("+");
      const cleanText = trimmed.replace(/^[-*•+]\s*/, "").trim();

      if (currentSection === "stats") {
        if (cleanText.toLowerCase().includes("calories")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.calories = m[0];
        } else if (cleanText.toLowerCase().includes("protein")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.protein = m[0];
        } else if (cleanText.toLowerCase().includes("carbs") || cleanText.toLowerCase().includes("carbohydrates")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.carbs = m[0];
        } else if (cleanText.toLowerCase().includes("fats") || cleanText.toLowerCase().includes("fat")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.fats = m[0];
        } else if (cleanText.toLowerCase().includes("prep")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.prepTime = m[0];
        } else if (cleanText.toLowerCase().includes("cook")) {
          const m = cleanText.match(/[\d]+/);
          if (m) r.cookTime = m[0];
        }
      } else if (currentSection === "ingredients") {
        if (cleanText) r.ingredients.push(cleanText);
      } else if (currentSection === "instructions") {
        const cleanStep = cleanText.replace(/^\d+[\s.)]*/, "").trim();
        if (cleanStep) r.instructions.push(cleanStep);
      } else if (currentSection === "nutrition") {
        if (cleanText) {
          r.nutritionInfo += (r.nutritionInfo ? " " : "") + cleanText;
        }
      }
    });

    return r;
  }

  // Recipe Fetcher
  async function generateRecipe(queryText) {
    if (!queryText.trim()) return;
    setRecipeLoading(true);
    setRecipeResponse("");
    setParsedRecipe(null);
    try {
      const formattedExclusions = [
        ...preferences.exclusions,
        ...(preferences.customExclusions ? preferences.customExclusions.split(",").map(s => s.trim()) : [])
      ].join(", ");

      const res = await fetch(`${API_URL}/api/generate-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          dietType: preferences.dietType,
          exclusions: formattedExclusions || "None"
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate recipe");
      setRecipeResponse(data.content);
      const parsed = parseRecipeText(data.content);
      setParsedRecipe(parsed);
    } catch (err) {
      console.error(err);
      setRecipeResponse(`Error: ${err.message}`);
    }
    setRecipeLoading(false);
  }

  const [pd, setPd] = useState({
    bmi: "—", bmiStatus: "—", calories: "—",
    protein: "0", carbs: "0", fats: "0", waterIntake: "—",
    meals: {
      breakfast: { name: "—", calories: "—", protein: "—", time: "08:00 AM" },
      lunch:     { name: "—", calories: "—", protein: "—", time: "01:00 PM" },
      dinner:    { name: "—", calories: "—", protein: "—", time: "07:30 PM" },
      snacks:    { name: "—", calories: "—", protein: "—", time: "04:00 PM" },
    },
    avoidFoods: [], exercises: [], tips: [],
  });

  /* ─── ROBUST PARSER ─── */
  function parseDietPlan(content) {
    const d = {
      bmi: "—", bmiStatus: "Normal", calories: "—",
      protein: "0", carbs: "0", fats: "0", waterIntake: "—",
      meals: {
        breakfast: { name: "—", calories: "—", protein: "—", time: "08:00 AM" },
        lunch:     { name: "—", calories: "—", protein: "—", time: "01:00 PM" },
        dinner:    { name: "—", calories: "—", protein: "—", time: "07:30 PM" },
        snacks:    { name: "—", calories: "—", protein: "—", time: "04:00 PM" },
      },
      avoidFoods: [], exercises: [], tips: [],
    };

    if (!content) return;

    const lines = content.split("\n");
    let currentSection = "";

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Check if line is a header by stripping markdown syntax (#, *, _, and trailing colon)
      const normalized = trimmed.replace(/[#*_\-:]/g, "").trim().toUpperCase();

      if (normalized === "BMI") {
        currentSection = "bmi";
        return;
      }
      if (normalized === "CALORIES") {
        currentSection = "calories";
        return;
      }
      if (normalized === "MEAL PLAN" || normalized === "MEALPLAN" || normalized === "DAILY MEAL SCHEDULE") {
        currentSection = "meal_plan";
        return;
      }
      if (normalized === "BREAKFAST") {
        currentSection = "breakfast";
        return;
      }
      if (normalized === "LUNCH") {
        currentSection = "lunch";
        return;
      }
      if (normalized === "DINNER") {
        currentSection = "dinner";
        return;
      }
      if (normalized === "SNACKS" || normalized === "SNACK") {
        currentSection = "snacks";
        return;
      }
      if (normalized === "WATER INTAKE" || normalized === "WATER" || normalized === "WATER REQUIREMENT") {
        currentSection = "water";
        return;
      }
      if (normalized === "FOODS TO AVOID" || normalized === "FOODS TO LIMIT" || normalized === "AVOID FOODS") {
        currentSection = "avoid";
        return;
      }
      if (normalized === "EXERCISE PLAN" || normalized === "EXERCISE" || normalized === "EXERCISES" || normalized === "WORKOUT PLAN") {
        currentSection = "exercise";
        return;
      }
      if (normalized === "TIPS" || normalized === "WELLNESS TIPS" || normalized === "HEALTH TIPS") {
        currentSection = "tips";
        return;
      }
      if (normalized === "RULES") {
        currentSection = "rules";
        return;
      }

      // Check if this line is a list item/bullet point
      const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•");
      const cleanText = trimmed.replace(/^[-*•]\s*/, "").trim();

      if (currentSection === "bmi") {
        // e.g. "- value: 22.9" or "value: 22.9" or "BMI is 22.9"
        let bmiMatch = cleanText.match(/(?:value|bmi)\s*[:=]\s*([\d.]+)/i);
        if (!bmiMatch) bmiMatch = cleanText.match(/(?:your\s+)?bmi(?:\s+is)?\s*[:=]?\s*([\d.]+)/i);
        if (bmiMatch) d.bmi = parseFloat(bmiMatch[1]).toFixed(1);

        const statusMatch = cleanText.match(/status\s*[:=]\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
        if (statusMatch) d.bmiStatus = statusMatch[1].trim();
      }
      else if (currentSection === "calories") {
        // e.g. "- daily requirement: 2500 kcal"
        const reqMatch = cleanText.match(/(?:daily\s+requirement|daily\s+calories|intake|requirement)\s*[:=]?\s*([\d,]+)/i);
        if (reqMatch) {
          d.calories = reqMatch[1].replace(/,/g, "");
        } else {
          const kcalMatch = cleanText.match(/([\d,]{3,})\s*kcal/i);
          if (kcalMatch) d.calories = kcalMatch[1].replace(/,/g, "");
        }

        // Macros
        const proteinMatch = cleanText.match(/protein\s*[:=]?\s*([\d]+)\s*g/i);
        if (proteinMatch) d.protein = proteinMatch[1];
        const carbsMatch = cleanText.match(/carbs?\s*[:=]?\s*([\d]+)\s*g/i);
        if (carbsMatch) d.carbs = carbsMatch[1];
        const fatsMatch = cleanText.match(/fats?\s*[:=]?\s*([\d]+)\s*g/i);
        if (fatsMatch) d.fats = fatsMatch[1];
      }
      else if (["breakfast", "lunch", "dinner", "snacks"].includes(currentSection)) {
        if (isBullet) {
          const calM = cleanText.match(/([\d]+)\s*kcal/i);
          const proM = cleanText.match(/([\d]+)\s*g\s*(?:of\s+)?protein/i);
          if (calM) {
            d.meals[currentSection].calories = calM[1];
          } else if (proM) {
            d.meals[currentSection].protein = proM[1];
          } else if (cleanText.toLowerCase().includes("protein")) {
            const pm = cleanText.match(/([\d]+)/);
            if (pm) d.meals[currentSection].protein = pm[1];
          } else if (!cleanText.match(/^\d+/) && cleanText.length > 3) {
            d.meals[currentSection].name = cleanText;
          }
        }
      }
      else if (currentSection === "water") {
        const waterMatch = cleanText.match(/([\d.]+)\s*(?:liters?|litres?|L)\b/i);
        if (waterMatch) {
          d.waterIntake = waterMatch[1];
        } else {
          const numMatch = cleanText.match(/([\d.]+)/);
          if (numMatch) d.waterIntake = numMatch[1];
        }
      }
      else if (currentSection === "avoid") {
        if (isBullet && cleanText.length > 1) {
          d.avoidFoods.push(cleanText);
        }
      }
      else if (currentSection === "exercise") {
        if (isBullet && cleanText.length > 1) {
          d.exercises.push(cleanText);
        }
      }
      else if (currentSection === "tips") {
        if (isBullet && cleanText.length > 1) {
          d.tips.push(cleanText);
        }
      }
    });

    // Fallbacks for macros
    if (d.protein === "0") {
      const m = content.match(/([\d]+)\s*g\s*(?:of\s+)?protein/i);
      if (m) d.protein = m[1];
    }
    if (d.carbs === "0") {
      const m = content.match(/([\d]+)\s*g\s*(?:of\s+)?carbs?/i);
      if (m) d.carbs = m[1];
    }
    if (d.fats === "0") {
      const m = content.match(/([\d]+)\s*g\s*(?:of\s+)?fats?/i);
      if (m) d.fats = m[1];
    }

    setPd(d);
  }

  /* ─── API CALLS ─── */
  async function generateDietPlan() {
    setLoading(true);
    setDietPlan("");
    setShowResults(false);
    try {
      const formattedExclusions = [
        ...preferences.exclusions,
        ...(preferences.customExclusions ? preferences.customExclusions.split(",").map(s => s.trim()) : [])
      ].join(", ");

      const res = await fetch(`${API_URL}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dietType: preferences.dietType,
          exclusions: formattedExclusions || "None"
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate plan");
      setDietPlan(data.content);
      parseDietPlan(data.content);
      setShowResults(true);
      setServerStatus("online");
      setActiveNav("results");
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (err) {
      console.error(err);
      setDietPlan(`Error: ${err.message}`);
      setShowResults(true);
    }
    setLoading(false);
  }

  async function downloadPDF() {
    if (!dietPlan) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietPlan, userInfo: formData }),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `diet-plan-${Date.now()}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (err) { alert(`PDF error: ${err.message}`); }
    finally { setDownloading(false); }
  }

  async function savePlan() {
    if (!dietPlan) return;
    try {
      const res = await fetch(`${API_URL}/api/save-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietPlan, userInfo: formData, parsedData: pd }),
      });
      const data = await res.json();
      if (data.success) alert("Plan saved!");
      else throw new Error(data.error);
    } catch (err) { alert(`Save error: ${err.message}`); }
  }

  async function checkServer() {
    try {
      const r = await fetch(`${API_URL}/api/health`);
      setServerStatus(r.ok ? "online" : "offline");
    } catch { setServerStatus("offline"); }
  }

  useEffect(() => { checkServer(); }, []);

  // 3D Parallax Tilt Effect for Cards and Interactive Items
  useEffect(() => {
    const cards = document.querySelectorAll(".card, .workout-day-btn, .timer-preset-btn");

    const handleMove = (e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left - box.width / 2;
      const y = e.clientY - box.top - box.height / 2;

      // Rotation bounds (max 8 degrees tilt)
      const rX = -(y / (box.height / 2)) * 8;
      const rY = (x / (box.width / 2)) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) translateY(-6px) translateZ(15px)`;
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.55), 0 0 25px rgba(34, 211, 238, 0.18)";
      card.style.borderColor = "var(--cyan)";
    };

    const handleLeave = (e) => {
      const card = e.currentTarget;
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)";
      card.style.boxShadow = "";
      card.style.borderColor = "";
    };

    cards.forEach((card) => {
      card.style.transformStyle = "preserve-3d";
      card.style.transition = "transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.3s ease";
      
      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [activeNav, showResults, parsedRecipe, workoutGoal, activeWorkoutDay]);

  /* ─── HELPERS ─── */
  const isError = dietPlan.startsWith("Error:");
  const pTotal  = parseInt(pd.protein) + parseInt(pd.carbs) + parseInt(pd.fats);
  const pPct    = pTotal ? Math.round((parseInt(pd.protein) / pTotal) * 100) : 33;
  const cPct    = pTotal ? Math.round((parseInt(pd.carbs)   / pTotal) * 100) : 33;
  const fPct    = pTotal ? Math.round((parseInt(pd.fats)    / pTotal) * 100) : 34;

  const meals = [
    { key: "breakfast", label: "Breakfast", icon: "wb_sunny"   },
    { key: "lunch",     label: "Lunch",     icon: "light_mode" },
    { key: "dinner",    label: "Dinner",    icon: "nights_stay"},
    { key: "snacks",    label: "Snack",     icon: "eco"        },
  ];

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Dynamic Real-time Calculations for Biometric Telemetry
  const calcAge = parseFloat(formData.age) || 28;
  const calcWeight = parseFloat(formData.weight) || 70;
  const calcHeight = parseFloat(formData.height) || 175;
  const calcGender = formData.gender || "Male";
  const calcActivity = formData.activityLevel || "Active (Moderate)";
  const calcGoal = formData.goal || "Lose Weight";

  // Mifflin-St Jeor Equation
  let calculatedBmr = Math.round(10 * calcWeight + 6.25 * calcHeight - 5 * calcAge);
  if (calcGender === "Male") calculatedBmr += 5;
  else if (calcGender === "Female") calculatedBmr -= 161;
  else calculatedBmr -= 78; // average of male and female

  calculatedBmr = Math.max(500, calculatedBmr);

  let activityMultiplier = 1.2;
  if (calcActivity === "Active (Moderate)") activityMultiplier = 1.55;
  else if (calcActivity === "Very Active (Athlete)") activityMultiplier = 1.85;

  const calculatedTdee = Math.round(calculatedBmr * activityMultiplier);

  let targetCalories = calculatedTdee;
  let targetAdjustmentLabel = "Maintenance";
  if (calcGoal === "Lose Weight") {
    targetCalories = calculatedTdee - 500;
    targetAdjustmentLabel = "-500 kcal Deficit";
  } else if (calcGoal === "Gain Muscle") {
    targetCalories = calculatedTdee + 500;
    targetAdjustmentLabel = "+500 kcal Surplus";
  } else if (calcGoal === "Improve Health") {
    targetCalories = calculatedTdee - 100;
    targetAdjustmentLabel = "-100 kcal Health Mod";
  }
  
  targetCalories = Math.max(800, targetCalories);

  const spinSpeed =
    formData.activityLevel === "Gentle (Sedentary)"
      ? "18s"
      : formData.activityLevel === "Active (Moderate)"
      ? "10s"
      : "4.5s";

  /* ─── RENDER ─── */
  return (
    <div className="app-shell">
      {/* Background with futuristic particles and grids */}
      <div className="bg-effects">
        <div className="bg-grid" />
        <div className="bg-glow-ring" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* ════ SIDEBAR ════ */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🥗</div>
          <span className="logo-name">Nutri<span className="ai-neon">AI</span></span>
        </div>

        <div className="sidebar-label">Navigation</div>
        <nav className="sidebar-nav">
          <button
            id="nav-create-plan"
            className={`nav-item ${activeNav === "plan" ? "active" : ""}`}
            onClick={() => { setActiveNav("plan"); setShowResults(false); }}
          >
            <span className="material-symbols-outlined">edit_note</span>
            Create Plan
          </button>
          {showResults && (
            <button
              id="nav-dashboard"
              className={`nav-item ${activeNav === "results" ? "active" : ""}`}
              onClick={() => setActiveNav("results")}
            >
              <span className="material-symbols-outlined">dashboard</span>
              My Dashboard
            </button>
          )}
          <button
            id="nav-recipes"
            className={`nav-item ${activeNav === "recipes" ? "active" : ""}`}
            onClick={() => setActiveNav("recipes")}
          >
            <span className="material-symbols-outlined">restaurant_menu</span>
            AI Recipe Hub
          </button>
          <button
            id="nav-workout"
            className={`nav-item ${activeNav === "workout" ? "active" : ""}`}
            onClick={() => setActiveNav("workout")}
          >
            <span className="material-symbols-outlined">fitness_center</span>
            Workout Hub
          </button>
          <button
            id="nav-presets"
            className={`nav-item ${activeNav === "presets" ? "active" : ""}`}
            onClick={() => setActiveNav("presets")}
          >
            <span className="material-symbols-outlined">menu_book</span>
            Diet Plans
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className={`server-pill ${serverStatus}`}>
            <div className={`s-dot ${serverStatus}`} />
            <span>
              {serverStatus === "online"   ? "Core Online"   :
               serverStatus === "offline"  ? "Offline Mode"  : "Syncing..."}
            </span>
          </div>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="main-wrapper">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {activeNav === "plan" ? "NUTRIAI // SYSTEM PLANNER" :
               activeNav === "results" ? "NUTRIAI // PERSONALIZED DASHBOARD" :
               activeNav === "recipes" ? "NUTRIAI // AI RECIPE ENGINE" :
               activeNav === "presets" ? "NUTRIAI // PRESET DIET SCHEMAS" :
               "NUTRIAI // FITNESS CONDITIONING"}
            </div>
            <div className="topbar-sub">
              {activeNav === "plan" ? "Configure biometrics to deploy customized nutrition model" :
               activeNav === "results" ? `Biometric Profile: ${formData.age}yo // ${formData.gender} // ${formData.weight}kg` :
               activeNav === "recipes" ? "AI-driven recipe customization and ingredient indexing" :
               activeNav === "presets" ? "Explore sample nutrition targets for cutting, maintaining, or bulking phases" :
               `Target Protocol: ${workoutGoal} // Today: ${WORKOUT_ROUTINES[workoutGoal]?.[activeWorkoutDay]?.focus || "Rest"}`}
            </div>
          </div>
          {showResults && !isError && activeNav === "results" && (
            <div className="topbar-actions">
              <button id="btn-download-pdf" className="btn-sm btn-neon-glow" onClick={downloadPDF} disabled={downloading}>
                <span className="material-symbols-outlined">
                  {downloading ? "progress_activity" : "download"}
                </span>
                {downloading ? "Compiling..." : "Export PDF"}
              </button>
              <button id="btn-save-plan" className="btn-sm" onClick={savePlan}>
                <span className="material-symbols-outlined">bookmark</span>
                Save Plan
              </button>
            </div>
          )}
        </div>

        <div className="page">

          {/* ════ INPUT VIEW ════ */}
          {(activeNav === "plan" || !showResults) && (
            <div className={`input-view theme-${(formData.goal || "Lose Weight").toLowerCase().replace(" ", "-")}`}>
              <div className="page-hero">
                <div className="page-hero-tag">
                  <div className="tag-dot" />
                  Quantum Nutrition AI v4.8
                </div>
                <h1>Deploy Your <span className="grad">Diet Core</span></h1>
                <p>Provide biological parameters. The neural engine will optimize macro ratios and schedule caloric ingestion blocks.</p>
              </div>

              <div className="dash-grid">
                {/* Left Column: Form Controls */}
                <div className="dash-column">
                  <div className="card form-card" style={{ marginBottom: 0 }}>
                    <div className="form-card-head">
                      <div className="form-card-icon">
                        <span className="material-symbols-outlined">analytics</span>
                      </div>
                      <div>
                        <h2>Biometric Telemetry</h2>
                        <p>Enter exact metrics to initialize computation</p>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="field">
                        <div className="field-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <label htmlFor="input-age" style={{ margin: 0 }}>Age (years)</label>
                          <input
                            id="input-age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="28"
                            min="10"
                            max="100"
                            style={{ width: "60px", padding: "4px 8px", fontSize: "12px", height: "auto", textAlign: "right" }}
                          />
                        </div>
                        <input
                          type="range"
                          name="age"
                          min="10"
                          max="100"
                          value={formData.age || 28}
                          onChange={handleChange}
                          className="biometric-slider"
                        />
                      </div>
                      
                      <div className="field">
                        <label style={{ marginBottom: "8px" }}>Gender</label>
                        <div className="segmented-control">
                          {["Male", "Female", "Non-binary"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              className={`segment-btn ${formData.gender === g ? "active" : ""}`}
                              onClick={() => setFormData({ ...formData, gender: g })}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="field">
                        <div className="field-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <label htmlFor="input-height" style={{ margin: 0 }}>Height (cm)</label>
                          <input
                            id="input-height"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="175"
                            min="100"
                            max="220"
                            style={{ width: "60px", padding: "4px 8px", fontSize: "12px", height: "auto", textAlign: "right" }}
                          />
                        </div>
                        <input
                          type="range"
                          name="height"
                          min="100"
                          max="220"
                          value={formData.height || 175}
                          onChange={handleChange}
                          className="biometric-slider"
                        />
                      </div>

                      <div className="field">
                        <div className="field-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <label htmlFor="input-weight" style={{ margin: 0 }}>Weight (kg)</label>
                          <input
                            id="input-weight"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="70"
                            min="30"
                            max="180"
                            style={{ width: "60px", padding: "4px 8px", fontSize: "12px", height: "auto", textAlign: "right" }}
                          />
                        </div>
                        <input
                          type="range"
                          name="weight"
                          min="30"
                          max="180"
                          value={formData.weight || 70}
                          onChange={handleChange}
                          className="biometric-slider"
                        />
                      </div>

                      <div className="field" style={{ gridColumn: "span 2" }}>
                        <label style={{ marginBottom: "8px" }}>Activity Level</label>
                        <div className="segmented-control">
                          {[
                            { label: "Gentle (Sedentary)", value: "Gentle (Sedentary)" },
                            { label: "Active (Moderate)", value: "Active (Moderate)" },
                            { label: "Very Active (Athlete)", value: "Very Active (Athlete)" }
                          ].map((act) => (
                            <button
                              key={act.value}
                              type="button"
                              className={`segment-btn ${formData.activityLevel === act.value ? "active" : ""}`}
                              onClick={() => setFormData({ ...formData, activityLevel: act.value })}
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="field" style={{ gridColumn: "span 2" }}>
                        <label style={{ marginBottom: "8px" }}>Target Goal</label>
                        <div className="segmented-control goal-segments">
                          {[
                            { label: "Lose Weight", value: "Lose Weight", icon: "trending_down" },
                            { label: "Gain Muscle", value: "Gain Muscle", icon: "fitness_center" },
                            { label: "Maintain Weight", value: "Maintain Weight", icon: "swap_horiz" },
                            { label: "Improve Health", value: "Improve Health", icon: "favorite" }
                          ].map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              className={`segment-btn ${formData.goal === g.value ? "active" : ""}`}
                              onClick={() => setFormData({ ...formData, goal: g.value })}
                            >
                              <span className="material-symbols-outlined segment-icon" style={{ fontSize: "16px" }}>{g.icon}</span>
                              <span>{g.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Dietary constraints */}
                    <div className="advanced-options-section" style={{ margin: "20px 0" }}>
                      <button
                        type="button"
                        className="advanced-toggle-btn"
                        onClick={() => setShowAdvancedPlanOptions(!showAdvancedPlanOptions)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "transparent",
                          border: "none",
                          color: "var(--indigo)",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          padding: "4px 0",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                          {showAdvancedPlanOptions ? "expand_less" : "expand_more"}
                        </span>
                        <span>Advanced Dietary Constraints</span>
                      </button>

                      {showAdvancedPlanOptions && (
                        <div className="advanced-fields-container" style={{ marginTop: "14px", padding: "16px", background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                          <div className="field" style={{ marginBottom: "16px" }}>
                            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--t3)", display: "block", marginBottom: "6px" }}>Dietary Paradigm</label>
                            <select
                              value={preferences.dietType}
                              onChange={(e) => setPreferences({ ...preferences, dietType: e.target.value })}
                              style={{ width: "100%" }}
                            >
                              <option>Standard</option>
                              <option>Vegan</option>
                              <option>Vegetarian</option>
                              <option>Ketogenic (Keto)</option>
                              <option>Paleo</option>
                              <option>Gluten-Free</option>
                              <option>Halal</option>
                            </select>
                          </div>

                          <div className="field" style={{ marginBottom: "16px" }}>
                            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--t3)", display: "block", marginBottom: "6px" }}>Allergen Filters</label>
                            <div className="allergens-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                              {["Nuts", "Dairy", "Soy", "Gluten", "Shellfish"].map((allergen) => {
                                const isChecked = preferences.exclusions.includes(allergen);
                                return (
                                  <label key={allergen} className="checkbox-item" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const newExclusions = e.target.checked
                                          ? [...preferences.exclusions, allergen]
                                          : preferences.exclusions.filter((x) => x !== allergen);
                                        setPreferences({ ...preferences, exclusions: newExclusions });
                                      }}
                                    />
                                    <span className="checkbox-custom" />
                                    <span className="checkbox-label" style={{ textDecoration: "none", color: "var(--t2)", fontSize: "11px" }}>
                                      {allergen} Free
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="field">
                            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--t3)", display: "block", marginBottom: "6px" }} htmlFor="input-custom-exclude">Custom Ingredient Exclusions</label>
                            <input
                              id="input-custom-exclude"
                              type="text"
                              placeholder="e.g. mushrooms, garlic"
                              value={preferences.customExclusions}
                              onChange={(e) => setPreferences({ ...preferences, customExclusions: e.target.value })}
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Real-time Telemetry HUD Panel */}
                    <div className="telemetry-hud-card" style={{
                      margin: "12px 0 20px",
                      padding: "16px",
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <div className="hud-glow-overlay" />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                        <span className="font-mono" style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: "var(--theme-accent, var(--indigo))" }}>METABOLIC PROFILE HUD</span>
                        <span className="font-mono blink c-green" style={{ fontSize: "9px", fontWeight: "700" }}>● SCANNING</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span className="font-mono" style={{ fontSize: "9px", color: "var(--t3)" }}>BMR (CORE METABOLIC):</span>
                          <span className="font-mono" style={{ fontSize: "16px", fontWeight: "800", color: "var(--t1)", marginTop: "2px" }}>
                            {calculatedBmr} <span style={{ fontSize: "10px", color: "var(--t3)", fontWeight: "400" }}>kcal</span>
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span className="font-mono" style={{ fontSize: "9px", color: "var(--t3)" }}>TDEE (ENERGY LOAD):</span>
                          <span className="font-mono" style={{ fontSize: "16px", fontWeight: "800", color: "var(--t1)", marginTop: "2px" }}>
                            {calculatedTdee} <span style={{ fontSize: "10px", color: "var(--t3)", fontWeight: "400" }}>kcal</span>
                          </span>
                        </div>
                        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", borderTop: "1px dashed var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                          <span className="font-mono" style={{ fontSize: "9px", color: "var(--t3)" }}>TARGET INTAKE MATRIX:</span>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "2px" }}>
                            <span className="font-mono theme-glow-text" style={{ fontSize: "20px", fontWeight: "900", color: "var(--theme-accent, var(--indigo))" }}>
                              {targetCalories} <span style={{ fontSize: "12px", color: "var(--t2)", fontWeight: "400" }}>kcal/day</span>
                            </span>
                            <span className="font-mono" style={{
                              fontSize: "9px",
                              padding: "2px 8px",
                              background: "var(--theme-accent-dim, var(--indigo-dim))",
                              border: "1px solid var(--theme-accent-glow, var(--indigo-dim))",
                              color: "var(--theme-accent, var(--indigo))",
                              borderRadius: "4px",
                              fontWeight: "700"
                            }}>
                              {targetAdjustmentLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button id="btn-generate-plan" className="btn-primary btn-primary-futuristic" onClick={generateDietPlan} disabled={loading} style={{
                      borderColor: "var(--theme-accent, var(--indigo))",
                      boxShadow: "0 0 10px var(--theme-accent-glow, var(--indigo-dim))"
                    }}>
                      {loading ? (
                        <><span className="material-symbols-outlined spin">sync</span> Computing Optimal Layout...</>
                      ) : (
                        <><span className="material-symbols-outlined">insights</span> Generate My Nutrition Plan</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: 3D DNA Goal Helix */}
                <div className="dash-column">
                  <div className={`card dash-card dna-helix-card goal-${(formData.goal || "Lose Weight").toLowerCase().replace(" ", "-")}`}>
                    <div className="dash-card-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <div className="dash-card-title" style={{ marginBottom: 0 }}>
                        <span className="material-symbols-outlined c-indigo" style={{ color: "var(--theme-accent, var(--indigo))" }}>dna</span>
                        Goal Biometric Helix
                      </div>
                      <span className="core-status-badge font-mono" style={{
                        fontSize: "10px",
                        background: "var(--theme-accent-dim, var(--indigo-dim))",
                        color: "var(--theme-accent, var(--indigo))",
                        borderColor: "var(--theme-accent-glow, var(--indigo-dim))"
                      }}>
                        {(formData.goal || "Lose Weight").toUpperCase()}
                      </span>
                    </div>

                    <div className="dna-viewport-container">
                      {/* Gyroscope scanner rings */}
                      <div className="gyro-ring gyro-ring-x" />
                      <div className="gyro-ring gyro-ring-y" />
                      {/* Horizontal laser scan plane */}
                      <div className="scanner-laser" />

                      <div className="dna-scene" style={{ animationDuration: spinSpeed }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="dna-rung" style={{ '--i': i }}>
                            <div className="dna-dot dot-a" />
                            <div className="dna-bar" />
                            <div className="dna-dot dot-b" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="dna-telemetry font-mono" style={{ fontSize: "10px", color: "var(--t3)", display: "flex", flexDirection: "column", gap: "4px", padding: "8px 0 0", borderTop: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>PARAM.INTEGRITY:</span>
                        <span className="c-green">NOMINAL</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>MODEL.TARGET:</span>
                        <span style={{ color: "var(--theme-accent, var(--indigo))", fontWeight: "700" }}>{formData.goal.toUpperCase()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>CORE.ROTATION:</span>
                        <span>{spinSpeed} / CYCLE</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>HEURISTIC.ENVELOPE:</span>
                        <span className="c-cyan" style={{ animation: "blink 1.5s infinite" }}>CALIBRATING</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ RESULTS DASHBOARD ════ */}
          {showResults && activeNav === "results" && (
            <div id="results">
              {isError ? (
                <div className="card error-card">
                  <div className="material-symbols-outlined error-icon">warning</div>
                  <p className="error-title">Computation Interrupted</p>
                  <p className="error-msg">{dietPlan}</p>
                  <button className="btn-retry" onClick={() => { setActiveNav("plan"); setShowResults(false); }}>
                    <span className="material-symbols-outlined">arrow_back</span> Return to telemetry
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Stats Row ── */}
                  <div className="stats-grid">
                    <div className="card stat-card border-glow-cyan">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-cyan">scale</span>
                        <div className="stat-lbl">Body Mass Index</div>
                      </div>
                      <div className="stat-num c-cyan">{pd.bmi}</div>
                      <span className="stat-badge c-cyan">{pd.bmiStatus}</span>
                    </div>
                    <div className="card stat-card border-glow-indigo">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-indigo">bolt</span>
                        <div className="stat-lbl">Caloric Requirement</div>
                      </div>
                      <div className="stat-num c-indigo">{pd.calories}</div>
                      <span className="stat-badge c-indigo">kcal / day</span>
                    </div>
                    <div className="card stat-card border-glow-green">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-green">water_drop</span>
                        <div className="stat-lbl">Water Volume</div>
                      </div>
                      <div className="stat-num c-green">{pd.waterIntake}</div>
                      <span className="stat-badge c-green">liters / day</span>
                    </div>
                  </div>

                  {/* ── Dashboard Grid ── */}
                  <div className="dash-grid">
                    {/* LEFT: Macros + Meals */}
                    <div className="dash-column">
                      {/* Macros Card */}
                      <div className="card dash-card macro-card">
                        <div className="dash-card-title">
                          <span className="material-symbols-outlined c-cyan">query_stats</span>
                          Macronutrient Core Allocation
                        </div>
                        <div className="macro-card-wrapper">
                          <div className="macro-list">
                            <div className="macro-row">
                              <div className="macro-meta">
                                <span className="macro-name">Protein</span>
                                <span className="macro-pct">{pPct}%</span>
                              </div>
                              <div className="macro-track">
                                <div className="macro-fill c-cyan" style={{ width: `${pPct}%` }} />
                              </div>
                              <div className="macro-val">{pd.protein}g</div>
                            </div>
                            <div className="macro-row">
                              <div className="macro-meta">
                                <span className="macro-name">Carbohydrates</span>
                                <span className="macro-pct">{cPct}%</span>
                              </div>
                              <div className="macro-track">
                                <div className="macro-fill c-indigo" style={{ width: `${cPct}%` }} />
                              </div>
                              <div className="macro-val">{pd.carbs}g</div>
                            </div>
                            <div className="macro-row">
                              <div className="macro-meta">
                                <span className="macro-name">Fats</span>
                                <span className="macro-pct">{fPct}%</span>
                              </div>
                              <div className="macro-track">
                                <div className="macro-fill c-green" style={{ width: `${fPct}%` }} />
                              </div>
                              <div className="macro-val">{pd.fats}g</div>
                            </div>
                          </div>

                          {/* 3D Macro Orb Visualizer */}
                          <div className="macro-3d-visualizer">
                            <div className="macro-3d-scene">
                              <div className="macro-nucleus" />
                              <div className="macro-orbit m-protein">
                                <div className="macro-electron c-cyan" />
                              </div>
                              <div className="macro-orbit m-carbs">
                                <div className="macro-electron c-indigo" />
                              </div>
                              <div className="macro-orbit m-fats">
                                <div className="macro-electron c-green" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Meals Card */}
                      <div className="card dash-card meal-schedule-card">
                        <div className="dash-card-title">
                          <span className="material-symbols-outlined c-indigo">schedule_send</span>
                          Optimal Meal Timeline
                        </div>
                        <div className="meal-timeline">
                          {meals.map((m, idx) => (
                            <div className="meal-timeline-item" key={m.key}>
                              <div className="meal-timeline-node">
                                <div className="meal-node-circle">
                                  <span className="material-symbols-outlined">{m.icon}</span>
                                </div>
                                {idx < meals.length - 1 && <div className="meal-timeline-line" />}
                              </div>
                              <div className="meal-timeline-content">
                                <div className="meal-header">
                                  <span className="meal-label">{m.label}</span>
                                  <span className="meal-time-tag">{pd.meals[m.key].time}</span>
                                </div>
                                <div className="meal-detail-card">
                                  <div className="meal-name-display">{pd.meals[m.key].name}</div>
                                  <div className="meal-nutrients">
                                    <span className="nutrient-badge font-mono">
                                      <span className="material-symbols-outlined">local_fire_department</span>
                                      {pd.meals[m.key].calories} kcal
                                    </span>
                                    <span className="nutrient-badge font-mono">
                                      <span className="material-symbols-outlined">fitness_center</span>
                                      {pd.meals[m.key].protein}g protein
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Avoid + Tips + Exercise */}
                    <div className="dash-column">
                      {/* Hydration Tracker Card */}
                      <div className="card dash-card border-glow-cyan">
                        <div className="dash-card-title">
                          <span className="material-symbols-outlined c-cyan">water_drop</span>
                          Daily Hydration Tracker
                        </div>
                        <div className="hydration-display" style={{ display: "flex", alignItems: "center", gap: "24px", padding: "8px 0" }}>
                          <div className="wave-container">
                            <div
                              className="wave-fill"
                              style={{
                                height: `${Math.min(100, (waterConsumed / ((parseFloat(pd.waterIntake) || 3.0) * 1000)) * 100)}%`
                              }}
                            >
                              <div className="wave wave-1" />
                              <div className="wave wave-2" />
                            </div>
                            <span className="wave-percentage font-mono">
                              {Math.round((waterConsumed / ((parseFloat(pd.waterIntake) || 3.0) * 1000)) * 100)}%
                            </span>
                          </div>
                          <div className="hydration-stats" style={{ display: "flex", flexDirection: "column", gap: "10px", flexGrow: "1" }}>
                            <div className="hydration-value font-mono" style={{ fontSize: "18px", fontWeight: "700", color: "var(--t1)" }}>
                              {waterConsumed} / {Math.round((parseFloat(pd.waterIntake) || 3.0) * 1000)} ml
                            </div>
                            <div className="hydration-controls" style={{ display: "flex", gap: "8px" }}>
                              <button className="btn-sm btn-neon-glow" onClick={() => setWaterConsumed(prev => prev + 250)}>
                                + 250ml
                              </button>
                              <button className="btn-sm btn-neon-glow" onClick={() => setWaterConsumed(prev => prev + 500)}>
                                + 500ml
                              </button>
                              <button className="btn-sm" style={{ padding: "8px 10px" }} onClick={() => setWaterConsumed(0)}>
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>refresh</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {pd.avoidFoods.length > 0 && (
                        <div className="card dash-card border-alert-red">
                          <div className="dash-card-title c-red">
                            <span className="material-symbols-outlined c-red">gavel</span>
                            Restrictions / Avoid Foods
                          </div>
                          <div className="tags-container">
                            {pd.avoidFoods.map((f, i) => (
                              <span className="tag-danger-futuristic" key={i}>
                                <span className="tag-dot-red" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {pd.exercises.length > 0 && (
                        <div className="card dash-card border-alert-indigo">
                          <div className="dash-card-title c-indigo">
                            <span className="material-symbols-outlined c-indigo">directions_run</span>
                            Physical Conditioning Plan
                          </div>
                          <div className="info-list-futuristic">
                            {pd.exercises.map((e, i) => (
                              <div className="info-item-futuristic" key={i}>
                                <div className="indicator-diamond c-indigo" />
                                <span>{e}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pd.tips.length > 0 && (
                        <div className="card dash-card border-alert-green">
                          <div className="dash-card-title c-green">
                            <span className="material-symbols-outlined c-green">verified</span>
                            Wellness Protocols
                          </div>
                          <div className="info-list-futuristic">
                            {pd.tips.map((t, i) => (
                              <div className="info-item-futuristic" key={i}>
                                <div className="indicator-diamond c-green" />
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full AI Plan View */}
                  <div className="card plan-card-futuristic">
                    <div className="plan-card-head">
                      <div className="plan-head-l">
                        <span className="material-symbols-outlined c-cyan">terminal</span>
                        <div>
                          <div className="plan-head-title">NEURAL NETWORK DIET CORPUS</div>
                          <div className="plan-head-sub">Raw parsed output stream</div>
                        </div>
                      </div>
                      <span className="plan-badge-glow">RAW DATA</span>
                    </div>
                    <div className="plan-body-futuristic">{dietPlan}</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════════ AI RECIPE HUB VIEW ════════ */}
          {activeNav === "recipes" && (
            <div className="recipe-view">
              <div className="page-hero">
                <div className="page-hero-tag">
                  <div className="tag-dot" />
                  NutriAI Culinary Engine v1.2
                </div>
                <h1>AI Recipe <span className="grad">Hub</span></h1>
                <p>Search ingredients or describe a recipe concept. The AI nutritionist will generate macro-calculated recipes instantly.</p>
              </div>

              {/* Search Box */}
              <div className="card search-card">
                <div className="search-box-container">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="e.g. High protein keto breakfast or Salmon bowl..."
                    value={recipeQuery}
                    onChange={(e) => setRecipeQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") generateRecipe(recipeQuery);
                    }}
                  />
                  <button
                    className="btn-primary search-btn"
                    onClick={() => generateRecipe(recipeQuery)}
                    disabled={recipeLoading || !recipeQuery.trim()}
                  >
                    {recipeLoading ? (
                      <span className="material-symbols-outlined spin">sync</span>
                    ) : (
                      <span className="material-symbols-outlined">restaurant_menu</span>
                    )}
                    <span>Compile Recipe</span>
                  </button>
                </div>

                {/* Quick Suggestions Chips */}
                <div className="recipe-suggestions">
                  <div className="suggestion-label">Quick Suggestions:</div>
                  <div className="suggestion-chips">
                    {[
                      { text: "Low-Carb Salad 🥗", query: "Healthy low carb salad with protein" },
                      { text: "Keto Breakfast 🥑", query: "Quick keto breakfast under 400 calories" },
                      { text: "High-Protein Snack 💪", query: "High protein snack ideas" },
                      { text: "Heart-Healthy Dinner 🐟", query: "Salmon or fish healthy dinner recipe" },
                      { text: "Green Detox Drink 🍵", query: "Nutritional detox green juice smoothie" }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        className="suggestion-chip"
                        onClick={() => {
                          setRecipeQuery(chip.query);
                          generateRecipe(chip.query);
                        }}
                        disabled={recipeLoading}
                      >
                        {chip.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty/Idle State with 3D Holographic Cloche Scanner */}
              {!recipeLoading && !parsedRecipe && (
                <div className="card dash-card recipe-empty-scanner-card">
                  <div className="dash-card-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div className="dash-card-title" style={{ marginBottom: 0 }}>
                      <span className="material-symbols-outlined c-indigo">biotech</span>
                      AI Culinary Scanner
                    </div>
                    <span className="core-status-badge font-mono" style={{ fontSize: "10px", color: "var(--cyan)", borderColor: "rgba(6, 182, 212, 0.3)", background: "rgba(6, 182, 212, 0.05)" }}>
                      STANDBY // SCANNER READY
                    </span>
                  </div>

                  <div className="scanner-viewport-container">
                    <div className="scanner-3d-scene">
                      <div className="scanner-plate" />
                      <div className="scanner-cloche" />
                      <div className="scanner-beam" />
                      <span className="material-symbols-outlined scanner-chef-icon">restaurant</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "14px" }}>
                    <p style={{ fontSize: "13px", color: "var(--t2)", fontWeight: "600", marginBottom: "4px" }}>Culinary Scanning Transceiver Online</p>
                    <p style={{ fontSize: "11px", color: "var(--t3)" }}>Submit ingredients or nutritional tags above to compile an AI recipe card.</p>
                  </div>
                </div>
              )}

              {/* Loader */}
              {recipeLoading && (
                <div className="card loading-card-recipe active-scan">
                  <div className="scanner-viewport-container" style={{ height: "140px", margin: "0 0 10px 0" }}>
                    <div className="scanner-3d-scene recipe-loading">
                      <div className="scanner-plate" />
                      <div className="scanner-cloche" />
                      <div className="scanner-beam" />
                      <span className="material-symbols-outlined scanner-chef-icon spin">restaurant_menu</span>
                    </div>
                  </div>
                  <h3>Simulating Culinary Model</h3>
                  <p>Combining macro balances, compiling ingredients, and formatting steps...</p>
                </div>
              )}

              {/* Recipe Results View */}
              {!recipeLoading && parsedRecipe && (
                <div className="recipe-results">
                  <div className="recipe-results-header">
                    <h2>{parsedRecipe.title}</h2>
                    {parsedRecipe.nutritionInfo && (
                      <p className="recipe-desc">{parsedRecipe.nutritionInfo}</p>
                    )}
                  </div>

                  {/* Macros & Stats Grid */}
                  <div className="stats-grid">
                    <div className="card stat-card border-glow-cyan">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-cyan">bolt</span>
                        <div className="stat-lbl">Calories</div>
                      </div>
                      <div className="stat-num c-cyan">{parsedRecipe.calories}</div>
                      <span className="stat-badge c-cyan">kcal</span>
                    </div>
                    <div className="card stat-card border-glow-indigo">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-indigo">timer</span>
                        <div className="stat-lbl">Prep / Cook Time</div>
                      </div>
                      <div className="stat-num c-indigo" style={{ fontSize: "24px", margin: "12px 0" }}>
                        {parsedRecipe.prepTime}m / {parsedRecipe.cookTime}m
                      </div>
                      <span className="stat-badge c-indigo">Minutes</span>
                    </div>
                    <div className="card stat-card border-glow-green">
                      <div className="stat-card-header">
                        <span className="material-symbols-outlined c-green">restaurant</span>
                        <div className="stat-lbl">Macro-split</div>
                      </div>
                      <div className="stat-num c-green" style={{ fontSize: "16px", margin: "16px 0 8px" }}>
                        P: {parsedRecipe.protein}g | C: {parsedRecipe.carbs}g | F: {parsedRecipe.fats}g
                      </div>
                      <span className="stat-badge c-green">g / serving</span>
                    </div>
                  </div>

                  <div className="dash-grid">
                    {/* Left Column: Ingredients Checklist */}
                    <div className="dash-column">
                      <div className="card dash-card">
                        <div className="dash-card-title">
                          <span className="material-symbols-outlined c-cyan">checklist</span>
                          Ingredients Checklist
                        </div>
                        <div className="recipe-ingredients-checklist">
                          {parsedRecipe.ingredients.map((ing, i) => {
                            const query = getIngredientQuery(ing);
                            const imgUrl = `https://loremflickr.com/150/150/food,${query}?random=${i}`;
                            return (
                              <label className="checkbox-item ingredient-card" key={i}>
                                <input type="checkbox" />
                                <span className="checkbox-custom" />
                                <div className="ingredient-img-wrapper">
                                  <img src={imgUrl} alt={ing} loading="lazy" />
                                </div>
                                <span className="checkbox-label">{ing}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Cooking Instructions & Video Player */}
                    <div className="dash-column">
                      {/* Cooking Instructions Card */}
                      <div className="card dash-card">
                        <div className="dash-card-title">
                          <span className="material-symbols-outlined c-indigo">menu_book</span>
                          Cooking Instructions
                        </div>
                        <ol className="recipe-instructions-list">
                          {parsedRecipe.instructions.map((step, i) => (
                            <li key={i} className="instruction-step">
                              <div className="step-number">{i + 1}</div>
                              <div className="step-text">{step}</div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* AI Cooking Companion Video Card */}
                      <div className="card dash-card cooking-video-card">
                        <div className="dash-card-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                          <div className="dash-card-title" style={{ marginBottom: 0 }}>
                            <span className="material-symbols-outlined c-green">videocam</span>
                            AI Cooking Companion
                          </div>
                          <span className="core-status-badge font-mono" style={{ fontSize: "10px" }}>
                            LIVE // CHANNEL_{videoChannel.toUpperCase()}
                          </span>
                        </div>

                        <div className="cooking-video-player-container">
                          <video
                            key={videoChannel}
                            className="cooking-video-element"
                            controls
                            loop
                            muted
                            autoPlay
                            playsInline
                          >
                            <source
                              src={
                                videoChannel === "grill"
                                  ? "/grill.webm"
                                  : videoChannel === "prep"
                                  ? "/prep.webm"
                                  : "/saute.webm"
                              }
                              type="video/webm"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <div className="video-telemetry-overlay font-mono">
                            <span className="telemetry-item blink"><span className="telemetry-dot" />STREAMING ACTIVE</span>
                            <span className="telemetry-item">1080P // H.264 // 60FPS</span>
                          </div>
                        </div>

                        <div className="video-channel-controls" style={{ marginTop: "12px" }}>
                          <div className="video-channel-label font-mono" style={{ fontSize: "10px", color: "var(--t3)", marginBottom: "6px" }}>Select Ambient Cooking Feed:</div>
                          <div className="mode-toggle-group">
                            <button
                              className={`mode-btn ${videoChannel === "saute" ? "active" : ""}`}
                              onClick={() => setVideoChannel("saute")}
                            >
                              Italian Sauté
                            </button>
                            <button
                              className={`mode-btn ${videoChannel === "grill" ? "active" : ""}`}
                              onClick={() => setVideoChannel("grill")}
                            >
                              Flame Grill
                            </button>
                            <button
                              className={`mode-btn ${videoChannel === "prep" ? "active" : ""}`}
                              onClick={() => setVideoChannel("prep")}
                            >
                              Chef's Prep
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Raw View Toggle */}
                  <div className="card plan-card-futuristic">
                    <div className="plan-card-head">
                      <div className="plan-head-l">
                        <span className="material-symbols-outlined c-cyan">terminal</span>
                        <div>
                          <div className="plan-head-title">NEURAL NETWORK RECIPE CORPUS</div>
                          <div className="plan-head-sub">Raw structured text output</div>
                        </div>
                      </div>
                      <span className="plan-badge-glow">RAW DATA</span>
                    </div>
                    <div className="plan-body-futuristic">{recipeResponse}</div>
                  </div>
                </div>
              )}

              {/* Error state */}
              {!recipeLoading && recipeResponse && recipeResponse.startsWith("Error:") && (
                <div className="card error-card">
                  <div className="material-symbols-outlined error-icon">warning</div>
                  <p className="error-title">Search Ingestion Failed</p>
                  <p className="error-msg">{recipeResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* ════════ WORKOUT & FITNESS VIEW ════════ */}
          {activeNav === "workout" && (
            <div className="workout-view">
              <div className="page-hero">
                <div className="page-hero-tag">
                  <div className="tag-dot" />
                  Kinetic Training Core v2.0
                </div>
                <h1>Workout & <span className="grad">Fitness</span></h1>
                <p>Synchronize your physical training with your goal. Log completed sets and manage rest cycles in real-time.</p>
              </div>

              {/* Goal selector */}
              <div className="card form-card workout-control-card" style={{ marginBottom: "20px" }}>
                <div className="workout-control-row">
                  <div className="field">
                    <label>Target Fitness Focus</label>
                    <select
                      value={workoutGoal}
                      onChange={(e) => setWorkoutGoal(e.target.value)}
                    >
                      <option>Lose Weight</option>
                      <option>Gain Muscle</option>
                      <option>Maintain Weight</option>
                      <option>Improve Health</option>
                    </select>
                  </div>
                  <div className="workout-header-stats">
                    <div className="w-stat">
                      <div className="w-stat-lbl">Today's Focus</div>
                      <div className="w-stat-val c-indigo">
                        {WORKOUT_ROUTINES[workoutGoal]?.[activeWorkoutDay]?.focus || "Rest"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Days Navigation Grid */}
              <div className="workout-days-nav">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                  const isCurrent = activeWorkoutDay === day;
                  const focus = WORKOUT_ROUTINES[workoutGoal]?.[day]?.focus || "Rest";
                  const isRest = focus === "Full Rest" || focus === "Rest & Reset" || focus === "Full Body Rejuvenation" || focus === "Complete Rest Day";
                  
                  return (
                    <button
                      key={day}
                      className={`workout-day-btn ${isCurrent ? "active" : ""}`}
                      onClick={() => setActiveWorkoutDay(day)}
                    >
                      <div className="day-name">{day.substring(0, 3)}</div>
                      <div className="day-focus-short" title={focus}>
                        {isRest ? "Rest" : focus.split(" ")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main Grid: Exercises Checklist vs Timer */}
              <div className="dash-grid">
                {/* Left Column: Exercises Checklist */}
                <div className="dash-column">
                  <div className="card dash-card">
                    <div className="dash-card-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                      <div className="dash-card-title" style={{ marginBottom: "0" }}>
                        <span className="material-symbols-outlined c-indigo">fitness_center</span>
                        Daily Routine Checklist
                      </div>
                      <span className="workout-completion-badge font-mono" style={{ fontSize: "11px", fontWeight: "700", color: "var(--indigo)" }}>
                        {Math.round(completionPct)}% Done
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="workout-progress-bar-container">
                      <div
                        className="workout-progress-bar-fill"
                        style={{
                          width: `${completionPct}%`
                        }}
                      />
                    </div>

                    <div className="workout-exercises-list">
                      {activeExercises.map((ex, i) => {
                        const isChecked = !!checkedExercises[`${workoutGoal}-${activeWorkoutDay}-${i}`];
                        return (
                          <label key={i} className={`workout-exercise-item ${isChecked ? "checked" : ""}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setCheckedExercises({
                                  ...checkedExercises,
                                  [`${workoutGoal}-${activeWorkoutDay}-${i}`]: e.target.checked
                                });
                              }}
                            />
                            <span className="checkbox-custom" />
                            <div className="exercise-info">
                              <div className="exercise-name">{ex.name}</div>
                              <div className="exercise-detail">{ex.detail}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Timer & 3D Core */}
                <div className="dash-column">
                  {/* Rest Timer Widget */}
                  <div className="card dash-card rest-timer-card">
                    <div className="dash-card-title">
                      <span className="material-symbols-outlined c-green">hourglass_empty</span>
                      Rest Interval Timer
                    </div>

                    <div className="timer-display-container">
                      <div className="timer-svg-wrapper">
                        <svg className="timer-svg" viewBox="0 0 100 100">
                          <circle className="timer-track" cx="50" cy="50" r="45" />
                          <circle
                            className="timer-fill"
                            cx="50"
                            cy="50"
                            r="45"
                            style={{
                              strokeDashoffset: timerTotal
                                ? 282.7 - (282.7 * timerSeconds) / timerTotal
                                : 0
                            }}
                          />
                        </svg>
                        <div className="timer-text-overlay">
                          <div className="timer-time font-mono">
                            {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                          </div>
                          <div className="timer-status-lbl">
                            {timerRunning ? "Resting..." : "Ready"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preset Buttons */}
                    <div className="timer-presets">
                      {[30, 60, 90].map((sec) => (
                        <button
                          key={sec}
                          className={`timer-preset-btn ${timerTotal === sec && !timerRunning ? "active" : ""}`}
                          onClick={() => {
                            setTimerTotal(sec);
                            setTimerSeconds(sec);
                            setTimerRunning(false);
                          }}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>

                    {/* Timer Control Actions */}
                    <div className="timer-controls">
                      {!timerRunning ? (
                        <button
                          className="btn-primary timer-btn-start"
                          onClick={() => {
                            if (timerSeconds === 0) {
                              setTimerSeconds(timerTotal);
                            }
                            setTimerRunning(true);
                          }}
                        >
                          <span className="material-symbols-outlined">play_arrow</span>
                          Start Rest
                        </button>
                      ) : (
                        <button
                          className="btn-primary timer-btn-pause"
                          style={{
                            background: "rgba(129, 140, 248, 0.2)",
                            borderColor: "var(--indigo)",
                            color: "var(--indigo)"
                          }}
                          onClick={() => setTimerRunning(false)}
                        >
                          <span className="material-symbols-outlined">pause</span>
                          Pause
                        </button>
                      )}
                      <button
                        className="btn-sm timer-btn-reset"
                        onClick={() => {
                          setTimerRunning(false);
                          setTimerSeconds(timerTotal);
                        }}
                      >
                        <span className="material-symbols-outlined">replay</span>
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* 3D Kinetic Core Hologram Card */}
                  <div className={`card dash-card kinetic-core-card ${blastActive ? 'blasting' : ''} active-mode-${animationMode}`}>
                    <div className="dash-card-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div className="dash-card-title" style={{ marginBottom: 0 }}>
                        <span className="material-symbols-outlined c-indigo">token</span>
                        3D Kinetic Core
                      </div>
                      <span className="core-status-badge font-mono">
                        {animationMode === 'sync' ? `SYNC: ${Math.round(completionPct)}%` : animationMode.toUpperCase()}
                      </span>
                    </div>

                    <div className="kinetic-core-scene-container">
                      <div className="kinetic-3d-scene" style={{ '--speed-mult': getSpeedMultiplier() }}>
                        {/* Center pulsing dumbbell core */}
                        <div className="kinetic-center-core">
                          <div className="core-glow-sphere" />
                          <span className="material-symbols-outlined barbell-core-icon">fitness_center</span>
                        </div>

                        {/* Concentric rings */}
                        <div className="kinetic-ring ring-outer">
                          <span className="ring-label">STRENGTH</span>
                        </div>
                        <div className="kinetic-ring ring-middle">
                          <span className="ring-label">AGILITY</span>
                        </div>
                        <div className="kinetic-ring ring-inner">
                          <span className="ring-label">ENDURANCE</span>
                        </div>

                        {/* Orbiting particles */}
                        <div className="kinetic-orbit-particle p1" />
                        <div className="kinetic-orbit-particle p2" />
                        <div className="kinetic-orbit-particle p3" />
                        <div className="kinetic-orbit-particle p4" />

                        {/* Expanding Shockwave on Blast */}
                        {blastActive && <div className="kinetic-shockwave" />}
                      </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="core-controls">
                      <div className="mode-toggle-group">
                        <button 
                          className={`mode-btn ${animationMode === 'sync' ? 'active' : ''}`}
                          onClick={() => setAnimationMode('sync')}
                          title="Link spin speed to exercise progress"
                        >
                          Sync
                        </button>
                        <button 
                          className={`mode-btn ${animationMode === 'zen' ? 'active' : ''}`}
                          onClick={() => setAnimationMode('zen')}
                          title="Slow, relaxing rotation"
                        >
                          Zen
                        </button>
                        <button 
                          className={`mode-btn ${animationMode === 'overdrive' ? 'active' : ''}`}
                          onClick={() => setAnimationMode('overdrive')}
                          title="Run core at maximum velocity"
                        >
                          Overdrive
                        </button>
                      </div>
                      
                      <button 
                        className="btn-primary blast-btn"
                        onClick={triggerKineticBlast}
                        disabled={blastActive}
                      >
                        <span className="material-symbols-outlined">bolt</span>
                        Kinetic Blast
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ DIET PLANS PRESETS VIEW ════════ */}
          {activeNav === "presets" && (
            <div className="presets-view">
              <div className="page-hero">
                <div className="page-hero-tag">
                  <div className="tag-dot" />
                  Telemetry Presets v2.0
                </div>
                <h1>Preset <span className="grad">Diet Plans</span></h1>
                <p>Explore optimized nutrition structures for fat loss, maintenance, or muscle building. Choose a protocol to inspect its meal schedule.</p>
              </div>

              <div className="dash-grid">
                {/* Left Column: Preset cards and details */}
                <div className="dash-column">
                  {/* Preset Selector Grid */}
                  <div className="preset-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "14px" }}>
                    {[
                      { key: "cutting", title: "Cutting", desc: "Fat loss & lean definition", icon: "vertical_align_bottom", macros: "1,800 kcal // 150g P", color: "var(--cyan)" },
                      { key: "maintaining", title: "Maintaining", desc: "Body recomposition", icon: "sync_alt", macros: "2,400 kcal // 160g P", color: "var(--indigo)" },
                      { key: "bulking", title: "Bulking", desc: "Muscle hypertrophy", icon: "vertical_align_top", macros: "3,200 kcal // 180g P", color: "#ec4899" }
                    ].map((plan) => {
                      const isSelected = activePresetPlan === plan.key;
                      return (
                        <div
                          key={plan.key}
                          className={`card preset-selector-card ${isSelected ? "active" : ""}`}
                          onClick={() => setActivePresetPlan(plan.key)}
                          style={{
                            cursor: "pointer",
                            borderColor: isSelected ? plan.color : "var(--border)",
                            boxShadow: isSelected ? `0 0 15px ${plan.color}25` : "none",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                            position: "relative",
                            overflow: "hidden"
                          }}
                        >
                          <div className="preset-card-icon-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div className="preset-card-icon" style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: plan.color,
                              background: `${plan.color}15`,
                              border: `1px solid ${plan.color}25`
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{plan.icon}</span>
                            </div>
                            {isSelected && <span className="material-symbols-outlined" style={{ color: plan.color, fontSize: "16px" }}>check_circle</span>}
                          </div>
                          <div className="preset-card-content">
                            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--t1)", margin: "0 0 2px" }}>{plan.title}</h3>
                            <p className="preset-desc" style={{ fontSize: "10px", color: "var(--t3)", margin: "0 0 6px", lineHeight: "1.3" }}>{plan.desc}</p>
                            <span className="preset-card-macros font-mono" style={{ fontSize: "9px", color: plan.color, fontWeight: "700" }}>{plan.macros}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Plan Details Display (visible only when activePresetPlan != null) */}
                  {activePresetPlan ? (
                    <div className="card dash-card preset-details-card animate-slide-up">
                      <div className="preset-details-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "14px", marginBottom: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h2 style={{ fontSize: "16px", fontWeight: "800", color: "var(--t1)", margin: 0 }}>{DIET_PRESET_PLANS[activePresetPlan].title}</h2>
                          <span className="core-status-badge font-mono" style={{
                            fontSize: "9px",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            color: activePresetPlan === "cutting" ? "var(--cyan)" : activePresetPlan === "bulking" ? "#ec4899" : "var(--indigo)",
                            borderColor: activePresetPlan === "cutting" ? "rgba(6, 182, 212, 0.3)" : activePresetPlan === "bulking" ? "rgba(236, 72, 153, 0.3)" : "rgba(129, 140, 248, 0.3)",
                            background: activePresetPlan === "cutting" ? "rgba(6, 182, 212, 0.05)" : activePresetPlan === "bulking" ? "rgba(236, 72, 153, 0.05)" : "rgba(129, 140, 248, 0.05)"
                          }}>
                            {DIET_PRESET_PLANS[activePresetPlan].focus.toUpperCase()}
                          </span>
                        </div>
                        <div className="preset-detail-metrics font-mono" style={{ fontSize: "11px", color: "var(--t3)", marginTop: "4px" }}>
                          {DIET_PRESET_PLANS[activePresetPlan].metrics}
                        </div>
                      </div>

                      <div className="meal-timeline" style={{ paddingLeft: "4px" }}>
                        {DIET_PRESET_PLANS[activePresetPlan].meals.map((meal, idx) => (
                          <div className="meal-timeline-item" key={idx} style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                            <div className="meal-timeline-node" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div className="meal-node-circle" style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                background: "var(--card-solid)",
                                border: "1px solid var(--border)",
                                color: activePresetPlan === "cutting" ? "var(--cyan)" : activePresetPlan === "bulking" ? "#ec4899" : "var(--indigo)"
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                  {idx === 0 ? "wb_sunny" : idx === 1 ? "light_mode" : idx === 2 ? "eco" : "nights_stay"}
                                </span>
                              </div>
                              {idx < 3 && <div className="meal-timeline-line" style={{ width: "2px", flex: 1, background: "var(--border)", margin: "4px 0" }} />}
                            </div>

                            <div className="meal-timeline-content" style={{ flex: 1 }}>
                              <div className="meal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span className="meal-label" style={{ fontWeight: "700", fontSize: "13px", color: "var(--t1)" }}>{meal.name}</span>
                                <span className="meal-time-tag font-mono" style={{ fontSize: "9px", color: "var(--t3)", background: "rgba(255, 255, 255, 0.02)", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)" }}>{meal.time}</span>
                              </div>
                              <div className="meal-detail-card" style={{ padding: "10px 14px", background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                                <p style={{ fontSize: "11px", color: "var(--t2)", lineHeight: "1.5", margin: 0 }}>{meal.details}</p>
                                <div className="meal-nutrients" style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                  <span className="nutrient-badge font-mono" style={{ fontSize: "9px", padding: "2px 6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--t3)", display: "flex", alignItems: "center", gap: "3px" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>local_fire_department</span>
                                    {meal.calories}
                                  </span>
                                  <span className="nutrient-badge font-mono" style={{ fontSize: "9px", padding: "2px 6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--t3)", display: "flex", alignItems: "center", gap: "3px" }}>
                                    P: {meal.protein}
                                  </span>
                                  <span className="nutrient-badge font-mono" style={{ fontSize: "9px", padding: "2px 6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--t3)", display: "flex", alignItems: "center", gap: "3px" }}>
                                    C: {meal.carbs}
                                  </span>
                                  <span className="nutrient-badge font-mono" style={{ fontSize: "9px", padding: "2px 6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--t3)", display: "flex", alignItems: "center", gap: "3px" }}>
                                    F: {meal.fats}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="card dash-card preset-placeholder-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: "220px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--t3)", marginBottom: "10px" }}>ads_click</span>
                      <p style={{ fontSize: "13px", color: "var(--t2)", fontWeight: "600", margin: "0 0 4px" }}>No Preset Plan Selected</p>
                      <p style={{ fontSize: "11px", color: "var(--t3)", margin: 0, textAlign: "center" }}>Click one of the profile templates above to load a complete daily nutritional breakdown.</p>
                    </div>
                  )}
                </div>

                {/* Right Column: 3D Diet Reactor Core */}
                <div className="dash-column">
                  <div className="card dash-card diet-reactor-card">
                    <div className="dash-card-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <div className="dash-card-title" style={{ marginBottom: 0 }}>
                        <span className="material-symbols-outlined c-indigo">center_focus_strong</span>
                        3D Diet Reactor Core
                      </div>
                      <span className="core-status-badge font-mono" style={{ fontSize: "10px" }}>
                        {activePresetPlan ? `FOCUS: ${activePresetPlan.toUpperCase()}` : "ORBITING"}
                      </span>
                    </div>

                    <div className="reactor-viewport-container">
                      <div className={`reactor-scene ${activePresetPlan ? `focus-${activePresetPlan}` : "orbiting"}`}>
                        <div className="reactor-platform" />
                        <div className="reactor-pill pill-cutting">
                          <span className="pill-lbl">CUT</span>
                        </div>
                        <div className="reactor-pill pill-maintaining">
                          <span className="pill-lbl">MAINT</span>
                        </div>
                        <div className="reactor-pill pill-bulking">
                          <span className="pill-lbl">BULK</span>
                        </div>
                      </div>
                    </div>

                    <div className="reactor-telemetry font-mono" style={{ fontSize: "10px", color: "var(--t3)", display: "flex", flexDirection: "column", gap: "4px", padding: "8px 0 0", borderTop: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>REACTOR.STATUS:</span>
                        <span className={activePresetPlan ? "c-green" : ""}>{activePresetPlan ? "LOCK_ACQUIRED" : "IDLE_SCAN"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>CORE.FREQUENCY:</span>
                        <span>{activePresetPlan ? "8.4 Hz (BOOSTED)" : "2.5 Hz (STABLE)"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>THERMAL.ENVELOPE:</span>
                        <span className="c-cyan">NOMINAL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
