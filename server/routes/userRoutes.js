import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyPurchase, getAffiliateStats, requestPayout } from '../controllers/userController.js'
import { protectUser } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/data', protectUser, getUserData)
userRouter.get('/enrolled-courses', protectUser, userEnrolledCourses)
userRouter.post('/purchase', protectUser, purchaseCourse)
userRouter.post('/update-course-progress', protectUser, updateUserCourseProgress)
userRouter.post('/get-course-progress', protectUser, getUserCourseProgress)
userRouter.post('/add-rating', protectUser, addUserRating)
userRouter.post('/verify-purchase', protectUser, verifyPurchase)
userRouter.get('/get-affiliate-stats', protectUser, getAffiliateStats)
userRouter.post('/request-payout', protectUser, requestPayout)

export default userRouter;