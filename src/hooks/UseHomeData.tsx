"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

type HomeDataType = {
  id: string;
  secondSectionTitle: string;
  secondSectionBtnTitle: string;
  thirdSectionTitle: string;
  thirdSectionBtnTitle: string;
  fourthSectionTitle: string;
  fourthSectionBtnTitle: string;
  fifthSectionTitle: string;
  fifthSectionBtnTitle: string;
  sixthSectionTitle: string;
  sixthSectionBtnTitle: string;
  images: Record<string, string>;
};

const useHomeData = () => {
  const [homeData, setHomeData] = useState<HomeDataType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "homeData"));
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setHomeData({ id: docSnap.id, ...docSnap.data() } as HomeDataType);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchData();
  }, []);

  return homeData;
};

export default useHomeData;
