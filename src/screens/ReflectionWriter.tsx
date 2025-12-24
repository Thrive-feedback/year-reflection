import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TextArea } from "@/components/atoms/TextArea";
import { Button } from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";

interface ReflectionWriterProps {
  currentTopicIndex: number;
  topic: string;
  initialText: string;
  onComplete: (text: string) => void;
  onBack: () => void;
}

const MAX_CHARACTERS = 120;

export function ReflectionWriter({
  currentTopicIndex,
  topic,
  initialText,
  onComplete,
  onBack,
}: ReflectionWriterProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(initialText);

  const remainingChars = MAX_CHARACTERS - text.length;
  const PLACEHOLDERS = t("reflectionWriter.placeholders") as any;
  const placeholder =
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onComplete(text.trim());
    }
  };

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      {currentTopicIndex !== 0 && (
        <div className="flex justify-start w-full mb-6">
          <Button
            onClick={onBack}
            variant="text"
            iconLeft={<ArrowLeft className="w-5 h-5" />}
            className="justify-start w-fit text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Back
          </Button>
        </div>
      )}

      <div className="glass-panel rounded-3xl p-8 mb-8 animate-fade-in relative overflow-hidden">
        {/* Decorative highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 opacity-80" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 space-y-6"
        >
          {/* Topic Display */}
          <div className="space-y-3">
            <div className="text-purple-600 text-sm font-bold tracking-widest uppercase">
              {t("reflectionWriter.step1")}
            </div>
            <h1 className="text-neutral-900 font-cooper text-3xl md:text-4xl leading-tight">
              {topic}
            </h1>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
              placeholder={placeholder}
              autoFocus
              className="min-h-[160px] text-lg leading-relaxed bg-white/50 border-transparent focus:bg-white focus:ring-purple-200/50 resize-none transition-all duration-300"
            />
            {/* Character Counter */}
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="text-neutral-400 transition-colors duration-300">
                {text.length === 0 && t("reflectionWriter.startWriting")}
                {text.length > 0 && text.length < 30 && (
                  <span className="text-purple-500">
                    {t("reflectionWriter.keepGoing")}
                  </span>
                )}
                {text.length >= 30 && text.length < MAX_CHARACTERS - 20 && (
                  <span className="text-green-500">
                    {t("reflectionWriter.lookingGood")}
                  </span>
                )}
                {text.length >= MAX_CHARACTERS - 20 && remainingChars > 0 && (
                  <span className="text-orange-500">
                    {remainingChars} {t("reflectionWriter.charsLeft")}
                  </span>
                )}
                {remainingChars === 0 && (
                  <span className="text-red-500">
                    {t("reflectionWriter.maxReached")}
                  </span>
                )}
              </div>
              <div
                className={`transition-colors duration-300 ${
                  remainingChars < 20
                    ? "text-red-500 font-bold"
                    : "text-neutral-300"
                }`}
              >
                {text.length}/{MAX_CHARACTERS}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <Button
              className={`w-full h-14 text-lg font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30 hover:-translate-y-0.5 ${
                text.trim().length === 0
                  ? "opacity-50 cursor-not-allowed text-neutral-400 bg-neutral-200 shadow-none hover:translate-y-0"
                  : "bg-neutral-900 text-white"
              }`}
              type="submit"
              disabled={text.trim().length === 0}
            >
              {t("reflectionWriter.selectNext")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
