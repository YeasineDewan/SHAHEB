import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, Wallet, Building2, ShieldCheck, Check, MapPin, Package, Truck, ArrowRight, ArrowLeft, Lock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package },
];

const orderItems = [
  { name: "Classic Oxford Shirt", size: "L", color: "White", qty: 2, price: 2499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&h=100&fit=crop" },
  { name: "Leather Jacket", size: "XL", color: "Black", qty: 1, price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=100&fit=crop" },
  { name: "Style Guide eBook", size: "—", color: "—", qty: 1, price: 499, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=100&fit=crop" },
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveAddress, setSaveAddress] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const placeOrder = () => {
    setOrderPlaced(true);
    toast({ title: "Order placed successfully! 🎉" });
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container px-4 py-20 max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">Your order has been placed successfully.</p>
          <p className="text-sm font-medium mb-6">Order ID: <span className="text-accent">ORD-2026-004</span></p>
          <div className="bg-card border border-border rounded-xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
            {orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="flex justify-between font-bold"><span>Total Paid</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
              <Link to="/track-order">Track Order</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          {/* Steps */}
          <div className="flex items-center gap-0 mt-4 max-w-md">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-1.5 ${step >= s.id ? "text-accent" : "text-muted-foreground"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s.id ? "bg-accent text-accent-foreground" : step === s.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 md:py-8 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-6 md:gap-8">
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                    <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" /> Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label className="text-xs font-medium">First Name *</Label><Input placeholder="John" className="rounded-lg" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-medium">Last Name *</Label><Input placeholder="Smith" className="rounded-lg" /></div>
                      <div className="col-span-2 space-y-1.5"><Label className="text-xs font-medium">Email *</Label><Input type="email" placeholder="john@example.com" className="rounded-lg" /></div>
                      <div className="col-span-2 space-y-1.5"><Label className="text-xs font-medium">Address *</Label><Input placeholder="123 Main Street, Apt 4B" className="rounded-lg" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-medium">City *</Label><Input placeholder="Mumbai" className="rounded-lg" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-medium">PIN Code *</Label><Input placeholder="400001" className="rounded-lg" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-medium">State *</Label><Input placeholder="Maharashtra" className="rounded-lg" /></div>
                      <div className="space-y-1.5"><Label className="text-xs font-medium">Phone *</Label><Input placeholder="+91 98765 43210" className="rounded-lg" /></div>
                    </div>
                    <label className="flex items-center gap-2 mt-4">
                      <Checkbox checked={saveAddress} onCheckedChange={(c) => setSaveAddress(!!c)} />
                      <span className="text-sm">Save this address for future orders</span>
                    </label>
                  </div>
                  <div className="flex justify-between mt-5">
                    <Button variant="ghost" className="rounded-full" asChild><Link to="/cart"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart</Link></Button>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" onClick={() => setStep(2)}>Continue to Payment <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                    <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><CreditCard className="h-5 w-5 text-accent" /> Payment Method</h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      {[
                        { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
                        { value: "upi", label: "UPI Payment", desc: "GPay, PhonePe, Paytm", icon: Wallet },
                        { value: "netbanking", label: "Net Banking", desc: "All major banks supported", icon: Building2 },
                        { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: Package },
                      ].map(({ value, label, desc, icon: Icon }) => (
                        <label key={value} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                          paymentMethod === value ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "border-border hover:bg-secondary/50"
                        }`}>
                          <RadioGroupItem value={value} />
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{label}</span>
                            <p className="text-[10px] text-muted-foreground">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-5 space-y-3 border-t border-border pt-5">
                        <div className="space-y-1.5"><Label className="text-xs">Card Number</Label><Input placeholder="4242 4242 4242 4242" className="rounded-lg" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5"><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" className="rounded-lg" /></div>
                          <div className="space-y-1.5"><Label className="text-xs">CVV</Label><Input placeholder="123" type="password" className="rounded-lg" /></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-5">
                    <Button variant="ghost" className="rounded-full" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" onClick={() => setStep(3)}>Review Order <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> Shipping Address</h3>
                        <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setStep(1)}>Edit</Button>
                      </div>
                      <p className="text-sm">John Smith</p>
                      <p className="text-xs text-muted-foreground">123 Main Street, Apt 4B · Mumbai, Maharashtra 400001 · +91 98765 43210</p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-accent" /> Payment</h3>
                        <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setStep(2)}>Edit</Button>
                      </div>
                      <p className="text-sm capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit Card ending in 4242" : paymentMethod.toUpperCase()}</p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5"><Package className="h-4 w-4 text-accent" /> Items</h3>
                      {orderItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.size !== "—" ? `${item.size} · ${item.color} · ` : ""}Qty: {item.qty}</p>
                          </div>
                          <p className="text-sm font-bold">₹{(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3"><Truck className="h-4 w-4 text-accent" /><span className="text-sm font-medium">Estimated delivery: <strong>Mar 12-14, 2026</strong></span></div>
                      <p className="text-xs text-muted-foreground">Standard shipping · Free for orders above ₹999</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-5">
                    <Button variant="ghost" className="rounded-full" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-12 px-8 text-base font-semibold shadow-lg shadow-accent/20" onClick={placeOrder}>
                      <Lock className="h-4 w-4 mr-2" /> Place Order — ₹{total.toLocaleString()}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-32">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">× {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (GST 18%)</span><span>₹{tax.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> 256-bit SSL encrypted · 100% secure
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Checkout;
