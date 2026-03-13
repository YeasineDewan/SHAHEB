import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, ShoppingBag, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { label: t("bottom.home"), icon: Home, href: "/" },
    { label: t("bottom.products"), icon: Grid3X3, href: "/products" },
    { label: t("bottom.cart"), icon: ShoppingBag, href: "/cart" },
    { label: t("bottom.profile"), icon: UserCircle, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          return (
            <Link key={tab.href} to={tab.href}
              className={cn("flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[60px]",
                isActive ? "text-accent" : "text-muted-foreground")}>
              <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
