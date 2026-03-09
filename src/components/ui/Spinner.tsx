import React from "react";
import { TbLoader } from "react-icons/tb";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <TbLoader
        className={`animate-spin ${className ?? "text-[54px]"}`}
      />
    </div>
  );
};

export default Spinner;
