"use client";
import { useEffect, useRef } from "react";
// import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import SecondSection from "@/components/Home/SecondSection";
import ThirdSection from "@/components/Home/ThirdSection";
import ForthSection from "@/components/Home/ForthSection";
import FifthSection from "@/components/Home/FifthSection";
import SixthSection from "@/components/Home/SixthSection";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import FooterStore from "@/components/Footer/FooterStore";
// import Text from "@/components/ui/Text";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardContents = [
    SecondSection,
    ThirdSection,
    ForthSection,
    FifthSection,
    SixthSection,
  ];

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      if (isMobile) {
        // Mobile: starts scaling the moment the image enters from the bottom,
        // reaches full size exactly when its center hits the screen center
        gsap.fromTo(
          card,
          { scale: 0.65, transformOrigin: "center center" },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom", // image just enters from the bottom edge
              end: "center center", // image center aligns with screen center → full size
              scrub: 1,
            },
          },
        );
      } else {
        // Desktop: original parallax / stack effect — unchanged
        gsap.fromTo(
          card,
          { scale: 0.95, scrub: 2, boxShadow: "none", y: 0, x: 0 },
          {
            scale: 1,
            boxShadow: "0px -20px 100px rgba(255, 255, 255, 0.3)",
            y: 0,
            x: 0,
            scrub: 2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 10%",
              scrub: 1,
              toggleActions: "play reverse play reverse",
              onUpdate: (self) => {
                const progress = self.progress;
                const focusedProgress = Math.max(
                  0,
                  Math.min(1, (progress - 0.4) / 0.6),
                );

                gsap.to(card, {
                  scale: 0.95 + focusedProgress * 0.05,
                  y: 0,
                });

                if (cardRefs.current[index - 1]) {
                  gsap.to(cardRefs.current[index - 1], {
                    y: -progress * 150,
                  });
                }
              },
            },
          },
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-black">
      <Navbar />

      <HeroSection />
      {/* <Text className="text-center text-accent items-center uppercase mt-8 mb-20">
        What you place on your walls reflects the world you want to see{" "}
      </Text> */}

      <div className="flex justify-center relative w-full" id="what-we-do">
        <div className="relative w-full">
          {cardContents.map((Component, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-full h-[500px] overflow-hidden md:h-auto md:overflow-visible md:min-h-screen flex items-center md:sticky md:top-0"
            >
              <div className="h-full w-full mob:pb-[25px] rounded-[24px]">
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>

      <FooterStore />
    </div>
  );
}
