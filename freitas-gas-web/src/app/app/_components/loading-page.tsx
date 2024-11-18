"use client";

import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="fixed bg-background top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <motion.div
        className="h-20 w-20 bg-primary rounded-[20%]"
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        animate={{
          scale: [1, 2, 1],
          rotate: 360,
          borderRadius: ["20%", "50%", "20%"],
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
