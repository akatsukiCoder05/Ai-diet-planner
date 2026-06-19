import { useState, useEffect } from "react";
import "./App.css";

// Backend hosted on Render
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-diet-planner-uko9.onrender.com';

function App() {
  const [formData, setFormData] = useState({
    age: "", gender: "Male", activityLevel: "Active (Moderate)",
    height: "", weight: "", goal: "Lose Weight",
  });

  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  const [parsedData, setParsedData] = useState({
    bmi: "—", bmiStatus: "Pending", calories: "—",
    protein: "0", carbs: "0", fats: "0", waterIntake: "—",
    meals: {
      breakfast: { name: "—", calories: "—", protein: "—", time: "08:00 AM" },
      lunch:     { name: "—", calories: "—", protein: "—", time: "01:00 PM" },
      dinner:    { name: "—", calories: "—", protein: "—", time: "07:30 PM" },
      snacks:    { name: "—", calories: "—", protein: "—", time: "04:00 PM" },
    },
    avoidFoods: [], exercises: [], tips: [],
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function generateDietPlan() {
    setLoading(true);
    setDietPlan("");
    setShowResults(false);

    try {
      const response = await fetch(`${API_URL}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to generate diet plan");

      const content = data.content;
      setDietPlan(content);
      parseDietPlan(content);
      setShowResults(true);
      setServerStatus("online");

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (error) {
      console.error("Generate plan error:", error);
      setDietPlan(`Error: ${error.message}`);
      setShowResults(true);
    }
    setLoading(false);
  }

  async function downloadPDF() {
    if (!dietPlan) { alert("Please generate a diet plan first"); return; }
    setDownloadingPDF(true);
    try {
      const response = await fetch(`${API_URL}/api/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietPlan, userInfo: formData }),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `diet-plan-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF error:", error);
      alert(`Failed to download PDF: ${error.message}`);
    } finally {
      setDownloadingPDF(false);
    }
  }

  async function savePlan() {
    if (!dietPlan) { alert("Please generate a diet plan first"); return; }
    try {
      const response = await fetch(`${API_URL}/api/save-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietPlan, userInfo: formData, parsedData }),
      });
      const data = await response.json();
      if (data.success) alert("Diet plan saved successfully!");
      else throw new Error(data.error);
    } catch (error) {
      alert("Failed to save plan. Please try again.");
    }
  }

  function parseDietPlan(content) {
    const lines = content.split("\n");
    const data = {
      bmi: "—", bmiStatus: "NORMAL", calories: "—",
      protein: "0", carbs: "0", fats: "0", waterIntake: "—",
      meals: {
        breakfast: { name: "Loading...", calories: "—", protein: "—", time: "08:00 AM" },
        lunch:     { name: "Loading...", calories: "—", protein: "—", time: "01:00 PM" },
        dinner:    { name: "Loading...", calories: "—", protein: "—", time: "07:30 PM" },
        snacks:    { name: "Loading...", calories: "—", protein: "—", time: "04:00 PM" },
      },
      avoidFoods: [], exercises: [], tips: [],
    };

    let section = "", meal = "";
    lines.forEach((line) => {
      const t = line.trim();
      if (t.startsWith("BMI:"))           section = "bmi";
      else if (t.startsWith("CALORIES:")) section = "calories";
      else if (t.startsWith("MEAL PLAN:")) section = "meals";
      else if (t.startsWith("WATER INTAKE:")) section = "water";
      else if (t.startsWith("FOODS TO AVOID:")) section = "avoid";
      else if (t.startsWith("EXERCISE PLAN:")) section = "exercise";
      else if (t.startsWith("TIPS:"))     section = "tips";

      if (t.startsWith("Breakfast:"))     meal = "breakfast";
      else if (t.startsWith("Lunch:"))    meal = "lunch";
      else if (t.startsWith("Dinner:"))   meal = "dinner";
      else if (t.startsWith("Snacks:"))   meal = "snacks";

      if (t.startsWith("-")) {
        const c = t.substring(1).trim();
        if (section === "bmi") {
          if (c.toLowerCase().includes("value:")) data.bmi = c.split(":")[1]?.trim() || data.bmi;
          else if (c.toLowerCase().includes("status:")) {
            const s = c.split(":")[1]?.trim().toUpperCase() || "NORMAL";
            data.bmiStatus = s;
          }
        } else if (section === "calories") {
          if (c.toLowerCase().includes("daily") || c.includes("kcal")) {
            const m = c.match(/(\d+)/); if (m) data.calories = m[1];
          } else if (c.toLowerCase().includes("protein")) {
            const m = c.match(/(\d+)/); if (m) data.protein = m[1];
          } else if (c.toLowerCase().includes("carb")) {
            const m = c.match(/(\d+)/); if (m) data.carbs = m[1];
          } else if (c.toLowerCase().includes("fat")) {
            const m = c.match(/(\d+)/); if (m) data.fats = m[1];
          }
        } else if (section === "meals" && meal) {
          if (!c.includes("kcal") && !c.includes("protein"))
            data.meals[meal].name = c;
          else if (c.includes("kcal")) {
            const m = c.match(/(\d+)\s*kcal/); if (m) data.meals[meal].calories = m[1];
          } else if (c.toLowerCase().includes("protein")) {
            const m = c.match(/(\d+)\s*g/); if (m) data.meals[meal].protein = m[1];
          }
        } else if (section === "water") {
          const m = c.match(/(\d+\.?\d*)/); if (m) data.waterIntake = m[1];
        } else if (section === "avoid")    data.avoidFoods.push(c);
        else if (section === "exercise") data.exercises.push(c);
        else if (section === "tips")     data.tips.push(c);
      }
    });
    setParsedData(data);
  }

  async function checkServerStatus() {
    try {
      const r = await fetch(`${API_URL}/api/health`);
      setServerStatus(r.ok ? "online" : "offline");
    } catch { setServerStatus("offline"); }
  }

  useEffect(() => { checkServerStatus(); }, []);

  const isError = dietPlan.startsWith("Error:");

  // Macro totals for bar widths
  const totalMacros = parseInt(parsedData.protein) + parseInt(parsedData.carbs) + parseInt(parsedData.fats);
  const proteinPct  = totalMacros ? Math.round((parseInt(parsedData.protein) / totalMacros) * 100) : 33;
  const carbsPct    = totalMacros ? Math.round((parseInt(parsedData.carbs)   / totalMacros) * 100) : 34;
  const fatsPct     = totalMacros ? Math.round((parseInt(parsedData.fats)    / totalMacros) * 100) : 33;

  const mealConfig = [
    { key: "breakfast", label: "Breakfast", icon: "wb_sunny",   colorClass: "cyan" },
    { key: "lunch",     label: "Lunch",     icon: "light_mode", colorClass: "cyan" },
    { key: "dinner",    label: "Dinner",    icon: "nights_stay", colorClass: "cyan" },
    { key: "snacks",    label: "Snacks",    icon: "eco",         colorClass: "cyan" },
  ];

  return (
    <div className="app-shell">
      {/* ── Background ── */}
      <div className="bg-effects">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      {/* ── Navigation ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">🥗</div>
          <span className="nav-logo-text">Nutri<span>AI</span></span>
        </div>
        <div className="nav-right">
          <div className={`server-badge ${serverStatus}`}>
            <div className={`status-dot ${serverStatus}`} />
            <span>
              {serverStatus === "online" ? "Server Online" :
               serverStatus === "offline" ? "Server Offline" : "Connecting..."}
            </span>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="main-content">

        {/* ── Hero ── */}
        <div className="hero-section">
          <div className="hero-tag">
            <div className="hero-tag-dot" />
            AI-Powered Nutrition
          </div>
          <h1 className="hero-title">
            Design Your <span className="gradient-text">Perfect Diet</span>
          </h1>
          <p className="hero-sub">
            Advanced AI analyzes your biometrics and crafts a personalized nutrition plan in seconds.
          </p>
        </div>

        {/* ── Input Form ── */}
        <div className="glass-card form-card">
          <div className="form-card-header">
            <div className="form-icon-box">
              <span className="material-symbols-outlined">monitor_heart</span>
            </div>
            <div>
              <h2>Your Health Profile</h2>
              <p>Fill in your details for a personalized analysis</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Age (years)</label>
              <input
                name="age" type="number" value={formData.age} onChange={handleChange}
                className="form-input" placeholder="e.g. 28" min="10" max="100"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Height (cm)</label>
              <input
                name="height" type="number" value={formData.height} onChange={handleChange}
                className="form-input" placeholder="e.g. 175"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Weight (kg)</label>
              <input
                name="weight" type="number" value={formData.weight} onChange={handleChange}
                className="form-input" placeholder="e.g. 70"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="form-select">
                <option>Gentle (Sedentary)</option>
                <option>Active (Moderate)</option>
                <option>Very Active (Athlete)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Primary Goal</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="form-select">
                <option>Lose Weight</option>
                <option>Gain Muscle</option>
                <option>Maintain Weight</option>
                <option>Improve Health</option>
              </select>
            </div>
          </div>

          <button className="generate-btn" onClick={generateDietPlan} disabled={loading}>
            {loading ? (
              <>
                <span className="material-symbols-outlined spin">progress_activity</span>
                Analyzing your profile...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">rocket_launch</span>
                Generate My Nutrition Plan
              </>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        {showResults && (
          <section className="results-section" id="results">

            {/* Header */}
            <div className="results-header">
              <h2 className="results-title">
                {isError ? "Generation Failed" : "Your Personalized Plan"}
              </h2>
              {!isError && (
                <div className="results-actions">
                  <button className="btn-outline" onClick={downloadPDF} disabled={downloadingPDF}>
                    <span className="material-symbols-outlined">
                      {downloadingPDF ? "progress_activity" : "download"}
                    </span>
                    {downloadingPDF ? "Generating..." : "Download PDF"}
                  </button>
                  <button className="btn-outline" onClick={savePlan}>
                    <span className="material-symbols-outlined">bookmark</span>
                    Save Plan
                  </button>
                </div>
              )}
            </div>

            {/* Error State */}
            {isError ? (
              <div className="glass-card error-card">
                <div className="material-symbols-outlined error-icon">error_outline</div>
                <p className="error-title">Something went wrong</p>
                <p className="error-msg">{dietPlan}</p>
                <button className="retry-btn" onClick={generateDietPlan}>
                  <span className="material-symbols-outlined">refresh</span>
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Stats Row */}
                <div className="stats-row">
                  <div className="glass-card stat-card">
                    <div className="stat-label">Body Mass Index</div>
                    <div className="stat-value cyan">{parsedData.bmi}</div>
                    <span className="stat-badge cyan">{parsedData.bmiStatus}</span>
                  </div>
                  <div className="glass-card stat-card">
                    <div className="stat-label">Daily Calories</div>
                    <div className="stat-value indigo">{parsedData.calories}</div>
                    <span className="stat-badge indigo">kcal / day</span>
                  </div>
                  <div className="glass-card stat-card">
                    <div className="stat-label">Water Intake</div>
                    <div className="stat-value green">{parsedData.waterIntake}</div>
                    <span className="stat-badge green">Litres / day</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="glass-card macros-card">
                  <div className="macros-title">Macronutrient Breakdown</div>
                  <div className="macros-list">
                    <div className="macro-row">
                      <div className="macro-name">Protein</div>
                      <div className="macro-bar-track">
                        <div className="macro-bar-fill cyan" style={{ width: `${proteinPct}%` }} />
                      </div>
                      <div className="macro-val">{parsedData.protein}g</div>
                    </div>
                    <div className="macro-row">
                      <div className="macro-name">Carbs</div>
                      <div className="macro-bar-track">
                        <div className="macro-bar-fill indigo" style={{ width: `${carbsPct}%` }} />
                      </div>
                      <div className="macro-val">{parsedData.carbs}g</div>
                    </div>
                    <div className="macro-row">
                      <div className="macro-name">Fats</div>
                      <div className="macro-bar-track">
                        <div className="macro-bar-fill green" style={{ width: `${fatsPct}%` }} />
                      </div>
                      <div className="macro-val">{parsedData.fats}g</div>
                    </div>
                  </div>
                </div>

                {/* Meal Timeline */}
                <div className="glass-card meals-card">
                  <div className="meals-title">Daily Meal Schedule</div>
                  <div className="meal-timeline">
                    {mealConfig.map((m, i) => (
                      <div className="meal-row" key={m.key}>
                        <div className="meal-icon-wrap">
                          <span className="material-symbols-outlined">{m.icon}</span>
                        </div>
                        <div className="meal-body">
                          <div className="meal-row-top">
                            <span className="meal-name-row">{m.label}</span>
                            <span className="meal-time">{parsedData.meals[m.key].time}</span>
                          </div>
                          <div className="meal-desc">{parsedData.meals[m.key].name}</div>
                          <div className="meal-stats">
                            <span className="meal-stat-pill">
                              {parsedData.meals[m.key].calories} kcal
                            </span>
                            <span className="meal-stat-pill">
                              {parsedData.meals[m.key].protein}g protein
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Foods to Avoid + Tips */}
                <div className="two-col">
                  {parsedData.avoidFoods.length > 0 && (
                    <div className="glass-card info-card">
                      <div className="info-card-title danger">
                        <span className="material-symbols-outlined">block</span>
                        Foods to Avoid
                      </div>
                      <div className="tags-wrap">
                        {parsedData.avoidFoods.map((f, i) => (
                          <span className="food-tag" key={i}>{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedData.tips.length > 0 && (
                    <div className="glass-card info-card">
                      <div className="info-card-title green">
                        <span className="material-symbols-outlined">tips_and_updates</span>
                        Wellness Tips
                      </div>
                      <div className="info-list">
                        {parsedData.tips.map((tip, i) => (
                          <div className="info-list-item" key={i}>
                            <div className="info-list-bullet green" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Exercise Plan */}
                {parsedData.exercises.length > 0 && (
                  <div className="glass-card exercise-card">
                    <div className="info-card-title indigo" style={{ marginBottom: 16 }}>
                      <span className="material-symbols-outlined">fitness_center</span>
                      Exercise Plan
                    </div>
                    <div className="info-list">
                      {parsedData.exercises.map((ex, i) => (
                        <div className="info-list-item" key={i}>
                          <div className="info-list-bullet indigo" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full AI Plan Text */}
                <div className="glass-card plan-text-card">
                  <div className="plan-text-header">
                    <div className="plan-text-header-left">
                      <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 18 }}>
                        smart_toy
                      </span>
                      <div>
                        <div className="plan-text-title">Full AI-Generated Plan</div>
                        <div className="plan-text-sub">Raw output from the AI model</div>
                      </div>
                    </div>
                    <span className="plan-text-tag">AI Output</span>
                  </div>
                  <div className="plan-text-body">{dietPlan}</div>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
