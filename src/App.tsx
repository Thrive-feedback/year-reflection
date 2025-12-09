import React, { useState, useEffect } from "react";
import { TopicSelection } from "./screens/TopicSelection";
import { ReflectionWriter } from "./screens/ReflectionWriter";
import { ExportScreen } from "./screens/ExportScreen";
import { ProgressIndicator } from "./components/atoms/ProgressIndicator";

export interface Reflection {
  id: string;
  topic: string;
  text: string;
  rating: number;
}

type Step =
  | "topic-selection"
  | "write-reflection"
  | "rate-reflection"
  | "review"
  | "export";

export default function App() {
  const [step, setStep] = useState<Step>("topic-selection");
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [currentText, setCurrentText] = useState<string>("");
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleTopicSelect = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentText("");
    setCurrentRating(0);
    setStep("write-reflection");
  };

  const handleReflectionComplete = (text: string, rating: number) => {
    setCurrentText(text);
    setCurrentRating(rating);

    if (editingId) {
      setReflections(
        reflections.map((r: Reflection) =>
          r.id === editingId
            ? {
                ...r,
                topic: currentTopic,
                text: text,
                rating: rating,
              }
            : r
        )
      );
      setEditingId(null);
    } else {
      const newReflection: Reflection = {
        id: Date.now().toString(),
        topic: currentTopic,
        text: text,
        rating: rating,
      };
      setReflections([...reflections, newReflection]);
    }

    // Reset current state
    setCurrentTopic("");
    setCurrentText("");
    setCurrentRating(0);
    setStep("topic-selection");
  };

  const handleEdit = (reflection: Reflection) => {
    console.log(reflection);
    setEditingId(reflection.id);
    setCurrentTopic(reflection.topic);
    setCurrentText(reflection.text);
    setCurrentRating(reflection.rating);
    setStep("write-reflection");
  };

  const handleDelete = (id: string) => {
    console.log(reflections);
    setReflections(reflections.filter((r: Reflection) => r.id !== id));
  };

  const handleFinish = () => {
    setStep("export");
  };

  const handleStartOver = () => {
    if (
      confirm(
        "Are you sure you want to start over? This will delete all your reflections."
      )
    ) {
      setReflections([]);
      localStorage.removeItem("new-year-reflections");
      setStep("topic-selection");
    }
  };

  const handleBack = () => {
    if (step === "write-reflection") {
      setStep("topic-selection");
    } else if (step === "export") {
      setStep("topic-selection");
    }
  };

  return (
    <div className="min-h-screen font-public-sans relative overflow-hidden">
      {/* Minimal geometric pattern background */}
      {/* <div className="absolute inset-0 opacity-40 bg-red-500"></div> */}

      {/* Content wrapper with relative positioning to appear above pattern */}
      <div className="relative z-10">
        {/* Progress Indicator - Show on all steps except export */}
        {step !== "export" && reflections.length > 0 && (
          <ProgressIndicator current={reflections.length} max={6} />
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {step === "topic-selection" && (
            <TopicSelection
              onSelectTopic={handleTopicSelect}
              existingReflections={reflections}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFinish={handleFinish}
            />
          )}

          {step === "write-reflection" && (
            <ReflectionWriter
              topic={currentTopic}
              initialText={currentText}
              initialRating={currentRating}
              onComplete={handleReflectionComplete}
              onBack={handleBack}
            />
          )}

          {step === "export" && (
            <ExportScreen
              reflections={reflections}
              onStartOver={handleStartOver}
              onBack={() => setStep("topic-selection")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
