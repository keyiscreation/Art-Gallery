"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import Drawer from "@/components/ui/Drawer";
// import logo from "@/public/logo.png";
import cartbucket from "@/public/icons/bucketcart.svg";
import Text from "../ui/Text";
import useShoppingCart from "@/hooks/useShoppingCart";
import { useAtomValue } from "@/jotai/useAtomValue";

type CartItem = {
  id: number;
  quantity: number;
};
// Type for Navbar Links
type NavbarLink = {
  name: string;
  url: string;
};

// Type for Navbar Data
type NavbarDataType = {
  id: string;
  logoUrl: string;
  links: NavbarLink[];
};

const Navbar = () => {
  const [navbarData, setNavbarData] = useState<NavbarDataType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [isSticky, setIsSticky] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const [cartItems] = useAtomValue("cart");
  const { cartProducts } = useShoppingCart();

  const totalQuantity: number = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const fetchNavbarData = async () => {
      const querySnapshot = await getDocs(collection(db, "navbarData"));
      const fetchedData: NavbarDataType[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedData.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as NavbarDataType);
      });
      setNavbarData(fetchedData);
    };

    fetchNavbarData();
  }, []);

  useEffect(() => {
    // Fetch logo data from Firestore (assuming the logo data is in the `navbarData` collection)
    const fetchLogoData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "navbarData"));
        querySnapshot.forEach((docSnap) => {
          // Assuming the logo is stored in a `logoUrl` field in Firestore
          const fetchedLogoUrl = docSnap.data().logoUrl;
          setLogoUrl(fetchedLogoUrl); // Set the fetched logo URL to state
        });
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogoData();
  }, []);

  // console.log(navbarData);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isSticky ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="absolute min-h-[80px] bg-cover z-50 w-full  px-14 mob:px-5">
        <div className="flex justify-center items-center w-full min-h-[80px] ">
          <div className="relative max-w-[100%] min-h-[80px] w-full flex flex-wrap items-center justify-between mx-auto py-4">
            <div className="flex justify-between items-center w-full mob:px-5 pb-4">
              {/* dekstop navbar */}
              {logoUrl && (
                <>
                  <Link
                    href="/"
                    className="flex mob:justify-start xl:hidden max-w-[115.81px] space-x-3 mob:w-[140px] rtl:space-x-reverse"
                  >
                    <Image
                      src={logoUrl}
                      alt="Logo"
                      priority
                      width={138}
                      height={114}
                    />
                  </Link>
                </>
              )}

              <ul className="font-normal mob:absolute xl:hidden mob:top-[100px] items-center mob:px-4 mob:left-0 mob:w-full z-50 flex flex-col py-4 md:p-0 mt-4 gap-[92px] md:flex-row rtl:space-x-reverse md:mt-0 tab:bg-black">
                {navbarData[0]?.links.map((link, index) => (
                  <li key={`${link.url}-${index}`}>
                    <Link
                      href={link.url}
                      onClick={() => handleTabChange(link.url)}
                      className={`block text-[22px] font-newCourier font-semibold leading-[17.95px] text-white ${
                        activeTab === link.url ? " font-medium" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-[32px] xl:hidden">
                <Link href="/cart" className="relative max-w-[49px]">
                  <Image className="" src={cartbucket} alt="cartbucket" />
                  <div className="absolute bottom-[-10px] right-[-4px] bg-[#6E8E73] rounded-full py-[2px] px-[6px] ">
                    <Text className="text-[10px] font-newCourier font-semibold">
                      {totalQuantity}
                    </Text>
                    <Text className="text-[10px] font-newCourier font-bold hidden">
                      {cartProducts.length}
                    </Text>
                  </div>
                </Link>
                <div>
                  <Link
                    href="/store"
                    onClick={() => handleTabChange("/store")}
                    className={`flex items-center justify-center bg-[#FFFFFF]  rounded-[60px] text-[18px] text-[#000000] font-newCourier font-bold leading-[15.38px] ${
                      activeTab === "/store" ? " font-semibold" : ""
                    }`}
                  >
                    <Text className="text-black font-bold px-5 py-4 mt-[2px]">
                      SHOP NOW
                    </Text>
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
                  {logoUrl && (
                    <a href="/">
                      <Image
                        src={logoUrl}
                        alt="Logo"
                        priority
                        className="h-[70px] w-[70px]"
                        width={138}
                        height={114}
                      />
                    </a>
                  )}
                </div>
                <Drawer isOpen={isOpen} onClose={onClose}>
                  <ul className="font-normal w-full z-50 flex flex-col py-4 gap-2">
                    {navbarData[0]?.links.map((link, index) => (
                      <a
                        href={link.url}
                        key={`${link.url}-${index}`}
                        onClick={() => handleTabChange(link.url)}
                        className={`block text-[16px] font-futura font-normal leading-[17.95px] text-white ${
                          activeTab === link.url
                            ? "text-white font-medium"
                            : "text-white"
                        }`}
                      >
                        <li className="flex justify-center py-[15px] list-items mob:px-[25px] uppercase">
                          {link.name.toUpperCase()}
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
