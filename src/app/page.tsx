"use client";

import {
  FiltersDrawer,
  Footer,
  Hero,
  ParticlesWrapper,
  SettingsDrawer,
} from "@/screens/home";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [id] = useState("6058779");
	const showAd = useRef()
	useEffect(() => {
		// Initialize the ad engine and get the SHOW method to display ads
		// @ts-expect-error admanager
		window.initCdTma?.({ id }).then(show => showAd.current = show).catch(e => console.log(e))
	}, [id]);

  return (
    <ParticlesWrapper>
      <div className="w-full h-full flex flex-col justify-between items-center gap-8 p-4">
        {/* Navbar */}
        <div className="w-full flex justify-end items-center">
        <button onClick={() => {
          //@ts-expect-error undefined
					showAd.current?.().then(() => console.log("Ad displayed"))
				}}
			>
				Call Ad
			</button>
          <SettingsDrawer />
          <FiltersDrawer />
        </div>
        {/* Hero */}
        <Hero />
        {/* Footer */}
        <Footer />
      </div>
    </ParticlesWrapper>
  );
}
