import React from "react";
import Image from "next/image";

interface LogoProps {
  size: number;
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  return <Image priority src={"/logo.png"} alt="Logo" width={size} height={size} />;
};

export default Logo;
