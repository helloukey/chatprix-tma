"use client";

import { Button } from "@/components/ui/button";
import { LottieSearch } from "@/screens/search";

export default function Search() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <LottieSearch />
      <p className="text-muted-foreground text-center mb-8">
        Searching for Partner...
      </p>
      <Button className="w-full">Cancel</Button>
    </div>
  );
}
