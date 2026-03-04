"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";
import Image from "next/image";
import Text from "@/components/ui/Text";

type HomeDataType = {
  id: string;
  title: string;
  intro: string;
  secondSectionBtnTitle: string;
  secondSectionTitle: string;
  thirdSectionTitle: string;
  thirdSectionBtnTitle: string;
  fourthSectionTitle: string;
  fourthSectionBtnTitle: string;
  fifthSectionBtnTitle: string;
  fifthSectionTitle: string;
  sixthSectionTitle: string;
  sixthSectionBtnTitle: string;
  heroSectionBgVideoUrl: string;
  images: Record<string, string>;
};

const HomeDataDisplay = () => {
  const [homeData, setHomeData] = useState<HomeDataType | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState<HomeDataType | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<
    Record<string, File | null>
  >({});
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "homeData"));
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setHomeData({ id: docSnap.id, ...docSnap.data() } as HomeDataType);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditedData(homeData);
    setEditing(true);
  };

  const handleDelete = async () => {
    if (!homeData) return;
    await deleteDoc(doc(db, "homeData", homeData.id));
    setHomeData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedData) {
      setEditedData({ ...editedData, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    if (e.target.files?.[0]) {
      setNewImageFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
        formData,
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const uploadVideoToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duox5d29k/video/upload",
        formData,
      );

      return response.data.secure_url;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Cloudinary video upload error:",
          error.response?.data?.error?.message,
        );
      } else {
        console.error("Error uploading video:", error);
      }
      return null;
    }
  };

  const handleSave = async () => {
    if (!editedData) return;
    setLoading(true);
    const updatedImages = { ...editedData.images };

    for (const key in newImageFiles) {
      if (newImageFiles[key]) {
        const uploadedUrl = await uploadImageToCloudinary(newImageFiles[key]!);
        if (uploadedUrl) {
          updatedImages[key] = uploadedUrl;
        }
      }
    }

    let heroSectionBgVideoUrl = editedData.heroSectionBgVideoUrl || "";
    if (newVideoFile) {
      const uploadedVideoUrl = await uploadVideoToCloudinary(newVideoFile);
      if (uploadedVideoUrl) {
        heroSectionBgVideoUrl = uploadedVideoUrl;
      }
    }

    const homeRef = doc(db, "homeData", editedData.id);
    await updateDoc(homeRef, {
      ...editedData,
      images: updatedImages,
      heroSectionBgVideoUrl,
    });
    setHomeData({
      ...editedData,
      images: updatedImages,
      heroSectionBgVideoUrl,
    });
    setNewVideoFile(null);
    setEditing(false);
    setLoading(false);
  };

  return (
    <div className="rounded-[12px] w-full max-w-[1268px] px-5">
      <div className="shadow-md p-8 rounded-[12px]">
        <Text className="text-center text-[57px] text-black font-medium">
          Uploaded Data
        </Text>
        <Text className="text-2xl font-bold text-center mb-5">Home Data</Text>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block font-futurapt mb-1">
                Hero Section Bg Video
              </label>
              <input
                type="file"
                accept="video/*"
                className="border p-2 rounded w-full"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setNewVideoFile(e.target.files[0]);
                  }
                }}
              />
              {newVideoFile ? (
                <video
                  src={URL.createObjectURL(newVideoFile)}
                  controls
                  className="mt-2 w-full max-h-[200px] rounded-md object-cover"
                />
              ) : editedData?.heroSectionBgVideoUrl ? (
                <video
                  src={editedData.heroSectionBgVideoUrl}
                  controls
                  className="mt-2 w-full max-h-[200px] rounded-md object-cover"
                />
              ) : null}
            </div>

            <div>
              <label className="block font-futurapt mb-1">
                Second Section Title
              </label>
              <input
                type="text"
                name="secondSectionTitle"
                value={editedData?.secondSectionTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Second Section Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Second Section Button Title
              </label>
              <input
                type="text"
                name="secondSectionBtnTitle"
                value={editedData?.secondSectionBtnTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Second Section Button Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Third Section Title
              </label>
              <input
                type="text"
                name="thirdSectionTitle"
                value={editedData?.thirdSectionTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Third Section Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Third Section Button Title
              </label>
              <input
                type="text"
                name="thirdSectionBtnTitle"
                value={editedData?.thirdSectionBtnTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Third Section Button Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Fourth Section Title
              </label>
              <input
                type="text"
                name="fourthSectionTitle"
                value={editedData?.fourthSectionTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Fourth Section Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Fourth Section Button Title
              </label>
              <input
                type="text"
                name="fourthSectionBtnTitle"
                value={editedData?.fourthSectionBtnTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Fourth Section Button Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Fifth Section Title
              </label>
              <input
                type="text"
                name="fifthSectionTitle"
                value={editedData?.fifthSectionTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Fifth Section Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Fifth Section Button Title
              </label>
              <input
                type="text"
                name="fifthSectionBtnTitle"
                value={editedData?.fifthSectionBtnTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Fifth Section Button Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Sixth Section Title
              </label>
              <input
                type="text"
                name="sixthSectionTitle"
                value={editedData?.sixthSectionTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Sixth Section Title"
              />
            </div>
            <div>
              <label className="block font-futurapt mb-1">
                Sixth Section Button Title
              </label>
              <input
                type="text"
                name="sixthSectionBtnTitle"
                value={editedData?.sixthSectionBtnTitle || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Sixth Section Button Title"
              />
            </div>
            {Object.entries(editedData?.images || {}).map(([key, value]) => (
              <div key={key} className="flex flex-col w-full">
                <label className="block font-futurapt mb-1 text-black">
                  {key}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, key)}
                    className="border p-2 rounded w-full"
                  />
                  {newImageFiles[key] ? (
                    <Image
                      src={URL.createObjectURL(newImageFiles[key]!)}
                      alt={key}
                      width={64}
                      height={64}
                      className="rounded"
                    />
                  ) : (
                    <Image
                      src={value || ""}
                      alt={key}
                      width={64}
                      height={64}
                      className="rounded"
                    />
                  )}
                </div>
              </div>
            ))}

            <button
              className="bg-green-500 text-white px-4 py-3 flex justify-center items-center mx-auto rounded w-[200px]"
              onClick={handleSave}
            >
              {loading ? "loading . . ." : "Save"}
            </button>
          </div>
        ) : (
          homeData && (
            <div className="w-full">
              {/* Displaying all the data */}
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">Second Section Title: </span>{" "}
                {homeData.secondSectionTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">Third Section Title: </span>{" "}
                {homeData.thirdSectionTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">Fourth Section Title: </span>{" "}
                {homeData.fourthSectionTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">Fifth Section Title: </span>{" "}
                {homeData.fifthSectionTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">Sixth Section Title: </span>{" "}
                {homeData.sixthSectionTitle}
              </Text>

              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">
                  Second Section Button Title:{" "}
                </span>{" "}
                {homeData.secondSectionBtnTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">
                  Third Section Button Title:{" "}
                </span>{" "}
                {homeData.thirdSectionBtnTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">
                  Fourth Section Button Title:{" "}
                </span>{" "}
                {homeData.fourthSectionBtnTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">
                  Fifth Section Button Title:{" "}
                </span>{" "}
                {homeData.fifthSectionBtnTitle}
              </Text>
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium">
                  Sixth Section Button Title:{" "}
                </span>{" "}
                {homeData.sixthSectionBtnTitle}
              </Text>
              {/* Repeat for other fields as needed */}

              {/* Display Hero Video */}
              {homeData.heroSectionBgVideoUrl && (
                <div className="mb-5">
                  <Text className="text-[20px] font-medium text-black mb-2">
                    Hero Section Bg Video:
                  </Text>
                  <video
                    src={homeData.heroSectionBgVideoUrl}
                    controls
                    className="w-full max-h-[300px] rounded-md object-cover"
                  />
                </div>
              )}

              {/* Display Images */}
              <div className="flex flex-wrap justify-center gap-[40px]">
                {Object.entries(homeData.images || {}).map(([key, url]) => (
                  <div key={key} className="relative">
                    <Image
                      src={url}
                      alt={key}
                      width={258}
                      height={258}
                      className="object-contain"
                    />
                    <Text className="text-black text-[18px]">{key}</Text>{" "}
                    {/* Display the key next to the image */}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-2 justify-center">
                <button
                  className="bg-blue-500 text-white px-3 py-3 w-[200px] rounded"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-3 w-[200px] rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomeDataDisplay;
