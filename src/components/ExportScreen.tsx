import { useState, useRef } from 'react';
import { Download, ArrowLeft, Sparkles, Share2 } from 'lucide-react';
import type { Reflection } from '../App';
import { StoryPreview } from './StoryPreview';

interface ExportScreenProps {
  reflections: Reflection[];
  onStartOver: () => void;
  onBack: () => void;
}

export function ExportScreen({ reflections, onStartOver, onBack }: ExportScreenProps) {
  const [template, setTemplate] = useState<'minimal' | 'elegant' | 'bold'>('minimal');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      // @ts-ignore
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 1080,
        height: 1920,
      });

      const link = document.createElement('a');
      link.download = `2025-reflections-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!previewRef.current) return;

    try {
      // @ts-ignore
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 1080,
        height: 1920,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], '2025-reflections.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: '2025 Reflections',
              text: 'My reflections for the new year',
            });
          } catch (error) {
            console.error('Share failed:', error);
          }
        } else {
          // Fallback to download if sharing is not supported
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Failed to share:', error);
      handleDownload();
    }
  };

  return (
    <div className="py-12 space-y-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-neutral-900">
          <Sparkles className="w-6 h-6" />
          <h1>Your 2025 Reflections</h1>
        </div>
        <p className="text-neutral-600">
          Share your journey with the world
        </p>
      </div>

      {/* Template Selector */}
      <div className="max-w-2xl mx-auto space-y-3">
        <label className="text-neutral-700">Choose a style</label>
        <div className="flex gap-3">
          <button
            onClick={() => setTemplate('minimal')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              template === 'minimal'
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            Minimal
          </button>
          <button
            onClick={() => setTemplate('elegant')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              template === 'elegant'
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            Elegant
          </button>
          <button
            onClick={() => setTemplate('bold')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              template === 'bold'
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            Bold
          </button>
        </div>
      </div>

      {/* Name Input */}
      <div className="max-w-2xl mx-auto space-y-3">
        {!showNameInput ? (
          <button
            onClick={() => setShowNameInput(true)}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            + Add your name
          </button>
        ) : (
          <div className="space-y-2">
            <label className="text-neutral-700">Your name (optional)</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name or @handle"
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 transition-colors"
              maxLength={30}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-[360px] h-[640px] overflow-hidden rounded-xl shadow-2xl border border-neutral-200">
            <div className="scale-[0.333] origin-top-left" style={{ width: '1080px', height: '1920px' }}>
              <StoryPreview
                ref={previewRef}
                reflections={reflections}
                template={template}
                userName={userName}
              />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded">
            IG Story Preview
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto space-y-3">
        <button
          onClick={handleShare}
          className="w-full bg-neutral-900 text-white rounded-lg py-4 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share to Instagram</span>
        </button>

        <button
          onClick={handleDownload}
          className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg py-4 px-6 hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Image</span>
        </button>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 text-neutral-600 hover:text-neutral-900 transition-colors py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More</span>
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 text-neutral-600 hover:text-neutral-900 transition-colors py-3"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-center text-neutral-400 max-w-md mx-auto">
        Tip: Screenshot or save this to share on Instagram Stories (1080 x 1920)
      </p>
    </div>
  );
}
