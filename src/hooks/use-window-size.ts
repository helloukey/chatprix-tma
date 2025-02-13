import { useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  // Update width and height
  useLayoutEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  return { width, height };
};

export { useWindowSize };
