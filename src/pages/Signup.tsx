import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: t("auth.fillAll"), variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: t("auth.passwordTooShort"), variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast({ title: t("auth.signupFailed"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.signupSuccess"), description: t("auth.checkEmail") });
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-wider mb-2">{t("auth.createAccount")}</h1>
            <p className="text-muted-foreground text-sm">{t("auth.joinCommunity")}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">{t("auth.name")}</Label>
                <Input placeholder={t("auth.fullNamePlaceholder")} className="rounded-lg" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("auth.email")}</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("auth.phone")}</Label>
                <Input type="tel" placeholder="+880 1712 345678" className="rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("auth.password")}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder={t("auth.minChars")} className="rounded-lg pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? t("auth.creatingAccount") : t("auth.createAccount")} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-4">{t("auth.termsAgree")}</p>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.hasAccount")} <Link to="/login" className="text-accent font-medium hover:underline">{t("auth.signIn")}</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
