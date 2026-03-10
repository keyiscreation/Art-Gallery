import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { admindb } from "@/lib/utils/firebaseadmin";

const ADMIN_EMAIL = "keyiscreation@gmail.com";
const OTP_COLLECTION = "admin_otp";

function getExpiresAt(data: Record<string, unknown> | undefined): Date {
  const raw = data?.expiresAt;
  if (!raw) return new Date(0);
  if (raw instanceof Date) return raw;
  if (typeof (raw as { toDate?: () => Date }).toDate === "function") {
    return (raw as { toDate: () => Date }).toDate();
  }
  if (typeof raw === "number") return new Date(raw);
  return new Date(0);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;
    console.log(
      "[admin-verify] Request received, code length:",
      code ? String(code).length : 0,
    );

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 },
      );
    }

    const normalizedCode = code.replace(/\s/g, "").trim();
    if (normalizedCode.length !== 4) {
      return NextResponse.json(
        { message: "Invalid code length" },
        { status: 400 },
      );
    }

    const doc = await admindb.collection(OTP_COLLECTION).doc("admin").get();
    if (!doc.exists) {
      return NextResponse.json(
        { message: "Invalid or expired code" },
        { status: 401 },
      );
    }

    const data = doc.data() as Record<string, unknown> | undefined;
    const storedCode = data?.code as string | undefined;
    const expiresAt = getExpiresAt(data);

    if (storedCode !== normalizedCode) {
      return NextResponse.json({ message: "Invalid code" }, { status: 401 });
    }

    if (new Date() > expiresAt) {
      return NextResponse.json(
        { message: "Code has expired" },
        { status: 401 },
      );
    }

    const auth = admin.auth();
    const user = await auth.getUserByEmail(ADMIN_EMAIL);
    const customToken = await auth.createCustomToken(user.uid);

    return NextResponse.json({ customToken }, { status: 200 });
  } catch (error) {
    console.error("Admin verify error:", error);
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("no user record") ||
      message.includes("user-not-found")
    ) {
      return NextResponse.json(
        {
          message:
            "Admin user not found in Firebase Auth. Please create the user with email sebiz.gpt0623.dev56@gmail.com first.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 },
    );
  }
}
