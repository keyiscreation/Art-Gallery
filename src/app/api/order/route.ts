// import { NextResponse, NextRequest } from "next/server";
// import nodemailer from "nodemailer";
// import QRCode from "qrcode";

// interface Product {
//   title: string;
//   price: number;
//   quantity: number;
//   slugtitle: string;
//   licenseNumber: number;
//   // QR link is expected here but is yet to be added in from the admin panel.
//   qrLink: string;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const formdata = await request.json();

//     console.log(formdata);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       auth: {
//         user: "developer@innovativemojo.com",
//         pass: "tjjs zgqd koej xpvf",
//       },
//     });

//     // Calculate grand total
//     const grandTotal = formdata.cartValues.reduce(
//       (total: number, product: Product) =>
//         total + product.price * product.quantity,
//       0
//     );

//     // Generate QR code attachments for each product
//     // NOTE: QR link is yet to be added in from the admin panel, so using a default placeholder.
//     const qrCodeAttachments = await Promise.all(
//       formdata.cartValues.map(async (product: Product) => {
//         // Use the provided qrLink if available, otherwise default to a placeholder message.
//         const qrText =
//           product.qrLink ||
//           "QR link is yet to be added in from the admin panel";
//         const qrCodeDataUrl = await QRCode.toDataURL(qrText);
//         const base64Data = qrCodeDataUrl.replace(
//           /^data:image\/png;base64,/,
//           ""
//         );
//         return {
//           filename: `${product.slugtitle}.png`,
//           content: base64Data,
//           encoding: "base64",
//           cid: `qr_${product.slugtitle}`,
//         };
//       })
//     );

//     // Generate product table rows
//     const productRows = formdata.cartValues
//       .map(
//         (product: Product) => `
//         <tr>
//           <td style="padding: 8px; border: 1px solid #ccc;">${
//             product.title
//           }</td>
//           <td style="padding: 8px; border: 1px solid #ccc;">${
//             product.quantity
//           }</td>
//           <td style="padding: 8px; border: 1px solid #ccc;">$${(
//             product.price * product.quantity
//           ).toFixed(2)}</td>
//           <td style="padding: 8px; border: 1px solid #ccc;">
//             <img src="cid:qr_${
//               product.slugtitle
//             }" alt="QR Code" style="width: 100px;">
//           </td>
//         </tr>
//       `
//       )
//       .join("");

//     const productListHTML = `
//       <table style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr>
//             <th style="padding: 8px; border: 1px solid #ccc;">Title</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Quantity</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">QR Code</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${productRows}
//           <tr>
//             <td colspan="3" style="padding: 8px; text-align: right; border: 1px solid #ccc;">
//               <strong>Grand Total:</strong>
//             </td>
//             <td style="padding: 8px; border: 1px solid #ccc;">
//               $${grandTotal.toFixed(2)}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     `;

//     // Email options for admin
//     const mailOptionToYou = {
//       from: "developer@innovativemojo.com",
//       to: "ART GALLERY <developer@innovativemojo.com>",
//       subject: "Order Confirmation",
//       html: `
//         <h3>New Order Received</h3>
//         <ul>
//           <li>First Name: ${formdata.firstName}</li>
//           <li>Last Name: ${formdata.lastName}</li>
//           <li>Email: ${formdata.email}</li>
//           <li>Street Address: ${formdata.streetAddress}</li>
//           <li>State: ${formdata.state}</li>
//           <li>Zip Code: ${formdata.zipCode}</li>
//         </ul>
//         <h4>Order Details</h4>
//         ${productListHTML}
//       `,
//       attachments: qrCodeAttachments,
//     };

//     // Email options for user
//     const mailOptionToUser = {
//       from: "ART GALLERY <developer@innovativemojo.com>",
//       to: formdata.email,
//       subject: "Your Order Confirmation",
//       html: `
//         <h3>Dear ${formdata.firstName} ${formdata.lastName},</h3>
//         <p>Thank you for placing your order. Below are your order details:</p>
//         ${productListHTML}
//         <p>Best Regards,</p>
//         <p><strong>ART GALLERY</strong></p>
//       `,
//       attachments: qrCodeAttachments,
//     };

//     await transporter.sendMail(mailOptionToYou);
//     await transporter.sendMail(mailOptionToUser);

//     return NextResponse.json(
//       { message: "Email Sent Successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return NextResponse.json(
//       { message: "Failed to Send Email", error },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

interface Product {
  title: string;
  price: number;
  quantity: number;
  slugtitle: string;
  licenseNumber: string; // licenseNumber is now a string
  qrLink: string;
}

export async function POST(request: NextRequest) {
  try {
    const formdata = await request.json();

    console.log(formdata);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "developer@innovativemojo.com",
        pass: "tjjs zgqd koej xpvf",
      },
    });

    // Calculate grand total
    const grandTotal = formdata.cartValues.reduce(
      (total: number, product: Product) =>
        total + product.price * product.quantity,
      0
    );

    // Generate QR code attachments for each product
    const qrCodeAttachments = await Promise.all(
      formdata.cartValues.map(async (product: Product) => {
        const qrText =
          product.qrLink ||
          "QR link is yet to be added in from the admin panel";
        const qrCodeDataUrl = await QRCode.toDataURL(qrText);
        const base64Data = qrCodeDataUrl.replace(
          /^data:image\/png;base64,/,
          ""
        );
        return {
          filename: `${product.slugtitle}.png`,
          content: base64Data,
          encoding: "base64",
          cid: `qr_${product.slugtitle}`,
        };
      })
    );

    // Generate product table rows with licenseNumber
    const productRows = formdata.cartValues
      .map(
        (product: Product) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">${
            product.title
          }</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${
            product.quantity
          }</td>
          <td style="padding: 8px; border: 1px solid #ccc;">$${(
            product.price * product.quantity
          ).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${
            product.licenseNumber
          }</td> <!-- Add licenseNumber to row -->
          <td style="padding: 8px; border: 1px solid #ccc;">
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
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ccc;">Title</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
            <th style="padding: 8px; border: 1px solid #ccc;">License Number</th> <!-- Add License Number header -->
            <th style="padding: 8px; border: 1px solid #ccc;">QR Code</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; border: 1px solid #ccc;">
              <strong>Grand Total:</strong>
            </td>
            <td style="padding: 8px; border: 1px solid #ccc;">
              $${grandTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    `;

    // Email options for admin
    const mailOptionToYou = {
      from: "developer@innovativemojo.com",
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
        <h4>Order Details</h4>
        ${productListHTML}
      `,
      attachments: qrCodeAttachments,
    };

    // Email options for user
    const mailOptionToUser = {
      from: "ART GALLERY <developer@innovativemojo.com>",
      to: formdata.email,
      subject: "Your Order Confirmation",
      html: `
        <h3>Dear ${formdata.firstName} ${formdata.lastName},</h3>
        <p>Thank you for placing your order. Below are your order details:</p>
        ${productListHTML}
        <p>Best Regards,</p>
        <p><strong>ART GALLERY</strong></p>
      `,
      attachments: qrCodeAttachments,
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
