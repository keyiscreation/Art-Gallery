"use client";

import { useEffect } from "react";
import { useAtomValue } from "@/jotai/useAtomValue";
import ScreenLoader from "@/components/ScreenLoader";

const MIN_LOADER_MS = 1500;

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useAtomValue("isLoading");

  useEffect(() => {
    let minElapsed = false;
    let loadFired = false;

    const tryHide = () => {
      if (minElapsed && loadFired) setIsLoading(false);
    };

    const minTimer = setTimeout(() => {
      minElapsed = true;
      tryHide();
    }, MIN_LOADER_MS);

    const onLoad = () => {
      loadFired = true;
      tryHide();
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        loadFired = true;
        tryHide();
      } else {
        window.addEventListener("load", onLoad);
      }
    } else {
      loadFired = true;
    }

    return () => {
      clearTimeout(minTimer);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", onLoad);
      }
    };
  }, [setIsLoading]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <>{children}</>;
}
