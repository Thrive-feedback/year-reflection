import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Reflection } from "../App";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { IconButton } from "@/components/atoms/IconButton";
import { useLanguage } from "@/hooks/useLanguage";

interface TopicSelectionProps {
  onSelectTopic: (topic: string) => void;
  existingReflections: Reflection[];
  onEdit: (reflection: Reflection) => void;
  onDelete: (id: string) => void;
  onFinish: () => void;
}

export function TopicSelection({
  onSelectTopic,
  existingReflections,
  onEdit,
  onDelete,
  onFinish,
}: TopicSelectionProps) {
  const { t } = useLanguage();
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const SYSTEM_TOPICS = t("topicSelection.topics") as any;
  const usedTopics = new Set(existingReflections.map((r) => r.topic));
  const availableTopics = SYSTEM_TOPICS.filter(
    (topic: string) => !usedTopics.has(topic)
  );
  const canAddMore = existingReflections.length < 4;

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
        <h1 className="text-neutral-900 font-semibold text-4xl font-cooper">
          {t("topicSelection.title")}
        </h1>
        <p className="text-neutral-600 max-w-md mx-auto">
          {t("topicSelection.subtitle")}
        </p>
      </div>

      {/* Existing Reflections */}
      {existingReflections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-neutral-700 font-cooper">
            {t("topicSelection.yourReflections")}
          </h2>
          <div className="space-y-2">
            {existingReflections.map((reflection) => (
              <Card
                key={reflection.id}
                className="items-start justify-between gap-4 bg-purple-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-neutral-900">{reflection.topic}</div>
                  <div className="text-neutral-500 mt-1 w-full whitespace-pre-wrap break-words">
                    {reflection.text}
                  </div>
                  <div className="text-neutral-400 mt-1">
                    {reflection.rating}/10
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    onClick={() => onEdit(reflection)}
                    icon={<Edit2 className="w-4 h-4" />}
                    variant="outline"
                    aria-label="Edit reflection"
                  />
                  <IconButton
                    onClick={() => onDelete(reflection.id)}
                    icon={<Trash2 className="w-4 h-4" />}
                    variant="outline"
                    aria-label="Delete reflection"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Reflection */}
      {canAddMore && (
        <div className="space-y-4">
          <h1 className="text-neutral-700 font-cooper">
            {existingReflections.length === 0
              ? t("topicSelection.chooseATopic")
              : t("topicSelection.addAnother")}
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
                variant={"text"}
                iconLeft={<Plus className="w-5 h-5" />}
                onClick={() => setShowCustomInput(true)}
              >
                {t("topicSelection.createYourOwn")}
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
                  placeholder={t("topicSelection.enterYourTopic")}
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
                  >
                    {t("topicSelection.cancel")}
                  </Button>
                  <Button type="submit" className="w-full">
                    {t("topicSelection.add")}
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
            {t("topicSelection.finishCreateSummary")}
          </Button>
        </div>
      )}

      {/* Helper Text */}
      {existingReflections.length === 0 && (
        <div className="text-center text-neutral-400 pt-4">
          {t("topicSelection.selectToBegin")}
        </div>
      )}
    </div>
  );
}
