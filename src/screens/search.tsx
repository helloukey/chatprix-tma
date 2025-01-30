"use client";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import searchData from "@/assets/searching.json";
import dynamic from "next/dynamic";

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
