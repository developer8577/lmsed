import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import "dotenv/config";
import connectDB from "../configs/mongodb.js";

const seedOneCourse = async () => {
    try {
        await connectDB();

        // 1. Clear existing courses
        await Course.deleteMany({});
        console.log("Cleared existing courses.");

        // 2. Clear enrolled courses from Users (optional but cleaner)
        await User.updateMany({}, { $set: { enrolledCourses: [] } });
        console.log("Cleared user enrollments.");

        // 3. Create the Single Course
        // Finding an educator to assign (or create one)
        let educator = await User.findOne({ webhooks_clerkId: "educator_1" });
        // Note: You might want to find *any* user or a specific one. 
        // For now, let's pick the first user or create a dummy.
        // Actually, let's just pick the first user found or create a placeholder ID if none.
        if (!educator) {
            educator = await User.findOne({});
        }

        const courseData = {
            courseTitle: "Complete Web Development Bootcamp",
            courseDescription: "Become a full-stack web developer with this comprehensive course.",
            courseThumbnail: "https://via.placeholder.com/600x400?text=Course+Thumbnail", // Placeholder or from S3
            coursePrice: 49.99,
            isPublished: true,
            discount: 20,
            courseContent: [
                {
                    chapterId: "chap_1",
                    chapterOrder: 1,
                    chapterTitle: "Introduction",
                    chapterContent: [
                        {
                            lectureId: "lec_1",
                            lectureTitle: "Welcome to the Course",
                            lectureDuration: 120, // seconds
                            lectureUrl: "videos/intro.mp4", // S3 Key
                            isPreviewFree: true,
                            lectureOrder: 1
                        },
                        {
                            lectureId: "lec_2",
                            lectureTitle: "Course Structure",
                            lectureDuration: 300,
                            lectureUrl: "videos/structure.mp4", // S3 Key
                            isPreviewFree: false,
                            lectureOrder: 2
                        }
                    ]
                }
            ],
            educator: educator ? educator._id : new mongoose.Types.ObjectId(), // Fallback
            enrolledStudents: []
        };

        const newCourse = await Course.create(courseData);
        console.log(`Course created: ${newCourse.courseTitle} (${newCourse._id})`);

        process.exit();

    } catch (error) {
        console.error("Error seeding course:", error);
        process.exit(1);
    }
};

seedOneCourse();
