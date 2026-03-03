"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

import Text from "../ui/Text";
import Button from "../ui/Button";

// import youtube from "@/public/icons/youtubewhite.svg";
import twiter from "@/public/icons/x-White.svg";
import insta from "@/public/icons/instagram-white.svg";
// import fb from "@/public/icons/facebook-white.svg";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!email) {
    //   alert("Please enter a valid email.");
    //   return;
    // }

    setLoading(true);

    try {
      const response = await axios.post("/api/newsletter", { email });

      if (response.status === 200) {
        alert("Successfully subscribed!");
        setEmail(""); // Clear input after successful submission
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 mob:px-5 bg-[#000000]">
      {/* <Text
        as="h2"
        className="text-center text-[40px] font-semibold mb-4 text-accent leading-[38.46px] "
      >
        Newsletter
      </Text>
      <Text
        as="h2"
        className="text-center text-[#FFFFFF] font-medium text-[20px] leading-[38.46px] mb-5"
      >
        Get notified when new projects drop.
      </Text>

      <form
        onSubmit={handleSubmit}
        action=""
        className="flex justify-center gap-[34px]"
      >
        <input
          placeholder="E-mail Address"
          type="email"
          value={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="px-3 border-[1px] border-[#FFFFFF] outline-none h-[60px] w-full max-w-[250px] text-[15px] text-[#000000] font-newCourier font-normal placehoder:text-[#000000] "
        />

        <Button
          type="submit"
          className="max-w-[146px]  bg-transparent border border-[#FFFFFF] text-[15px] text-[#FFFFFF] font-newCourier font-semibold hover:opacity-100"
        >
          {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </Button>
      </form> */}

      <Text className="text-white text-center mt-10 text-[20px] font-semibold leading-[25.64px]  ">
        Keyiscreation
      </Text>
      <Text className="text-white/70 text-center text-[18px] max-w-[800px] mx-auto my-4">
        Beautiful limited edition photographic prints. Each image comes with a certificate of authenticity and edition number.
      </Text>
      <Text className="text-white/70 italic text-center text-[16px] max-w-[800px] mx-auto my-8">
        In memory of my friend Þorleifur
      </Text>

      {/* <Text as="h1" className="text-center text-[40px] text-accent mt-10">
        Follow
      </Text> */}
      <div className="flex justify-center items-center gap-5 mt-5">
        {/* <Image
          className="w-[24.52px] h-[24.52px]"
          src={youtube}
          alt="youtube"
        /> */}

        {/* <Link href="https://x.com/keyiscreation?t=nfKjEi1hOGfy78NpZLZDRw&s=08">
          <Image
            className="w-[24.52px] h-[24.52px]"
            src={twiter}
            alt="twiter"
          />
        </Link> */}

        <Link className="text-[#F4C430] text-sm flex items-center gap-1" href="https://www.instagram.com/keyiscreation?igsh=MWhzcHJqeWN1N292dQ==">
          {/* <Image className="w-[24.52px] h-[24.52px]" src={insta} alt="insta" /> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-fg-b7rw67=":914.573:/App.tsx:893:17:30165:598:e:svg:etete"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" data-fg-b7rw68=":914.573:/App.tsx:904:19:30541:56:e:rect"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" data-fg-b7rw69=":914.573:/App.tsx:905:19:30616:59:e:path"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" data-fg-b7rw70=":914.573:/App.tsx:906:19:30694:46:e:line"></line></svg>
           @keyiscreation
        </Link>
        {/* <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" /> */}
      </div>
        <Text className="text-white/70  text-center text-[16px] mt-4">© 2025</Text>

      <div className="mt-10 h-px w-full max-w-[800px] mx-auto bg-white/30" />

      {/* <div className="mt-6 flex flex-col items-center justify-center gap-4 max-w-[1200px] mx-auto">

        <Link
          href="/admin-panel"
          className="border border-white/70 px-5 py-2 text-[13px] font-newCourier font-semibold text-white transition hover:bg-white hover:text-black"
        >
          ADMIN LOGIN
        </Link>
      </div> */}
    </div>
  );
};

export default Footer;
