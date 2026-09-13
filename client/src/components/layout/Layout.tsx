import type { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuthModal } from "../auth/AuthModal";
import { ToastViewport } from "../ui/ToastViewport";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
      <ToastViewport />
    </div>
  );
}