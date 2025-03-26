"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import Text from "../ui/Text";

import youtube from "@/public/icons/youtube.svg";
import twiter from "@/public/icons/u_twitter.svg";
import insta from "@/public/icons/u_instagram.svg";
import fb from "@/public/icons/u_facebook-f.svg";
import Spinner from "../ui/Spinner";

type AboutDataType = {
  id: string;
  title: string;
  intro: string;
  socialLinks: Record<string, string>;
  images: Record<string, string>;
};
const AboutMe = () => {
  const [aboutData, setAboutData] = useState<AboutDataType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "aboutData"));
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setAboutData({ id: docSnap.id, ...docSnap.data() } as AboutDataType);
      }
    };
    fetchData();
  }, []);

  if (!aboutData) return <Spinner />;
  // console.log("about data:", aboutData);
  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <div className="flex justify-between px-5">
          <Text
            as="h1"
            className="text-black text-center mob:text-[24px] mob:leading-[30.77px] mob:mb-5"
          >
            {aboutData?.title}
          </Text>

          <div className="flex justify-center items-center gap-5 mt-5 mob:hidden">
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={youtube}
              alt="youtube"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={twiter}
              alt="twiter"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={insta}
              alt="insta"
            />
            <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
          </div>
        </div>
        <hr className="border-[0.5px] border-black/50 w-full my-5 mob:hidden" />

        <Text className="text-black text-[16px] leading-[20px] px-5">
          {aboutData?.intro.split(/<br\s*\/?>/g).map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Text>
        {/* mob social */}
        <div className="mob:block hidden py-5">
          <div className="flex justify-center items-center gap-5 mt-5 ">
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={youtube}
              alt="youtube"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={twiter}
              alt="twiter"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={insta}
              alt="insta"
            />
            <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
          </div>
        </div>
        {/* mob social end */}

        {aboutData?.images && (
          <div className="flex gap-5 mob:gap-2 mt-6 mb-20 px-5">
            <Image
              className="mob:max-w-[23%]"
              src={aboutData.images.left}
              alt="left"
              width={298}
              height={440}
            />
            <Image
              className="mob:max-w-[50%]"
              src={aboutData.images.center}
              alt="center"
              width={646.82}
              height={862.42}
            />
            <Image
              className="mob:max-w-[23%]"
              src={aboutData.images.right}
              alt="right"
              width={298}
              height={440}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMe;
