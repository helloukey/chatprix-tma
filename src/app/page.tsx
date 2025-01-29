"use client";

import { SettingsDrawer } from "@/screens/home";
import heroImage from "@/assets/hero.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-between items-center gap-8 p-4">
      {/* Navbar */}
      <div className="w-full flex justify-end items-center">
        <SettingsDrawer />
      </div>
      {/* Hero */}
      <div className="w-full flex flex-col items-center gap-4 my-8">
        <Image
          src={heroImage}
          alt="Hero"
          className="w-48 h-48"
          width={192}
          height={192}
        />
        <h1 className="text-3xl font-bold text-center">Welcome to Chatprix</h1>
        <p className="text-muted-foreground text-center">
          Start chatting with strangers from around the world.
        </p>
        <div className="w-full flex gap-2">
          <Button variant="secondary" className="w-full">
            <Filter /> Preferences
          </Button>
          <Button className="w-full">
            <Search /> Search
          </Button>
        </div>
      </div>
      {/* Placeholder */}
      <div className="mt-8"></div>
    </div>
  );
}
