import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground hidden md:block">
      {/* Main footer */}
      <div className="container px-4 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/">
              <img src={logoImg} alt="SHAHEB" className="h-10 w-auto brightness-0 invert mb-4" />
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed mb-6 max-w-xs">
              Premium men's fashion & digital content. Curated for the modern gentleman who values quality and style.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><Link to="/products" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
              <li><Link to="/category/shirts" className="hover:text-primary-foreground transition-colors">Shirts</Link></li>
              <li><Link to="/category/ethnic" className="hover:text-primary-foreground transition-colors">Ethnic Wear</Link></li>
              <li><Link to="/category/jackets" className="hover:text-primary-foreground transition-colors">Jackets & Blazers</Link></li>
              <li><Link to="/category/digital" className="hover:text-primary-foreground transition-colors">Digital Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">Help</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-primary-foreground transition-colors">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> support@shaheb.com</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} SHAHEB. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/40">
            <Link to="/privacy" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground/70 transition-colors">Terms & Conditions</Link>
            <Link to="/returns" className="hover:text-primary-foreground/70 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
