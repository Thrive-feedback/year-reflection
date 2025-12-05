import React from 'react';
import { ArrowLeft, Edit2, Star } from 'lucide-react';

interface ReviewScreenProps {
  topic: string;
  text: string;
  rating: number;
  onSave: () => void;
  onEdit: () => void;
  onBack: () => void;
}

export function ReviewScreen({
  topic,
  text,
  rating,
  onSave,
  onEdit,
  onBack,
}: ReviewScreenProps) {
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

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-neutral-900">Review Your Reflection</h2>
          <p className="text-neutral-500 mt-2">Make sure everything looks good</p>
        </div>

        {/* Reflection Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 space-y-6">
          {/* Topic */}
          <div className="space-y-2">
            <div className="text-neutral-500">Topic</div>
            <h3 className="text-neutral-900">{topic}</h3>
          </div>

          {/* Reflection Text */}
          <div className="space-y-2">
            <div className="text-neutral-500">Reflection</div>
            <p className="text-neutral-900 leading-relaxed">{text}</p>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="text-neutral-500">Self-Rating</div>
            <div className="flex items-center gap-3">
              <div className="text-neutral-900 text-3xl">{rating}/10</div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'fill-neutral-900 text-neutral-900'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg py-3 px-6 hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Reflection</span>
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            className="w-full bg-neutral-900 text-white rounded-lg py-4 px-6 hover:bg-neutral-800 transition-colors"
          >
            Save & Continue
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-center text-neutral-400">
          You can edit this reflection anytime before finishing
        </p>
      </div>
    </div>
  );
}
