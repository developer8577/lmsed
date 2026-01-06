import { PutObjectCommand } from "@aws-sdk/client-s3";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import fs from 'fs';
import s3Client from "../configs/aws.js";

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findByIdAndUpdate(userId, { role: 'educator' });
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

    // Upload Thumbnail to S3
    const fileStream = fs.createReadStream(imageFile.path);
    const contentType = imageFile.mimetype;
    const key = `thumbnails/${Date.now()}_${imageFile.originalname}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    newCourse.courseThumbnail = key; // Store Key on S3
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
      // Upload Thumbnail to S3
      const fileStream = fs.createReadStream(imageFile.path);
      const contentType = imageFile.mimetype;
      const key = `thumbnails/${Date.now()}_${imageFile.originalname}`;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      course.courseThumbnail = key;
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

// Upload Video to AWS S3
export const uploadVideo = async (req, res) => {
  try {
    const videoFile = req.file;
    if (!videoFile) {
      return res.json({ success: false, message: "Video Not Attached" });
    }

    const fileStream = fs.createReadStream(videoFile.path);
    const contentType = videoFile.mimetype;
    const key = `lectures/${Date.now()}_${videoFile.originalname}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return the Key so the frontend/controller can save it. 
    // The course controller will sign this key when fetching.
    res.json({ success: true, videoUrl: key });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
