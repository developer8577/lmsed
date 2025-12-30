// Redesigned CourseDetails.jsx (World-Class E-Learning UI)
// All logic, backend, API calls, and component behavior remain unchanged.
// Only UI/UX, styling, spacing, shadows, and overall layout updated.

import React, { useContext, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const CourseDetails = () => {
  const { id } = useParams()
  // Affiliate Code Capture
  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref) {
      sessionStorage.setItem('affiliateCode', ref)
    }
  }, [location.search])

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('lms_dark_mode') === 'true'
    } catch {
      return false
    }
  })

  const {
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
    getToken,
    getYouTubeId,
    user
  } = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) setCourseData(data.courseData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
    try {
      if (!user) return toast.warn('Login to enroll')
      if (isAlreadyEnrolled) return toast.warn('Already Enrolled')

      const token = await getToken()
      const affiliateCode = sessionStorage.getItem('affiliateCode');
      const { data } = await axios.post(
        backendUrl + '/api/user/purchase',
        { courseId: courseData._id, affiliateCode },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        window.location.replace(data.session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  useEffect(() => {
    try {
      localStorage.setItem('lms_dark_mode', darkMode ? 'true' : 'false')
      if (darkMode) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch { }
  }, [darkMode])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  if (!courseData) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${darkMode ? 'dark' : ''} font-outfit min-h-screen bg-gradient-to-br from-[#ECF5FF] via-[#F9FBFF] to-[#D6ECFF] text-gray-900 dark:text-gray-100`}
    >

      {/* ===================== HERO ===================== */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">

          <div className="space-y-4 max-w-3xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-5xl font-extrabold leading-tight"
            >
              {courseData.courseTitle}
            </motion.h1>

            <p
              className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + '…' }}
            />

            <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <img src={assets.star} className="w-4" />
                <strong>{calculateRating(courseData)}</strong>
                <span className="text-gray-500">({courseData.courseRatings.length})</span>
              </div>

              <span className="hidden md:block">•</span>

              <div className="flex items-center gap-2">
                <img src={assets.time_clock_icon} className="w-4" />
                {calculateCourseDuration(courseData)}
              </div>

              <span className="hidden md:block">•</span>

              <div className="flex items-center gap-2">
                <img src={assets.lesson_icon} className="w-4" />
                {calculateNoOfLectures(courseData)} lessons
              </div>
            </div>
          </div>

          <button
            onClick={() => setDarkMode((s) => !s)}
            className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700 shadow text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>


      {/* ===================== GRID WRAPPER ===================== */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ===================== LEFT CONTENT ===================== */}
        <div className="lg:col-span-2 space-y-10">

          {/* Course Structure */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>

            <div className="space-y-4">
              {courseData.courseContent.map((chapter, idx) => (
                <div key={idx} className="border dark:border-gray-700 rounded-xl overflow-hidden">

                  {/* Chapter Title */}
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        className={`transition-transform ${openSections[idx] ? 'rotate-180' : ''}`}
                      />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{chapter.chapterTitle}</span>
                    </div>

                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </span>
                  </button>

                  {/* Chapter Lectures */}
                  <div className={`${openSections[idx] ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden transition-all duration-300`}>
                    <ul className="p-5 space-y-4 bg-white dark:bg-gray-800">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <img src={assets.play_icon} className="w-5 mt-1" />
                            <div>
                              <p className="text-sm font-medium">{lecture.lectureTitle}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                              </p>
                            </div>
                          </div>

                          {lecture.isPreviewFree && (
                            <button
                              onClick={() => setPlayerData({ videoId: lecture.lectureUrl })}
                              className="text-blue-600 text-xs font-medium underline"
                            >
                              Preview
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>


          {/* Course Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-3">Course Description</h3>
            <div
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            />
          </motion.section>


          {/* Instructor */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={courseData.educator?.avatar || assets.default_user_avatar}
                className="w-14 h-14 rounded-full object-cover shadow"
              />
              <div>
                <p className="font-semibold text-lg">{courseData.educator?.name || "Estreet"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 text-right">
              <div className="font-semibold">{courseData.enrolledStudents.length} students</div>
              <div className="text-xs">{courseData.courseRatings.length} ratings</div>
            </div>
          </motion.section>

        </div>


        {/* ===================== RIGHT SIDEBAR ===================== */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-28 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

            {/* Preview Player */}
            <div className="bg-black w-full">
              {playerData ? (
                getYouTubeId(playerData.videoId) ?
                  <YouTube
                    videoId={playerData.videoId}
                    opts={{ playerVars: { autoplay: 1 } }}
                    iframeClassName="w-full aspect-video"
                  />
                  :
                  <video src={playerData.videoId} autoPlay controls controlsList="nodownload" onContextMenu={e => e.preventDefault()} className='w-full aspect-video' />
              ) : (
                <img src={courseData.courseThumbnail} className="w-full aspect-video object-cover" />
              )}
            </div>

            <div className="p-6 space-y-5">

              <div className="flex items-center gap-2 text-sm text-red-500">
                <img src={assets.time_left_clock_icon} className="w-4" />
                <span>5 days left at this price!</span>
              </div>

              {/* Pricing */}
              <div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  {currency}{courseData.coursePrice}
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  {courseData.discount}% off
                </div>
              </div>

              {/* Enroll Button */}
              <button
                onClick={enrollCourse}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
              >
                {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </button>

              {/* Features */}
              <div>
                <p className="font-semibold mb-1">What's included:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-3 list-disc">
                  <li>Lifetime access</li>
                  <li>Hands-on project guidance</li>
                  <li>Downloadable resources</li>
                  <li>Quizzes included</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>

            </div>
          </div>
        </motion.aside>

      </div>

      <Footer />
    </motion.div>
  )
}

export default CourseDetails;