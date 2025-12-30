import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const Companies = () => {
  const logos = [
    assets.microsoft_logo,
    assets.walmart_logo,
    assets.accenture_logo,
    assets.adobe_logo,
    assets.paypal_logo,
  ];

  return (
    <div className="pt-20 pb-10 text-center">
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-gray-500 text-sm md:text-base tracking-wide"
      >
        Trusted by learners from the world’s top companies
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-8 md:mt-12"
      >
        {logos.map((logo, index) => (
          <motion.img
            key={index}
            whileHover={{ scale: 1.1 }}
            src={logo}
            alt="company"
            className="w-24 md:w-32 opacity-80 hover:opacity-100 transition"
          />
        ))}
      </motion.div>

    </div>
  );
};

export default Companies;
