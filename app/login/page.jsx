'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [fieldValue, setFieldValue] = React.useState({ email: '', password: '' })

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fieldValue.email,
      password: fieldValue.password,
    })
    if (error) {
      alert('Invalid credentials. Please try again.')
    } else {
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) {
      console.error('Google login error:', error.message)
    }
  }

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/')
    }
    checkSession()
  }, [supabase, router])

  const handleLogin = (e) => {
    const { name, value } = e.target
    setFieldValue((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signInWithEmail()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Navbar />
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 text-center">
          <h1 className="text-3xl font-semibold text-black mb-3">Welcome back</h1>
          <p className="text-gray-600 text-sm mb-6">Log in to continue your ride</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded-lg py-3 px-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-all"
              type="email"
              value={fieldValue.email}
              name="email"
              onChange={handleLogin}
              placeholder="Enter your email"
              required
            />
            <input
              className="border border-gray-300 rounded-lg py-3 px-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-all"
              type="password"
              value={fieldValue.password}
              name="password"
              onChange={handleLogin}
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              className="bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-[#333] transition-all"
            >
              Continue
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 border border-gray-300 py-3 w-full rounded-lg hover:bg-gray-100 transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">Continue with Google</span>
          </button>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-black font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-gray-500 text-xs">
        © 2025 Uber Technologies Inc. All rights reserved.
      </footer>
    </div>
  )
}

export default LoginPage
