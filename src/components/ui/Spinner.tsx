import React from "react";
import { TbLoader } from "react-icons/tb";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <TbLoader className="animate-spin text-[54px] " />
    </div>
  );
};

export default Spinner;
