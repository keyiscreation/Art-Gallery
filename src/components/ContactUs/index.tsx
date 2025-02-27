"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import axios from "axios";

import Text from "../ui/Text";

import imgleft from "@/public/images/contactus.png";
import Button from "../ui/Button";

type OrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};
const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData, " form data");
    try {
      const res = await axios.post("/api/contactus", formData);
      const data = res?.data;

      if (data && data.message === "Email Sent Successfully") {
        alert("Email sent successfully");
        setLoading(false);
      } else {
        throw new Error(data?.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Email sent Error");
    }
  };

  return (
    <div className="px-5">
      <Text as="h1" className="text-black text-center">
        Contact Us
      </Text>

      <hr className="border-[0.5px] border-black/50 w-full my-5 max-w-[1284px] mx-auto" />

      <div className="flex tab:flex-wrap  w-full max-w-[1284px] mx-auto gap-16 mob:gap-8  items-center mt-10 pb-20">
        <div className="w-full max-w-[740px]">
          <Image src={imgleft} alt="" width={740} height={832} />
        </div>

        <div className="w-full max-w-[452px] ">
          <Text className="text-[38px] text-black  font-futurapt font-bold leading-[48.7px]">
            {" "}
            Say Hey!
          </Text>

          <Text className="text-[18px] text-black leading-[23.08px] font-light mt-5">
            Fill out the form below, or email me at nate@nateinthewild.com
          </Text>
          <Text className="text-[18px] text-black leading-[23.08px] font-light mt-5 mb-8">
            For brand inquiries, email Nate@outdoorinfluence.co
          </Text>

          <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
            <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-3">
              Name <span className="text-[10px]"> (required) </span>
            </Text>
            <div className="flex mob:block w-full gap-5 justify-between mb-3">
              {/* First Name */}

              <div className="w-full max-w-[272.22px] mob:max-w-full">
                <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-2">
                  First Name
                </Text>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  // placeholder="First Name"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[54px] w-full text-[15px] text-[#000000]  font-light placeholder:text-[#00000033] placeholder:text-[16px]"
                />
              </div>

              {/* Last Name */}
              <div className="w-full max-w-[272.22px] mob:max-w-full">
                <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-2">
                  Last Name
                </Text>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  // placeholder="Last Name"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[54px] w-full text-[15px] text-[#000000] font-light placeholder:text-[#00000033] placeholder:text-[16px]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-2">
                Email <span className="text-[10px]"> (required) </span>
              </Text>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="off"
                //   placeholder="Email"
                className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[54px] w-full text-[15px] text-[#000000]  font-light placeholder:text-[#00000033] placeholder:text-[16px]"
              />
            </div>

            <div className="mb-3">
              <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-2">
                Subject <span className="text-[10px]"> (required) </span>
              </Text>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                autoComplete="off"
                //   placeholder=" Street Address"
                className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[54px] w-full text-[15px] text-[#000000]  font-light placeholder:text-[#00000033] placeholder:text-[16px]"
              />
            </div>
            <div className="mb-3">
              <Text className="text-[16px] text-[#000000] font-futuraBT font-light mb-2">
                Message <span className="text-[10px]"> (required) </span>
              </Text>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                autoComplete="off"
                // placeholder="Enter your message..."
                className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[120px] w-full text-[15px] text-[#000000] font-light placeholder:text-[#00000033] placeholder:text-[16px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-20 mob:mt-10 bg-black max-w-[154px] rounded-[5px] text-white flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
