import { useState, useEffect, useRef } from "react";

const DEVICE_PROFILES = [
  {
    id: "budget-android-2gb",
    tier: "BUDGET",
    name: "Budget Android",
    specs: { ram: "2GB", cpu: "Snapdragon 439", gpu: "Adreno 505", os: "Android 10" },
    color: "#ff4444",
    icon: "📱",
    marketShare: "31%",
  },
  {
    id: "mid-android-4gb",
    tier: "MID",
    name: "Mid-Range Android",
    specs: { ram: "4GB", cpu: "Snapdragon 680", gpu: "Adreno 610", os: "Android 12" },
    color: "#ff9500",
    icon: "📱",
    marketShare: "28%",
  },
  {
    id: "mid-android-6gb",
    tier: "MID+",
    name: "Mid+ Android",
    specs: { ram: "6GB", cpu: "Dimensity 900", gpu: "Mali-G68", os: "Android 13" },
    color: "#ffcc00",
    icon: "📱",
    marketShare: "18%",
  },
  {
    id: "flagship-android",
    tier: "FLAG",
    name: "Flagship Android",
    specs: { ram: "12GB", cpu: "Snapdragon 8 Gen 2", gpu: "Adreno 740", os: "Android 14" },
    color: "#00d4aa",
    icon: "📱",
    marketShare: "12%",
  },
  {
    id: "budget-pc",
    tier: "PC-LOW",
    name: "Budget PC",
    specs: { ram: "8GB", cpu: "Intel i3-10100", gpu: "Intel UHD 630", os: "Windows 11" },
    color: "#4488ff",
    icon: "💻",
    marketShare: "7%",
  },
  {
    id: "mid-pc",
    tier: "PC-MID",
    name: "Mid-Range PC",
    specs: { ram: "16GB", cpu: "Ryzen 5 5600", gpu: "RTX 3060", os: "Windows 11" },
    color: "#aa44ff",
    icon: "💻",
    marketShare: "4%",
  },
];

const STEPS = ["upload", "configure", "testing", "results"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function LogLine({ text, delay, type = "info" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const colors = { info: "#5a8a7a", success: "#00f5a0", warn: "#ff9500", error: "#ff4444" };
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s",
      color: colors[type],
      fontFamily: "'Space Mono', monospace",
      fontSize: "11px",
      lineHeight: "1.8",
      paddingLeft: "8px",
      borderLeft: `2px solid ${colors[type]}22`,
    }}>
      <span style={{ color: "#2a4a3a", marginRight: "8px" }}>
        {new Date().toLocaleTimeString("en-US", { hour12: false })}
      </span>
      {text}
    </div>
  );
}

function DeviceCard({ device, selected, onToggle }) {
  const tierColors = {
    BUDGET: "#ff4444", MID: "#ff9500", "MID+": "#ffcc00",
    FLAG: "#00d4aa", "PC-LOW": "#4488ff", "PC-MID": "#aa44ff"
  };
  return (
    <div
      onClick={() => onToggle(device.id)}
      style={{
        border: `1px solid ${selected ? device.color : "#1a2a1a"}`,
        borderRadius: "8px",
        padding: "14px",
        cursor: "pointer",
        background: selected ? `${device.color}08` : "#060d0a",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 8, height: 8, borderRadius: "50%",
          background: device.color, boxShadow: `0 0 8px ${device.color}`,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "16px" }}>{device.icon}</span>
        <span style={{
          fontSize: "9px", fontFamily: "'Space Mono', monospace",
          background: `${device.color}22`, color: device.color,
          padding: "2px 6px", borderRadius: "3px", letterSpacing: "1px"
        }}>{device.tier}</span>
      </div>
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "6px", color: "#d0e8d8" }}>
        {device.name}
      </div>
      {Object.entries(device.specs).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "2px" }}>
          <span style={{ color: "#2a5a3a", fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>{k}</span>
          <span style={{ color: "#6a9a7a", fontFamily: "'Space Mono', monospace" }}>{v}</span>
        </div>
      ))}
      <div style={{
        marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #0d2a1a",
        fontSize: "10px", color: "#2a6a4a", fontFamily: "'Space Mono', monospace"
      }}>
        MARKET SHARE: <span style={{ color: device.color }}>{device.marketShare}</span>
      </div>
    </div>
  );
}

function ResultBar({ label, value, max = 100, color, unit = "" }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 300);
    return () => clearTimeout(t);
  }, [value]);
  const pct = (animated / max) * 100;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "#4a7a5a", fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: "11px", color, fontFamily: "'Space Mono', monospace", fontWeight: "700" }}>{value}{unit}</span>
      </div>
      <div style={{ background: "#0a1a0f", borderRadius: "2px", height: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "2px",
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function ResultCard({ device, result, index }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), index * 200 + 300);
    return () => clearTimeout(t);
  }, [index]);

  const gradeColor = result.grade === "A" ? "#00f5a0" : result.grade === "B" ? "#88ff44" :
    result.grade === "C" ? "#ffcc00" : result.grade === "D" ? "#ff9500" : "#ff4444";

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.5s",
      border: `1px solid ${gradeColor}33`,
      borderRadius: "10px",
      padding: "18px",
      background: `${gradeColor}04`,
      marginBottom: "12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#d0e8d8", marginBottom: "3px" }}>
            {device.icon} {device.name}
          </div>
          <div style={{ fontSize: "10px", color: "#2a5a3a", fontFamily: "'Space Mono', monospace" }}>
            {device.specs.cpu} · {device.specs.ram} RAM
          </div>
        </div>
        <div style={{
          width: "40px", height: "40px", borderRadius: "8px",
          background: `${gradeColor}15`, border: `1px solid ${gradeColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: "900", color: gradeColor,
          fontFamily: "'Space Mono', monospace",
        }}>{result.grade}</div>
      </div>
      <ResultBar label="FPS Average" value={result.fps} max={120} color={gradeColor} unit=" fps" />
      <ResultBar label="Load Time" value={result.loadTime} max={15} color={gradeColor} unit="s" />
      <ResultBar label="Memory Usage" value={result.memUsage} max={100} color="#4488ff" unit="%" />
      <ResultBar label="Crash Rate" value={result.crashRate} max={20} color={result.crashRate > 5 ? "#ff4444" : "#00f5a0"} unit="%" />
      {result.warnings.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {result.warnings.map((w, i) => (
            <div key={i} style={{
              fontSize: "10px", color: "#ff9500", fontFamily: "'Space Mono', monospace",
              padding: "4px 8px", background: "#ff950008", borderRadius: "4px", marginBottom: "3px",
              borderLeft: "2px solid #ff950044",
            }}>⚠ {w}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateResult(device) {
  const tierMap = { BUDGET: 0, MID: 1, "MID+": 2, FLAG: 3, "PC-LOW": 2, "PC-MID": 4 };
  const tier = tierMap[device.tier];
  const base = tier * 20;
  const fps = Math.min(60 + base + Math.random() * 15 - 8, 120) | 0;
  const loadTime = Math.max(12 - tier * 2 - Math.random() * 1.5, 1.2).toFixed(1) * 1;
  const memUsage = Math.min(95 - tier * 10 + Math.random() * 10, 98) | 0;
  const crashRate = Math.max(15 - tier * 3 - Math.random() * 2, 0).toFixed(1) * 1;
  const warnings = [];
  if (fps < 30) warnings.push("FPS below playable threshold on this device");
  if (memUsage > 85) warnings.push("Memory pressure detected — may cause OOM kills");
  if (loadTime > 8) warnings.push("Load time exceeds 8s — user retention risk");
  if (crashRate > 5) warnings.push("Crash rate above 5% — not recommended for release");
  const score = (fps / 60) * 40 + (1 - crashRate / 20) * 30 + (1 - memUsage / 100) * 20 + (1 - loadTime / 15) * 10;
  const grade = score > 80 ? "A" : score > 65 ? "B" : score > 50 ? "C" : score > 35 ? "D" : "F";
  return { fps, loadTime, memUsage, crashRate, warnings, grade, score: score.toFixed(0) };
}

export default function ConfigEngine() {
  const [step, setStep] = useState("upload");
  const [gameName, setGameName] = useState("");
  const [gameFile, setGameFile] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [testLogs, setTestLogs] = useState([]);
  const [results, setResults] = useState([]);
  const [testProgress, setTestProgress] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [currentDevice, setCurrentDevice] = useState("");
  const fileRef = useRef();

  const toggleDevice = (id) => {
    setSelectedDevices(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setGameFile(f);
      setGameName(f.name.replace(/\.[^.]+$/, ""));
    }
  };

  const runTests = async () => {
    setStep("testing");
    setTestLogs([]);
    setTestProgress(0);

    const selected = DEVICE_PROFILES.filter(d => selectedDevices.includes(d.id));
    const newResults = [];
    const logs = [];
    let logId = 0;

    const addLog = (text, type = "info", extraDelay = 0) => {
      logs.push({ id: logId++, text, type, delay: extraDelay });
      setTestLogs([...logs]);
    };

    addLog(`CONFIG-ENGINE v1.0.0 initializing...`, "info", 0);
    addLog(`Build received: ${gameName || "game_build_001"}`, "success", 400);
    addLog(`Queuing ${selected.length} device profile(s) for parallel execution`, "info", 800);
    await sleep(1200);

    for (let i = 0; i < selected.length; i++) {
      const device = selected[i];
      setCurrentDevice(device.name);
      const baseDelay = i * 3200;

      addLog(`─────────────────────────────`, "info", baseDelay + 100);
      addLog(`Booting instance: ${device.name} [${device.specs.ram} / ${device.specs.cpu}]`, "info", baseDelay + 200);
      addLog(`Mounting virtual GPU: ${device.specs.gpu}`, "info", baseDelay + 600);
      addLog(`Applying RAM ceiling: ${device.specs.ram}`, "info", baseDelay + 900);
      addLog(`Installing game build...`, "info", baseDelay + 1200);
      addLog(`Running benchmark suite — 120 second session`, "info", baseDelay + 1700);

      await sleep(baseDelay + 2400);

      const result = generateResult(device);
      newResults.push({ device, result });
      setResults([...newResults]);

      const logType = result.grade === "F" ? "error" : result.grade === "D" ? "warn" : "success";
      addLog(`✓ Test complete — Grade: ${result.grade} | ${result.fps} FPS avg | ${result.crashRate}% crash rate`, logType, baseDelay + 2600);

      const progress = ((i + 1) / selected.length) * 100;
      setTestProgress(progress);
    }

    setCurrentDevice("");
    addLog(`─────────────────────────────`, "info", selected.length * 3200 + 200);
    addLog(`All tests complete. Generating AI analysis report...`, "success", selected.length * 3200 + 400);

    await sleep(selected.length * 3200 + 800);
    setStep("results");
    fetchAIAnalysis(newResults);
  };

  const fetchAIAnalysis = async (testResults) => {
    setLoadingAI(true);
    const summary = testResults.map(({ device, result }) =>
      `${device.name} (${device.specs.ram} RAM, ${device.specs.cpu}): Grade ${result.grade}, ${result.fps} FPS avg, ${result.crashRate}% crash rate, ${result.memUsage}% memory usage, ${result.loadTime}s load time`
    ).join("\n");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Config-Engine's AI analysis module. You analyze game performance test results across device profiles and give actionable developer recommendations. Be direct, technical, and concise. Format your response with clear sections: OVERALL VERDICT, KEY ISSUES, and TOP 3 OPTIMIZATIONS. Use plain text, no markdown symbols. Keep the total response under 280 words.`,
          messages: [{
            role: "user",
            content: `Game build test results:\n${summary}\n\nProvide a technical analysis with actionable optimization recommendations.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Analysis unavailable.";
      setAiAnalysis(text);
    } catch (e) {
      setAiAnalysis("AI analysis module offline. Review raw metrics above for manual assessment.");
    }
    setLoadingAI(false);
  };

  const reset = () => {
    setStep("upload");
    setGameName("");
    setGameFile(null);
    setSelectedDevices([]);
    setTestLogs([]);
    setResults([]);
    setTestProgress(0);
    setAiAnalysis("");
    setCurrentDevice("");
  };

  const passCount = results.filter(r => ["A", "B", "C"].includes(r.result.grade)).length;
  const coverageReach = results.reduce((acc, { device }) => {
    const d = DEVICE_PROFILES.find(d => d.id === device.id);
    return acc + parseFloat(d?.marketShare || 0);
  }, 0).toFixed(0);

  // ─── RENDER ───────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: "#040a06",
      color: "#c0dcc8",
      fontFamily: "'Syne', sans-serif",
      position: "relative",
    }}>
      {/* Scanline effect */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,255,100,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,100,0.015) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ padding: "32px 0 24px", borderBottom: "1px solid #0d2a15", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "28px", height: "28px", background: "#00f5a0",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px",
                  background: "linear-gradient(90deg, #00f5a0, #44ffbb)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>config-engine</span>
                <span style={{
                  fontSize: "9px", fontFamily: "'Space Mono', monospace",
                  background: "#00f5a011", border: "1px solid #00f5a033",
                  color: "#00f5a077", padding: "2px 6px", borderRadius: "3px", letterSpacing: "1px"
                }}>MVP v0.1</span>
              </div>
              <div style={{ fontSize: "11px", color: "#2a5a3a", fontFamily: "'Space Mono', monospace", marginTop: "4px", paddingLeft: "38px" }}>
                GAME COMPATIBILITY TESTING PLATFORM
              </div>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: STEPS.indexOf(step) >= i ? "#00f5a0" : "#0d2a15",
                    boxShadow: STEPS.indexOf(step) === i ? "0 0 8px #00f5a0" : "none",
                    transition: "all 0.3s",
                  }} />
                  {i < STEPS.length - 1 && (
                    <div style={{ width: "16px", height: "1px", background: STEPS.indexOf(step) > i ? "#00f5a044" : "#0d2a15" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 1: UPLOAD ── */}
        {step === "upload" && (
          <div>
            <div style={{ marginBottom: "8px", fontSize: "11px", color: "#2a5a3a", fontFamily: "'Space Mono', monospace", letterSpacing: "2px" }}>
              STEP 01 / GAME UPLOAD
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-1px", lineHeight: 1.2 }}>
              Upload your<br /><span style={{ color: "#00f5a0" }}>game build</span>
            </h1>
            <p style={{ color: "#2a6a3a", fontSize: "13px", marginBottom: "32px", maxWidth: "480px" }}>
              Drop your APK, EXE, or ZIP. Config-Engine will run it against real device profiles in the cloud.
            </p>

            {/* Upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${gameFile ? "#00f5a066" : "#1a3a22"}`,
                borderRadius: "12px",
                padding: "48px 32px",
                textAlign: "center",
                cursor: "pointer",
                background: gameFile ? "#00f5a005" : "#060d08",
                transition: "all 0.2s",
                marginBottom: "24px",
              }}
            >
              <input ref={fileRef} type="file" style={{ display: "none" }} accept=".apk,.exe,.zip,.ipa" onChange={handleFileChange} />
              {gameFile ? (
                <>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#00f5a0", marginBottom: "4px" }}>{gameFile.name}</div>
                  <div style={{ fontSize: "11px", color: "#2a5a3a", fontFamily: "'Space Mono', monospace" }}>
                    {(gameFile.size / 1024 / 1024).toFixed(1)} MB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}>⬆</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px", color: "#4a8a5a" }}>
                    Drop game build here
                  </div>
       
