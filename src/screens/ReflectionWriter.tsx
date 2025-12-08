import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TextArea } from "@/components/atoms/TextArea";
import { Button } from "@/components/atoms/Button";

interface ReflectionWriterProps {
  topic: string;
  initialText: string;
  initialRating: number;
  onComplete: (text: string, rating: number) => void;
  onBack: () => void;
}

const MAX_CHARACTERS = 180;

const PLACEHOLDERS = [
  "Share your thoughts...",
  "What comes to mind?",
  "Take a moment to reflect...",
  "Your story matters...",
  "Write from the heart...",
];

export function ReflectionWriter({
  topic,
  initialText,
  initialRating,
  onComplete,
  onBack,
}: ReflectionWriterProps) {
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const remainingChars = MAX_CHARACTERS - text.length;
  const placeholder =
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (text.trim()) {
  //     // onComplete(text.trim());
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && text.trim()) {
      onComplete(text.trim(), rating);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-8">
        {/* Topic Display */}
        <div className="space-y-2">
          <div className="text-neutral-500">Reflecting on</div>
          <h1 className="text-neutral-900">{topic}</h1>
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={placeholder}
            autoFocus
            className="min-h-[140px] p-4"
          />

          {/* Character Counter */}
          <div className="flex justify-between items-center text-neutral-500">
            <div>
              {text.length === 0 && "Start writing your reflection"}
              {text.length > 0 && text.length < 30 && "Keep going..."}
              {text.length >= 30 &&
                text.length < MAX_CHARACTERS - 20 &&
                "Looking good!"}
              {text.length >= MAX_CHARACTERS - 20 &&
                remainingChars > 0 &&
                `${remainingChars} characters left`}
              {remainingChars === 0 && "Maximum length reached"}
            </div>
            <div className={remainingChars < 20 ? "text-neutral-900" : ""}>
              {text.length}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Rating Question */}
        <div className="text-center space-y-8">
          {/* Rating Display */}
          <div className="">
            <div className="text-neutral-900 text-7xl">
              {displayRating > 0 ? displayRating : "–"}
            </div>
            <div className="text-neutral-400 mt-2">out of 10</div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                variant={num === rating ? "contained" : "outlined"}
                type="button"
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoveredRating(num)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          disabled={rating === 0 || text.trim().length === 0}
        >
          Select next topic
        </Button>
      </form>
    </div>
  );
}
