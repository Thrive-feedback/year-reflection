import React, { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";
import type { Reflection } from "../App";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/ui/card";

interface TopicSelectionProps {
  onSelectTopic: (topic: string) => void;
  existingReflections: Reflection[];
  onEdit: (reflection: Reflection) => void;
  onDelete: (id: string) => void;
  onFinish: () => void;
}

const SYSTEM_TOPICS = [
  "What I'm leaving behind in 2024",
  "My biggest lesson this year",
  "What I'm grateful for",
  "My word for 2025",
  "A challenge I overcame",
  "Someone who inspired me",
  "A habit I want to build",
  "What success means to me",
  "My proudest moment",
  "Where I found joy",
  "A fear I faced",
  "What I learned about myself",
  "My vision for 2025",
  "A relationship that grew",
  "What I want more of",
];

export function TopicSelection({
  onSelectTopic,
  existingReflections,
  onEdit,
  onDelete,
  onFinish,
}: TopicSelectionProps) {
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const usedTopics = new Set(existingReflections.map((r) => r.topic));
  const availableTopics = SYSTEM_TOPICS.filter(
    (topic) => !usedTopics.has(topic)
  );
  const canAddMore = existingReflections.length < 6;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectTopic(customTopic.trim());
      setCustomTopic("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-neutral-900 font-semibold text-4xl">
          First step to a better workday
        </h1>
        <p className="text-neutral-600 max-w-md mx-auto">
          Capture your thoughts, rate your growth, and share your journey
        </p>
      </div>

      {/* Existing Reflections */}
      {existingReflections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-neutral-700">Your Reflections</h2>
          <div className="space-y-2">
            {existingReflections.map((reflection) => (
              <Card
                key={reflection.id}
                className="bg-white border border-neutral-200 rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-neutral-900">{reflection.topic}</div>
                  <div className="text-neutral-500 truncate mt-1">
                    {reflection.text}
                  </div>
                  <div className="text-neutral-400 mt-1">
                    {reflection.rating}/10
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(reflection)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    aria-label="Edit reflection"
                  >
                    <Edit2 className="w-4 h-4 text-neutral-600" />
                  </button>
                  <button
                    onClick={() => onDelete(reflection.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    aria-label="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Reflection */}
      {canAddMore && (
        <div className="space-y-4">
          <h1 className="text-neutral-700">
            {existingReflections.length === 0
              ? "Choose a topic"
              : "Add another reflection"}
          </h1>

          {/* System Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableTopics.slice(0, 8).map((topic) => (
              <Button
                size={"large"}
                variant={"outlined"}
                onClick={() => onSelectTopic(topic)}
              >
                {topic}
              </Button>
            ))}

            {/* Custom Topic Card */}
            {!showCustomInput ? (
              <Button
                variant={"outlined"}
                iconLeft={<Plus className="w-5 h-5" />}
                onClick={() => setShowCustomInput(true)}
              >
                Create your own
              </Button>
            ) : (
              <form
                onSubmit={handleCustomSubmit}
                className="bg-white border-2 border-neutral-900 rounded-lg p-4"
              >
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your topic..."
                  className="w-full bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-400"
                  autoFocus
                  maxLength={60}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    variant={"text"}
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomTopic("");
                    }}
                    // className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full">
                    Add
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Finish Button */}
      {existingReflections.length > 0 && (
        <div className="pt-4">
          <Button onClick={onFinish} className="w-full">
            Finish & Create Summary
          </Button>
        </div>
      )}

      {/* Helper Text */}
      {existingReflections.length === 0 && (
        <div className="text-center text-neutral-400 pt-4">
          Select a topic to begin your reflection
        </div>
      )}
    </div>
  );
}
