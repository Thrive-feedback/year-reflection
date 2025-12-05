import React, { forwardRef } from 'react';
import { Star, Sparkles } from 'lucide-react';
import type { Reflection } from '../App';

interface StoryPreviewProps {
  reflections: Reflection[];
  template: 'minimal' | 'elegant' | 'bold';
  userName?: string;
}

export const StoryPreview = forwardRef<HTMLDivElement, StoryPreviewProps>(
  ({ reflections, template, userName }, ref) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (template === 'minimal') {
      return (
        <div
          ref={ref}
          className="w-[1080px] h-[1920px] bg-white p-24 flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-20">
            <div className="text-8xl mb-6">2025</div>
            <div className="text-5xl text-neutral-600">Reflections</div>
            {userName && <div className="text-4xl text-neutral-400 mt-8">{userName}</div>}
          </div>

          {/* Reflections */}
          <div className="flex-1 space-y-16">
            {reflections.map((reflection, index) => (
              <div key={reflection.id} className="border-l-4 border-neutral-900 pl-10">
                <div className="text-3xl text-neutral-500 mb-4">
                  {reflection.topic}
                </div>
                <div className="text-4xl text-neutral-900 mb-6 leading-snug">
                  {reflection.text}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{reflection.rating}/10</div>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(reflection.rating, 10) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-neutral-900 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-3xl text-neutral-400 mt-16">
            {currentDate}
          </div>
        </div>
      );
    }

    if (template === 'elegant') {
      return (
        <div
          ref={ref}
          className="w-[1080px] h-[1920px] bg-gradient-to-br from-neutral-50 to-neutral-100 p-24 flex flex-col"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-neutral-900/5 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-20 relative">
            <div className="inline-block p-6 rounded-full bg-white shadow-lg mb-8">
              <Sparkles className="w-24 h-24 text-neutral-900" />
            </div>
            <div className="text-7xl mb-4">My 2025 Reflections</div>
            {userName && <div className="text-4xl text-neutral-600 mt-6">{userName}</div>}
          </div>

          {/* Reflections */}
          <div className="flex-1 space-y-12">
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="bg-white rounded-3xl p-12 shadow-lg"
              >
                <div className="text-3xl text-neutral-500 mb-6">
                  {reflection.topic}
                </div>
                <div className="text-4xl text-neutral-900 mb-8 leading-relaxed">
                  "{reflection.text}"
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                  <div className="text-3xl text-neutral-600">Self-rating</div>
                  <div className="text-5xl">{reflection.rating}/10</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-3xl text-neutral-500 mt-16 relative">
            {currentDate}
          </div>
        </div>
      );
    }

    // Bold template
    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1920px] bg-neutral-900 text-white p-24 flex flex-col"
      >
        {/* Header */}
        <div className="mb-20">
          <div className="text-9xl mb-4">2025</div>
          <div className="text-6xl text-neutral-400">REFLECTIONS</div>
          {userName && (
            <div className="text-4xl text-neutral-500 mt-8 uppercase tracking-wider">
              {userName}
            </div>
          )}
        </div>

        {/* Reflections */}
        <div className="flex-1 space-y-14">
          {reflections.map((reflection, index) => (
            <div key={reflection.id}>
              <div className="flex items-start gap-8 mb-6">
                <div className="text-7xl text-neutral-600">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="text-3xl text-neutral-400 mb-4 uppercase tracking-wide">
                    {reflection.topic}
                  </div>
                  <div className="text-4xl leading-snug">
                    {reflection.text}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 pl-32">
                <div className="text-5xl">{reflection.rating}</div>
                <div className="text-3xl text-neutral-500">/10</div>
                <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${(reflection.rating / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-3xl text-neutral-600 mt-16 uppercase tracking-wider">
          {currentDate}
        </div>
      </div>
    );
  }
);

StoryPreview.displayName = 'StoryPreview';
