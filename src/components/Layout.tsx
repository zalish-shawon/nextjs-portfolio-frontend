import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}