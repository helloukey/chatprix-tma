"use client";

import { Footer, Hero, ParticlesWrapper, SettingsDrawer } from "@/screens/home";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export default function Home() {
  const ls = retrieveLaunchParams();
  console.log("Launch params", ls);

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
