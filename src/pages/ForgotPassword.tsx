import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your email and we'll send a reset link.</p>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-left">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Email Address</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg" />
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
