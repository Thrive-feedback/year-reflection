import { useState, useRef, useEffect } from "react";
import {
  Download,
  ArrowLeft,
  Share2,
  Sparkles,
  Copy,
  Check,
  Instagram,
} from "lucide-react";
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

  const hasEnvApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  const STORAGE_KEY = "spirit-animal-result";

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

    try {
      // @ts-ignore
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc: Document) => {
          // Remove all style elements to prevent oklch parsing issues if any
          const styles = clonedDoc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((style) => style.remove());
        },
      });

      const link = document.createElement("a");
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert(t("exportScreen.failedGenerate"));
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

    try {
      // @ts-ignore
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc: Document) => {
          const styles = clonedDoc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((style) => style.remove());
        },
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to create blob");
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
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to share:", error);
      handleDownload(ref, title);
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

      {/* Export Mode Toggle */}
      {/* <div className="max-w-2xl mx-auto">
        <div className="glass-panel p-1.5 rounded-2xl flex gap-1 relative">
          <button
            onClick={() => setExportMode("image")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              exportMode === "image"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-neutral-500 hover:bg-white/40 hover:text-neutral-700"
            }`}
          >
            Spirit Animal
          </button>
          <button
            onClick={() => setExportMode("plainText")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              exportMode === "plainText"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-neutral-500 hover:bg-white/40 hover:text-neutral-700"
            }`}
          >
            Plain Text
          </button>
        </div>
      </div> */}

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
              iconLeft={<Instagram className="w-5 h-5" />}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all border-none"
            >
              {t("exportScreen.shareInstagram")}
            </Button>

            <Button
              onClick={() => handleDownload(previewRef, "2025-reflections")}
              variant="outlined"
              iconLeft={<Download className="w-5 h-5" />}
              className="w-full h-12 border-neutral-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              {t("exportScreen.downloadImage")}
            </Button>
{/* 
            <div className="flex gap-4 pt-6 border-t border-neutral-100/50">
              <Button
                onClick={onBack}
                variant="text"
                iconLeft={<ArrowLeft className="w-4 h-4" />}
                className="flex-1 text-neutral-500 hover:text-neutral-800"
              >
                {t("exportScreen.addMore")}
              </Button>
              <Button
                onClick={onStartOver}
                variant="text"
                className="flex-1 text-neutral-500 hover:text-red-600 hover:bg-red-50/50"
              >
                {t("exportScreen.startOver")}
              </Button>
            </div> */}
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
                  iconLeft={<Instagram className="w-5 h-5" />}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Share to Instagram
                </Button>
                <Button
                  onClick={() =>
                    handleDownload(
                      spiritAnimalRef,
                      `my-spirit-animal-${animalResult.animal}`
                    )
                  }
                  variant="outlined"
                  iconLeft={<Download className="w-4 h-4" />}
                  className="w-full h-12 border-neutral-200 bg-white/50 hover:bg-white hover:border-purple-200 hover:text-purple-700 backdrop-blur-sm"
                >
                  Download Card as Image
                </Button>
              </div>

              {/* Plain Text Display */}
              {/* <div className="mt-8 pt-6 border-t border-neutral-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Copy Text
                  </span>
                  <button
                    onClick={() =>
                      handleCopyText(
                        selectedLang === "en"
                          ? selectedVersion === 1
                            ? animalResult.version1En
                            : animalResult.version2En
                          : selectedVersion === 1
                          ? animalResult.version1Th
                          : animalResult.version2Th,
                        selectedLang
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100"
                  >
                    {(selectedLang === "en" ? copiedEn : copiedTh) ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur-sm rounded-xl text-sm text-neutral-600 leading-relaxed border border-white/50 shadow-inner">
                  {selectedLang === "en"
                    ? selectedVersion === 1
                      ? animalResult.version1En
                      : animalResult.version2En
                    : selectedVersion === 1
                    ? animalResult.version1Th
                    : animalResult.version2Th}
                </div>
              </div> */}
            </div>
          )}

          {/* Back Button */}
          {/* <div className="pt-2 border-t border-neutral-100/50">
            <Button
              onClick={onBack}
              variant="text"
              iconLeft={<ArrowLeft className="w-4 h-4" />}
              className="w-full text-neutral-500 hover:text-neutral-800"
            >
              Back to Reflections
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
}
