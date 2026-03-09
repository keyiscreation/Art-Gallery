import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { admindb } from "@/lib/utils/firebaseadmin";

const ADMIN_EMAIL = "chadilrauf@gmail.com";
const OTP_COLLECTION = "admin_otp";
const OTP_EXPIRY_MINUTES = 10;

function generateFourDigitCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST() {
  try {
    const appPassword = "foel vztq hmji trnq";
    if (!appPassword) {
      return NextResponse.json(
        {
          message: "Server misconfiguration: ADMIN_EMAIL_APP_PASSWORD not set",
        },
        { status: 500 },
      );
    }

    const code = generateFourDigitCode();

    await admindb
      .collection(OTP_COLLECTION)
      .doc("admin")
      .set({
        code,
        email: ADMIN_EMAIL,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: ADMIN_EMAIL,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `Art Gallery <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: "Your Admin Login Code",
      html: `
        <p>Your 4-digit admin login code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin send code error:", error);
    return NextResponse.json(
      { message: "Failed to send code" },
      { status: 500 },
    );
  }
}
