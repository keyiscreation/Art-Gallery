import React from "react";

import Text from "../ui/Text";

import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import LogOutButton from "../Logutbutton";

const AdminPanel = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex w-full justify-between max-w-[1268px] mt-[100px]">
        <Text as="h1" className="text-black">
          Admin Panel
        </Text>
        <LogOutButton />
      </div>
      <AddProduct />
      <ProductList />
    </div>
  );
};

export default AdminPanel;
