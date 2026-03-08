import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const initialCart = [
  { id: "1", name: "Classic Oxford Shirt", price: 2499, size: "L", quantity: 2, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop" },
  { id: "3", name: "Leather Jacket", price: 5999, size: "XL", quantity: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop" },
];

const Cart = () => {
  const [items, setItems] = useState(initialCart);
  const [coupon, setCoupon] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const remove = (id: string) => setItems(items.filter(i => i.id !== id));

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-card border border-border rounded-xl p-4"
              >
                <Link to={`/products/${item.id}`} className="w-20 h-24 md:w-24 md:h-28 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm md:text-base line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQty(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQty(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-accent">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-32">
            <h3 className="font-bold mb-4">Order Summary</h3>

            <div className="flex gap-2 mb-4">
              <Input placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} className="rounded-full text-sm" />
              <Button variant="outline" className="rounded-full shrink-0" size="sm"><Tag className="h-4 w-4" /></Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
            </div>

            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-12 mt-6 text-base" asChild>
              <Link to="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>

            <p className="text-[10px] text-muted-foreground text-center mt-3">Taxes calculated at checkout</p>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Cart;
