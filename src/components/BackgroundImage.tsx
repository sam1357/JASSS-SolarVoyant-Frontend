"use client";
import Image from "next/image";
import React from "react";

const BackgroundImage: React.FC = () => {
  return (
    <Image
      src="/home-bg.png"
      alt={"Background"}
      priority
      fill
      style={{
        objectFit: "cover",
      }}
    />
  );
};

export default BackgroundImage;
