import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Building2, ShieldCheck } from "lucide-react";

const Checkout = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 space-y-8">
            {/* Shipping */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs">First Name</Label><Input placeholder="John" /></div>
                <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input placeholder="Doe" /></div>
                <div className="col-span-2 space-y-2"><Label className="text-xs">Address</Label><Input placeholder="123 Main Street" /></div>
                <div className="space-y-2"><Label className="text-xs">City</Label><Input placeholder="Mumbai" /></div>
                <div className="space-y-2"><Label className="text-xs">PIN Code</Label><Input placeholder="400001" /></div>
                <div className="space-y-2"><Label className="text-xs">State</Label><Input placeholder="Maharashtra" /></div>
                <div className="space-y-2"><Label className="text-xs">Phone</Label><Input placeholder="+91 98765 43210" /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-bold mb-4">Payment Method</h2>
              <RadioGroup defaultValue="card" className="space-y-3">
                {[
                  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
                  { value: "upi", label: "UPI Payment", icon: Wallet },
                  { value: "netbanking", label: "Net Banking", icon: Building2 },
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="flex items-center gap-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={value} />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-32">
              <h2 className="font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {[
                  { name: "Classic Oxford Shirt × 2", price: 4998 },
                  { name: "Leather Jacket × 1", price: 5999 },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span>₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹10,997</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (GST 18%)</span><span>₹1,979</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-accent">₹12,976</span></div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-12 mt-6 text-base">
                Place Order
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure 256-bit SSL encrypted payment
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
