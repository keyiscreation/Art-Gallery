import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const formdata = await request.json();
    // console.log(formdata, "form data");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "developer@innovativemojo.com",
        pass: "tjjs zgqd koej xpvf",
      },
    });

    // Email to admin
    const mailOptionToYou = {
      from: "developer@innovativemojo.com",
      // to: "ART GALLERY <Chadilrauf@gmail.com>",
      to: "ART GALLERY <developer@innovativemojo.com>",
      subject: "Form Submission",
      html: `
        <h3>New Form Submission</h3>
        <ul>
          <li>First Name: ${formdata.firstName}</li>
          <li>Last Name: ${formdata.lastName}</li>
          <li>Email: ${formdata.email}</li>
          <li>Subject: ${formdata.subject}</li>
          <li>Message: ${formdata.message}</li>
        </ul>
      `,
    };

    // Updated email for user
    const mailOptionToUser = {
      from: "ART GALLERY <developer@innovativemojo.com>",
      to: formdata.email,
      subject: "Form Submission",
      html: `
      <h3>Dear ${formdata.firstName} ${formdata.lastName},</h3>
      <p>Thank you for contacting us, We will get back to you soon.</p>
      <p>Best Regards,</p>
      <p><strong>ART GALLERY</strong></p>
    `,
    };
    await transporter.sendMail(mailOptionToYou);
    await transporter.sendMail(mailOptionToUser);

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to Send Email", error },
      { status: 500 }
    );
  }
}
