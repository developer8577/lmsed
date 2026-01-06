import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator, uploadVideo, updateCourse, uploadVideoUrl } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator, protectUser } from '../middlewares/authMiddleware.js';
const educatorRouter = express.Router()
// Add Educator Role
educatorRouter.get('/update-role', protectUser, updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.post('/update-course', upload.single('image'), protectEducator, updateCourse)
educatorRouter.post('/upload-video', upload.single('video'), protectEducator, uploadVideo)
educatorRouter.post('/upload-video-url', protectEducator, uploadVideoUrl)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)
export default educatorRouter;