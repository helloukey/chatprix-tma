import Lottie from "lottie-react";
import searchData from "@/assets/searching.json";

export const LottieSearch = () => {
  return (
    <div className="w-full">
      <Lottie animationData={searchData} loop autoplay />
    </div>
  );
};
