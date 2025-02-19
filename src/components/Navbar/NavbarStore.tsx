"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

import Drawer from "@/components/ui/Drawer";
import logo from "@/public/logo.png";
// import linkedinsvg from "../../../public/linkedin.svg";
// import linkedinsvgmob from "../../../public/linkedin1.svg";
// import usersvg from "../../../public/user.svg";
// import loginsvg from "../../../public/login.svg";
import cartbucket from "@/public/icons/bucketcart.svg";
import Text from "../ui/Text";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/"); // Initial active tab set to home

  // Load activeTab from local storage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save activeTab to local storage whenever it changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  useEffect(() => {
    if (isOpen) {
      const listItems = document.querySelectorAll(".list-items");
      gsap.set(listItems, { opacity: 0, x: 20 });
      gsap.to(listItems, {
        delay: 0.5,
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <div className="relative bg-[#000000] mb-16">
      <nav className="relative min-h-[80px] bg-cover z-50 w-full  px-14 mob:px-5">
        <div className="flex justify-center items-center w-full min-h-[80px] ">
          <div className="relative max-w-[100%] min-h-[80px] w-full flex flex-wrap items-center justify-between mx-auto py-4">
            <div className="flex justify-between items-center w-full mob:px-5 pb-4">
              {/* dekstop navbar */}
              <Link
                href="/"
                className="flex mob:justify-start xl:hidden max-w-[146.81px] space-x-3 mob:w-[140px] rtl:space-x-reverse"
              >
                <Image
                  src={logo}
                  alt="Flowbite Logo"
                  priority
                  // className="w-[140px] h-[114px]"
                  // width={138}
                  // height={114}
                />
              </Link>

              <ul className="font-normal mob:absolute xl:hidden mob:top-[100px] items-center mob:px-4 mob:left-0 mob:w-full z-50 flex flex-col py-4 md:p-0 mt-4 gap-[32px] md:flex-row rtl:space-x-reverse md:mt-0 tab:bg-black">
                <li>
                  <Link
                    href="/store"
                    onClick={() => handleTabChange("/")}
                    className={`block text-[14px] font-futurapt font-normal leading-[17.95px] text-white ${
                      activeTab === "/" ? " font-medium" : "text-white"
                    }`}
                  >
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => handleTabChange("/about")}
                    className={`block text-[14px] font-futurapt font-normal leading-[17.95px] text-white ${
                      activeTab === "/about" ? " font-medium" : "text-white"
                    }`}
                  >
                    ABOUT
                  </Link>
                </li>

                <li>
                  <Link
                    href="/"
                    onClick={() => handleTabChange("/")}
                    className={`block text-[14px] font-futurapt font-normal leading-[17.95px] text-white ${
                      activeTab === "" ? " font-medium" : "text-white"
                    }`}
                  >
                    CONTACT
                  </Link>
                </li>

                {/* <li className="xl:hidden">
                  <Link href="/contact">
                    <button className="uppercase px-[23px] h-[44px] rounded-[4px] border text-[16px] font-inter font-bold leading-[25.5px] text-[#FFFFFF]">
                      CONTACT
                    </button>
                  </Link>
                </li> */}
              </ul>

              <div className="flex items-center gap-[32px] xl:hidden">
                <div className="relative max-w-[29px]">
                  <Image className="" src={cartbucket} alt="cartbucket" />
                  <div className="absolute bottom-[-10px] right-[-4px] bg-[#6E8E73] rounded-full py-[2px] px-[6px] ">
                    <Text className="text-[10px] font-futurapt font-bold ">
                      0
                    </Text>
                  </div>
                </div>
                <div>
                  <Link
                    href="/store"
                    onClick={() => handleTabChange("/")}
                    className={`flex items-center justify-center bg-[#FFFFFF] w-[112.48px] h-[51.2px] rounded-[60px] text-[12px] text-[#000000] font-futurapt font-medium  leading-[15.38px] ${
                      activeTab === "/" ? " font-semibold" : ""
                    }`}
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>

              {/* dekstop navbar  end*/}

              {/* mobile navbar */}
              <div className="hidden xl:block w-full">
                <div className="flex w-full justify-between items-center flex-row-reverse">
                  <div
                    className="relative cursor-pointer flex"
                    onClick={onOpen}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center w-10 h-10 justify-center text-sm  text-[#fff] rounded-lg"
                    >
                      <span className="sr-only">Open main menu</span>
                      <svg
                        className="w-[30px] h-[30px]"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1h15M1 7h15M1 13h15"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src={logo}
                    alt="Flowbite Logo"
                    priority
                    className="h-[70px] w-[70px]"
                    // width={90}
                    // height={114}
                  />
                </div>
                <Drawer isOpen={isOpen} onClose={onClose}>
                  <ul className="font-normal w-full z-50 flex flex-col py-4 gap-2">
                    {["/", "/about", "/store"].map((path) => (
                      <a
                        href={path}
                        key={path}
                        onClick={() => handleTabChange(path)}
                        className={`block text-[16px] font-futura font-normal leading-[17.95px] text-white  ${
                          activeTab === path
                            ? "text-white font-medium"
                            : "text-white"
                        }`}
                      >
                        <li className="flex justify-center py-[15px] list-items mob:px-[25px] uppercase">
                          {path === "/"
                            ? "Home"
                            : path === "/store"
                            ? "Shop"
                            : path.slice(1).toUpperCase()}
                        </li>
                        <hr className="w-full border border-[#FFFFFF] my-2" />
                      </a>
                    ))}
                  </ul>
                </Drawer>
              </div>

              {/* mobile navbar */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
