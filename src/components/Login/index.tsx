"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

const DIGIT_COUNT = 6;

const Login = () => {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [passwordDigits, setPasswordDigits] = useState<string[]>(
    Array(DIGIT_COUNT).fill("")
  );
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const loginPassword = passwordDigits.join("");

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handlePasswordDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...passwordDigits];
    newDigits[index] = value;
    setPasswordDigits(newDigits);
    if (value && index < DIGIT_COUNT - 1) {
      focusInput(index + 1);
    }
  };

  const handlePasswordKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !passwordDigits[index] && index > 0) {
      e.preventDefault();
      const newDigits = [...passwordDigits];
      newDigits[index - 1] = "";
      setPasswordDigits(newDigits);
      focusInput(index - 1);
    }
  };

  const handlePasswordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, DIGIT_COUNT);
    if (!/^[\x20-\x7E]*$/.test(pasted)) return;
    const newDigits = [...passwordDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setPasswordDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    focusInput(nextEmpty === -1 ? DIGIT_COUNT - 1 : nextEmpty);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    if (loginPassword.length !== DIGIT_COUNT) {
      setLoginError("Please enter all 6 digits of your password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
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
          <label className="sr-only" htmlFor="password-digit-0">
            PASSWORD (6 digits)
          </label>
          <div className="flex gap-2 mb-4 w-full justify-center" role="group" aria-label="Password - enter 6 characters">
            {passwordDigits.map((digit, index) => (
              <input
                key={index}
                id={index === 0 ? "password-digit-0" : undefined}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="password"
                inputMode="text"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Password digit ${index + 1}`}
                value={digit}
                onChange={(e) =>
                  handlePasswordDigitChange(index, e.target.value)
                }
                onKeyDown={(e) => handlePasswordKeyDown(index, e)}
                onPaste={handlePasswordPaste}
                className="password-digit-box w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-white border-2 border-[#d1d5db] text-center text-secondary font-semibold text-lg focus:outline-none focus:border-black focus:ring-0 transition-[border-color] duration-200"
              />
            ))}
          </div>
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
