"use client";

import dynamic from "next/dynamic";
import searchData from "@/assets/searching.json";
import { useWindowSize } from "@/hooks/use-window-size";
import Image from "next/image";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import chatprixLogo from "../../tma-assets/chatprix-logo.png";

export const LottieSearch = () => {
  const { width } = useWindowSize();

  if (width === 0) {
    return (
      <div className="w-full h-fit p-8">
        <Image src={chatprixLogo} alt="chatprix" className="w-full h-fit" />
      </div>
    );
  }

  return (
    <div
      className="w-full h-fit"
      style={{ width: width - 32, height: width - 32 }}
    >
      <Lottie animationData={searchData} loop autoplay />
    </div>
  );
};
