import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();
    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// update course
export const updateCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    const parsedCourseData = await JSON.parse(courseData);
    const courseId = parsedCourseData.courseId; // Expecting courseId in the data

    if (!courseId) {
      return res.json({ success: false, message: "Course ID missing" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    if (course.educator !== educatorId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update fields
    course.courseTitle = parsedCourseData.courseTitle;
    course.courseDescription = parsedCourseData.courseDescription;
    course.coursePrice = parsedCourseData.coursePrice;
    course.discount = parsedCourseData.discount;
    course.courseContent = parsedCourseData.courseContent;


    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      course.courseThumbnail = imageUpload.secure_url;
    }

    await course.save();

    res.json({ success: true, message: "Course Updated" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Get educator Dashboard data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);
    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });
    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );
    // Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Get enrolled Students data
export const getEnrolledStudentsData = async (req, res) => {

  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')
    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));
    res.json({ success: true, enrolledStudents })

  } catch (error) {
    res.json({ success: false, message: error.message });

  }
}
// Upload Video to Cloudinary
export const uploadVideo = async (req, res) => {
  try {
    const videoFile = req.file;
    if (!videoFile) {
      return res.json({ success: false, message: "Video Not Attached" });
    }
    const result = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
    });
    res.json({ success: true, videoUrl: result.secure_url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
