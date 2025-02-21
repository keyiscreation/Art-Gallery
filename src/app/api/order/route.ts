import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import { extname } from "path";

interface Product {
  title: string;
  image: string;
  price: number;
  quantity: number;
  slugtitle: string;
  pathnode: string;
}

export async function POST(request: NextRequest) {
  try {
    const formdata = await request.json();
    console.log(formdata); // Log formData to check its structure and values

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "developer@innovativemojo.com",
        pass: "tjjs zgqd koej xpvf",
      },
    });

    const grandTotal = formdata.cartValues.reduce(
      (total: number, product: Product) =>
        total + product.price * product.quantity,
      0
    );

    const attachments = formdata.cartValues.map((product: Product) => {
      const fileExtension = extname(product.pathnode); // Extracts ".png", ".jpg", ".pdf", etc.

      return {
        filename: `${product.title}${fileExtension}`, // Preserve original file extension
        path: path.join(
          process.cwd(),
          "public",
          "images",
          "store",
          product.pathnode
        ),
        cid: product.slugtitle,
      };
    });
    const productListHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
      <th style="border-bottom: 2px solid #000; text-align: left;">Image</th>
        <th style="border-bottom: 2px solid #000;  text-align: left;">Title</th>
        <th style="border-bottom: 2px solid #000;  text-align: left;">Quantity</th>
        <th style="border-bottom: 2px solid #000;  text-align: left;">Price</th>
      </tr>
      ${formdata.cartValues
        .map((product: Product) => {
          const totalPrice = product.price * product.quantity;

          return `
            <tr class="product-row">
            <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">
            <img src="cid:${product.slugtitle}" alt="${product.title}" style="max-width: 50px; height: auto;">
          </td>
              <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">${product.title}</td>
              <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">${product.quantity}</td>
              <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">$${totalPrice}</td>
            </tr>
          `;
        })
        .join("")}
      <tr>
        <td colspan="4" style="text-align: right; padding: 8px; margin-right:15px;"><strong>Grand Total: $${grandTotal}</strong></td>
      </tr>
    </table>
    `;

    //   <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: center;">
    //   <img src="${product.title}" alt="Image" style="max-width: 50px;">
    // </td>

    const mailOptionToYou = {
      from: "developer@innovativemojo.com",
      // from: formdata.email,
      to: "ART GAlLERY <developer@innovativemojo.com>",
      // to: "developer@innovativemojo.com",
      subject: " order",
      html: `
        <h3>New Contact Form Submission</h3>
        <ul>
          <li>firstName: ${formdata.firstName}</li>
          <li>lastName: ${formdata.lastName}</li>
          <li>email: ${formdata.email}</li>
          <li>streetAddress: ${formdata.streetAddress}</li>
          <li>state: ${formdata.state}</li>
          <li>zipCode: ${formdata.zipCode}</li>
          <div style="text-align: center; font-size:25px; padding: 8px;"> Order Details </div>
          ${productListHTML}
    </ul>
      `,
      attachments,
    };

    const mailOptionToUser = {
      from: "ART GAlLERY <developer@innovativemojo.com> ",

      to: formdata.email,
      subject: "Your order is placed",
      html: `
        <h3>Dear ${formdata.firstName} ${formdata.lastName},</h3>
        <p>Thank you for placing order. </p>
        <p>Best Regards,</p>
        <p>ART GAlLERY</p>
      `,
    };

    await transporter.sendMail(mailOptionToYou);
    await transporter.sendMail(mailOptionToUser);

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Send Email", error },
      { status: 500 }
    );
  }
}
