"use client";
import { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Home/HeroSection";
import SecondSection from "@/components/Home/SecondSection";
import ThirdSection from "@/components/Home/ThirdSection";
import ForthSection from "@/components/Home/ForthSection";
import FifthSection from "@/components/Home/FifthSection";
import SixthSection from "@/components/Home/SixthSection";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";

// Register the plugin
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
          { scale: 1,scrub: 2, boxShadow: "none", y: 0, x: 0 },
          {
            scale: 1,
            boxShadow: "0px -20px 100px rgba(255, 255, 255, 0.3)",
            y: 0,
            x: 0,
            scrub: 2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 30%",
              scrub: 1, // Make sure this is set to 1 or higher for smooth scroll effect
              toggleActions: "play reverse play reverse",
              onUpdate: (self) => {
                const progress = self.progress;

                // Apply scroll-based movement to the current section
                gsap.to(card, {
                  scale: 1,
                  y: 0,
                });

                // Move the previous section to the left and up, based on the scroll progress
                if (cardRefs.current[index - 1]) {
                  gsap.to(cardRefs.current[index - 1], {
                    y: -progress * 150, // Move previous section up
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

      <div className="flex justify-center relative w-full" id="what-we-do">
        <div className="relative w-full">
          {cardContents.map((Component, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-full min-h-screen flex items-center sticky top-0"
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
