import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-indigo-50'>
            <SignIn />
        </div>
    )
}

export default Login
