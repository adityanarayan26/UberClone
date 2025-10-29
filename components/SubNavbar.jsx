import React from 'react'

const SubNavbar = () => {
  return (
    <div className='w-full py-3 px-16  text-black flex justify-between items-center'>
      <div>
        <h1 className='text-[1.4rem] font-uberMedium font-semibold'>Ride</h1>
      </div>
      <div className='flex items-center gap-x-5 text-gray-500 font-uberRegular text-sm'>
        <h1>Request a ride</h1>
        <h1>Reserve a ride</h1>
        <h1>See prices</h1>
        <h1>Explore ride options</h1>
        <h1>Airport rides</h1>
      </div>
    </div>
  )
}

export default SubNavbar
