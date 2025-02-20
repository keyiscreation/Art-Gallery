"use client";
import { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import FifthSection from "@/components/Home/FifthSection";
import ForthSection from "@/components/Home/ForthSection";
import HeroSection from "@/components/Home/HeroSection";
import SecondSection from "@/components/Home/SecondSection";
import SixthSection from "@/components/Home/SixthSection";
import ThirdSection from "@/components/Home/ThirdSection";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardContents = [
    HeroSection,
    SecondSection,
    ThirdSection,
    ForthSection,
    FifthSection,
    SixthSection,
  ];

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { scale: 1, boxShadow: "none" }, // Initial state (normal size, no glow)
          {
            scale: 1,
            boxShadow: "0px -20px 100px rgba(255, 255, 255, 0.3)", // Glow effect
            scrollTrigger: {
              trigger: card,
              start: "top 80%", // When the section enters the viewport
              end: "top 30%", // When it's in the middle
              scrub: true,
              toggleActions: "play reverse play reverse", // Smooth scaling in/out
              onEnter: () => {
                // Apply effect to the current section
                gsap.to(card, {
                  scale: 1,
                  boxShadow: "0px -20px 100px rgba(255, 255, 255, 0.3)",
                });

                // Reset previous section
                if (cardRefs.current[index - 1]) {
                  gsap.to(cardRefs.current[index - 1], {
                    scale: 1,
                    boxShadow: "none",
                  });
                }
              },
              onLeaveBack: () => {
                // Reset effect when scrolling back
                gsap.to(card, {
                  scale: 1,
                  boxShadow: "none",
                });

                // Reapply effect to the previous section when scrolling up
                if (cardRefs.current[index - 1]) {
                  gsap.to(cardRefs.current[index - 1], {
                    scale: 1,
                    boxShadow: "0px -20px 100px rgba(255, 255, 255, 0.3)",
                  });
                }
              },
            },
          }
        );
      }
    });
  }, []);

  return (
    <div>
      <Navbar />

      <div className="flex  justify-center relative w-full" id="what-we-do">
        <div className="relative w-full">
          {cardContents.map((Component, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-full min-h-screen flex items-center sticky top-0 "
            >
              <div className="h-full tab:h-[80%] mob:h-auto w-full mob:pb-[25px] rounded-[24px]">
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
