import React from 'react'
import './index.css'

import { Route, Routes, useMatch, useLocation } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import MyAffiliate from './pages/educator/MyAffiliate'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';


const App = () => {
  const isEducatorRoute = useMatch('/educator/*')
  const location = useLocation()

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref) {
      sessionStorage.setItem('affiliateCode', ref)
      console.log("Affiliate Code Captured:", ref);
    }
  }, [location.search])

  return (
    <div className='text-default min-h-screen bg-white flex flex-col'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />

        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/educator' element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
          <Route path='my-affiliate' element={<MyAffiliate />} />

        </Route>

      </Routes>


    </div>
  )
}

export default App
