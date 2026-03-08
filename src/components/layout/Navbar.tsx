import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
          {/* Top bar */}
          <div className="text-center text-[10px] tracking-wider uppercase py-1 bg-accent text-accent-foreground font-medium">
            Free Shipping on Orders Above ₹999
          </div>
          <div className="flex items-center justify-between px-4 h-13">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="font-display text-xl font-bold tracking-[0.25em]">
              SHAHEB
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
        </header>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 pt-[calc(1.25rem+3.25rem)]">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileMenuOpen(false)} />
            <nav className="relative bg-primary text-primary-foreground px-6 py-4 space-y-1 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block py-3 text-sm font-medium tracking-wider uppercase border-b border-primary-foreground/10 transition-colors",
                    location.pathname === link.href ? "text-accent" : "text-primary-foreground/80 hover:text-primary-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-4">
                <ThemeToggle />
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full text-xs" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
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
      {/* Top announcement bar */}
      <div className="text-center text-[11px] tracking-wider uppercase py-1.5 bg-accent text-accent-foreground font-medium">
        Free Shipping on Orders Above ₹999 &nbsp;·&nbsp; New Summer Collection 2026
      </div>
      {/* Main nav */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-bold tracking-[0.3em]">
            SHAHEB
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs font-medium tracking-[0.15em] uppercase transition-colors",
                  location.pathname === link.href
                    ? "text-accent"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
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
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs tracking-wider uppercase ml-2" asChild>
              <Link to="/login"><User className="h-4 w-4 mr-1.5" /> Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
