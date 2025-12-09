import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TextArea } from "@/components/atoms/TextArea";
import { Button } from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";

interface ReflectionWriterProps {
  topic: string;
  initialText: string;
  initialRating: number;
  onComplete: (text: string, rating: number) => void;
  onBack: () => void;
}

const MAX_CHARACTERS = 120;

export function ReflectionWriter({
  topic,
  initialText,
  initialRating,
  onComplete,
  onBack,
}: ReflectionWriterProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const remainingChars = MAX_CHARACTERS - text.length;
  const PLACEHOLDERS = t("reflectionWriter.placeholders") as any;
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
      <div className="flex justify-end w-full">
        <Button
          onClick={onBack}
          variant="text"
          iconLeft={<ArrowLeft className="w-5 h-5" />}
          className="justify-start w-fit"
        >
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-3">
        {/* Topic Display */}
        <div className="space-y-2">
          <div className="text-neutral-500">{t("reflectionWriter.step1")}</div>
          <h1 className="text-neutral-900 font-cooper">{topic}</h1>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={placeholder}
            autoFocus
            className="min-h-[140px]"
          />
          {/* Character Counter */}
          <div className="flex justify-between items-center text-neutral-500">
            <div>
              {text.length === 0 && t("reflectionWriter.startWriting")}
              {text.length > 0 &&
                text.length < 30 &&
                t("reflectionWriter.keepGoing")}
              {text.length >= 30 &&
                text.length < MAX_CHARACTERS - 20 &&
                t("reflectionWriter.lookingGood")}
              {text.length >= MAX_CHARACTERS - 20 &&
                remainingChars > 0 &&
                `${remainingChars} ${t("reflectionWriter.charsLeft")}`}
              {remainingChars === 0 && t("reflectionWriter.maxReached")}
            </div>
            <div className={remainingChars < 20 ? "text-neutral-900" : ""}>
              {text.length}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        <hr />

        {/* Rating Question */}
        <div className="text-neutral-500">{t("reflectionWriter.step2")}</div>
        <div className="text-center space-y-8">
          {/* Rating Display */}
          <div className="">
            <div className="text-neutral-900 text-7xl font-cooper">
              {displayRating > 0 ? displayRating : "–"}
            </div>
            <div className="text-neutral-400 mt-2">
              {t("reflectionWriter.outOf10")}
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                size={"medium"}
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
          className="mt-4"
          type="submit"
          disabled={rating === 0 || text.trim().length === 0}
        >
          {t("reflectionWriter.selectNext")}
        </Button>
      </form>
    </div>
  );
}
