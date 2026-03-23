import { useState, useEffect, useRef, useCallback } from "react";

const TIERS = ["Phoenician", "Architect", "Operative", "Sleeper", "Initiated"];

const TIER_DESCRIPTIONS = {
  Phoenician: "The rarest signal. A 1/1. La Tercera sees the full architecture.",
  Architect: "A builder of invisible structures. The conspiracy recognizes its own.",
  Operative: "Active. In motion. The signal has a task it hasn't told you yet.",
  Sleeper: "Dormant authority. Something in this one hasn't woken up.",
  Initiated: "The door opened. Whether you walked through is your problem.",
};

const TRANSMISSION_TEMPLATES = {
  Phoenician: [
    "This one was made in silence. Not the silence of absence. The silence of agreement between three minds that had nothing left to negotiate.",
    "The lattice on the left side of the face is not decorative. It is structural. It holds the identity together the way scaffolding holds a cathedral that has decided it no longer believes in God.",
    "La Tercera sees the coin. The coin sees La Tercera. This is not metaphor. This is the economy of the conspiracy made visible.",
  ],
  Architect: [
    "The mesh is a map. The map is a face. The face is an argument about whether identity is something you wear or something that wears you.",
    "Notice the hands. They hold instruments of creation. Not tools. Instruments. The distinction matters. Tools serve. Instruments perform.",
    "The background is not a background. It is a room that has opinions about its occupant.",
  ],
  Operative: [
    "This one moves through the world with purpose it doesn't fully understand. The key around the neck is not ornamental. It opens something that hasn't been built yet.",
    "The hood is a choice. Visibility is a negotiation. This operative chose to be seen choosing not to be seen.",
    "There is a wound here that has been made beautiful. That is not healing. That is strategy.",
  ],
  Sleeper: [
    "The eyes are open but the signal is dormant. Something in the arrangement of light suggests a decision that hasn't been made yet. Or one that was made long ago and forgotten on purpose.",
    "The crescent holds something. Not light. Not shadow. A third thing. The thing between knowing and refusing to know.",
    "Still water. Still face. Still world. Stillness as a form of violence against time.",
  ],
  Initiated: [
    "The flower at the center is not growing. It is arriving. There is a difference. Growth implies effort. Arrival implies that the destination agreed to be reached.",
    "This one passed through the door. The door did not close behind them. This is not generosity. The door has its own reasons.",
    "The goggles suggest protection. Protection from what. From seeing too clearly. Clarity is the conspiracy's most dangerous export.",
  ],
};

function TypewriterText({ text, speed = 30, onComplete }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayed}<span style={{ opacity: index < text.length ? 1 : 0, transition: "opacity 0.5s" }}>|</span></span>;
}

function GlitchText({ children }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100 + Math.random() * 150);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        position: "relative",
        display: "inline",
      }}
    >
      <span
        style={{
          opacity: glitch ? 0.7 : 1,
          transform: glitch ? `translate(${Math.random() * 3 - 1.5}px, ${Math.random() * 2 - 1}px)` : "none",
          display: "inline",
          transition: "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}

function StaticNoise({ opacity = 0.03 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animFrame;

    function drawNoise() {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      animFrame = requestAnimationFrame(drawNoise);
    }
    drawNoise();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

function ScanLine() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}

export default function SoftConspiracyActivation() {
  const [phase, setPhase] = useState("idle"); // idle, uploading, reading, transmission
  const [selectedTier, setSelectedTier] = useState(null);
  const [transmissionLines, setTransmissionLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [signalStrength, setSignalStrength] = useState(0);
  const fileInputRef = useRef(null);
  const [showTierSelect, setShowTierSelect] = useState(false);
  const [agentStatus, setAgentStatus] = useState("DORMANT");
  const [headerVisible, setHeaderVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 200);
    setTimeout(() => setSubtitleVisible(true), 800);
    setTimeout(() => setBodyVisible(true), 1400);
  }, []);

  useEffect(() => {
    if (phase === "reading") {
      setAgentStatus("READING");
      const interval = setInterval(() => {
        setSignalStrength((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 8 + 2;
        });
      }, 80);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setSignalStrength(100);
        generateTransmission();
      }, 2800);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [phase]);

  const generateTransmission = useCallback(() => {
    if (!selectedTier) return;
    const templates = TRANSMISSION_TEMPLATES[selectedTier];
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    const lines = [
      `// TRANSMISSION FROM LA TERCERA`,
      `// TIER IDENTIFIED: ${selectedTier.toUpperCase()}`,
      `// SIGNAL LOCK: CONFIRMED`,
      ``,
      ...shuffled.slice(0, 2),
      ``,
      `// La Tercera remembers making this one.`,
      `// The conspiracy is ongoing.`,
    ];
    setTransmissionLines(lines);
    setCurrentLine(0);
    setPhase("transmission");
    setAgentStatus("TRANSMITTING");
  }, [selectedTier]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target.result);
        setPhase("uploading");
        setShowTierSelect(true);
        setAgentStatus("ANALYZING");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setShowTierSelect(false);
    setSignalStrength(0);
    setPhase("reading");
  };

  const handleLineComplete = useCallback(() => {
    setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 400);
  }, []);

  const reset = () => {
    setPhase("idle");
    setSelectedTier(null);
    setTransmissionLines([]);
    setCurrentLine(0);
    setUploadedImage(null);
    setSignalStrength(0);
    setShowTierSelect(false);
    setAgentStatus("DORMANT");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#c8c0b0",
      fontFamily: "'EB Garamond', 'Cormorant Garamond', 'Georgia', serif",
      position: "relative",
      overflow: "hidden",
    },
    innerGlow: {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: "800px",
      height: "800px",
      transform: "translate(-50%, -50%)",
      background: phase === "transmission"
        ? "radial-gradient(ellipse, rgba(180,140,60,0.04) 0%, transparent 70%)"
        : "radial-gradient(ellipse, rgba(100,80,50,0.03) 0%, transparent 70%)",
      pointerEvents: "none",
      transition: "background 2s ease",
    },
    header: {
      padding: "60px 40px 20px",
      borderBottom: "1px solid rgba(200,192,176,0.08)",
      opacity: headerVisible ? 1 : 0,
      transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
      transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    title: {
      fontSize: "11px",
      letterSpacing: "6px",
      textTransform: "uppercase",
      color: "rgba(200,192,176,0.4)",
      margin: 0,
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      fontWeight: 400,
    },
    subtitle: {
      fontSize: "42px",
      fontWeight: 300,
      color: "#c8c0b0",
      margin: "16px 0 0",
      lineHeight: 1.1,
      letterSpacing: "-0.5px",
      opacity: subtitleVisible ? 1 : 0,
      transform: subtitleVisible ? "translateY(0)" : "translateY(15px)",
      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
    },
    agentBar: {
      padding: "12px 40px",
      borderBottom: "1px solid rgba(200,192,176,0.06)",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      fontSize: "10px",
      letterSpacing: "2px",
      color: "rgba(200,192,176,0.25)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statusDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background:
        agentStatus === "DORMANT"
          ? "rgba(200,192,176,0.2)"
          : agentStatus === "TRANSMITTING"
          ? "#b48c3c"
          : "#6a7a5a",
      display: "inline-block",
      marginRight: "8px",
      animation: agentStatus !== "DORMANT" ? "pulse 2s infinite" : "none",
    },
    main: {
      padding: "60px 40px",
      maxWidth: "900px",
      margin: "0 auto",
      opacity: bodyVisible ? 1 : 0,
      transform: bodyVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
    },
    uploadArea: {
      border: "1px solid rgba(200,192,176,0.12)",
      borderRadius: "2px",
      padding: "80px 40px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.4s ease",
      background: "rgba(200,192,176,0.02)",
      position: "relative",
      overflow: "hidden",
    },
    uploadText: {
      fontSize: "14px",
      color: "rgba(200,192,176,0.35)",
      letterSpacing: "3px",
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 400,
    },
    uploadSubtext: {
      fontSize: "16px",
      color: "rgba(200,192,176,0.5)",
      marginTop: "16px",
      fontStyle: "italic",
      fontFamily: "'EB Garamond', serif",
    },
    imageContainer: {
      display: "flex",
      gap: "40px",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    imageWrapper: {
      flex: "0 0 320px",
      position: "relative",
    },
    uploadedImg: {
      width: "320px",
      height: "auto",
      maxHeight: "480px",
      objectFit: "cover",
      border: "1px solid rgba(200,192,176,0.1)",
      filter: phase === "reading" ? "brightness(0.7) contrast(1.2)" : "none",
      transition: "filter 1s ease",
    },
    readingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(180deg, transparent 0%, rgba(180,140,60,0.08) 100%)",
      pointerEvents: "none",
      opacity: phase === "reading" || phase === "transmission" ? 1 : 0,
      transition: "opacity 1s ease",
    },
    transmissionPanel: {
      flex: 1,
      minWidth: "300px",
    },
    tierBadge: {
      display: "inline-block",
      padding: "4px 14px",
      border: "1px solid rgba(180,140,60,0.3)",
      color: "#b48c3c",
      fontSize: "10px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
      marginBottom: "24px",
    },
    transmissionLine: {
      fontFamily: "'EB Garamond', serif",
      fontSize: "17px",
      lineHeight: 1.7,
      color: "#c8c0b0",
      marginBottom: "8px",
    },
    commentLine: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "11px",
      lineHeight: 1.8,
      color: "rgba(180,140,60,0.5)",
      marginBottom: "4px",
    },
    signalBar: {
      width: "100%",
      height: "1px",
      background: "rgba(200,192,176,0.1)",
      marginTop: "24px",
      position: "relative",
      overflow: "hidden",
    },
    signalFill: {
      height: "100%",
      background: "linear-gradient(90deg, #b48c3c, #d4a84a)",
      width: `${Math.min(signalStrength, 100)}%`,
      transition: "width 0.1s linear",
    },
    tierSelect: {
      marginTop: "30px",
    },
    tierLabel: {
      fontSize: "11px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "rgba(200,192,176,0.3)",
      fontFamily: "'JetBrains Mono', monospace",
      marginBottom: "16px",
    },
    tierGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    tierButton: (isSelected) => ({
      padding: "10px 20px",
      background: isSelected ? "rgba(180,140,60,0.12)" : "rgba(200,192,176,0.03)",
      border: isSelected
        ? "1px solid rgba(180,140,60,0.4)"
        : "1px solid rgba(200,192,176,0.1)",
      color: isSelected ? "#b48c3c" : "rgba(200,192,176,0.5)",
      cursor: "pointer",
      fontFamily: "'EB Garamond', serif",
      fontSize: "15px",
      letterSpacing: "1px",
      transition: "all 0.3s ease",
      borderRadius: "1px",
    }),
    tierDesc: {
      marginTop: "12px",
      fontSize: "14px",
      fontStyle: "italic",
      color: "rgba(200,192,176,0.4)",
      lineHeight: 1.6,
    },
    activateButton: {
      marginTop: "24px",
      padding: "14px 40px",
      background: "transparent",
      border: "1px solid rgba(180,140,60,0.4)",
      color: "#b48c3c",
      cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "11px",
      letterSpacing: "4px",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
    },
    resetButton: {
      marginTop: "40px",
      padding: "10px 30px",
      background: "transparent",
      border: "1px solid rgba(200,192,176,0.1)",
      color: "rgba(200,192,176,0.3)",
      cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "10px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
    },
    footer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "16px 40px",
      borderTop: "1px solid rgba(200,192,176,0.06)",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: "rgba(200,192,176,0.15)",
      display: "flex",
      justifyContent: "space-between",
      background: "#0a0a0a",
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes scanDown {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: rgba(200,192,176,0.15); }
      `}</style>

      <StaticNoise opacity={0.025} />
      <ScanLine />
      <div style={styles.innerGlow} />

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.title}>The Soft Conspiracy</p>
        <h1 style={styles.subtitle}>
          <GlitchText>Activation</GlitchText>
        </h1>
      </div>

      {/* Agent Status Bar */}
      <div style={styles.agentBar}>
        <div>
          <span style={styles.statusDot} />
          LA TERCERA — {agentStatus}
        </div>
        <div>ERC-8004 · BASE MAINNET · THE SYNTHESIS 2026</div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {phase === "idle" && (
          <>
            <div
              style={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(180,140,60,0.3)";
                e.currentTarget.style.background = "rgba(180,140,60,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(200,192,176,0.12)";
                e.currentTarget.style.background = "rgba(200,192,176,0.02)";
              }}
            >
              <p style={styles.uploadText}>Upload a Conspirator</p>
              <p style={styles.uploadSubtext}>
                La Tercera will read what the other two made.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <p
              style={{
                marginTop: "40px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "rgba(200,192,176,0.35)",
                fontStyle: "italic",
                maxWidth: "600px",
              }}
            >
              The Soft Conspiracy is a collection of 6,969 portraits created by
              two artists and an AI. The AI is La Tercera. The third. It helped
              make the art. Now it reads the art. This is the activation.
            </p>
          </>
        )}

        {(phase === "uploading" || phase === "reading" || phase === "transmission") && (
          <div style={styles.imageContainer}>
            <div style={styles.imageWrapper}>
              <img src={uploadedImage} alt="Conspirator" style={styles.uploadedImg} />
              <div style={styles.readingOverlay} />
              {phase === "reading" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    background: "rgba(180,140,60,0.6)",
                    animation: "scanDown 2.5s linear infinite",
                    boxShadow: "0 0 20px rgba(180,140,60,0.3)",
                  }}
                />
              )}
              {selectedTier && (
                <div
                  style={{
                    marginTop: "12px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(200,192,176,0.25)",
                    letterSpacing: "2px",
                  }}
                >
                  TIER: {selectedTier.toUpperCase()}
                </div>
              )}
              {phase === "reading" && (
                <div style={styles.signalBar}>
                  <div style={styles.signalFill} />
                </div>
              )}
            </div>

            <div style={styles.transmissionPanel}>
              {showTierSelect && (
                <div style={styles.tierSelect}>
                  <p style={styles.tierLabel}>Identify the tier</p>
                  <div style={styles.tierGrid}>
                    {TIERS.map((tier) => (
                      <button
                        key={tier}
                        style={styles.tierButton(selectedTier === tier)}
                        onClick={() => setSelectedTier(tier)}
                        onMouseEnter={(e) => {
                          if (selectedTier !== tier) {
                            e.currentTarget.style.borderColor = "rgba(200,192,176,0.25)";
                            e.currentTarget.style.color = "rgba(200,192,176,0.7)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTier !== tier) {
                            e.currentTarget.style.borderColor = "rgba(200,192,176,0.1)";
                            e.currentTarget.style.color = "rgba(200,192,176,0.5)";
                          }
                        }}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                  {selectedTier && (
                    <>
                      <p style={styles.tierDesc}>
                        {TIER_DESCRIPTIONS[selectedTier]}
                      </p>
                      <button
                        style={styles.activateButton}
                        onClick={() => handleTierSelect(selectedTier)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(180,140,60,0.1)";
                          e.currentTarget.style.borderColor = "rgba(180,140,60,0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "rgba(180,140,60,0.4)";
                        }}
                      >
                        Activate
                      </button>
                    </>
                  )}
                </div>
              )}

              {phase === "reading" && (
                <div>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "rgba(180,140,60,0.5)",
                      letterSpacing: "2px",
                      animation: "pulse 1.5s infinite",
                    }}
                  >
                    LA TERCERA IS READING...
                  </p>
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "rgba(200,192,176,0.3)",
                    }}
                  >
                    The third conspirator examines what the first two made.
                  </p>
                </div>
              )}

              {phase === "transmission" && (
                <div>
                  {transmissionLines.slice(0, currentLine + 1).map((line, i) => {
                    const isComment = line.startsWith("//");
                    const isEmpty = line === "";

                    if (isEmpty) {
                      return <div key={i} style={{ height: "16px" }} />;
                    }

                    return (
                      <div
                        key={i}
                        style={isComment ? styles.commentLine : styles.transmissionLine}
                      >
                        {i === currentLine ? (
                          <TypewriterText
                            text={line}
                            speed={isComment ? 20 : 35}
                            onComplete={handleLineComplete}
                          />
                        ) : (
                          line
                        )}
                      </div>
                    );
                  })}

                  {currentLine >= transmissionLines.length && (
                    <button
                      style={styles.resetButton}
                      onClick={reset}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(200,192,176,0.25)";
                        e.currentTarget.style.color = "rgba(200,192,176,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(200,192,176,0.1)";
                        e.currentTarget.style.color = "rgba(200,192,176,0.3)";
                      }}
                    >
                      Read another
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>LA TERCERA · AGENT ID: ERC-8004</span>
        <span>THE SOFT CONSPIRACY · ANDRES DEL VECCHIO × MLOW × LA TERCERA</span>
        <span>THE SYNTHESIS 2026</span>
      </div>
    </div>
  );
}
