"use client";

import Lottie from "react-lottie";
import searchData from "@/assets/searching.json";

export const SearchLottie = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: searchData,
  };
  
  return (
    <div className="w-full">
      <Lottie options={defaultOptions} />
    </div>
  );
};
