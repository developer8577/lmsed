import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={"/course/" + course._id}
        onClick={() => scrollTo(0, 0)}
        className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block"
      >

        {/* Thumbnail */}
        <div className="relative">
          <img
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
            src={course.courseThumbnail}
          />
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold shadow">
            {course.week || "4"} Weeks
          </div>
        </div>

        <div className="p-5 text-left">

          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
            {course.courseTitle}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {course.educator?.name || "Estreet"}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-2 mt-3">
            <p className="font-bold text-amber-500">
              {calculateRating(course)}
            </p>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-4 h-4"
                />
              ))}
            </div>

            <p className="text-gray-400 text-sm">
              ({course.courseRatings.length})
            </p>
          </div>

          {/* Price + Enroll */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <p className="text-xl font-bold text-gray-900">
              {currency}
              {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
            </p>

            <span className="text-indigo-600 font-medium text-sm border border-indigo-200 bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition">
              Enroll
            </span>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
