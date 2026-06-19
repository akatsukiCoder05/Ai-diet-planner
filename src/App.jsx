import { useState, useEffect } from "react";
import "./App.css";

// Environment variables - backend hosted on Render
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-diet-planner-uko9.onrender.com';


function App() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    activityLevel: "Active (Moderate)",
    height: "",
    weight: "",
    goal: "Lose Weight",
  });

  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [showResults, setShowResults] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Parse diet plan data
  const [parsedData, setParsedData] = useState({
    bmi: "22.8",
    bmiStatus: "OPTIMAL HARMONY",
    calories: "2450",
    protein: "185",
    carbs: "260",
    fats: "65",
    waterIntake: "3.5",
    meals: {
      breakfast: { 
        name: "Greek yogurt with organic forest berries & raw honey", 
        calories: "420", 
        protein: "30",
        time: "08:00 AM"
      },
      lunch: { 
        name: "Wild-caught grilled salmon with lemon quinoa & kale salad", 
        calories: "650", 
        protein: "45",
        time: "01:30 PM"
      },
      dinner: { 
        name: "Crispy organic tofu stir-fry with steamed seasonal greens", 
        calories: "580", 
        protein: "25",
        time: "07:30 PM"
      },
      snacks: { 
        name: "Handful of almonds & green apple", 
        calories: "280", 
        protein: "8",
        time: "04:00 PM"
      },
    },
    avoidFoods: [],
    exercises: [],
    tips: [],
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function generateDietPlan() {
    setLoading(true);
    setDietPlan("");
    setShowResults(false);

    try {
      const response = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate diet plan');
      }

      const content = data.content;
      setDietPlan(content);
      parseDietPlan(content);
      setShowResults(true);
      setServerStatus('online'); // backend responded, so it's online

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (error) {
      console.error('Generate plan error:', error);
      setDietPlan(`Error: ${error.message}`);
      setShowResults(true); // show error section
    }

    setLoading(false);
  }

  async function downloadPDF() {
    if (!dietPlan) {
      alert('Please generate a diet plan first');
      return;
    }

    setDownloadingPDF(true);

    try {
      const response = await fetch(`${API_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dietPlan: dietPlan,
          userInfo: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diet-plan-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Check if it's a network error
      if (error.message.includes('fetch')) {
        alert('Cannot connect to server. Please make sure:\n1. Server is running (npm run server)\n2. Server is on http://localhost:5000');
      } else {
        alert(`Failed to download PDF: ${error.message}\n\nPlease check:\n1. Server is running\n2. Diet plan is generated\n3. Check browser console for details`);
      }
    } finally {
      setDownloadingPDF(false);
    }
  }

  async function savePlan() {
    if (!dietPlan) {
      alert('Please generate a diet plan first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/save-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dietPlan: dietPlan,
          userInfo: formData,
          parsedData: parsedData,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Diet plan saved successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan. Please make sure the server is running.');
    }
  }

  function parseDietPlan(content) {
    const lines = content.split("\n");
    const data = {
      bmi: "22.8",
      bmiStatus: "OPTIMAL HARMONY",
      calories: "2450",
      protein: "185",
      carbs: "260",
      fats: "65",
      waterIntake: "3.5",
      meals: {
        breakfast: { 
          name: "Greek yogurt with organic berries", 
          calories: "420", 
          protein: "30",
          time: "08:00 AM"
        },
        lunch: { 
          name: "Grilled salmon with quinoa", 
          calories: "650", 
          protein: "45",
          time: "01:30 PM"
        },
        dinner: { 
          name: "Tofu stir-fry with greens", 
          calories: "580", 
          protein: "25",
          time: "07:30 PM"
        },
        snacks: { 
          name: "Almonds & apple", 
          calories: "280", 
          protein: "8",
          time: "04:00 PM"
        },
      },
      avoidFoods: [],
      exercises: [],
      tips: [],
    };

    let currentSection = "";
    let currentMeal = "";

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Section detection
      if (trimmed.startsWith("BMI:")) currentSection = "bmi";
      else if (trimmed.startsWith("CALORIES:")) currentSection = "calories";
      else if (trimmed.startsWith("MEAL PLAN:")) currentSection = "meals";
      else if (trimmed.startsWith("WATER INTAKE:")) currentSection = "water";
      else if (trimmed.startsWith("FOODS TO AVOID:")) currentSection = "avoid";
      else if (trimmed.startsWith("EXERCISE PLAN:")) currentSection = "exercise";
      else if (trimmed.startsWith("TIPS:")) currentSection = "tips";
      
      // Meal detection
      if (trimmed.startsWith("Breakfast:")) currentMeal = "breakfast";
      else if (trimmed.startsWith("Lunch:")) currentMeal = "lunch";
      else if (trimmed.startsWith("Dinner:")) currentMeal = "dinner";
      else if (trimmed.startsWith("Snacks:")) currentMeal = "snacks";

      // Parse content
      if (trimmed.startsWith("-")) {
        const content = trimmed.substring(1).trim();
        
        if (currentSection === "bmi") {
          if (content.toLowerCase().includes("value:")) {
            data.bmi = content.split(":")[1]?.trim() || data.bmi;
          } else if (content.toLowerCase().includes("status:")) {
            const status = content.split(":")[1]?.trim().toUpperCase() || "NORMAL";
            data.bmiStatus = status === "NORMAL" ? "OPTIMAL HARMONY" : status;
          }
        } else if (currentSection === "calories") {
          if (content.toLowerCase().includes("daily") || content.includes("kcal")) {
            const match = content.match(/(\d+)/);
            if (match) data.calories = match[1];
          } else if (content.toLowerCase().includes("protein")) {
            const match = content.match(/(\d+)/);
            if (match) data.protein = match[1];
          } else if (content.toLowerCase().includes("carb")) {
            const match = content.match(/(\d+)/);
            if (match) data.carbs = match[1];
          } else if (content.toLowerCase().includes("fat")) {
            const match = content.match(/(\d+)/);
            if (match) data.fats = match[1];
          }
        } else if (currentSection === "meals" && currentMeal) {
          if (!content.includes("kcal") && !content.includes("protein")) {
            data.meals[currentMeal].name = content;
          } else if (content.includes("kcal")) {
            const calMatch = content.match(/(\d+)\s*kcal/);
            if (calMatch) data.meals[currentMeal].calories = calMatch[1];
          } else if (content.toLowerCase().includes("protein")) {
            const protMatch = content.match(/(\d+)\s*g/);
            if (protMatch) data.meals[currentMeal].protein = protMatch[1];
          }
        } else if (currentSection === "water") {
          const match = content.match(/(\d+\.?\d*)/);
          if (match) data.waterIntake = match[1];
        } else if (currentSection === "avoid") {
          data.avoidFoods.push(content);
        } else if (currentSection === "exercise") {
          data.exercises.push(content);
        } else if (currentSection === "tips") {
          data.tips.push(content);
        }
      }
    });

    setParsedData(data);
  }

  useEffect(() => {
    // Add Google Fonts and Material Symbols
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@500&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const iconLink = document.createElement("link");
    iconLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..300,0..1&display=swap";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);

    // Check server status
    checkServerStatus();

    // Intersection Observer for staggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.staggered-item').forEach(el => observer.observe(el));
    }, 100);
  }, []);

  async function checkServerStatus() {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
      });
      
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
      {/* Integrated Slim Sidebar - Desktop */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-6 p-4 rounded-full floating-nav">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 mb-4">
          <img 
            className="w-full h-full object-cover" 
            alt="User Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyKPsM6ua53LjFcoKIkbskqT5ucE7ANos01ivw-1YbxfFycxwSA1pFCksWo1krzmFfFWg2NbFxzp_q3zX2eryktSwXxRQzYZgiygdR9WVu6JzgKirYP9bLb0BO9AOkXrQYOh47jIMUneOmkegA01Mj5lhqVnLihIDNter7XwlPkmP-ZLfUr46CCAtGGDGmPJEASSc3bwiuIr-KdhJR_mJqTB84pyPbLk-rFTNTI2gKHFHzGJYYIwFat6LGGDZ3_v16IYQSNLvgBFIs"
          />
        </div>
        
        <nav className="flex flex-col gap-6">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveNav("overview"); }}
            className={`p-3 rounded-full transition-all ${
              activeNav === "overview" 
                ? "text-primary bg-primary/10" 
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="Overview"
          >
            <span className="material-symbols-outlined">grid_view</span>
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveNav("history"); }}
            className={`p-3 rounded-full transition-all ${
              activeNav === "history" 
                ? "text-primary bg-primary/10" 
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="History"
          >
            <span className="material-symbols-outlined">tide_high</span>
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveNav("profile"); }}
            className={`p-3 rounded-full transition-all ${
              activeNav === "profile" 
                ? "text-primary bg-primary/10" 
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="Profile"
          >
            <span className="material-symbols-outlined">person_2</span>
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveNav("settings"); }}
            className={`p-3 rounded-full transition-all ${
              activeNav === "settings" 
                ? "text-primary bg-primary/10" 
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="Settings"
          >
            <span className="material-symbols-outlined">tune</span>
          </a>
        </nav>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-6">
          <a href="#" className="p-3 rounded-full text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">help</span>
          </a>
          <a href="#" className="p-3 rounded-full text-error/60 hover:text-error transition-all">
            <span className="material-symbols-outlined">logout</span>
          </a>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 floating-nav px-4 py-4 flex justify-between items-center">
        <span className="serif-font text-xl text-primary">AI Diet Planner</span>
        <div className="flex items-center gap-3">
          {/* Server Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-green-400' : serverStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-on-surface-variant">{serverStatus === 'online' ? 'Server' : serverStatus === 'offline' ? 'Offline' : 'Checking'}</span>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant">menu</button>
        </div>
      </header>

      {/* Main Storytelling Flow */}
      <main className="max-w-3xl mx-auto pt-24 pb-32 px-4 md:px-0">
        {/* Hero / Input Section */}
        <section className="mb-24 text-center staggered-item" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-5xl md:text-6xl text-on-surface mb-6 leading-tight serif-font">
            Your path to <span className="text-primary italic">wellness</span> begins here.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-12 font-light tracking-wide">
            Tell us about yourself to create a nourishing meal journey tailored for your unique body.
          </p>

          <div className="organic-card p-10 rounded-[3rem] text-left">
            <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium ml-1">
                    Current Age
                  </label>
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 focus:border-primary py-2 px-1 text-lg outline-none transition-all placeholder:text-white/10"
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium ml-1">
                    Gender Identity
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 focus:border-primary py-2 px-1 text-lg outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-surface">Male</option>
                    <option className="bg-surface">Female</option>
                    <option className="bg-surface">Non-binary</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium ml-1">
                    Daily Activity
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 focus:border-primary py-2 px-1 text-lg outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-surface">Gentle (Sedentary)</option>
                    <option className="bg-surface">Active (Moderate)</option>
                    <option className="bg-surface">Very Active (Athlete)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium ml-1">
                    Weight (kg)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 focus:border-primary py-2 px-1 text-lg outline-none transition-all placeholder:text-white/10"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={generateDietPlan}
                  disabled={loading}
                  className="w-full py-5 rounded-full bg-primary text-background font-semibold text-lg soft-glow transition-all active:scale-[0.98] disabled:opacity-80"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Syncing with Body...
                    </span>
                  ) : (
                    "Craft My Journey"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Section (Storytelling Flow) */}
        {showResults && (
          <section className="space-y-16" id="results">
            {/* Section Header */}
            <div className="text-center staggered-item" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-4xl text-primary mb-4 serif-font">Your Nourishment Plan</h2>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={downloadPDF}
                  disabled={downloadingPDF}
                  className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download your diet plan as PDF"
                >
                  <span className="material-symbols-outlined text-base">
                    {downloadingPDF ? 'progress_activity' : 'file_download'}
                  </span> 
                  {downloadingPDF ? 'Generating...' : 'Download PDF'}
                </button>
                <span className="text-white/10">|</span>
                <button 
                  onClick={savePlan}
                  className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center gap-2"
                  title="Save your plan to history"
                >
                  <span className="material-symbols-outlined text-base">ios_share</span> Save Plan
                </button>
              </div>
            </div>

            {/* Error Display */}
            {dietPlan.startsWith('Error:') && (
              <div className="organic-card p-8 rounded-3xl border border-red-500/30 text-center staggered-item">
                <span className="material-symbols-outlined text-4xl text-error mb-4 block">error</span>
                <p className="text-error font-medium mb-2">Something went wrong</p>
                <p className="text-on-surface-variant text-sm">{dietPlan}</p>
                <button
                  onClick={generateDietPlan}
                  className="mt-6 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Raw AI Plan Text — always visible as primary result */}
            {!dietPlan.startsWith('Error:') && dietPlan && (
              <div className="organic-card p-8 rounded-3xl staggered-item" style={{ animationDelay: '0.25s' }}>
                <h3 className="text-lg serif-font text-primary mb-4">Your AI Generated Plan</h3>
                <pre className="text-on-surface-variant text-sm whitespace-pre-wrap leading-relaxed font-sans">{dietPlan}</pre>
              </div>
            )}

            {/* Vital Statistics — only shown for successful plans */}
            {!dietPlan.startsWith('Error:') && (
            <div className="space-y-6">
              <div className="organic-card p-12 rounded-[3rem] text-center staggered-item" style={{ animationDelay: "0.3s" }}>
                <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant/50 font-medium mb-6 block">
                  Current Equilibrium (BMI)
                </span>
                <div className="text-7xl serif-font text-primary mb-6">{parsedData.bmi}</div>
                <div className="inline-block px-6 py-2 rounded-full border border-primary/20 text-primary text-sm tracking-widest">
                  {parsedData.bmiStatus}
                </div>
                <p className="mt-8 text-on-surface-variant leading-relaxed font-light">
                  Your body is currently in a healthy state of balance. Our recommendations focus on maintaining this vitality while enhancing muscle tone.
                </p>
              </div>

              {/* Daily Goals Cards (Masonry-like staggered two-column on md) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calorie Target */}
                <div className="organic-card p-10 rounded-[3rem] flex flex-col items-center staggered-item" style={{ animationDelay: "0.4s" }}>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant/50 font-medium mb-8">
                    Daily Energy Target
                  </span>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        className="text-white/5"
                        cx="80"
                        cy="80"
                        fill="transparent"
                        r="72"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <circle
                        className="text-primary/40"
                        cx="80"
                        cy="80"
                        fill="transparent"
                        r="72"
                        stroke="currentColor"
                        strokeDasharray="452"
                        strokeDashoffset="120"
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl serif-font">{parsedData.calories}</span>
                      <span className="text-xs text-on-surface-variant/60 uppercase tracking-widest">Kcal</span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full text-center px-4">
                    <div>
                      <div className="text-primary text-lg serif-font">{parsedData.protein}g</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Protein</div>
                    </div>
                    <div>
                      <div className="text-tertiary text-lg serif-font">{parsedData.carbs}g</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Carbs</div>
                    </div>
                    <div>
                      <div className="text-secondary text-lg serif-font">{parsedData.fats}g</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Fats</div>
                    </div>
                  </div>
                </div>

                {/* Hydration */}
                <div className="organic-card p-10 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-between staggered-item" style={{ animationDelay: "0.5s" }}>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant/50 font-medium mb-4">
                    Hydration Flow
                  </span>
                  <div className="text-center z-10">
                    <div className="text-6xl serif-font mb-2">
                      {parsedData.waterIntake}
                      <span className="text-xl serif-font text-on-surface-variant/40 ml-2">L</span>
                    </div>
                    <p className="text-xs text-on-surface-variant tracking-wide">
                      Aim for 10 mindful glasses daily
                    </p>
                  </div>
                  <div className="flex gap-2 mt-8 z-10">
                    <div className="w-2 h-10 bg-primary/40 rounded-full"></div>
                    <div className="w-2 h-10 bg-primary/40 rounded-full"></div>
                    <div className="w-2 h-10 bg-primary/40 rounded-full"></div>
                    <div className="w-2 h-10 bg-primary/10 rounded-full"></div>
                    <div className="w-2 h-10 bg-primary/10 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-primary/5 blur-3xl"></div>
                </div>
              </div>
            </div>
            )}

            {/* The Daily Rhythm (Vertical Timeline) */}
            <div className="staggered-item" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-3xl text-on-surface mb-10 pl-6 border-l border-primary/20 serif-font">
                The Daily Rhythm
              </h3>
              <div className="space-y-8">
                {/* Breakfast */}
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                    <span className="material-symbols-outlined text-primary">eco</span>
                  </div>
                  <div className="organic-card flex-1 p-8 rounded-3xl group-hover:warm-active transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl serif-font">Morning Awakening</h4>
                      <span className="text-xs text-primary/60 font-mono">{parsedData.meals.breakfast.time}</span>
                    </div>
                    <p className="text-on-surface-variant mb-4 font-light">
                      {parsedData.meals.breakfast.name}
                    </p>
                    <div className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">
                      {parsedData.meals.breakfast.calories} kcal • {parsedData.meals.breakfast.protein}g Protein
                    </div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                    <span className="material-symbols-outlined text-primary">sunny</span>
                  </div>
                  <div className="organic-card flex-1 p-8 rounded-3xl group-hover:warm-active transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl serif-font">Midday Vitality</h4>
                      <span className="text-xs text-primary/60 font-mono">{parsedData.meals.lunch.time}</span>
                    </div>
                    <p className="text-on-surface-variant mb-4 font-light">
                      {parsedData.meals.lunch.name}
                    </p>
                    <div className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">
                      {parsedData.meals.lunch.calories} kcal • {parsedData.meals.lunch.protein}g Protein
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                    <span className="material-symbols-outlined text-primary">nights_stay</span>
                  </div>
                  <div className="organic-card flex-1 p-8 rounded-3xl group-hover:warm-active transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl serif-font">Evening Restoration</h4>
                      <span className="text-xs text-primary/60 font-mono">{parsedData.meals.dinner.time}</span>
                    </div>
                    <p className="text-on-surface-variant mb-4 font-light">
                      {parsedData.meals.dinner.name}
                    </p>
                    <div className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">
                      {parsedData.meals.dinner.calories} kcal • {parsedData.meals.dinner.protein}g Protein
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mindful Avoidance & Movement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 staggered-item" style={{ animationDelay: "0.7s" }}>
              <div className="organic-card p-10 rounded-[3rem] border-l-2 border-l-error/20">
                <h4 className="serif-font text-2xl mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-error/60">ink_eraser</span> Gentle Omission
                </h4>
                <ul className="space-y-4">
                  {parsedData.avoidFoods.length > 0 ? (
                    parsedData.avoidFoods.map((food, index) => (
                      <li key={index} className="flex items-start gap-4 text-sm text-on-surface-variant font-light">
                        <span className="w-1 h-1 rounded-full bg-error/40 mt-2"></span>
                        {food}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-4 text-sm text-on-surface-variant font-light">
                        <span className="w-1 h-1 rounded-full bg-error/40 mt-2"></span>
                        Refined sugars & artificial syrups
                      </li>
                      <li className="flex items-start gap-4 text-sm text-on-surface-variant font-light">
                        <span className="w-1 h-1 rounded-full bg-error/40 mt-2"></span>
                        Deep-fried processed fast foods
                      </li>
                      <li className="flex items-start gap-4 text-sm text-on-surface-variant font-light">
                        <span className="w-1 h-1 rounded-full bg-error/40 mt-2"></span>
                        High-sodium preserved meats
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="organic-card p-10 rounded-[3rem] border-l-2 border-l-primary/20">
                <h4 className="serif-font text-2xl mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary/60">self_care</span> Body Movement
                </h4>
                <div className="space-y-4">
                  {parsedData.exercises.length > 0 ? (
                    parsedData.exercises.map((exercise, index) => (
                      <div key={index} className="flex justify-between text-sm font-light border-b border-white/5 pb-2">
                        <span className="text-on-surface">{exercise.split(":")[0]}</span>
                        <span className="text-on-surface-variant">{exercise.split(":")[1]}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between text-sm font-light border-b border-white/5 pb-2">
                        <span className="text-on-surface">Mon / Wed / Fri</span>
                        <span className="text-on-surface-variant">Strength Flow</span>
                      </div>
                      <div className="flex justify-between text-sm font-light border-b border-white/5 pb-2">
                        <span className="text-on-surface">Tue / Thu</span>
                        <span className="text-on-surface-variant">Active Breath (Cardio)</span>
                      </div>
                      <div className="flex justify-between text-sm font-light">
                        <span className="text-on-surface">Sat / Sun</span>
                        <span className="text-on-surface-variant">Nature Walk & Rest</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* AI Wellness Insights */}
            <div className="organic-card p-12 rounded-[3rem] bg-primary/5 border border-primary/10 relative overflow-hidden staggered-item" style={{ animationDelay: "0.8s" }}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <h4 className="serif-font text-3xl mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">auto_awesome</span> Mindful Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {parsedData.tips.length > 0 ? (
                  parsedData.tips.map((tip, index) => (
                    <div key={index} className="space-y-3">
                      <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                        Wellness Tip {index + 1}
                      </span>
                      <p className="text-on-surface-variant font-light leading-relaxed italic">
                        "{tip}"
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                        Digestive Care
                      </span>
                      <p className="text-on-surface-variant font-light leading-relaxed italic">
                        "Pause for a glass of water 15 minutes before meals to align your digestive fire and enhance absorption."
                      </p>
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                        Glucose Balance
                      </span>
                      <p className="text-on-surface-variant font-light leading-relaxed italic">
                        "A touch of cinnamon in your morning ritual helps sustain steady energy throughout your day."
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button className="mt-12 group flex items-center gap-3 text-primary text-sm tracking-widest uppercase font-medium hover:gap-5 transition-all">
                Seek Deeper Counsel 
                <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Floating Interaction (Bottom Right) */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background flex items-center justify-center shadow-2xl soft-glow z-50 group hover:scale-110 transition-all">
        <span className="material-symbols-outlined text-3xl">fluid_meditation</span>
      </button>
    </div>
  );
}

export default App;
