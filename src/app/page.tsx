"use client";

import { Footer, Hero, ParticlesWrapper, SettingsDrawer } from "@/screens/home";

export default function Home() {

  return (
    <ParticlesWrapper>
      <div className="w-full h-full flex flex-col justify-between items-center gap-8 p-4">
        {/* Navbar */}
        <div className="w-full flex justify-end items-center">
          <SettingsDrawer />
        </div>
        {/* Hero */}
        <Hero />
        {/* Footer */}
        <Footer />
      </div>
    </ParticlesWrapper>
  );
}
