"use client";

import React, { useState } from "react";

// import ProtectedRoute from "../Layouts/ProtectedRoute";
import Text from "../ui/Text";

import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import UploadAboutData from "./About/UploadData";
import LogOutButton from "../Logutbutton";
import AboutDataDisplay from "./About/DisplayAndEdit";
import UploadHomeData from "./HomePage/UploadHomeData";
import HomePageEditor from "./HomePage/DisplayAndEdit";
import UploadNavbarData from "./Navbar/UploadData";
import NavbarDataManager from "./Navbar/DisplayandEdit";

const AdminPanel = () => {
  const [addProduct, setaddProduct] = useState(false);
  const [homePage, sethomePage] = useState(true);
  const [aboutPage, setaboutPage] = useState(false);
  const [navbarData, setNavbarData] = useState(false);
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex w-full justify-between max-w-[1268px] mt-[100px]">
        <Text as="h1" className="text-black">
          Admin Panel
        </Text>
        <LogOutButton />
      </div>
      <div className="flex w-full justify-between max-w-[1268px] mt-[100px] bg-slate-500 rounded-[10px]">
        <Text
          className=" text-[20px] bg-black p-3 rounded-[10px] cursor-pointer"
          onClick={() => {
            sethomePage(true);
            setaddProduct(false);
            setaboutPage(false);
            setNavbarData(false);
          }}
        >
          Home Page
        </Text>
        <Text
          className=" text-[20px] bg-black p-3 rounded-[10px] cursor-pointer"
          onClick={() => {
            sethomePage(false);
            setaddProduct(false);
            setaboutPage(true);
            setNavbarData(false);
          }}
        >
          About Page
        </Text>
        <Text
          className=" text-[20px] bg-black p-3 rounded-[10px] cursor-pointer"
          onClick={() => {
            sethomePage(false);
            setaddProduct(true);
            setaboutPage(false);
            setNavbarData(false);
          }}
        >
          Product Page
        </Text>
        <Text
          className=" text-[20px] bg-black p-3 rounded-[10px] cursor-pointer"
          onClick={() => {
            sethomePage(false);
            setaddProduct(false);
            setaboutPage(false);
            setNavbarData(true);
          }}
        >
          Navbar
        </Text>
      </div>

      {addProduct && (
        <>
          <AddProduct />
          <ProductList />
        </>
      )}

      {aboutPage && (
        <>
          <UploadAboutData />
          <AboutDataDisplay />
        </>
      )}

      {homePage && (
        <>
          <UploadHomeData />
          <HomePageEditor />
        </>
      )}

      {navbarData && (
        <>
          <UploadNavbarData />
          <NavbarDataManager />
        </>
      )}
    </div>
  );
};

export default AdminPanel;
