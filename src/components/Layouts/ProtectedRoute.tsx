"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";

import { useAuth } from "@/providers/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="w-full h-[98vh] flex justify-center items-center">
        <Spinner />
      </div>
    ); // You can use a Spinner here
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
