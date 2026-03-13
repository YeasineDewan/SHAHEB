import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
      className="rounded-full gap-1.5 text-xs font-medium tracking-wider"
    >
      <Globe className="h-4 w-4" />
      {language === "bn" ? "EN" : "বাং"}
    </Button>
  );
}
