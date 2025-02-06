"use client";

import { useEffect, useCallback } from "react";

type Props = {
  id: string;
};

const useMountAd = ({ id }: Props) => {
  useEffect(() => {
    // @ts-expect-error undefined
    if (window[`show_${id}`]) {
      return;
    }

    const script = document.createElement("script");
    script.src = "//whephiwums.com/vignette.min.js";
    script.dataset.zone = id;
    script.dataset.sdk = `show_${id}`;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  const showAd = useCallback(async () => {
    // @ts-expect-error undefined
    if (window[`show_${id}`]) {
      // @ts-expect-error undefined
      await window[`show_${id}`]();
      // Add here the function that should be executed after viewing the ad
    }
  }, [id]);

  return showAd;
};

export { useMountAd };
