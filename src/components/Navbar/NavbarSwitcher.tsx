"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavbarStore from "@/components/Navbar/NavbarStore";

export default function NavbarSwitcher() {
  const pathname = usePathname();

  // Use main Navbar (transparent) on store page
  if (pathname === "/store") {
    return <Navbar />;
  }

  // Use NavbarStore on all other pages
  return <NavbarStore />;
}
