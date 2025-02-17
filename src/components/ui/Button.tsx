import React from "react";

import { cn } from "@/lib/utils";
interface ButtonProps {
  text?: string;
  children?: React.ReactNode; // Add children prop
  className?: string;
  type?: "button" | "submit" | "reset"; 
  loading?: boolean; 
}


const Button: React.FC<ButtonProps> = ({
  text = "Explore Music",
  children,
  className,
  type = "button",
  loading = false,
}) => {
  return (
    <>
      <button
      type={type}
      disabled={loading}
        className={cn(
          "w-full flex justify-center items-center  bg-accent  h-[62px] max-w-[273px] text-[18px] font-normal leading-[23.08px] text-[#000000] ",
          className
        )}
      >
        {children || text} {/* Use children if available, otherwise use text */}
      </button>
    </>
  );
};

export default Button;
