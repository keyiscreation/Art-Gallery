import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import { extname } from "path";
import QRCode from "qrcode"; // Import QRCode package

interface Product {
  title: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  slugtitle: string;
  pathnode: string;
  qrLink: string;
}

export async function POST(request: NextRequest) {
  try {
    const formdata = await request.json();
    console.log(formdata, "form data");

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

    // Attachments for product images
    const productAttachments = formdata.cartValues.map((product: Product) => {
      const fileExtension = extname(product.pathnode);
      return {
        filename: `${product.title}${fileExtension}`,
        path: path.join(
          process.cwd(),
          "public",
          "images",
          "store",
          product.pathnode
        ),
        cid: product.slugtitle, // Content-ID for embedding image in email
      };
    });

    // Generate QR codes and store as attachments
    const qrCodeAttachments = await Promise.all(
      formdata.cartValues.map(async (product: Product) => {
        const qrCodeDataUrl = await QRCode.toDataURL(product.qrLink);
        const base64Data = qrCodeDataUrl.replace(
          /^data:image\/png;base64,/,
          ""
        );

        return {
          filename: `${product.slugtitle}.png`,
          content: base64Data,
          encoding: "base64",
          cid: `qr_${product.slugtitle}`, // Content ID for referencing in HTML
        };
      })
    );

    // Generate product rows with QR code images
    const productRows = formdata.cartValues
      .map(
        (product: Product) => `
        <tr class="product-row">
       <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">
         <img src="cid:${product.slugtitle}" alt="${
          product.title
        }" style="max-width: 80px; height: auto;">
         <br>
          <a href="cid:${product.slugtitle}" download="${product.title}.jpg"
         style="display: inline-block; margin-top: 5px; padding: 5px 10px; background: #000000; color: #fff; text-decoration: none; border-radius: 5px;">
         Download
         </a>
        </td>

          <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">${
            product.title
          }</td>
          <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">${
            product.quantity
          }</td>
          <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">${
            product.size
          }</td>
          <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">$${
            product.price * product.quantity
          }</td>
          <td style="border-bottom: 1px solid #ccc; padding: 8px; text-align: left;">
            <img src="cid:qr_${
              product.slugtitle
            }" alt="QR Code" style="width: 100px;">
          </td>
        </tr>
      `
      )
      .join("");

    const productListHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border-bottom: 2px solid #000; text-align: left;">Image</th>
          <th style="border-bottom: 2px solid #000; text-align: left;">Title</th>
          <th style="border-bottom: 2px solid #000; text-align: left;">Quantity</th>
          <th style="border-bottom: 2px solid #000; text-align: left;">Size</th>
          <th style="border-bottom: 2px solid #000; text-align: left;">Price</th>
          <th style="border-bottom: 2px solid #000; text-align: left;">Product QR Code</th>
        </tr>
        ${productRows}
        <tr>
          <td colspan="4" style="text-align: right; padding: 8px;"><strong>Grand Total: $${grandTotal}</strong></td>
        </tr>
      </table>
    `;

    // Email to admin
    const mailOptionToYou = {
      from: "developer@innovativemojo.com",
      // to: "ART GALLERY <Chadilrauf@gmail.com>",
      to: "ART GALLERY <developer@innovativemojo.com>",
      subject: "Order Confirmation",
      html: `
        <h3>New Order Received</h3>
        <ul>
          <li>First Name: ${formdata.firstName}</li>
          <li>Last Name: ${formdata.lastName}</li>
          <li>Email: ${formdata.email}</li>
          <li>Street Address: ${formdata.streetAddress}</li>
          <li>State: ${formdata.state}</li>
          <li>Zip Code: ${formdata.zipCode}</li>
        </ul>
        <div style="text-align: center; font-size: 20px; padding: 10px;">Order Details</div>
        ${productListHTML}
      `,
      attachments: [...productAttachments, ...qrCodeAttachments],
    };

    const userProductListHTML = formdata.cartValues
      .map(
        (product: Product) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; text-align: center;">
          <p style="font-weight: bold; font-size: 16px;">${product.title}</p>
          <img src="cid:${product.slugtitle}" alt="${product.title}" style="max-width: 150px; height: auto; display: block; margin: auto;">
          <img src="cid:qr_${product.slugtitle}" alt="QR Code" style="width: 150px; display: block; margin: auto;">
          <p>Size: ${product.size}</p>
          <p><strong>Scan Your QR Code Below:</strong></p>
        </div>
      `
      )
      .join("");

    // Updated email for user
    const mailOptionToUser = {
      from: "ART GALLERY <developer@innovativemojo.com>",
      to: formdata.email,
      subject: "Your Order Confirmation",
      html: `
      <h3>Dear ${formdata.firstName} ${formdata.lastName},</h3>
      <p>Thank you for placing your order. Below are your order details:</p>
      ${userProductListHTML}
      <p>Best Regards,</p>
      <p><strong>ART GALLERY</strong></p>
    `,
      attachments: [...productAttachments, ...qrCodeAttachments], // Attach images & QR codes
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
