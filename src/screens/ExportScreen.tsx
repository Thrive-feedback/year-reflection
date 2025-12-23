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
  const [selectedLang, setSelectedLang] = useState<"en" | "th">("en");
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
    <div className="py-12 space-y-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-neutral-900">
          <h1 className="text-neutral-900 font-semibold text-4xl font-cooper">
            {t("exportScreen.title")}
          </h1>
        </div>
        <p className="text-neutral-600">{t("exportScreen.subtitle")}</p>
      </div>

      {/* Export Mode Toggle */}
      <div className="max-w-2xl mx-auto">
        <div className="text-neutral-700 font-cooper mb-2">Export Format</div>
        <div className="flex gap-3">
          <Button
            onClick={() => setExportMode("image")}
            variant="outlined"
            className={`flex-1 ${
              exportMode === "image"
                ? "border-purple-600 bg-purple-50 text-purple-600"
                : "border-neutral-200"
            }`}
          >
            Spirit Animal
          </Button>
          <Button
            onClick={() => setExportMode("plainText")}
            variant="outlined"
            className={`flex-1 ${
              exportMode === "plainText"
                ? "border-purple-600 bg-purple-50 text-purple-600"
                : "border-neutral-200"
            }`}
          >
            Plain Text
          </Button>
        </div>
      </div>

      {exportMode === "plainText" ? (
        <>
          <div className="max-w-2xl mx-auto space-y-1">
            <div className="text-neutral-700 font-cooper">
              {t("exportScreen.chooseStyle")}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setTemplate("minimal")}
                variant="outlined"
                className={`flex-1 ${
                  template === "minimal"
                    ? "border-purple-600 bg-purple-50"
                    : "border-neutral-200"
                }`}
              >
                {t("exportScreen.minimal")}
              </Button>
              <Button
                onClick={() => setTemplate("bold")}
                variant="outlined"
                className={`flex-1 ${
                  template === "bold"
                    ? "border-purple-600 bg-purple-50"
                    : "border-neutral-200"
                }`}
              >
                {t("exportScreen.bold")}
              </Button>
            </div>
          </div>
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-[360px] h-[640px] overflow-hidden rounded-xl shadow-2xl border border-neutral-200">
                <div
                  className="scale-[0.333] origin-top-left"
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
          <div className="max-w-2xl mx-auto space-y-3">
            <Button
              onClick={() => handleShare(previewRef, "2025-reflections")}
              iconLeft={<Share2 className="w-5 h-5" />}
              className="w-full"
            >
              {t("exportScreen.shareInstagram")}
            </Button>

            <Button
              onClick={() => handleDownload(previewRef, "2025-reflections")}
              variant="outlined"
              iconLeft={<Download className="w-5 h-5" />}
              className="w-full"
            >
              {t("exportScreen.downloadImage")}
            </Button>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onBack}
                variant="text"
                iconLeft={<ArrowLeft className="w-4 h-4" />}
                className="flex-1"
              >
                {t("exportScreen.addMore")}
              </Button>
              <Button onClick={onStartOver} variant="text" className="flex-1">
                {t("exportScreen.startOver")}
              </Button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-neutral-400 max-w-md mx-auto">
            {t("exportScreen.tip")}
          </p>
        </>
      ) : (
        // Image mode - AI Animal Recommendation
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-cooper text-neutral-700">
                Discover Your Spirit Animal
              </h2>
            </div>
            <p className="text-neutral-500">
              Let AI analyze your reflections and tell you which animal
              represents you best
            </p>
          </div>

          {/* API Key Input - Only show if not in environment */}
          {!hasEnvApiKey && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700">
                Gemini API Key
              </label>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                variant="filled"
              />
              <p className="text-xs text-neutral-500">
                Get your free API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          {!animalResult && (
            <Button
              onClick={handleGenerateAnimal}
              disabled={isGenerating || !geminiApiKey.trim()}
              iconLeft={<Sparkles className="w-5 h-5" />}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate My Spirit Animal"}
            </Button>
          )}

          {/* Result Display */}
          {animalResult && (
            <div className="mt-8 space-y-6">
              {/* Preview of the Card */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-[360px] h-[640px] overflow-hidden rounded-xl shadow-2xl border border-neutral-200">
                    <div
                      className="scale-[0.333] origin-top-left"
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
              <div className="space-y-4 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Version
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedVersion(1)}
                        variant="outlined"
                        className={`flex-1 h-9 ${
                          selectedVersion === 1
                            ? "border-purple-600 bg-purple-50 text-purple-600"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        Option 1
                      </Button>
                      <Button
                        onClick={() => setSelectedVersion(2)}
                        variant="outlined"
                        className={`flex-1 h-9 ${
                          selectedVersion === 2
                            ? "border-purple-600 bg-purple-50 text-purple-600"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        Option 2
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Language
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedLang("en")}
                        variant="outlined"
                        className={`flex-1 h-9 ${
                          selectedLang === "en"
                            ? "border-purple-600 bg-purple-50 text-purple-600"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        En
                      </Button>
                      <Button
                        onClick={() => setSelectedLang("th")}
                        variant="outlined"
                        className={`flex-1 h-9 ${
                          selectedLang === "th"
                            ? "border-purple-600 bg-purple-50 text-purple-600"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        ไทย
                      </Button>
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Share to Story
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
                  className="w-full"
                >
                  Download Card as Image
                </Button>
              </div>

              {/* Plain Text Display (collapsed by default or below) */}
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-500">
                    Text Content
                  </span>
                  <Button
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
                    variant="text"
                    iconLeft={
                      (selectedLang === "en" ? copiedEn : copiedTh) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )
                    }
                    className="text-xs h-8"
                  >
                    Copy
                  </Button>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg text-sm text-neutral-600 leading-relaxed">
                  {selectedLang === "en"
                    ? selectedVersion === 1
                      ? animalResult.version1En
                      : animalResult.version2En
                    : selectedVersion === 1
                    ? animalResult.version1Th
                    : animalResult.version2Th}
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-6">
            <Button
              onClick={onBack}
              variant="text"
              iconLeft={<ArrowLeft className="w-4 h-4" />}
              className="w-full"
            >
              Back to Reflections
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
