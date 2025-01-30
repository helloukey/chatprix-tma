import dynamic from "next/dynamic";
import searchData from "@/assets/searching.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export const LottieSearch = () => {
  return (
    <div className="w-full">
      <Lottie animationData={searchData} loop autoplay />
    </div>
  );
};
