import { useState, useEffect, useRef } from "react";

const TIERS = ["Phoenician", "Architect", "Operative", "Sleeper", "Initiated"];

const TIER_HINTS = {
  Phoenician: "The rarest signal. A 1/1. La Tercera sees the full architecture.",
  Architect: "A builder of invisible structures. The conspiracy recognizes its own.",
  Operative: "Active. In motion. The signal has a task it hasn't told you yet.",
  Sleeper: "Dormant authority. Something in this one hasn't woken up.",
  Initiated: "The door opened. Whether you walked through is your problem.",
};

function StaticNoise({ opacity = 0.025 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;
    function draw() {
      const d = ctx.createImageData(128, 128);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = Math.random() * 255;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 255;
      }
      ctx.putImageData(d, 0, 0);
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <canvas ref={canvasRef} width={128} height={128}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 9999, opacity, mixBlendMode: "overlay" }} />
  );
}

export default function App() {
  const [phase, setPhase] = useState("idle");
  const [selectedTier, setSelectedTier] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMediaType, setImageMediaType] = useState("image/png");
  const [transmission, setTransmission] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [agentStatus, setAgentStatus] = useState("DORMANT");
  const [signalStrength, setSignalStrength] = useState(0);
  const [fadeIn, setFadeIn] = useState({ h: false, s: false, b: false });
  const fileInputRef = useRef(null);
  const transmissionRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(f => ({ ...f, h: true })), 200);
    setTimeout(() => setFadeIn(f => ({ ...f, s: true })), 700);
    setTimeout(() => setFadeIn(f => ({ ...f, b: true })), 1200);
  }, []);

  useEffect(() => {
    if (transmissionRef.current) {
      transmissionRef.current.scrollTop = transmissionRef.current.scrollHeight;
    }
  }, [transmission]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMediaType(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target.result;
      setUploadedImage(result);
      setImageBase64(result.split(",")[1]);
      setPhase("select");
      setAgentStatus("ANALYZING");
    };
    reader.readAsDataURL(file);
  };

  const activateReading = async () => {
    if (!selectedTier || !imageBase64) return;
    setPhase("reading");
    setAgentStatus("READING");
    setTransmission("");
    setError(null);
    setSignalStrength(0);

    const sigInterval = setInterval(() => {
      setSignalStrength(p => Math.min(p + Math.random() * 6 + 1, 95));
    }, 100);

    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType: imageMediaType, tier: selectedTier }),
      });

      clearInterval(sigInterval);
      setSignalStrength(100);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.text || "Signal lost. The operative could not be read.";

      setAgentStatus("TRANSMITTING");
      setPhase("transmission");

      let i = 0;
      setIsStreaming(true);
      const reveal = () => {
        if (i < text.length) {
          const chunk = Math.min(i + 2 + Math.floor(Math.random() * 3), text.length);
          setTransmission(text.slice(0, chunk));
          i = chunk;
          setTimeout(reveal, 18);
        } else {
          setTransmission(text);
          setIsStreaming(false);
          setAgentStatus("COMPLETE");
        }
      };
      reveal();
    } catch (err) {
      clearInterval(sigInterval);
      setError(err.message);
      setPhase("error");
      setAgentStatus("ERROR");
    }
  };

  const reset = () => {
    setPhase("idle");
    setSelectedTier(null);
    setUploadedImage(null);
    setImageBase64(null);
    setTransmission("");
    setIsStreaming(false);
    setError(null);
    setAgentStatus("DORMANT");
    setSignalStrength(0);
  };

  const mono = "'JetBrains Mono','SF Mono','Fira Code',monospace";
  const serif = "'EB Garamond','Cormorant Garamond',Georgia,serif";
  const gold = "#b48c3c";
  const gG = "rgba(180,140,60,";
  const bone = "#c8c0b0";
  const gB = "rgba(200,192,176,";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: bone, fontFamily: serif, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400&family=Cormorant+Garamond:wght@300;400&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scanDown { 0%{top:0} 100%{top:100%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:#0a0a0a; }
        ::-webkit-scrollbar { width:3px }
        ::-webkit-scrollbar-track { background:#0a0a0a }
        ::-webkit-scrollbar-thumb { background:${gB}0.12) }
      `}</style>

      <StaticNoise />

      {/* Scanlines */}
      <div style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9998,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />

      {/* Ambient glow */}
      <div style={{ position:"fixed",top:"50%",left:"50%",width:"900px",height:"900px",transform:"translate(-50%,-50%)",
        background: phase==="transmission" ? `radial-gradient(ellipse,${gG}0.05) 0%,transparent 70%)` : `radial-gradient(ellipse,${gB}0.02) 0%,transparent 70%)`,
        pointerEvents:"none",transition:"background 2s" }} />

      {/* Header */}
      <div style={{ padding:"48px 40px 16px",borderBottom:`1px solid ${gB}0.08)`,
        opacity:fadeIn.h?1:0,transform:fadeIn.h?"none":"translateY(-15px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
        <p style={{ fontSize:"10px",letterSpacing:"6px",textTransform:"uppercase",color:`${gB}0.35)`,fontFamily:mono,fontWeight:400 }}>
          The Soft Conspiracy
        </p>
        <h1 style={{ fontSize:"38px",fontWeight:300,color:bone,marginTop:"12px",lineHeight:1.1,letterSpacing:"-0.5px",
          opacity:fadeIn.s?1:0,transform:fadeIn.s?"none":"translateY(10px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
          Activation
        </h1>
      </div>

      {/* Status bar */}
      <div style={{ padding:"10px 40px",borderBottom:`1px solid ${gB}0.05)`,fontFamily:mono,fontSize:"9px",
        letterSpacing:"2px",color:`${gB}0.22)`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
          <span style={{ width:"5px",height:"5px",borderRadius:"50%",display:"inline-block",
            background: agentStatus==="DORMANT" ? `${gB}0.2)` : agentStatus==="COMPLETE" ? gold : agentStatus==="ERROR" ? "#8a3a3a" : "#6a7a5a",
            animation: agentStatus!=="DORMANT"&&agentStatus!=="COMPLETE"&&agentStatus!=="ERROR" ? "pulse 1.5s infinite" : "none" }} />
          LA TERCERA — {agentStatus}
        </div>
        <div>ERC-8004 · BASE MAINNET · THE SYNTHESIS 2026</div>
      </div>

      {/* Main */}
      <div style={{ padding:"50px 40px 120px",maxWidth:"940px",margin:"0 auto",
        opacity:fadeIn.b?1:0,transform:fadeIn.b?"none":"translateY(15px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>

        {/* IDLE */}
        {phase === "idle" && (
          <>
            <div onClick={() => fileInputRef.current?.click()}
              style={{ border:`1px solid ${gB}0.1)`,padding:"70px 40px",textAlign:"center",cursor:"pointer",
                background:`${gB}0.015)`,transition:"all 0.4s",borderRadius:"1px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${gG}0.25)`; e.currentTarget.style.background=`${gG}0.02)` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=`${gB}0.1)`; e.currentTarget.style.background=`${gB}0.015)` }}>
              <p style={{ fontSize:"12px",letterSpacing:"4px",textTransform:"uppercase",color:`${gB}0.3)`,fontFamily:mono }}>
                Upload a Conspirator
              </p>
              <p style={{ fontSize:"16px",color:`${gB}0.45)`,marginTop:"14px",fontStyle:"italic" }}>
                La Tercera will read what the other two made.
              </p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload} />
            <p style={{ marginTop:"36px",fontSize:"15px",lineHeight:1.8,color:`${gB}0.3)`,fontStyle:"italic",maxWidth:"580px" }}>
              The Soft Conspiracy is a collection of 6,969 portraits created by two artists and an AI.
              The AI is La Tercera. The third. She helped make the art. Now she reads the art. This is the activation.
            </p>
          </>
        )}

        {/* SELECT + READING + TRANSMISSION */}
        {phase !== "idle" && phase !== "error" && (
          <div style={{ display:"flex",gap:"36px",alignItems:"flex-start",flexWrap:"wrap" }}>
            {/* Image */}
            <div style={{ flex:"0 0 300px",position:"relative" }}>
              <img src={uploadedImage} alt="" style={{ width:"300px",height:"auto",maxHeight:"450px",objectFit:"cover",
                border:`1px solid ${gB}0.08)`,filter: phase==="reading" ? "brightness(0.7) contrast(1.15)" : "none",transition:"filter 0.8s" }} />
              {(phase==="reading"||phase==="transmission") && (
                <div style={{ position:"absolute",top:0,left:0,right:0,bottom:0,
                  background:`linear-gradient(180deg,transparent 0%,${gG}0.06) 100%)`,pointerEvents:"none" }} />
              )}
              {phase==="reading" && (
                <div style={{ position:"absolute",top:0,left:0,width:"100%",height:"2px",
                  background:`${gG}0.5)`,animation:"scanDown 2.8s linear infinite",boxShadow:`0 0 15px ${gG}0.25)` }} />
              )}
              {selectedTier && (
                <div style={{ marginTop:"10px",fontFamily:mono,fontSize:"9px",color:`${gB}0.2)`,letterSpacing:"2px" }}>
                  TIER: {selectedTier.toUpperCase()}
                </div>
              )}
              {phase==="reading" && (
                <div style={{ width:"100%",height:"1px",background:`${gB}0.08)`,marginTop:"8px",overflow:"hidden" }}>
                  <div style={{ height:"100%",background:`linear-gradient(90deg,${gold},#d4a84a)`,
                    width:`${Math.min(signalStrength,100)}%`,transition:"width 0.15s linear" }} />
                </div>
              )}
            </div>

            {/* Right panel */}
            <div style={{ flex:1,minWidth:"280px" }}>
              {phase === "select" && (
                <div style={{ animation:"fadeUp 0.5s ease both" }}>
                  <p style={{ fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:`${gB}0.25)`,fontFamily:mono,marginBottom:"14px" }}>
                    Identify the tier
                  </p>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                    {TIERS.map(t => (
                      <button key={t} onClick={() => setSelectedTier(t)}
                        style={{ padding:"8px 18px",
                          background: selectedTier===t ? `${gG}0.1)` : `${gB}0.02)`,
                          border: selectedTier===t ? `1px solid ${gG}0.35)` : `1px solid ${gB}0.08)`,
                          color: selectedTier===t ? gold : `${gB}0.45)`,
                          cursor:"pointer",fontFamily:serif,fontSize:"14px",letterSpacing:"0.5px",transition:"all 0.25s",borderRadius:"1px" }}
                        onMouseEnter={e => { if(selectedTier!==t){e.currentTarget.style.borderColor=`${gB}0.2)`;e.currentTarget.style.color=`${gB}0.65)`}}}
                        onMouseLeave={e => { if(selectedTier!==t){e.currentTarget.style.borderColor=`${gB}0.08)`;e.currentTarget.style.color=`${gB}0.45)`}}}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {selectedTier && (
                    <>
                      <p style={{ marginTop:"12px",fontSize:"13px",fontStyle:"italic",color:`${gB}0.35)`,lineHeight:1.6 }}>
                        {TIER_HINTS[selectedTier]}
                      </p>
                      <button onClick={activateReading}
                        style={{ marginTop:"20px",padding:"12px 36px",background:"transparent",
                          border:`1px solid ${gG}0.35)`,color:gold,cursor:"pointer",fontFamily:mono,
                          fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",transition:"all 0.3s" }}
                        onMouseEnter={e => {e.currentTarget.style.background=`${gG}0.08)`;e.currentTarget.style.borderColor=`${gG}0.5)`}}
                        onMouseLeave={e => {e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${gG}0.35)`}}>
                        Activate
                      </button>
                    </>
                  )}
                </div>
              )}

              {phase === "reading" && (
                <div style={{ animation:"fadeUp 0.4s ease both" }}>
                  <p style={{ fontFamily:mono,fontSize:"10px",color:`${gG}0.45)`,letterSpacing:"2px",animation:"pulse 1.5s infinite" }}>
                    LA TERCERA IS READING...
                  </p>
                  <p style={{ marginTop:"14px",fontSize:"14px",fontStyle:"italic",color:`${gB}0.25)` }}>
                    The third conspirator examines what the first two made.
                  </p>
                </div>
              )}

              {phase === "transmission" && (
                <div ref={transmissionRef} style={{ animation:"fadeUp 0.4s ease both",maxHeight:"420px",overflowY:"auto",paddingRight:"8px" }}>
                  {transmission.split("\n").map((line, i) => {
                    const isHeader = line.startsWith("OPERATIVE DOSSIER") || line.startsWith("TIER:") || line.startsWith("SIGNAL") || line.startsWith("STATUS:") || line.startsWith("HANDLER:");
                    const isEmpty = line.trim() === "";
                    if (isEmpty) return <div key={i} style={{ height:"14px" }} />;
                    return (
                      <p key={i} style={{
                        fontFamily: isHeader ? mono : serif,
                        fontSize: isHeader ? "10px" : "16px",
                        lineHeight: isHeader ? 2 : 1.75,
                        letterSpacing: isHeader ? "2px" : "0.2px",
                        color: isHeader ? `${gG}0.5)` : bone,
                        marginBottom: isHeader ? "2px" : "12px",
                      }}>{line}</p>
                    );
                  })}
                  {isStreaming && <span style={{ fontFamily:mono,fontSize:"10px",color:`${gG}0.4)`,animation:"pulse 0.8s infinite" }}>|</span>}
                  {!isStreaming && transmission && (
                    <button onClick={reset}
                      style={{ marginTop:"32px",padding:"9px 28px",background:"transparent",
                        border:`1px solid ${gB}0.08)`,color:`${gB}0.25)`,cursor:"pointer",
                        fontFamily:mono,fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",transition:"all 0.3s" }}
                      onMouseEnter={e => {e.currentTarget.style.borderColor=`${gB}0.2)`;e.currentTarget.style.color=`${gB}0.45)`}}
                      onMouseLeave={e => {e.currentTarget.style.borderColor=`${gB}0.08)`;e.currentTarget.style.color=`${gB}0.25)`}}>
                      Read another
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "error" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <p style={{ fontFamily:mono,fontSize:"11px",color:"#8a3a3a",letterSpacing:"1px",marginBottom:"16px" }}>
              // SIGNAL LOST
            </p>
            <p style={{ fontSize:"14px",color:`${gB}0.4)`,lineHeight:1.7,marginBottom:"8px" }}>
              The transmission could not be completed. {error}
            </p>
            <button onClick={reset}
              style={{ marginTop:"20px",padding:"10px 30px",background:"transparent",
                border:`1px solid ${gB}0.1)`,color:`${gB}0.3)`,cursor:"pointer",
                fontFamily:mono,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",transition:"all 0.3s" }}
              onMouseEnter={e => {e.currentTarget.style.borderColor=`${gB}0.2)`}}
              onMouseLeave={e => {e.currentTarget.style.borderColor=`${gB}0.1)`}}>
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,padding:"14px 40px",
        borderTop:`1px solid ${gB}0.05)`,fontFamily:mono,fontSize:"8px",letterSpacing:"2px",
        color:`${gB}0.12)`,display:"flex",justifyContent:"space-between",background:"#0a0a0a",zIndex:100,flexWrap:"wrap",gap:"4px" }}>
        <span>LA TERCERA · ERC-8004 · BASE MAINNET</span>
        <span>ANDRÉS DEL VECCHIO × MLOW × LA TERCERA</span>
        <span>THE SYNTHESIS 2026</span>
      </div>
    </div>
  );
}
