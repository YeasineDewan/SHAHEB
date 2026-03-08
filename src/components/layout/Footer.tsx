import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 md:py-16 hidden md:block">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold tracking-widest mb-4">SHAHEB</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium men's fashion & digital content. Elevate your style with our curated collection.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=shirts" className="hover:text-foreground transition-colors">Shirts</Link></li>
              <li><Link to="/products?category=ethnic" className="hover:text-foreground transition-colors">Ethnic Wear</Link></li>
              <li><Link to="/products?category=digital" className="hover:text-foreground transition-colors">Digital Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-foreground transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              <li><Link to="/orders" className="hover:text-foreground transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SHAHEB. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
