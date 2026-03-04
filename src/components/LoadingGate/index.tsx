"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "@/jotai/useAtomValue";
import ScreenLoader from "@/components/ScreenLoader";

const MIN_LOADER_MS = 3000;

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useAtomValue("isLoading");
  const [heroVideoReady] = useAtomValue("heroVideoReady");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let minElapsed = false;
    let loadFired = false;

    const tryHide = () => {
      if (minElapsed && loadFired && heroVideoReady) setIsLoading(false);
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
  // Re-runs when heroVideoReady flips to true so tryHide can fire
  }, [setIsLoading, heroVideoReady]);

  // Remove loader from DOM only after the full fade-out completes
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setVisible(false), 1800);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [isLoading]);

  return (
    <>
      {/* Page renders in background so video buffers; fades in after loader starts fading */}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: isLoading
            ? "none"
            : "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1) 300ms",
        }}
      >
        {children}
      </div>

      {/* Loader fades out slowly for a felt cross-dissolve */}
      {visible && (
        <div
          className="pointer-events-none"
          style={{
            opacity: isLoading ? 1 : 0,
            transition: isLoading
              ? "none"
              : "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ScreenLoader />
        </div>
      )}
    </>
  );
}
