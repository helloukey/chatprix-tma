"use client";

import { Button } from "@/components/ui/button";
import { SearchLottie } from "@/screens/search";

export default function Search() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-4">
      <SearchLottie />
      <p className="text-muted-foreground text-center mb-8">
        Searching for Partner...
      </p>
      <Button className="w-full">Cancel</Button>
    </div>
  );
}
