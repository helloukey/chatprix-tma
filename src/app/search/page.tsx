"use client";

import { Button } from "@/components/ui/button";
import Lottie from "react-lottie";
import searchData from "@/assets/searching.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: searchData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Search() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full">
        <Lottie options={defaultOptions} />
      </div>
      <p className="text-muted-foreground text-center mb-8">
        Searching for Partner...
      </p>
      <Button className="w-full">Cancel</Button>
    </div>
  );
}
