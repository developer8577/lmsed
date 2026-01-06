import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Config for Authorized Requests was: { headers: { Authorization: `Bearer ${token}` } }
  // Since token is async now, we can't have a static config.

  // Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // fetch user data
  const fetchUserData = async () => {
    if (!user) return; // Wait for Clerk user
    try {
      const token = await getToken();
      if (!token) return;

      // Call Sync Endpoint (creates user if not exists)
      const { data } = await axios.post(backendUrl + "/api/auth/sync", {}, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        setUserData(data.user);
        if (data.user.role === "educator") {
          setIsEducator(true);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth Sync Error:", error);
      toast.error(error.message);
    }
  };

  // Fetch User enrolled courses
  const fetchUserEnrolledCourses = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses", { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchUserEnrolledCourses error:", error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      setUserData(null);
      setEnrolledCourses([]);
      setIsEducator(false);
    }
  }, [user]);


  // Average Rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    let total = 0;
    course.courseRatings.forEach((r) => (total += r.rating));
    return Math.floor(total / course.courseRatings.length);
  };

  // Chapter Duration
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Total Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Total Lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Function to calculate course duration
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    user,
    fetchAllCourses,
    getYouTubeId,
    fetchUserData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
