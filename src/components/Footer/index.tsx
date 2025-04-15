import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

import Text from "../ui/Text";
import Button from "../ui/Button";

import youtube from "@/public/icons/youtube.svg";
import twiter from "@/public/icons/u_twitter.svg";
import insta from "@/public/icons/u_instagram.svg";
import fb from "@/public/icons/u_facebook-f.svg";

const Footer = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

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
    <div className="py-20 mob:px-5">
      <Text
        as="h2"
        className="text-center text-[30px] text-[#000000] leading-[38.46px] "
      >
        Newsletter
      </Text>
      <Text
        as="h2"
        className="text-center text-[#000000] font-medium text-[15px] leading-[38.46px] mb-5"
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
          className="px-3 border-[1px] border-[#000000] outline-none h-[60px] w-full max-w-[250px] text-[15px] text-[#000000] font-newCourier font-normal placehoder:text-[#000000] "
        />

        <Button
          type="submit"
          className="max-w-[146px] bg-transparent border border-[#000000] text-[15px] font-newCourier text-[#000000] font-semibold hover:opacity-100"
        >
          {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </Button>
      </form>

      <Text className="text-black text-center mt-10 text-[20px]">
        What you place on your walls reflects the world you want to see.
      </Text>
      <Text as="h1" className="text-center text-[#000000] mt-10 text-[40px]">
        Follow
      </Text>

      <div className="flex justify-center items-center gap-5 mt-5">
        <Image
          className="w-[24.52px] h-[24.52px]"
          src={youtube}
          alt="youtube"
        />
        <Image className="w-[24.52px] h-[24.52px]" src={twiter} alt="twiter" />
        <Image className="w-[24.52px] h-[24.52px]" src={insta} alt="insta" />
        <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
      </div>
    </div>
  );
};

export default Footer;
