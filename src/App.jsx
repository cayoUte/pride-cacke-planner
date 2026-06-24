import { useState, useEffect, useMemo } from "react";

// ─── localStorage hook ────────────────────────────────────────────────────────
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Could not save "${key}" to localStorage.`);
    }
  }, [key, value]);

  return [value, setValue];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RAINBOW     = ["#FF3B3B","#FF8C00","#FFD700","#3CB84A","#2979FF","#8B2BE2"];
const LAYER_NAMES = ["Red","Orange","Yellow","Green","Blue","Purple"];

const BASE_DOUGH = {
  flour:        { amount: 280,  unit: "g",   label: "All-purpose flour" },
  sugar:        { amount: 300,  unit: "g",   label: "Sugar" },
  butter:       { amount: 200,  unit: "g",   label: "Unsalted butter (softened)" },
  eggs:         { amount: 3,    unit: "pcs", label: "Eggs (large)" },
  milk:         { amount: 240,  unit: "ml",  label: "Whole milk" },
  bakingPowder: { amount: 2,    unit: "tsp", label: "Baking powder" },
  vanilla:      { amount: 1,    unit: "tsp", label: "Vanilla extract" },
  salt:         { amount: 0.5,  unit: "tsp", label: "Salt" },
  foodColor:    { amount: 6,    unit: "pcs", label: "Gel food coloring (one per layer)" },
};

const BASE_CREAM = {
  heavyCream:    { amount: 600, unit: "ml",  label: "Heavy whipping cream (cold)" },
  powderedSugar: { amount: 60,  unit: "g",   label: "Powdered sugar" },
  vanilla:       { amount: 1,   unit: "tsp", label: "Vanilla extract" },
  foodColor:     { amount: 6,   unit: "pcs", label: "Gel food coloring sets" },
};

const DEFAULT_COSTS = {
  flour: 1.2, sugar: 1.5, butter: 3.5, eggs: 2.0,
  milk: 1.2, bakingPowder: 0.5, vanilla: 1.0, salt: 0.1,
  foodColor: 4.0, heavyCream: 3.5, powderedSugar: 0.8,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val, unit) {
  if (unit === "pcs") return `${Math.ceil(val)} ${val === 1 ? "pc" : "pcs"}`;
  if (val < 1 && unit !== "pcs")
    return `${(val * (unit === "ml" || unit === "g" ? 1000 : 1)).toFixed(0)} m${unit}`;
  return `${val % 1 === 0 ? val : val.toFixed(1)} ${unit}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Stepper({ value, onChange, min = 1, max = 50 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #e0e0e0",
          background:"white", fontSize:18, cursor:"pointer", display:"flex",
          alignItems:"center", justifyContent:"center", fontWeight:"bold", color:"#555" }}>−</button>
      <span style={{ fontWeight:700, fontSize:20, minWidth:30, textAlign:"center" }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #e0e0e0",
          background:"white", fontSize:18, cursor:"pointer", display:"flex",
          alignItems:"center", justifyContent:"center", fontWeight:"bold", color:"#555" }}>+</button>
    </div>
  );
}

function IngredientRow({ label, amount, unit, color }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"8px 12px", borderRadius:8, background:"#fafafa", marginBottom:6,
      borderLeft: `4px solid ${color}` }}>
      <span style={{ fontSize:14, color:"#333" }}>{label}</span>
      <span style={{ fontWeight:700, fontSize:14, color:"#111" }}>{fmt(amount, unit)}</span>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function RecipeTab({ cakes, setCakes, cream, setCream }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Cake Dough */}
      <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px #0001" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#aaa", textTransform:"uppercase" }}>Recipe 1</div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>🎂 Rainbow Cake Dough</h2>
            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>Makes 1 cake · 6 colored layers · ~10 slices</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#aaa", marginBottom:4 }}>Cakes</div>
            <Stepper value={cakes} onChange={setCakes} />
          </div>
        </div>
        {Object.entries(BASE_DOUGH).map(([key, { amount, unit, label }], i) => (
          <IngredientRow key={key} label={label} amount={amount * cakes}
            unit={unit} color={RAINBOW[i % RAINBOW.length]} />
        ))}
        <div style={{ marginTop:16, padding:12, borderRadius:10, background:"#FFF8E1", fontSize:13, color:"#666" }}>
          <strong>Steps:</strong> Cream butter + sugar → add eggs + vanilla → alternate flour and milk → divide batter into 6 bowls → tint each layer → bake at 175°C / 350°F for 25–30 min per layer.
        </div>
      </div>

      {/* Whipped Cream */}
      <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px #0001" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#aaa", textTransform:"uppercase" }}>Recipe 2</div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>🌈 Colored Whipped Cream</h2>
            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>6 colors · ~100ml per layer</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#aaa", marginBottom:4 }}>Cakes</div>
            <Stepper value={cream} onChange={setCream} />
          </div>
        </div>
        {Object.entries(BASE_CREAM).map(([key, { amount, unit, label }], i) => (
          <IngredientRow key={key} label={label} amount={amount * cream}
            unit={unit} color={RAINBOW[i % RAINBOW.length]} />
        ))}
        <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
          {LAYER_NAMES.map((name, i) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:6,
              padding:"6px 10px", borderRadius:8, background:RAINBOW[i]+"18",
              border:`1px solid ${RAINBOW[i]}44`, fontSize:12, fontWeight:600, color:"#333" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:RAINBOW[i] }}/>
              {name}
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, padding:12, borderRadius:10, background:"#F3E5F5", fontSize:13, color:"#666" }}>
          <strong>Steps:</strong> Chill bowl + beaters. Whip cold cream to soft peaks → add sugar + vanilla → whip to stiff peaks → divide into 6 portions → tint each with gel food coloring. Keep refrigerated until assembly.
        </div>
      </div>
    </div>
  );
}

function BudgetTab({ cakes, setCakes, costs, setCosts, margin, setMargin }) {
  const setC = (key, val) =>
    setCosts(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

  const ingredientCostPerCake = useMemo(() => {
    const d = costs.flour + costs.sugar + costs.butter + costs.eggs +
      costs.milk + costs.bakingPowder + costs.vanilla + costs.salt + costs.foodColor;
    const c = costs.heavyCream + costs.powderedSugar + costs.vanilla * 0.3 + costs.foodColor * 0.5;
    return d + c;
  }, [costs]);

  const overhead      = ingredientCostPerCake * 0.15;
  const costPerCake   = ingredientCostPerCake + overhead;
  const sellPrice     = costPerCake / (1 - margin / 100);
  const profitPerCake = sellPrice - costPerCake;
  const totalRevenue  = sellPrice * cakes;
  const totalCost     = costPerCake * cakes;
  const totalProfit   = profitPerCake * cakes;

  const costGroups = [
    { label: "Dough ingredients", items: [
      ["flour","Flour"],["sugar","Sugar"],["butter","Butter"],["eggs","Eggs"],
      ["milk","Milk"],["bakingPowder","Baking powder"],["vanilla","Vanilla"],
      ["salt","Salt"],["foodColor","Food coloring (dough)"],
    ]},
    { label: "Whipped cream", items: [
      ["heavyCream","Heavy cream"],["powderedSugar","Powdered sugar"],
    ]},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Quantity */}
      <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px #0001" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h3 style={{ margin:0, fontSize:17, fontWeight:800 }}>Number of cakes</h3>
            <div style={{ fontSize:12, color:"#888" }}>How many do you plan to bake & sell?</div>
          </div>
          <Stepper value={cakes} onChange={setCakes} max={200} />
        </div>
      </div>

      {/* Ingredient costs */}
      <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px #0001" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:800 }}>Cost per cake (ingredients)</h3>
          <button onClick={() => setCosts(DEFAULT_COSTS)}
            style={{ fontSize:11, color:"#aaa", border:"1px solid #eee", borderRadius:6,
              padding:"3px 8px", background:"white", cursor:"pointer" }}>
            Reset
          </button>
        </div>
        {costGroups.map(({ label, items }, gi) => (
          <div key={gi} style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#aaa",
              textTransform:"uppercase", marginBottom:8 }}>{label}</div>
            {items.map(([key, lbl], i) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:10,
                marginBottom:6, borderLeft:`3px solid ${RAINBOW[(gi*5+i)%6]}`, paddingLeft:10 }}>
                <span style={{ flex:1, fontSize:13, color:"#333" }}>{lbl}</span>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12, color:"#888" }}>$</span>
                  <input type="number" min={0} step={0.1} value={costs[key]}
                    onChange={e => setC(key, e.target.value)}
                    style={{ width:60, padding:"4px 6px", borderRadius:6,
                      border:"1.5px solid #e0e0e0", fontSize:13, fontWeight:600,
                      textAlign:"right", outline:"none" }} />
                </div>
              </div>
            ))}
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"10px 12px", borderRadius:10, background:"#f5f5f5", marginTop:4 }}>
          <span style={{ fontSize:13, color:"#555" }}>+15% overhead (packaging, energy, time)</span>
          <span style={{ fontWeight:700, fontSize:13 }}>${overhead.toFixed(2)}</span>
        </div>
      </div>

      {/* Margin tweaker */}
      <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px #0001" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:800 }}>Profit margin</h3>
          <span style={{ fontWeight:800, fontSize:22,
            background:`linear-gradient(90deg, ${RAINBOW.join(",")})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {margin}%
          </span>
        </div>
        <input type="range" min={10} max={90} value={margin}
          onChange={e => setMargin(Number(e.target.value))}
          style={{ width:"100%", accentColor:"#8B2BE2", cursor:"pointer", height:6 }} />
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#bbb", marginTop:4 }}>
          <span>10% (break-even)</span><span>50% (standard)</span><span>90% (premium)</span>
        </div>
      </div>

      {/* Results */}
      <div style={{ borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px #0001" }}>
        <div style={{ height:6, background:`linear-gradient(90deg, ${RAINBOW.join(",")})` }} />
        <div style={{ background:"white", padding:20 }}>
          <h3 style={{ margin:"0 0 16px", fontSize:17, fontWeight:800 }}>📊 Pricing summary</h3>
          {[
            { label:"Cost per cake",        value:`$${costPerCake.toFixed(2)}`,   sub:"ingredients + overhead",          color:"#555"      },
            { label:"Sell price per cake",  value:`$${sellPrice.toFixed(2)}`,     sub:`at ${margin}% margin`,            color:RAINBOW[4], big:true },
            { label:"Profit per cake",      value:`$${profitPerCake.toFixed(2)}`, sub:"net per unit",                    color:RAINBOW[3]  },
            { label:`Total for ${cakes} cakes`, value:`$${totalRevenue.toFixed(2)} revenue`,
              sub:`$${totalCost.toFixed(2)} cost · $${totalProfit.toFixed(2)} profit`, color:RAINBOW[5], big:true },
          ].map(({ label, value, sub, color, big }) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", padding:"12px 0", borderBottom:"1px solid #f0f0f0" }}>
              <div>
                <div style={{ fontSize:13, color:"#555" }}>{label}</div>
                <div style={{ fontSize:11, color:"#bbb" }}>{sub}</div>
              </div>
              <div style={{ fontWeight:800, fontSize: big ? 20 : 16, color }}>{value}</div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:12, borderRadius:10,
            background: profitPerCake > 5 ? "#E8F5E9" : "#FFF3E0",
            fontSize:13, color:"#555", display:"flex", gap:8, alignItems:"center" }}>
            {profitPerCake > 10 ? "🎉" : profitPerCake > 5 ? "✅" : "⚠️"}
            {profitPerCake > 10
              ? `Great margin! Selling all ${cakes} cakes earns you $${totalProfit.toFixed(0)} profit.`
              : profitPerCake > 5
              ? "Solid margin for a stall. Consider bumping to 65%+ for a safety cushion."
              : "Thin margin — try raising the sell price or reducing ingredient costs."}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // All persisted state lives here and flows down as props
  const [tab,    setTab]    = useLocalStorage("pcp_tab",    "recipe");
  const [cakes,  setCakes]  = useLocalStorage("pcp_cakes",  10);
  const [cream,  setCream]  = useLocalStorage("pcp_cream",  10);
  const [costs,  setCosts]  = useLocalStorage("pcp_costs",  DEFAULT_COSTS);
  const [margin, setMargin] = useLocalStorage("pcp_margin", 60);

  return (
    <div style={{ minHeight:"100vh", background:"#F7F7F9", fontFamily:"system-ui, sans-serif" }}>
      <div style={{ height:8, background:`linear-gradient(90deg, ${RAINBOW.join(",")})` }} />
      <div style={{ padding:"20px 16px 0", maxWidth:560, margin:"0 auto" }}>
        <h1 style={{ margin:"0 0 4px", fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>
          🏳️‍🌈 Pride Cake Planner
        </h1>
        <p style={{ margin:"0 0 20px", fontSize:14, color:"#888" }}>
          Adjustable recipes + stall profit calculator
        </p>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["recipe","🎂 Recipes"],["budget","💰 Budget"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex:1, padding:"10px 0", borderRadius:10, border:"none",
                cursor:"pointer", fontWeight:700, fontSize:14, transition:"all .15s",
                background: tab===id ? `linear-gradient(90deg, ${RAINBOW[0]}, ${RAINBOW[5]})` : "#eee",
                color: tab===id ? "white" : "#555",
                boxShadow: tab===id ? "0 3px 10px #0002" : "none" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "recipe"
          ? <RecipeTab cakes={cakes} setCakes={setCakes} cream={cream} setCream={setCream} />
          : <BudgetTab cakes={cakes} setCakes={setCakes}
              costs={costs} setCosts={setCosts}
              margin={margin} setMargin={setMargin} />
        }
        <div style={{ height:40 }} />
      </div>
    </div>
  );
}
