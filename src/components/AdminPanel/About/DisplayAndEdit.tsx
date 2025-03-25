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

type AboutDataType = {
  id: string;
  title: string;
  intro: string;
  socialLinks: Record<string, string>;
  images: Record<string, string>;
};

const AboutDataDisplay = () => {
  const [aboutData, setAboutData] = useState<AboutDataType | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState<AboutDataType | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<
    Record<string, File | null>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "aboutData"));
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setAboutData({ id: docSnap.id, ...docSnap.data() } as AboutDataType);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditedData(aboutData);
    setEditing(true);
  };

  const handleDelete = async () => {
    if (!aboutData) return;
    await deleteDoc(doc(db, "aboutData", aboutData.id));
    setAboutData(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedData) {
      setEditedData({ ...editedData, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
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
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!editedData) return;
    const updatedImages = { ...editedData.images };

    for (const key in newImageFiles) {
      if (newImageFiles[key]) {
        const uploadedUrl = await uploadImageToCloudinary(newImageFiles[key]!);
        if (uploadedUrl) {
          updatedImages[key] = uploadedUrl;
        }
      }
    }

    const aboutRef = doc(db, "aboutData", editedData.id);
    await updateDoc(aboutRef, { ...editedData, images: updatedImages });
    setAboutData({ ...editedData, images: updatedImages });
    setEditing(false);
  };

  return (
    <div className="rounded-[12px] w-full max-w-[1268px] px-5">
      <div className="shadow-md p-8 rounded-[12px]">
        <Text className="text-center text-[57px] text-black font-medium">
          Uploaded Data
        </Text>
        <Text className="text-2xl font-bold text-center mb-5">About Me</Text>
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editedData?.title || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <textarea
              name="intro"
              value={editedData?.intro || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {Object.entries(editedData?.socialLinks || {}).map(
              ([key, value]) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={value}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData!,
                      socialLinks: {
                        ...editedData!.socialLinks,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              )
            )}
            {Object.entries(editedData?.images || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 w-full">
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
            ))}
            <button
              className="bg-green-500 text-white px-4 py-3 flex justify-center items-center mx-auto rounded w-[200px]"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        ) : (
          aboutData && (
            <div className="w-full">
              <Text className="text-[20px] font-light text-black mb-5">
                <span className="font-medium"> Title: </span> {aboutData.title}
              </Text>
              <Text className="mb-2 text-black font-light leading-[18px] text-[20px]">
                <span className="font-medium"> Description:</span>{" "}
                {aboutData.intro}
              </Text>

              <div className="flex justify-center gap-[100px]  flex-wrap">
                {Object.entries(aboutData.images || {}).map(([key, url]) => (
                  <Image
                    key={key}
                    src={url}
                    alt={key}
                    width={258}
                    height={258}
                  />
                ))}
              </div>
              <div className="mt-10">
                <Text className="text-[20px] text-black font-medium">
                  Social Media Links
                </Text>
                {Object.entries(aboutData.socialLinks).map(([key, link]) => (
                  <Text className="text-black text-[20px] font-light" key={key}>
                    {key}:{" "}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {link}
                    </a>
                  </Text>
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

export default AboutDataDisplay;
