"use client";
// FIXME: PLACEHOLDER - MIGHT BE REMOVED
import Image from "next/image";
import React from "react";

const BackgroundImage: React.FC = () => {
  return (
    <Image
      src="#"
      loader={() => {
        return "https://picsum.photos/1920/1080";
      }}
      alt={"Background"}
      priority
      fill
      style={{
        zIndex: "-999",
        objectFit: "cover",
      }}
    />
  );
};

export default BackgroundImage;
