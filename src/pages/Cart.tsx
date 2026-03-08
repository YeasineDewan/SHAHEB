import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Heart, Truck, ShieldCheck, Check, X, RotateCcw } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const initialCart = [
  { id: "1", name: "Classic Oxford Shirt", price: 2499, size: "L", color: "White", quantity: 2, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop" },
  { id: "3", name: "Leather Jacket", price: 5999, size: "XL", color: "Black", quantity: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop" },
  { id: "5", name: "Style Guide eBook", price: 499, size: "—", color: "—", quantity: 1, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=250&fit=crop", isDigital: true },
];

const savedItems = [
  { id: "4", name: "Premium Kurta Set", price: 3499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=180&fit=crop" },
  { id: "6", name: "Formal Blazer", price: 6999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=150&h=180&fit=crop" },
];

const recentlyViewed = [
  { id: "7", name: "Cotton Linen Shirt", price: 1799, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=180&fit=crop" },
  { id: "2", name: "Slim Fit Chinos", price: 1999, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=150&h=180&fit=crop" },
  { id: "10", name: "Casual Denim Jacket", price: 3999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=180&fit=crop" },
  { id: "8", name: "Designer Kurta", price: 2999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&h=180&fit=crop" },
];

const Cart = () => {
  const [items, setItems] = useState(initialCart);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + shipping + tax;
  const freeShippingProgress = Math.min(100, (subtotal / 999) * 100);

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };
  const remove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({ title: "Item removed from cart" });
  };
  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SHAHEB20") {
      setCouponApplied(true);
      toast({ title: "Coupon applied!", description: "20% discount added" });
    } else {
      toast({ title: "Invalid coupon code", variant: "destructive" });
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Looks like you haven't added anything yet. Start exploring our collection!</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 h-11" asChild>
            <Link to="/products">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} items · {items.reduce((s, i) => s + i.quantity, 0)} total</p>
        </div>
      </div>

      <div className="container px-4 py-6 md:py-8">
        {/* Free shipping bar */}
        {subtotal < 999 && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-accent" /> Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</span>
              <span className="text-xs text-muted-foreground">₹999 min</span>
            </div>
            <Progress value={freeShippingProgress} className="h-2" />
          </div>
        )}
        {subtotal >= 999 && (
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-6 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <Check className="h-4 w-4" /> You qualify for <strong>free shipping!</strong>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Items */}
          <div className="md:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.05 }}
                  className="flex gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <Link to={`/products/${item.id}`} className="w-22 h-28 md:w-24 md:h-30 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.id}`} className="font-semibold text-sm md:text-base line-clamp-1 hover:text-accent transition-colors">{item.name}</Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.size !== "—" && `Size: ${item.size}`}
                          {item.color !== "—" && ` · Color: ${item.color}`}
                          {"isDigital" in item && <Badge variant="outline" className="ml-2 text-[9px] py-0">Digital</Badge>}
                        </p>
                        <p className="text-accent font-bold mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent"><Heart className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border rounded-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-lg rounded-r-none" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-9 text-center text-sm font-semibold border-x border-border h-8 flex items-center justify-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-lg rounded-l-none" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                      <p className="font-bold text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="flex gap-2 mb-4">
                <Input placeholder="Enter coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} className="rounded-full text-sm h-9" />
                <Button variant="outline" className="rounded-full shrink-0 h-9 text-xs" onClick={applyCoupon}>Apply</Button>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/10 rounded-lg px-3 py-2 mb-3 text-sm">
                  <span className="flex items-center gap-1 text-green-700 dark:text-green-400"><Tag className="h-3 w-3" /> SHAHEB20</span>
                  <button onClick={() => setCouponApplied(false)} className="text-muted-foreground"><X className="h-3 w-3" /></button>
                </div>
              )}

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (GST 18%)</span><span>₹{tax.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-12 mt-5 text-base font-semibold shadow-lg shadow-accent/20" asChild>
                <Link to="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>

              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure Checkout</span>
                <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" /> 15-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved items */}
        {savedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold mb-4">Saved for Later ({savedItems.length})</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {savedItems.map(item => (
                <div key={item.id} className="min-w-[160px] bg-card border border-border rounded-xl p-3">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-medium line-clamp-1">{item.name}</h3>
                  <p className="text-accent font-bold text-sm mt-0.5">₹{item.price.toLocaleString()}</p>
                  <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-[10px] h-7 mt-2">Move to Cart</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">Recently Viewed</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentlyViewed.map(item => (
              <Link key={item.id} to={`/products/${item.id}`} className="min-w-[140px] group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xs font-medium line-clamp-1">{item.name}</h3>
                <p className="text-accent font-bold text-sm">₹{item.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Cart;
