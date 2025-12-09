import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "./Button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1">
      <Button
        variant={language === "en" ? "contained" : "outlined"}
        size="small"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={language === "th" ? "contained" : "outlined"}
        size="small"
        onClick={() => setLanguage("th")}
      >
        TH
      </Button>
    </div>
  );
}
