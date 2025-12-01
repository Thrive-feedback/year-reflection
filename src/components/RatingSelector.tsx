import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface RatingSelectorProps {
  topic: string;
  onComplete: (rating: number) => void;
  onBack: () => void;
}

export function RatingSelector({ topic, onComplete, onBack }: RatingSelectorProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onComplete(rating);
    }
  };

  const displayRating = hoveredRating || rating;

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
        {/* Topic Reminder */}
        <div className="space-y-2">
          <div className="text-neutral-500">Rating</div>
          <h2 className="text-neutral-900">{topic}</h2>
        </div>

        {/* Rating Question */}
        <div className="text-center space-y-8">
          <p className="text-neutral-700">
            How do you rate yourself in this area?
          </p>

          {/* Rating Display */}
          <div className="py-8">
            <div className="text-neutral-900 text-7xl">
              {displayRating > 0 ? displayRating : '–'}
            </div>
            <div className="text-neutral-400 mt-2">out of 10</div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoveredRating(num)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  num === rating
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : num === hoveredRating
                    ? 'bg-neutral-100 border-neutral-400'
                    : 'bg-white border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Quick Rating Labels */}
          <div className="flex justify-between text-neutral-400 px-2">
            <span>Room to grow</span>
            <span>Thriving</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={rating === 0}
          className="w-full bg-neutral-900 text-white rounded-lg py-4 px-6 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Review
        </button>
      </form>
    </div>
  );
}
