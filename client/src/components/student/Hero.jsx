import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-white via-blue-50/60 to-white pt-32 md:pt-44 pb-24 overflow-hidden">

      {/* Premium Gradient Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-32 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-extrabold leading-tight max-w-5xl text-gray-900
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight"
        >
          Accelerate Your Skills With  
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-2">
            World-Class Learning
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg md:text-xl"
        >
          Master industry-ready skills with curated courses, expert educators, and a global learning experience—all in one place.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl mt-10"
        >
          <div className="backdrop-blur-xl bg-white/40 shadow-lg shadow-indigo-200/40 rounded-2xl p-2">
            <SearchBar />
          </div>
        </motion.div>

        {/* Decorative Sketch */}
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          src={assets.sketch}
          alt="Sketch"
          className="hidden md:block absolute md:right-20 lg:right-32 top-56 w-36 opacity-80"
        />
      </div>
    </div>
  );
};

export default Hero;
