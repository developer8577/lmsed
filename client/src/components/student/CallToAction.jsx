import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <div className="relative pt-20 pb-28 px-8 md:px-0 text-center overflow-hidden">

      {/* Gradient background mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50/40 to-white opacity-70"></div>

      {/* Decorative gradient blobs */}
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col items-center gap-6">

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl leading-snug"
        >
          Learn anything, anytime, anywhere
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-gray-600 max-w-xl text-sm md:text-lg"
        >
          Build real skills with interactive courses, expert educators, and a community-driven learning experience that keeps you growing daily.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mt-4"
        >
          <button onClick={() => navigate("/course-list")} className="px-10 py-3 rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:-translate-y-1 transition">
            Get Started
          </button>

          <button className="flex items-center gap-2 text-indigo-700 font-medium hover:underline hover:underline-offset-4">
            
            <img src={assets.arrow_icon} alt="arrow_icon" className="w-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default CallToAction;
