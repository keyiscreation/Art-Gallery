import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";

import Text from "@/components/ui/Text";

import { db } from "@/firebase";

type ImageType = {
  HerosectionImage1: File | null;
  HerosectionImage2: File | null;
  SecondSection: File | null;
  ThirdSection: File | null;
  ForthSection1: File | null;
  ForthSection2: File | null;
  FifthSection: File | null;
  SixthSection: File | null;
};

// Upload image to Cloudinary
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "art-gallery");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Upload video to Cloudinary
const uploadVideoToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "art-gallery");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/auto/upload",
      formData
    );

    return response.data.secure_url;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Cloudinary video upload error:", error.response?.data);
    } else {
      console.error("Error uploading video:", error);
    }
    return null;
  }
};

const UploadHomeData = () => {
  const [images, setImages] = useState<ImageType>({
    HerosectionImage1: null,
    HerosectionImage2: null,
    SecondSection: null,
    ThirdSection: null,
    ForthSection1: null,
    ForthSection2: null,
    FifthSection: null,
    SixthSection: null,
  });
  const [secondSectionBtnTitle, setsecondSectionBtnTitle] =
    useState<string>("");
  const [secondSectionTitle, setsecondSectionTitle] = useState<string>("");
  const [thirdSectionTitle, setthirdSectionTitle] = useState<string>("");
  const [thirdSectionBtnTitle, setthirdSectionBtnTitle] = useState<string>("");
  const [fourthSectionTitle, setfourthSectionTitle] = useState<string>("");
  const [fourthSectionBtnTitle, setfourthSectionBtnTitle] =
    useState<string>("");
  const [fifthSectionTitle, setfifthSectionTitle] = useState<string>("");
  const [fifthSectionBtnTitle, setfifthSectionBtnTitle] = useState<string>("");
  const [sixthSectionTitle, setsixthSectionTitle] = useState<string>("");
  const [sixthSectionBtnTitle, setsixthSectionBtnTitle] = useState<string>("");

  const [heroSectionBgVideo, setHeroSectionBgVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    position: keyof ImageType
  ) => {
    if (e.target.files && e.target.files[0]) {
      setImages((prev) => ({ ...prev, [position]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [uploadedImages, heroVideoUrl] = await Promise.all([
        Promise.all(
          Object.entries(images).map(async ([key, file]) => {
            if (file) {
              return [key, await uploadImageToCloudinary(file)];
            }
            return [key, null];
          })
        ),
        heroSectionBgVideo
          ? uploadVideoToCloudinary(heroSectionBgVideo)
          : Promise.resolve(null),
      ]);

      const imageUrls = Object.fromEntries(uploadedImages);

      await addDoc(collection(db, "homeData"), {
        secondSectionBtnTitle,
        secondSectionTitle,
        thirdSectionTitle,
        thirdSectionBtnTitle,
        fourthSectionTitle,
        fourthSectionBtnTitle,
        fifthSectionBtnTitle,
        fifthSectionTitle,
        sixthSectionTitle,
        sixthSectionBtnTitle,
        heroSectionBgVideoUrl: heroVideoUrl,
        images: imageUrls,
      });

      alert("Data uploaded successfully!");
      setsecondSectionBtnTitle("");
      setsecondSectionTitle("");
      setthirdSectionBtnTitle("");
      setthirdSectionTitle("");
      setfourthSectionBtnTitle("");
      setfifthSectionTitle("");
      setsixthSectionBtnTitle("");
      setsixthSectionTitle("");
      setHeroSectionBgVideo(null);

      setImages({
        HerosectionImage1: null,
        HerosectionImage2: null,
        SecondSection: null,
        ThirdSection: null,
        ForthSection1: null,
        ForthSection2: null,
        FifthSection: null,
        SixthSection: null,
      });
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-[12px] w-full max-w-[1268px] my-[100px] px-5">
      <div className="shadow-md p-8 rounded-[12px]">
        <Text className="text-center text-[57px] text-black font-medium">
          Upload Home Data
        </Text>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-futurapt mb-1">
              Hero Section Bg Video
            </label>
            <input
              type="file"
              accept="video/*"
              required
              className="w-full p-2 border rounded-md font-futurapt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setHeroSectionBgVideo(e.target.files[0]);
                }
              }}
            />
            {heroSectionBgVideo && (
              <video
                src={URL.createObjectURL(heroSectionBgVideo)}
                controls
                className="mt-2 w-full max-h-[200px] rounded-md object-cover"
              />
            )}
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Second Section Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={secondSectionTitle}
              required
              onChange={(e) => setsecondSectionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Second Section Button Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={secondSectionBtnTitle}
              required
              onChange={(e) => setsecondSectionBtnTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Third Section Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={thirdSectionTitle}
              required
              onChange={(e) => setthirdSectionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Third Section Button Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={thirdSectionBtnTitle}
              required
              onChange={(e) => setthirdSectionBtnTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-futurapt mb-1">
              Fourth Section Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={fourthSectionTitle}
              required
              onChange={(e) => setfourthSectionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Fourth Section Button Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={fourthSectionBtnTitle}
              required
              onChange={(e) => setfourthSectionBtnTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Fifth Section Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={fifthSectionTitle}
              required
              onChange={(e) => setfifthSectionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Fifth Section Button Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={fifthSectionBtnTitle}
              required
              onChange={(e) => setfifthSectionBtnTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Sixth Section Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={sixthSectionTitle}
              required
              onChange={(e) => setsixthSectionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">
              Sixth Section Button Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={sixthSectionBtnTitle}
              required
              onChange={(e) => setsixthSectionBtnTitle(e.target.value)}
            />
          </div>

          <div>
            {Object.keys(images).map((key) => (
              <div key={key}>
                <label className="block font-futurapt mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full p-2 border rounded-md font-futurapt mb-2"
                  onChange={(e) => handleFileChange(e, key as keyof ImageType)}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="flex justify-center items-center text-[18px] font-normal leading-[23.08px] hover:opacity-85 transition duration-500 ease-in-out w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-[#000000]/90 text-white p-2 rounded-md
"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadHomeData;
