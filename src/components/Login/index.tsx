"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // console.log("login successful");
      router.push("/admin-panel");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError(error.message);
        console.log("error in login", error);
      } else {
        setLoginError("An unknown error occurred.");
        console.log("error in login", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full my-10 min-h-[79vh] flex items-center justify-center bg-primary tab:px-5">
      <div className="w-full  max-w-[700px] bg-[#000000]/90 py-16 rounded-[20px] flex flex-col items-center justify-center tab:px-5">
        <Text as="h1" className="font-bold text-white mb-[10px] capitalize">
          Log In
        </Text>
        <form
          autoComplete="off"
          className="mt-1 flex justify-center w-full max-w-[400px] items-center flex-col"
          onSubmit={handleSubmit}
        >
          <input
            className="w-[100%] h-[56px] py-2 px-6 rounded-[6px] bg-[#F2F5FA] text-secondary font-medium leading-6 mb-4 input-styling focus:input-box-shadow duration-500 "
            type="email"
            name="email"
            placeholder="EMAIL"
            required
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
          />
          <input
            className="w-[100%] h-[56px] py-2 px-6 rounded-[6px] bg-[#F2F5FA] text-secondary font-medium leading-6  mb-4 input-styling  focus:input-box-shadow duration-300 "
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            disabled={loading}
            className=" h-[50px] hover:bg-cyan/70 duration-500 py-[14px] w-[200px] mb-3  bg-cyan px-[20px] rounded-[6px] text-black bg-white font-semibold leading-6 text-center "
          >
            {loading ? "Loading" : "Log In"}
          </Button>

          {loginError && (
            <p className="mt-1 text-center text-[14px] font-normal text-red-500">
              Invalid Credentials. Pls recheck your Email and Password
            </p>
          )}

          <div className="flex justify-between w-full mt-5">
            <Text className="text-[14px] text-white font-medium mt-2">
              <Link href="/" className="text-white underline">
                Forgot Password?
              </Link>
            </Text>
            <Text className="text-[14px] text-white font-medium mt-2">
              <Link href="/" className="text-white underline">
                Back to Home
              </Link>
            </Text>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
