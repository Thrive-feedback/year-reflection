import React, { useState, useEffect } from "react";
import { ReflectionWriter } from "./screens/ReflectionWriter";
import { ExportScreen } from "./screens/ExportScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { ProgressIndicator } from "./components/atoms/ProgressIndicator";
import { useLanguage } from "./hooks/useLanguage";

export interface Reflection {
  id: string;
  topic: string;
  text: string;
}

export default function App() {
  const { t } = useLanguage();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);

  // Detect Instagram/In-App browser for safe mode
  const isInstagram = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua =
      window.navigator.userAgent ||
      window.navigator.vendor ||
      (window as any).opera;
    return /Instagram|FBAN|FBAV|Line/i.test(ua);
  }, []);

  // Load saved reflections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("new-year-reflections");
    if (saved) {
      try {
        setReflections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved reflections");
      }
    }
  }, []);

  // Save reflections to localStorage
  useEffect(() => {
    if (reflections.length > 0) {
      localStorage.setItem("new-year-reflections", JSON.stringify(reflections));
    } else {
      localStorage.removeItem("new-year-reflections");
    }
  }, [reflections]);

  const FIXED_TOPICS = React.useMemo(
    () => t("topicSelection.topics") as unknown as string[],
    [t]
  );
  const currentTopicIndex = reflections.length;
  const isComplete = currentTopicIndex >= FIXED_TOPICS.length;
  const shouldShowIntro = !hasStarted && reflections.length === 0;

  // Memoize snowflakes - Reduce count significantly for all, and disable if Instagram to save memory
  const snowflakes = React.useMemo(() => {
    if (isInstagram)
      return [...Array(15)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 20}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${10 + Math.random() * 20}s`,
        opacity: 0.8 + Math.random() * 0.2,
        size: `${6 + Math.random() * 6}px`,
      }));

    return [...Array(40)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`,
      opacity: 0.8 + Math.random() * 0.2,
      size: `${6 + Math.random() * 6}px`,
    }));
  }, [isInstagram]);

  const handleReflectionComplete = (text: string) => {
    const newReflection: Reflection = {
      id: Date.now().toString(),
      topic: FIXED_TOPICS[currentTopicIndex],
      text: text,
    };

    setReflections([...reflections, newReflection]);
    setCurrentText("");
  };

  const handleStartOver = () => {
    if (confirm(t("app.confirmStartOver"))) {
      setReflections([]);
      localStorage.removeItem("new-year-reflections");
      localStorage.removeItem("spirit-animal-result");
      setCurrentText("");
    }
  };

  const handleBack = () => {
    if (reflections.length > 0) {
      // Go back to previous step by removing the last reflection
      const newReflections = [...reflections];
      const last = newReflections.pop();
      setReflections(newReflections);
      // Restore previous state to allow editing
      if (last) {
        setCurrentText(last.text);
      }
    }
  };

  return (
    <div className="min-h-screen font-public-sans relative overflow-hidden bg-neutral-50 selection:bg-purple-200 selection:text-purple-900">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1: Brand Purple (Top Left) */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/25 blur-[60px] md:blur-[100px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />

        {/* Orb 2: Soft Blue/Teal (Top Right) */}
        <div
          className="absolute top-[-5%] right-[-10%] w-[40%] h-[60%] rounded-full bg-teal-200/20 blur-[80px] md:blur-[120px] animate-pulse"
          style={{ animationDuration: "7s", animationDelay: "1s" }}
        />

        {/* Orb 3: Warm Rose/Pink (Bottom Left) */}
        <div
          className="absolute bottom-[-10%] left-[10%] w-[45%] h-[45%] rounded-full bg-rose-200/20 blur-[70px] md:blur-[110px] animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />

        {/* Orb 4: Subtle Yellow (Bottom Right) */}
        <div
          className="absolute bottom-[10%] right-[-5%] w-[35%] h-[50%] rounded-full bg-yellow-100/25 blur-[50px] md:blur-[90px] animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "0.5s" }}
        />

        {/* Noise overlay texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Dark overlay for better snow contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/10"></div>

        {/* Christmas Snow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes.map((snow) => (
            <div
              key={snow.id}
              className="absolute animate-snowfall"
              style={{
                left: snow.left,
                top: snow.top,
                animationDelay: snow.delay,
                animationDuration: snow.duration,
                opacity: snow.opacity,
              }}
            >
              <div
                className="bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{
                  width: snow.size,
                  height: snow.size,
                  filter: "blur(0.5px)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content wrapper with relative positioning to appear above pattern */}
      <div className="relative z-10 transition-all duration-500 ease-out">
        {/* Progress Indicator - Show on all steps except export & intro */}
        {!isComplete && !shouldShowIntro && (
          <div className="pt-8 mb-4 max-w-2xl mx-auto px-4">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase">
                Step {currentTopicIndex + 1} of {FIXED_TOPICS.length}
              </span>
              <ProgressIndicator
                current={currentTopicIndex + 1}
                max={FIXED_TOPICS.length}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 pb-12">
          {shouldShowIntro ? (
            <IntroScreen
              key="intro-screen"
              onStart={() => setHasStarted(true)}
              isInstagram={isInstagram}
            />
          ) : !isComplete ? (
            <ReflectionWriter
              key={currentTopicIndex}
              currentTopicIndex={currentTopicIndex}
              topic={FIXED_TOPICS[currentTopicIndex] || ""}
              initialText={currentText}
              onComplete={handleReflectionComplete}
              onBack={handleBack}
            />
          ) : (
            <ExportScreen
              reflections={reflections}
              onStartOver={handleStartOver}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      {/* Global Brand Footer */}
      <footer
        className="relative z-10 pb-8 text-center animate-fade-in"
        style={{ animationDelay: "1s" }}
      >
        <p className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          Created with ❤️ by{" "}
          <span className="text-neutral-500">thrive.team</span>
        </p>
      </footer>
    </div>
  );
}
