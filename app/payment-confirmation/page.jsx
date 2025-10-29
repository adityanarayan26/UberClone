'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const PaymentConfirmationPage = () => {
    return (
        <div className='h-screen w-full bg-zinc-100'>
            <Navbar />
            <div className='flex justify-center items-center mt-20'>
                <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center'>
                    <h1 className='text-3xl font-uberMedium mb-4 text-green-600'>Payment Successful!</h1>
                    <p className='text-lg mb-6'>Your ride has been confirmed.</p>
                    <Link href="/" legacyBehavior>
                        <a className='w-full px-4 py-3 text-lg font-uberMedium rounded-lg text-white bg-black hover:bg-gray-800'>
                            Book Another Ride
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentConfirmationPage
