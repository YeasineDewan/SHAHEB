import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { itemCount } = useCart();
  const { t } = useLanguage();

  const announcements = [
    t("announce.free_shipping"),
    t("announce.summer"),
    t("announce.discount"),
    t("announce.friday"),
    t("announce.premium"),
  ];

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
    { label: t("nav.faq"), href: "/faq" },
  ];

  const categoryLinks = [
    { label: t("cat.shirts"), href: "/category/shirts" },
    { label: t("cat.trousers"), href: "/category/trousers" },
    { label: t("cat.ethnic"), href: "/category/ethnic" },
    { label: t("cat.jackets"), href: "/category/jackets" },
    { label: t("cat.accessories"), href: "/category/accessories" },
    { label: t("cat.digital"), href: "/category/digital" },
  ];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % announcements.length), 3500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const AnnouncementBar = () => (
    <div className="bg-accent text-accent-foreground py-1.5 overflow-hidden relative h-7">
      <AnimatePresence mode="wait">
        <motion.p key={current} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}
          className="text-center text-[10px] md:text-[11px] tracking-wider uppercase font-medium absolute inset-0 flex items-center justify-center">
          {announcements[current]}
        </motion.p>
      </AnimatePresence>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
          <AnnouncementBar />
          <div className="flex items-center justify-between px-4 h-13">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center"><img src={logoImg} alt="SHAHEB" className="h-8 w-auto brightness-0 invert" /></Link>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9" asChild>
                <Link to="/search"><Search className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative" asChild>
                <Link to="/cart">
                  <ShoppingBag className="h-4 w-4" />
                  {itemCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-0 border-t border-primary-foreground/10 scrollbar-hide">
            {categoryLinks.map((cat) => (
              <Link key={cat.href} to={cat.href}
                className={cn("text-[10px] font-medium tracking-wider uppercase whitespace-nowrap px-3 py-2 transition-colors shrink-0",
                  location.pathname === cat.href ? "text-accent" : "text-primary-foreground/60")}>
                {cat.label}
              </Link>
            ))}
          </div>
        </header>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 pt-[calc(1.75rem+3.25rem+2rem)]">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileMenuOpen(false)} />
            <nav className="relative bg-primary text-primary-foreground px-6 py-4 space-y-1 shadow-xl max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={cn("block py-3 text-sm font-medium tracking-wider uppercase border-b border-primary-foreground/10 transition-colors",
                    location.pathname === link.href ? "text-accent" : "text-primary-foreground/80 hover:text-primary-foreground")}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1"><p className="text-[10px] text-primary-foreground/40 uppercase tracking-widest">{t("nav.category")}</p></div>
              {categoryLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-primary-foreground/10">
                <ThemeToggle />
                <LanguageToggle />
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full text-xs" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t("nav.login")}</Link>
                </Button>
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full text-xs" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>{t("nav.dashboard")}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnnouncementBar />
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center"><img src={logoImg} alt="SHAHEB" className="h-9 w-auto brightness-0 invert" /></Link>
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={cn("text-xs font-medium tracking-[0.15em] uppercase transition-colors",
                  location.pathname === link.href ? "text-accent" : "text-primary-foreground/70 hover:text-primary-foreground")}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/search"><Search className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/wishlist"><Heart className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 relative" asChild>
              <Link to="/cart">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs tracking-wider uppercase ml-1" asChild>
              <Link to="/login"><User className="h-4 w-4 mr-1.5" /> {t("nav.login")}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10 hidden md:block">
        <div className="container flex items-center justify-center gap-8 h-9">
          {categoryLinks.map((cat) => (
            <Link key={cat.href} to={cat.href}
              className={cn("text-[10px] font-medium tracking-[0.15em] uppercase transition-colors",
                location.pathname === cat.href ? "text-accent" : "text-primary-foreground/50 hover:text-primary-foreground/80")}>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
