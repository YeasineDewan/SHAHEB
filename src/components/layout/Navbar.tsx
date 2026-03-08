import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";

const announcements = [
  "Free Shipping on Orders Above ₹999",
  "🔥 Summer Collection 2026 — Now Live!",
  "Use Code SHAHEB20 for 20% Off First Order",
  "New Arrivals Every Friday — Stay Tuned!",
  "💎 Premium Members Get Early Access",
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const categoryLinks = [
  { label: "Shirts", href: "/category/shirts" },
  { label: "Trousers", href: "/category/trousers" },
  { label: "Ethnic Wear", href: "/category/ethnic" },
  { label: "Jackets & Blazers", href: "/category/jackets" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "Digital Products", href: "/category/digital" },
];

function AnnouncementSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-accent text-accent-foreground py-1.5 overflow-hidden relative h-7">
      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-[10px] md:text-[11px] tracking-wider uppercase font-medium absolute inset-0 flex items-center justify-center"
        >
          {announcements[current]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { itemCount } = useCart();

  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
          <AnnouncementSlider />
          <div className="flex items-center justify-between px-4 h-13">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center">
              <img src={logoImg} alt="SHAHEB" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9" asChild>
                <Link to="/search"><Search className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative" asChild>
                <Link to="/cart">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
                </Link>
              </Button>
            </div>
          </div>
          {/* Mobile category bar */}
          <div className="flex overflow-x-auto gap-0 border-t border-primary-foreground/10 scrollbar-hide">
            {categoryLinks.map((cat) => (
              <Link
                key={cat.href}
                to={cat.href}
                className={cn(
                  "text-[10px] font-medium tracking-wider uppercase whitespace-nowrap px-3 py-2 transition-colors shrink-0",
                  location.pathname === cat.href ? "text-accent" : "text-primary-foreground/60"
                )}
              >
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
              <div className="pt-2 pb-1"><p className="text-[10px] text-primary-foreground/40 uppercase tracking-widest">Categories</p></div>
              {categoryLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-primary-foreground/10">
                <ThemeToggle />
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full text-xs" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full text-xs" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
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
      <AnnouncementSlider />
      {/* Main nav */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="SHAHEB" className="h-9 w-auto brightness-0 invert" />
          </Link>

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
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs tracking-wider uppercase ml-1" asChild>
              <Link to="/login"><User className="h-4 w-4 mr-1.5" /> Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Sub-header category bar */}
      <div className="bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10 hidden md:block">
        <div className="container flex items-center justify-center gap-8 h-9">
          {categoryLinks.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className={cn(
                "text-[10px] font-medium tracking-[0.15em] uppercase transition-colors",
                location.pathname === cat.href ? "text-accent" : "text-primary-foreground/50 hover:text-primary-foreground/80"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
