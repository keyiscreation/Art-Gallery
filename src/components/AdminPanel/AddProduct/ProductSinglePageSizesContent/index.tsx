// components/TextEditor.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Text from "@/components/ui/Text";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }); // Using react-quill-new

import "react-quill-new/dist/quill.snow.css"; // Import Quill styles
import Button from "@/components/ui/Button";

const TextEditor = () => {
  const [editorContent, setEditorContent] = useState("");
  const [savedContent, setSavedContent] = useState<string | null>(null); // State to hold saved content

  const docId = "unique-id"; // The document ID you want to fetch from Firestore

  // Fetch the content from Firestore when the component loads
  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, "sizes", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const content = docSnap.data()?.content || "";
        setSavedContent(content); // Set the saved content to be displayed
        setEditorContent(content); // Set the content in the editor as well
      } else {
        console.log("No such document!");
      }
    };

    fetchContent();
  }, []);

  // Save the content to Firestore
  const handleSave = async () => {
    if (!editorContent) return;

    try {
      const docRef = doc(db, "sizes", docId); // Save under a specific docId
      await setDoc(docRef, {
        content: editorContent,
        createdAt: new Date(),
      });

      alert("Content saved successfully!");
      setSavedContent(editorContent); // Update saved content to show in the UI
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Error saving content");
    }
  };

  return (
    <div className="w-full max-w-[1268px]">
      <Text className="font-newCourier text-[48px] font-bold text-center mb-10 text-black">
        Text Editor
      </Text>
      <ReactQuill
        className="w-full"
        value={editorContent} // Set the content of the editor
        onChange={setEditorContent} // Update the editor content as it changes
        theme="snow"
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { header: "3" }],
            [{ font: [] }],
            [{ align: [] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        }}
      />
      <Button
        className="bg-black text-white mt-10 h-[50px] rounded-lg"
        onClick={handleSave}>
        Save
      </Button>

      <Text className="font-newCourier text-[22px] font-bold text-left my-10 text-black">Saved Content</Text>
      {/* Display saved content */}
      <div className="font-normal text-[#000000] text-[20px] leading-[25.64px] mb-6 font-newCourier">
        {savedContent ? (
          <div
            dangerouslySetInnerHTML={{
              __html: savedContent,
            }}
          />
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
