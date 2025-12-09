import { useState, useRef } from "react";
import { Download, ArrowLeft, Share2 } from "lucide-react";
import type { Reflection } from "../App";
import { StoryPreview } from "../components/molecules/StoryPreview";
import { Button } from "../components/atoms/Button";
import { useLanguage } from "../hooks/useLanguage";
import { Input } from "@/components/atoms/Input";

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
  const [template, setTemplate] = useState<"minimal" | "elegant" | "bold">(
    "minimal"
  );
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

      {/* Template Selector */}
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
          {/* <Button
            onClick={() => setTemplate("elegant")}
            variant="outlined"
            className={`flex-1 ${
              template === "elegant"
                ? "border-purple-600 bg-purple-50"
                : "border-neutral-200"
            }`}
          >
            {t("exportScreen.elegant")}
          </Button> */}
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

      {/* Name Input */}
      {/* <div className="max-w-2xl mx-auto space-y-3">
        {!showNameInput ? (
          <Button onClick={() => setShowNameInput(true)} variant="text">
            {t("exportScreen.addYourName")}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-neutral-700 font-cooper">
              {t("exportScreen.yourName")}
            </div>
            <Input placeholder={t("exportScreen.placeholder")} variant="filled"/>
          </div>
        )}
      </div> */}

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
          {/* <div className="absolute -top-2 bg-neutral-900 text-white text-xs px-2 py-2 rounded">
            {t("exportScreen.igStoryPreview")}
          </div> */}
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
    </div>
  );
}
