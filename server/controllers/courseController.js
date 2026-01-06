
import Course from "../models/Course.js";
import { generatePresignedUrl } from "../configs/aws.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).
            select(['-courseContent', '-enrolledStudents']).populate
            ({ path: 'educator' })

        for (const course of courses) {
            if (course.courseThumbnail && !course.courseThumbnail.startsWith('http')) {
                try {
                    course.courseThumbnail = await generatePresignedUrl(course.courseThumbnail);
                } catch (err) {
                    console.error("Error signing thumbnail:", err);
                }
            }
        }
        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//Get course by id
export const getCourseId = async (req, res) => {
    const { id } = req.params
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' })

        if (courseData.courseThumbnail && !courseData.courseThumbnail.startsWith('http')) {
            try {
                courseData.courseThumbnail = await generatePresignedUrl(courseData.courseThumbnail);
            } catch (err) {
                console.error("Error signing thumbnail:", err);
            }
        }

        // Iterate through chapters and lectures to sign URLs
        for (const chapter of courseData.courseContent) {
            for (const lecture of chapter.chapterContent) {
                if (lecture.lectureUrl) {
                    // Check if it's already a full URL (legacy Cloudinary/YouTube)
                    if (lecture.lectureUrl.startsWith('http') || lecture.lectureUrl.startsWith('https')) {
                        // Skip signing
                    } else {
                        // Assume lectureUrl is an S3 key. Sign it.
                        try {
                            lecture.lectureUrl = await generatePresignedUrl(lecture.lectureUrl);
                        } catch (err) {
                            console.error("Error signing URL:", err);
                        }
                    }
                }

                // Hide URL if not free preview
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            }
        }

        res.json({ success: true, courseData })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}
