import { useState, useEffect } from "react";
import { ReflectionWriter } from "./screens/ReflectionWriter";
import { ExportScreen } from "./screens/ExportScreen";
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

  const FIXED_TOPICS = t("topicSelection.topics") as unknown as string[];
  const currentTopicIndex = reflections.length;
  const isComplete = currentTopicIndex >= FIXED_TOPICS.length;

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
    <div className="min-h-screen font-public-sans relative overflow-hidden">
      {/* Minimal geometric pattern background */}
      {/* <div className="absolute inset-0 opacity-40 bg-red-500"></div> */}

      {/* Content wrapper with relative positioning to appear above pattern */}
      <div className="relative z-10">
        {/* Progress Indicator - Show on all steps except export */}
        {!isComplete && (
          <ProgressIndicator
            current={currentTopicIndex + 1}
            max={FIXED_TOPICS.length}
          />
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {!isComplete ? (
            <ReflectionWriter
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
    </div>
  );
}
