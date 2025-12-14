import { useState, useRef, useEffect } from "react";
import { Download, ArrowLeft, Share2, Sparkles, Copy, Check } from "lucide-react";
import type { Reflection } from "../App";
import { StoryPreview } from "../components/molecules/StoryPreview";
import { Button } from "../components/atoms/Button";
import { useLanguage } from "../hooks/useLanguage";
import { Input } from "@/components/atoms/Input";
import { getAnimalRecommendation, getAnimalEmoji, getAnimalImage, type AnimalRecommendation } from "../lib/gemini";

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
  const [showNameInput, setShowNameInput] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Gemini AI states
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [animalResult, setAnimalResult] = useState<AnimalRecommendation | null>(null);
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

  const handleDownload = async () => {
    if (!previewRef.current) {
      console.error("Preview ref is not available");
      return;
    }

    try {
      // @ts-ignore
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc: Document) => {
          // Remove all style elements to prevent oklch parsing
          const styles = clonedDoc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((style) => style.remove());
        },
      });

      const link = document.createElement("a");
      link.download = `2025-reflections-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert(t("exportScreen.failedGenerate"));
    }
  };

  const handleShare = async () => {
    if (!previewRef.current) {
      console.error("Preview ref is not available");
      return;
    }

    try {
      // @ts-ignore
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc: Document) => {
          // Remove all style elements to prevent oklch parsing
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

        const file = new File([blob], "2025-reflections.png", {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "2025 Reflections",
              text: "My reflections for the new year",
            });
          } catch (error) {
            console.error("Share failed:", error);
          }
        } else {
          // Fallback to download if sharing is not supported
          handleDownload();
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to share:", error);
      handleDownload();
    }
  };

  const handleGenerateAnimal = async () => {
    // Check if result already exists
    if (animalResult) {
      // Result already generated, just show it
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
      setError(err instanceof Error ? err.message : "Failed to generate recommendation. Please try again.");
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

  const handleDownloadAnimalImage = () => {
    if (!animalResult) return;

    const link = document.createElement("a");
    link.href = getAnimalImage(animalResult.animal);
    link.download = `${animalResult.animal}-spirit-animal.jpeg`;
    link.click();
  };

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
        <div className="text-neutral-700 font-cooper">
          Export Format
        </div>
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
          onClick={handleShare}
          iconLeft={<Share2 className="w-5 h-5" />}
          className="w-full"
        >
          {t("exportScreen.shareInstagram")}
        </Button>

        <Button
          onClick={handleDownload}
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
              Let AI analyze your reflections and tell you which animal represents you best
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
              <div className="p-6 bg-[#f5f3ef] space-y-4 rounded-2xl">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <img
                      src={getAnimalImage(animalResult.animal)}
                      alt={animalResult.animal}
                      className="w-64 h-64 object-cover rounded-2xl"
                    />
                  </div>
                  <h3 className="text-3xl font-cooper text-neutral-800">
                    You are a {animalResult.animal}!
                  </h3>
                  <Button
                    onClick={handleDownloadAnimalImage}
                    variant="outlined"
                    iconLeft={<Download className="w-4 h-4" />}
                    className="mt-2"
                  >
                    Download Image
                  </Button>
                </div>
              </div>

              {/* Version Toggle */}
              <div className="space-y-2">
                <div className="text-center text-sm text-neutral-600 font-medium">
                  Why choose this animal?
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSelectedVersion(1)}
                    variant="outlined"
                    className={`${
                      selectedVersion === 1
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-neutral-200"
                    }`}
                  >
                    Version 1
                  </Button>
                  <Button
                    onClick={() => setSelectedVersion(2)}
                    variant="outlined"
                    className={`${
                      selectedVersion === 2
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-neutral-200"
                    }`}
                  >
                    Version 2
                  </Button>
                </div>
              </div>

              {/* Language Toggle
              <div className="space-y-2">
                <div className="text-center text-sm text-neutral-600 font-medium">
                  Select Language
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSelectedLang("en")}
                    variant="outlined"
                    className={`${
                      selectedLang === "en"
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-neutral-200"
                    }`}
                  >
                    English
                  </Button>
                  <Button
                    onClick={() => setSelectedLang("th")}
                    variant="outlined"
                    className={`${
                      selectedLang === "th"
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-neutral-200"
                    }`}
                  >
                    ไทย (Thai)
                  </Button>
                </div>
              </div> */}

              {/* Description Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-neutral-600">English</div>
                  <Button
                    onClick={() => handleCopyText(
                      selectedVersion === 1 ? animalResult.version1En : animalResult.version2En,
                      "en"
                    )}
                    variant="text"
                    iconLeft={copiedEn ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    className="text-sm"
                  >
                    {copiedEn ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="max-w-2xl mx-auto p-6 bg-white border border-neutral-200">
                  <p className="text-neutral-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedVersion === 1 && animalResult.version1En}
                    {selectedVersion === 2 && animalResult.version2En}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-neutral-600">Thai</div>
                  <Button
                    onClick={() => handleCopyText(
                      selectedVersion === 1 ? animalResult.version1Th : animalResult.version2Th,
                      "th"
                    )}
                    variant="text"
                    iconLeft={copiedTh ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    className="text-sm"
                  >
                    {copiedTh ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="max-w-2xl mx-auto p-6 bg-white border border-neutral-200">
                  <p className="text-neutral-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedVersion === 1 && animalResult.version1Th}
                    {selectedVersion === 2 && animalResult.version2Th}
                  </p>
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
