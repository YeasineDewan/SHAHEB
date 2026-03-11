import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container px-4 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Link to="/"><img src={logoImg} alt="SHAHEB" className="h-10 w-auto brightness-0 invert mb-4" /></Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed mb-6 max-w-xs">
              প্রিমিয়াম পুরুষদের ফ্যাশন ও ডিজিটাল কন্টেন্ট। আধুনিক ভদ্রলোকদের জন্য মানসম্পন্ন ও স্টাইলিশ পণ্য।
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">কেনাকাটা</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><Link to="/products" className="hover:text-primary-foreground transition-colors">সকল পণ্য</Link></li>
              <li><Link to="/category/shirts" className="hover:text-primary-foreground transition-colors">শার্ট</Link></li>
              <li><Link to="/category/ethnic" className="hover:text-primary-foreground transition-colors">এথনিক পোশাক</Link></li>
              <li><Link to="/category/jackets" className="hover:text-primary-foreground transition-colors">জ্যাকেট ও ব্লেজার</Link></li>
              <li><Link to="/category/digital" className="hover:text-primary-foreground transition-colors">ডিজিটাল পণ্য</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">সাহায্য</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">যোগাযোগ</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">সাধারণ জিজ্ঞাসা</Link></li>
              <li><Link to="/track-order" className="hover:text-primary-foreground transition-colors">অর্ডার ট্র্যাক</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">আমাদের সম্পর্কে</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/80">যোগাযোগ</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> support@shaheb.com</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +৮৮০ ১৭১২ ৩৪৫৬৭৮</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} SHAHEB। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/40">
            <Link to="/privacy" className="hover:text-primary-foreground/70 transition-colors">গোপনীয়তা নীতি</Link>
            <Link to="/terms" className="hover:text-primary-foreground/70 transition-colors">শর্তাবলী</Link>
            <Link to="/returns" className="hover:text-primary-foreground/70 transition-colors">রিফান্ড নীতি</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
