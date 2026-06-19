import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://ai-diet-planner-uko9.onrender.com";

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
      const res = await fetch(`${API_URL}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
              {activeNav === "plan" ? "NUTRIAI // SYSTEM PLANNER" : "NUTRIAI // PERSONALIZED DASHBOARD"}
            </div>
            <div className="topbar-sub">
              {activeNav === "plan" ? "Configure biometrics to deploy customized nutrition model" : `Biometric Profile: ${formData.age}yo // ${formData.gender} // ${formData.weight}kg`}
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
            <div className="input-view">
              <div className="page-hero">
                <div className="page-hero-tag">
                  <div className="tag-dot" />
                  Quantum Nutrition AI v4.8
                </div>
                <h1>Deploy Your <span className="grad">Diet Core</span></h1>
                <p>Provide biological parameters. The neural engine will optimize macro ratios and schedule caloric ingestion blocks.</p>
              </div>

              <div className="card form-card">
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
                    <label htmlFor="input-age">Age (years)</label>
                    <input id="input-age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g. 28" min="10" max="100" />
                  </div>
                  <div className="field">
                    <label htmlFor="input-gender">Gender</label>
                    <select id="input-gender" name="gender" value={formData.gender} onChange={handleChange}>
                      <option>Male</option><option>Female</option><option>Non-binary</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="input-height">Height (cm)</label>
                    <input id="input-height" name="height" type="number" value={formData.height} onChange={handleChange} placeholder="e.g. 175" />
                  </div>
                  <div className="field">
                    <label htmlFor="input-weight">Weight (kg)</label>
                    <input id="input-weight" name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="e.g. 70" />
                  </div>
                  <div className="field">
                    <label htmlFor="input-activity">Activity Level</label>
                    <select id="input-activity" name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                      <option>Gentle (Sedentary)</option>
                      <option>Active (Moderate)</option>
                      <option>Very Active (Athlete)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="input-goal">Target Goal</label>
                    <select id="input-goal" name="goal" value={formData.goal} onChange={handleChange}>
                      <option>Lose Weight</option>
                      <option>Gain Muscle</option>
                      <option>Maintain Weight</option>
                      <option>Improve Health</option>
                    </select>
                  </div>
                </div>

                <button id="btn-generate-plan" className="btn-primary btn-primary-futuristic" onClick={generateDietPlan} disabled={loading}>
                  {loading ? (
                    <><span className="material-symbols-outlined spin">sync</span> Computing Optimal Layout...</>
                  ) : (
                    <><span className="material-symbols-outlined">insights</span> Generate My Nutrition Plan</>
                  )}
                </button>
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

        </div>
      </div>
    </div>
  );
}

export default App;
