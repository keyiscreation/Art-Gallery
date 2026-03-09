"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "react-toastify";
import Text from "@/components/ui/Text";
// import Button from "@/components/ui/Button";
import Spinner from "../ui/Spinner";

// const ADMIN_EMAIL = "keyiscreation1@gmail.com";
const DIGIT_COUNT = 4;

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Lock = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-lock h-5 w-5"
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
};

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const [sendCodeStatus, setSendCodeStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [verifyError, setVerifyError] = useState<string>("");
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setVerifyError("");
    if (value && index < DIGIT_COUNT - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, DIGIT_COUNT);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setVerifyError("");
    const nextEmpty = newDigits.findIndex((d) => !d);
    focusInput(nextEmpty === -1 ? DIGIT_COUNT - 1 : nextEmpty);
  };

  const handleSendCode = useCallback(async () => {
    setSendCodeStatus("sending");
    setVerifyError("");
    try {
      const res = await fetch("/api/admin-send-code", { method: "POST" });
      if (res.ok) {
        setSendCodeStatus("sent");
      } else {
        setSendCodeStatus("error");
      }
    } catch {
      setSendCodeStatus("error");
    }
  }, []);

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== DIGIT_COUNT) {
      setVerifyError("Please enter all 4 digits.");
      return;
    }
    setVerifying(true);
    setVerifyError("");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/admin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let data: { customToken?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        toast.error("Recheck the code.");
        onClose();
        setVerifying(false);
        setDigits(Array(DIGIT_COUNT).fill(""));
        return;
      }

      if (!res.ok) {
        toast.error("Recheck the code.");
        onClose();
        setVerifying(false);
        setDigits(Array(DIGIT_COUNT).fill(""));
        return;
      }

      if (!data.customToken) {
        toast.error("Recheck the code.");
        onClose();
        setVerifying(false);
        setDigits(Array(DIGIT_COUNT).fill(""));
        return;
      }

      await signInWithCustomToken(auth, data.customToken);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Auth timeout")),
          8000,
        );
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            clearTimeout(timeout);
            unsubscribe();
            resolve();
          }
        });
      });

      onClose();
      router.replace("/admin-panel");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          toast.error("Request timed out. Please try again.");
        } else if (err.message === "Auth timeout") {
          toast.error("Verification took too long. Please try again.");
        } else {
          toast.error("Recheck the code.");
        }
      } else {
        toast.error("Recheck the code.");
      }
      onClose();
      setVerifying(false);
      setDigits(Array(DIGIT_COUNT).fill(""));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[450px] bg-white/95 rounded-[20px] px-4 py-6 shadow-xl border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-start gap-2">
            <Lock />
            <Text as="h2" className="font-bold text-black text-xl">
              Admin Access
            </Text>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-black/70 hover:text-black text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[#a1a1a1] font-newCourier text-[14px] mb-3">
          Enter PIN code to access admin panel
        </p>

        <p className="text-black/80 text-sm mb-4">
          To log in to the panel, request the shortcode via{" "}
          <button
            type="button"
            onClick={handleSendCode}
            className="text-black font-semibold underline underline-offset-1 hover:no-underline cursor-pointer"
          >
            email
          </button>
          .
        </p>

        {sendCodeStatus === "sent" && (
          <p className="text-green-400 text-sm mb-4">
            Code sent! Check your email.
          </p>
        )}
        {sendCodeStatus === "error" && (
          <p className="text-red-400 text-sm mb-4">
            Failed to send code. Try again.
          </p>
        )}
        {sendCodeStatus === "sending" && (
          <p className="text-black/90 text-sm mb-4">
            Sending code to your email…
          </p>
        )}

        <div className="flex gap-2 justify-center mb-4">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-white border-2 border-[#d1d5db] text-center text-black font-semibold text-lg focus:outline-none focus:border-black transition-[border-color] duration-200"
            />
          ))}
        </div>

        {verifyError && (
          <p className="text-red-400 text-sm mb-4 text-center">{verifyError}</p>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || digits.join("").length !== DIGIT_COUNT}
          className="w-full flex justify-center mb-5 mt-5 items-center hover:bg-black/90 font-semibold h-[40px] rounded-[6px] bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? <Spinner className="text-[20px]" /> : "Unlock"}
        </button>

        <p className="text-[#a1a1a1] font-newCourier text-sm text-center">
          Hint: Press Ctrl+Shift+A to open this dialog
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;
