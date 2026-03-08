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
      <main className={isMobile ? "pt-[calc(1.25rem+3.25rem)] pb-20" : "pt-[calc(1.75rem+4rem)]"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
