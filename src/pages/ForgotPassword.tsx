import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: t("auth.resetFailed"), description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            {sent ? <CheckCircle className="h-7 w-7 text-green-500" /> : <Mail className="h-7 w-7 text-accent" />}
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">{t("auth.resetPassword")}</h1>
          <p className="text-muted-foreground text-sm mb-8">{sent ? t("auth.resetSent") : t("auth.resetDesc")}</p>
          {!sent && (
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-left">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">{t("auth.email")}</Label>
                  <Input type="email" placeholder="you@example.com" className="rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 text-sm">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t("auth.sendResetLink")} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
