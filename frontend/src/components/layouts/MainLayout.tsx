import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatWidget from "../ui/AIChatWidget";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
