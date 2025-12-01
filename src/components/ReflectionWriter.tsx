import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ReflectionWriterProps {
  topic: string;
  initialText: string;
  onComplete: (text: string) => void;
  onBack: () => void;
}

const MAX_CHARACTERS = 180;

const PLACEHOLDERS = [
  'Share your thoughts...',
  'What comes to mind?',
  'Take a moment to reflect...',
  'Your story matters...',
  'Write from the heart...',
];

export function ReflectionWriter({
  topic,
  initialText,
  onComplete,
  onBack,
}: ReflectionWriterProps) {
  const [text, setText] = useState(initialText);
  const remainingChars = MAX_CHARACTERS - text.length;
  const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onComplete(text.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic Display */}
        <div className="space-y-2">
          <div className="text-neutral-500">Reflecting on</div>
          <h1 className="text-neutral-900">{topic}</h1>
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-6 bg-white border border-neutral-200 rounded-lg resize-none focus:outline-none focus:border-neutral-400 transition-colors text-neutral-900 placeholder:text-neutral-400"
            autoFocus
          />
          
          {/* Character Counter */}
          <div className="flex justify-between items-center text-neutral-500">
            <div>
              {text.length === 0 && 'Start writing your reflection'}
              {text.length > 0 && text.length < 30 && 'Keep going...'}
              {text.length >= 30 && text.length < MAX_CHARACTERS - 20 && 'Looking good!'}
              {text.length >= MAX_CHARACTERS - 20 && remainingChars > 0 && `${remainingChars} characters left`}
              {remainingChars === 0 && 'Maximum length reached'}
            </div>
            <div className={remainingChars < 20 ? 'text-neutral-900' : ''}>
              {text.length}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={text.trim().length === 0}
          className="w-full bg-neutral-900 text-white rounded-lg py-4 px-6 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Rating
        </button>
      </form>
    </div>
  );
}
