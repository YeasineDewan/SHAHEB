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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-wider mb-2">একাউন্ট তৈরি করুন</h1>
            <p className="text-muted-foreground text-sm">SHAHEB কমিউনিটিতে যোগ দিন</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">নাম</Label><Input placeholder="আবদুল" className="rounded-lg" /></div>
                <div className="space-y-2"><Label className="text-xs">পদবি</Label><Input placeholder="করিম" className="rounded-lg" /></div>
              </div>
              <div className="space-y-2"><Label className="text-xs">ইমেইল ঠিকানা</Label><Input type="email" placeholder="you@example.com" className="rounded-lg" /></div>
              <div className="space-y-2"><Label className="text-xs">ফোন নম্বর</Label><Input type="tel" placeholder="+৮৮০ ১৭১২ ৩৪৫৬৭৮" className="rounded-lg" /></div>
              <div className="space-y-2">
                <Label className="text-xs">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="কমপক্ষে ৮ অক্ষর" className="rounded-lg pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                একাউন্ট তৈরি করুন <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-4">সাইন আপ করে আপনি আমাদের সেবার শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হচ্ছেন।</p>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            ইতিমধ্যে একাউন্ট আছে? <Link to="/login" className="text-accent font-medium hover:underline">সাইন ইন করুন</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
