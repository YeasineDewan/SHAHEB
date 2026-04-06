import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: t("auth.fillAll"), variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: t("auth.loginFailed"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.loginSuccess") });
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col justify-center bg-primary text-primary-foreground rounded-l-2xl p-10">
            <h2 className="font-display text-4xl font-bold tracking-wider mb-4">SHAHEB</h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-8">{t("auth.loginBenefitsDesc")}</p>
            <div className="space-y-4">
              {[t("auth.benefit1"), t("auth.benefit2"), t("auth.benefit3"), t("auth.benefit4")].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border md:rounded-r-2xl md:rounded-l-none rounded-2xl p-6 md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold tracking-wider mb-1">{t("auth.welcomeBack")}</h1>
              <p className="text-muted-foreground text-sm">{t("auth.loginSubtitle")}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">{t("auth.email")}</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium">{t("auth.password")}</Label>
                  <Link to="/forgot-password" className="text-[11px] text-accent hover:underline">{t("auth.forgotPassword")}</Link>
                </div>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder={t("auth.enterPassword")} className="rounded-lg h-11 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
                  <span className="text-xs">{t("auth.rememberMe")}</span>
                </label>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm font-semibold shadow-lg shadow-accent/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? t("auth.signingIn") : t("auth.signIn")} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-7">
              {t("auth.noAccount")} <Link to="/signup" className="text-accent font-medium hover:underline">{t("auth.signup")}</Link>
            </p>
            <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" /> {t("auth.sslSecure")}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
