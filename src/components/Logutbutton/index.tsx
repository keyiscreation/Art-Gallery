"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LogOutProps {
  className?: string;
}

const LogOutButton: React.FC<LogOutProps> = ({ className }) => {
  // const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // setLoading(true)
      await signOut(auth);
      // console.log("User logged out successfully");
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      // setLoading(false)
      localStorage.removeItem("user");
    }
  };

  return (
    <div>
      <Button
        className={cn(
          "bg-black text-white w-[200px] rounded-[12px]",
          className
        )}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
};

export default LogOutButton;
