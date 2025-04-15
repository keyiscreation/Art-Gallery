import React from "react";

import { cn } from "@/lib/utils";
interface ButtonProps {
  text?: string;
  children?: React.ReactNode; // Add children prop
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text = "Explore Music",
  children,
  className,
  type = "button",
  loading = false,
  // disabled,
  onClick,
}) => {
  return (
    <>
      <button
        type={type}
        disabled={loading}
        onClick={onClick}
        className={cn(
          "w-full flex justify-center font-newCourier items-center  bg-accent h-[62px] max-w-[273px] text-[20px] font-normal leading-[23.08px] text-[#000000] hover:opacity-85 transition duration-500 ease-in-out",
          className
        )}
      >
        {children || text} {/* Use children if available, otherwise use text */}
      </button>
    </>
  );
};

export default Button;
