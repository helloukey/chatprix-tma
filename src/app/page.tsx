"use client";

import { Footer, Hero, ParticlesWrapper, SettingsDrawer } from "@/screens/home";
import { useUserState } from "@/zustand/useStore";

export default function Home() {
  const { loading, user } = useUserState((state) => state);
  console.log({ loading, user });

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
