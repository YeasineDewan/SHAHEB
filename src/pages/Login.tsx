import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 md:gap-0">
          {/* Left branding panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col justify-center bg-primary text-primary-foreground rounded-l-2xl p-10">
            <h2 className="font-display text-4xl font-bold tracking-wider mb-4">SHAHEB</h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-8">
              Welcome back to your style destination. Sign in to access your orders, wishlist, and exclusive member perks.
            </p>
            <div className="space-y-4">
              {["Exclusive member-only deals", "Track orders in real-time", "Save items to your wishlist", "Fast checkout with saved addresses"].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" /> {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border md:rounded-r-2xl md:rounded-l-none rounded-2xl p-6 md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold tracking-wider mb-1">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Sign in to your SHAHEB account</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email Address</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg h-11" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium">Password</Label>
                  <Link to="/forgot-password" className="text-[11px] text-accent hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="rounded-lg h-11 pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
                  <span className="text-xs">Remember me</span>
                </label>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm font-semibold shadow-lg shadow-accent/20">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-[11px] text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-full h-10 text-xs font-medium">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </Button>
              <Button variant="outline" className="rounded-full h-10 text-xs font-medium">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-7">
              Don't have an account? <Link to="/signup" className="text-accent font-medium hover:underline">Create Account</Link>
            </p>

            <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Protected by 256-bit SSL encryption
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
