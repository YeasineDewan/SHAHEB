import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldAlert, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const checkRole = async () => {
      if (!user) {
        if (active) {
          setIsAdmin(false);
          setRoleLoading(false);
        }
        return;
      }

      setRoleLoading(true);
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });

      if (active) {
        setIsAdmin(Boolean(data));
        setRoleLoading(false);
      }
    };

    void checkRole();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || roleLoading) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("admin.loadingTitle")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.loadingDesc")}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">{t("admin.accessDeniedTitle")}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{t("admin.accessDeniedDesc")}</p>
            <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="/dashboard">{t("admin.backToDashboard")}</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}