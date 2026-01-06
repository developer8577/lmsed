import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser, UserButton, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const becomeEducator = async () => {
    console.log("Become Educator Clicked. isEducator:", isEducator);
    try {
      if (isEducator) {
        console.log("Already educator, navigating...");
        navigate('/educator');
        return;
      }
      const token = await getToken();
      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log("Calling update-role API...");

      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } });
      console.log("API Response:", data);

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        console.log("Navigating to /educator...");
        navigate('/educator');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Become Educator Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-all duration-300 shadow-sm ${isCourseListPage ? "bg-white/80 border-b border-gray-200" : "bg-white/50 border-b border-white/20"
        }`}
    >
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer drop-shadow-sm"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {user && (
            <motion.div className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={becomeEducator}
                className="hover:text-primary transition-colors text-sm tracking-wide"
              >
                {isEducator ? 'Affiliate Dashboard' : 'Become an Affiliate'}
              </button>
              <Link
                to="/my-enrollments"
                className="hover:text-primary transition-colors text-sm tracking-wide"
              >
                My Enrollments
              </Link>
            </motion.div>
          )}

          {/* Right Side */}
          {user ? (
            <motion.div className="flex items-center gap-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="text-sm font-semibold">{user.fullName}</span>
              <UserButton />
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openSignIn()}
              className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
            >
              Login/Signup
            </motion.button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-3 text-gray-600">
          {user && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <button
                onClick={becomeEducator}
                className="hover:text-primary transition-colors"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              <Link to="/my-enrollments" className="hover:text-primary">
                My Enrollments
              </Link>
            </div>
          )}

          {user ? (
            <UserButton />
          ) : (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="user" className="w-6" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;