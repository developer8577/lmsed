import React from "react";
import { motion } from "framer-motion";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-20 px-6 md:px-0">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-gray-900"
      >
        What our learners say
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="md:text-base text-gray-500 mt-3"
      >
        Transforming careers, building confidence, and helping thousands achieve their goals.
      </motion.p>

      <div className="grid grid-cols-auto gap-10 mt-16">
        {dummyTestimonial.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-black/5 overflow-hidden hover:-translate-y-2 transition-transform duration-300"
          >
            
            {/* User Header */}
            <div className="flex items-center gap-4 px-6 py-5 bg-gray-50/60 border-b">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{testimonial.name}</h1>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating & Feedback */}
            <div className="p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-4"
                    src={i < testimonial.rating ? assets.star : assets.star_blank}
                  />
                ))}
              </div>

              <p className="text-gray-600 mt-4 leading-relaxed">
                {testimonial.feedback}
              </p>
            </div>

            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 px-6 pb-5 font-medium underline"
            >
              
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
