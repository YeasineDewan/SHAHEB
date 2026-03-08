import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-wider mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join the SHAHEB community</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">First Name</Label><Input placeholder="John" className="rounded-lg" /></div>
                <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input placeholder="Doe" className="rounded-lg" /></div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Email Address</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Phone Number</Label>
                <Input type="tel" placeholder="+91 98765 43210" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="rounded-lg pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              By signing up, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
