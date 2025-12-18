import React, { useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const Loading = () => {
  const { path } = useParams()
  const navigate = useNavigate();
  const { backendUrl, getToken } = useContext(AppContext)

  useEffect(() => {
    const verifyAndNavigate = async () => {
      if (path === 'my-enrollments') {
        try {
          // 1. Manually trigger purchase verification on backend
          await axios.post(backendUrl + '/api/user/verify-purchase', {}, { headers: { Authorization: `Bearer ${await getToken()}` } });
          // Success? We proceed to navigate.
        } catch (error) {
          console.error("Verification error", error);
        }
      }

      navigate(`/${path}`);
    }

    if (path) {
      const timer = setTimeout(verifyAndNavigate, 5000);
      return () => clearTimeout(timer);
    }
  }, [path, navigate])
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animated-spin'></div>

    </div>
  )
}

export default Loading
