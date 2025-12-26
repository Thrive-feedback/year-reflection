import { useState, useRef, useEffect } from "react";
import { Download, Sparkles, Instagram } from "lucide-react";
import type { Reflection } from "../App";
import { StoryPreview } from "../components/molecules/StoryPreview";
import { SpiritAnimalStoryCard } from "../components/molecules/SpiritAnimalStoryCard";
import { Button } from "../components/atoms/Button";
import { useLanguage } from "../hooks/useLanguage";
import { Input } from "@/components/atoms/Input";
import {
  getAnimalRecommendation,
  type AnimalRecommendation,
} from "../lib/gemini";

interface ExportScreenProps {
  reflections: Reflection[];
  onStartOver: () => void;
  onBack: () => void;
}

export function ExportScreen({
  reflections,
  onStartOver,
  onBack,
}: ExportScreenProps) {
  const { t } = useLanguage();
  const [exportMode, setExportMode] = useState<"plainText" | "image">("image");
  const [template, setTemplate] = useState<"minimal" | "elegant" | "bold">(
    "minimal"
  );
  const [userName, setUserName] = useState("");
  // const [showNameInput, setShowNameInput] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const spiritAnimalRef = useRef<HTMLDivElement>(null);

  // Gemini AI states
  const [geminiApiKey, setGeminiApiKey] = useState(
    import.meta.env.VITE_GEMINI_API_KEY || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [animalResult, setAnimalResult] = useState<AnimalRecommendation | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<1 | 2>(1);
  const [selectedLang, setSelectedLang] = useState<"en" | "th">("th");
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedTh, setCopiedTh] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const hasEnvApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  const STORAGE_KEY = "spirit-animal-result";

  // Helper function to convert image to Data URL for absolute reliability
  const convertImagesToDataUrls = async (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName("img"));
    const promises = images.map(async (img) => {
      try {
        // If it's already a data URL, skip
        if (img.src.startsWith("data:")) return;

        // Fetch image and convert to blob then to data URL
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result as string;
            resolve(null);
          };
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed to convert image to Data URL:", img.src, err);
      }
    });
    await Promise.all(promises);
  };

  // Helper function to wait for all images to load
  const waitForImages = async (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName("img"));
    const promises = images.map((img) => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue on error
        // 5s timeout fallback for large images
        setTimeout(() => resolve(null), 5000);
      });
    });
    await Promise.all(promises);
    // Extra buffer for rendering
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  // Load saved result from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnimalResult(parsed);
      } catch (e) {
        console.error("Failed to load saved animal result:", e);
      }
    }
  }, []);

  const handleDownload = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    if (!ref.current) {
      console.error("Preview ref is not available");
      return;
    }

    setIsExporting(true);
    try {
      if (ref.current) {
        await waitForImages(ref.current);
        await convertImagesToDataUrls(ref.current);
      }
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#fafafa",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `${filename}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert(t("exportScreen.failedGenerate"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (
    ref: React.RefObject<HTMLDivElement | null>,
    title: string
  ) => {
    if (!ref.current) {
      console.error("Preview ref is not available");
      return;
    }

    setIsExporting(true);
    try {
      if (ref.current) {
        await waitForImages(ref.current);
        await convertImagesToDataUrls(ref.current);
      }
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(ref.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#fafafa",
        cacheBust: true,
      });

      if (!blob) {
        console.error("Failed to create blob");
        alert(t("exportScreen.failedGenerate"));
        return;
      }

      const file = new File([blob], `${title}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: title,
            text: "My 2025 Year Reflection",
          });
        } catch (error) {
          console.error("Share failed:", error);
        }
      } else {
        // Fallback to download if sharing is not supported
        const link = document.createElement("a");
        link.download = `${title}-${Date.now()}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error("Failed to share:", error);
      handleDownload(ref, title);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateAnimal = async () => {
    // Check if result already exists
    if (animalResult) {
      return;
    }

    if (!geminiApiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const result = await getAnimalRecommendation(reflections, geminiApiKey);
      setAnimalResult(result);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (err) {
      console.error("Failed to generate animal recommendation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate recommendation. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = async (text: string, lang: "en" | "th") => {
    try {
      await navigator.clipboard.writeText(text);
      if (lang === "en") {
        setCopiedEn(true);
        setTimeout(() => setCopiedEn(false), 2000);
      } else {
        setCopiedTh(true);
        setTimeout(() => setCopiedTh(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // const handleDownloadAnimalImage = () => {
  //   if (!animalResult) return;
  //   const link = document.createElement("a");
  //   link.href = getAnimalImage(animalResult.animal);
  //   link.download = `${animalResult.animal}-spirit-animal.jpeg`;
  //   link.click();
  // };

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="font-bold text-4xl md:text-5xl font-cooper tracking-tight bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t("exportScreen.title")}
        </h1>
        <p className="text-neutral-700 text-lg max-w-lg mx-auto leading-relaxed">
          {t("exportScreen.subtitle")}
        </p>
      </div>

      {exportMode === "plainText" ? (
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 animate-fade-in">
          {/* Template Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-widest text-center">
              {t("exportScreen.chooseStyle")}
            </div>
            <div className="flex gap-2 justify-center">
              {[
                { id: "minimal", label: t("exportScreen.minimal") },
                { id: "bold", label: t("exportScreen.bold") },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setTemplate(style.id as any)}
                  className={`px-6 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                    template === style.id
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center py-4">
            <div className="relative group perspective-1000">
              <div className="w-[300px] h-[533px] overflow-hidden rounded-[2rem] shadow-2xl shadow-purple-900/10 border-[6px] border-white ring-1 ring-neutral-200 bg-neutral-100 transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.02]">
                <div
                  className="scale-[0.277] origin-top-left"
                  style={{ width: "1080px", height: "1920px" }}
                >
                  <StoryPreview
                    reflections={reflections}
                    template={template}
                    userName={userName}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hidden full-size version for capture */}
          <div
            style={{
              position: "fixed",
              left: "-9999px",
              top: "-9999px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: "#000000",
              backgroundColor: "#ffffff",
              // Reset all CSS variables to prevent oklch inheritance
              borderColor: "#e5e5e5",
              outlineColor: "#a3a3a3",
              isolation: "isolate",
            }}
          >
            <StoryPreview
              ref={previewRef}
              reflections={reflections}
              template={template}
              userName={userName}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => handleShare(previewRef, "2025-reflections")}
              disabled={isExporting}
              iconLeft={
                isExporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Instagram className="w-5 h-5" />
                )
              }
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all border-none"
            >
              {isExporting
                ? "Preparing image..."
                : t("exportScreen.shareInstagram")}
            </Button>

            <Button
              onClick={() => handleDownload(previewRef, "2025-reflections")}
              disabled={isExporting}
              variant="outlined"
              iconLeft={
                isExporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                ) : (
                  <Download className="w-5 h-5" />
                )
              }
              className="w-full h-12 border-neutral-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              {isExporting ? "Saving..." : t("exportScreen.downloadImage")}
            </Button>
          </div>
        </div>
      ) : (
        // Image mode - AI Animal Recommendation
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-cooper text-neutral-800">
                Discover Your Spirit Animal
              </h2>
            </div>
            <p className="text-neutral-500 leading-relaxed max-w-md mx-auto">
              Let AI analyze your reflections and tell you which animal
              represents you best
            </p>
          </div>

          {/* API Key Input - Only show if not in environment */}
          {!hasEnvApiKey && (
            <div className="glass-input p-6 rounded-xl space-y-4">
              <label className="text-sm font-bold text-neutral-700 block">
                Gemini API Key
              </label>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                variant="filled"
                className="bg-white/80 border-transparent focus:bg-white"
              />
              <p className="text-xs text-neutral-500">
                Get your free API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl animate-shake">
              <p className="text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            </div>
          )}

          {/* Generate Button */}
          {!animalResult && (
            <div className="py-8">
              <Button
                onClick={handleGenerateAnimal}
                disabled={isGenerating || !geminiApiKey.trim()}
                iconLeft={
                  isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )
                }
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 border-none transition-all duration-300"
              >
                {isGenerating ? "Analyzing..." : "Reveal My Spirit Animal"}
              </Button>
            </div>
          )}

          {/* Result Display */}
          {animalResult && (
            <div className="space-y-8 animate-fade-in">
              {/* Preview of the Card */}
              <div className="flex justify-center">
                <div className="relative group perspective-1000">
                  <div className="w-[300px] h-[533px] overflow-hidden rounded-[2rem] shadow-2xl shadow-purple-900/10 border-[6px] border-white ring-1 ring-neutral-200 bg-neutral-100 transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.02]">
                    <div
                      className="scale-[0.277] origin-top-left"
                      style={{ width: "1080px", height: "1920px" }}
                    >
                      <SpiritAnimalStoryCard
                        animalResult={animalResult}
                        userName={userName}
                        lang={selectedLang}
                        version={selectedVersion}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden Spirit Animal Card for Capture */}
              <div
                style={{
                  position: "fixed",
                  left: "-9999px",
                  top: "-9999px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  color: "#000000",
                  backgroundColor: "#f5f3ef",
                  // Reset all CSS variables to prevent oklch inheritance
                  borderColor: "#e5e5e5",
                  outlineColor: "#a3a3a3",
                  isolation: "isolate",
                }}
              >
                <SpiritAnimalStoryCard
                  ref={spiritAnimalRef}
                  animalResult={animalResult}
                  userName={userName}
                  lang={selectedLang}
                  version={selectedVersion}
                />
              </div>

              {/* Controls for Version/Lang */}
              <div className="space-y-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60">
                <div className="gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 text-center">
                      Language
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedLang("en")}
                        className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                          selectedLang === "en"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-white/50 text-neutral-500 border border-transparent hover:bg-white"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setSelectedLang("th")}
                        className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                          selectedLang === "th"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-white/50 text-neutral-500 border border-transparent hover:bg-white"
                        }`}
                      >
                        TH
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share/Download Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() =>
                    handleShare(
                      spiritAnimalRef,
                      `my-spirit-animal-${animalResult.animal}`
                    )
                  }
                  disabled={isExporting}
                  iconLeft={
                    isExporting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Instagram className="w-5 h-5" />
                    )
                  }
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                  {isExporting ? "Preparing image..." : "Share to Instagram"}
                </Button>
                <Button
                  onClick={onStartOver}
                  disabled={isExporting}
                  variant="text"
                  className="w-full text-neutral-400 hover:text-neutral-600 font-medium text-xs tracking-widest uppercase py-4"
                >
                  Reflect Again (Reset All)
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
