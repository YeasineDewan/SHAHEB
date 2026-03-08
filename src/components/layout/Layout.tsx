import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={isMobile ? "pt-14 pb-20" : "pt-16"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
