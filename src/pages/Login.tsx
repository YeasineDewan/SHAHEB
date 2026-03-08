import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
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
            <h1 className="font-display text-3xl font-bold tracking-wider mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your SHAHEB account</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Email Address</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="rounded-lg pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-full h-10 text-xs">Google</Button>
              <Button variant="outline" className="rounded-full h-10 text-xs">Apple</Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-accent font-medium hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
