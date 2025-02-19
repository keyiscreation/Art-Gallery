import Footer from "@/components/Footer";
import FifthSection from "@/components/Home/FifthSection";
import ForthSection from "@/components/Home/ForthSection";
import HeroSection from "@/components/Home/HeroSection";
import SecondSection from "@/components/Home/SecondSection";
import SixthSection from "@/components/Home/SixthSection";
import ThirdSection from "@/components/Home/ThirdSection";


export default function Home() {
  return (
    <>
   <div className="overflow-hidden">
   <HeroSection/>
   <SecondSection/>
   <ThirdSection/>
   <ForthSection/>
   <FifthSection/>
   <SixthSection/>
   <Footer/>
   </div>
    </>
  );
}
