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
      <main className={isMobile ? "pt-[calc(1.75rem+3.25rem+2rem)] pb-20" : "pt-[calc(1.75rem+3.5rem+2.25rem)]"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
