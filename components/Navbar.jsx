'use client' // This component is now interactive

import React from 'react'
import { useAuth } from '@/app/utils/Context' // Import the auth context
import Link from 'next/link'

const Navbar = () => {
  const { session, signOut } = useAuth() // Get session and signOut function

  return (
    <div className='w-full py-4 px-16 bg-black flex justify-between items-center text-white '>
      <div className='flex items-center gap-x-10'>
        <Link href="/" legacyBehavior>
          <a className=' text-2xl font-uberRegular tracking-tighter'>Uber</a>
        </Link>
        <div className='flex items-center gap-x-4'>
          <h1 className='font-uberMedium text-sm text-white'>Ride</h1>
          <h1 className='font-uberMedium text-sm text-white'>Drive</h1>
          <h1 className='font-uberMedium text-sm text-white'>Business</h1>
          <h1 className='font-uberMedium text-sm text-white'>About</h1>
        </div>
      </div>
    
      <div className='flex items-center gap-x-4'>
        {session ? (
          // User is logged in
          <>
            <div className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-white font-uberMedium text-sm uppercase'>
              {session.user.email ? session.user.email.charAt(0) : 'U'}
            </div>
            <button
              onClick={() => signOut()}
              className='text-sm bg-gray-700 hover:bg-gray-600 transition-all ease duration-150 text-white font-uberMedium rounded-full px-4 py-2'
            >
              Logout
            </button>
          </>
        ) : (
          // User is logged out
          <>
            <Link href="/login" legacyBehavior>
              <a className='text-sm bg-black hover:bg-gray-900/90 transition-all ease duration-150 text-white font-uberMedium rounded-full px-4 py-2'>
                Login
              </a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a className='text-sm bg-white text-black font-uberMedium rounded-full px-3 py-2'>
                Signup
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
