import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyPurchase, getAffiliateStats, requestPayout } from '../controllers/userController.js'
const userRouter = express.Router()
userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)
userRouter.post('/verify-purchase', verifyPurchase)
userRouter.get('/get-affiliate-stats', getAffiliateStats)
userRouter.post('/request-payout', requestPayout)
export default userRouter;