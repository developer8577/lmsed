import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-20 md:px-40 px-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-gray-900"
      >
        Learn from the best
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-sm md:text-base text-gray-500 mt-3"
      >
        Explore our highest-rated courses taught by top instructors across tech, business, design, and more.
      </motion.p>

      <div className="grid grid-cols-auto gap-6 md:my-16 my-10">
        {allCourses.slice(0, 4).map((course, idx) => (
          <CourseCard key={idx} course={course} />
        ))}
      </div>

      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="text-gray-700 hover:text-white hover:bg-indigo-600 border border-gray-300 px-10 py-3 rounded-full transition-all"
      >
        Explore course
      </Link>
    </div>
  );
};

export default CoursesSection;
