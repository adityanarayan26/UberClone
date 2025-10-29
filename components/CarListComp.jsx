'use client'
import { CarList } from '../lib/CarList' // Import the data
import { useCarSelectionContext } from '@/app/utils/Context'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // <-- IMPORTANT: Added router

const CarListComp = ({ distance }) => {

  const [activeIndex, setActiveIndex] = useState(null)
  const { car, setCar } = useCarSelectionContext()
  const router = useRouter() // <-- IMPORTANT: Initialized router

  const getPrice = (item) => {
    const region = 'india'; 
    const pricing = item.amount[region];
    
    // UPDATED: Calculate price using base fare + (per/km * distance)
    // Use parseFloat to ensure it's a number
    const price = parseFloat((pricing.baseFare + (pricing.perKm * distance)).toFixed(2));
    
    return { price, currency: pricing.currency };
  }

  const handleSelectCar = (item, index) => {
    setActiveIndex(index);
    const { price, currency } = getPrice(item);
    
    setCar({
      ...item,
      calculatedPrice: price, // Store the calculated price
      currency: currency
    });
  }

  // UPDATED: Renamed to handleRequestClick and added navigation
  const handleRequestClick = () => {
    if (!car) return;
    
    // Navigate to payment page with price and car name
    router.push(`/payment?price=${car.calculatedPrice}&carName=${encodeURIComponent(car.name)}`);
  }

  return (
    <div className='w-full flex pb-7 flex-col'>
      <div className='w-full overflow-y-auto h-[250px]'>
        {CarList.map((item, index) => {
          const { price, currency } = getPrice(item);
          
          const displayPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
          }).format(price);

          return (
            <div
              key={index}
              onClick={() => handleSelectCar(item, index)}
              className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer 
              ${activeIndex === index ? 'border border-black' : 'border border-transparent'}`}
            >
              {/* This div is flexible and will grow */}
              <div className='flex items-center gap-x-5 flex-1'>
                <Image 
                  src={item.image} 
                  height={50} 
                  width={50} 
                  alt={item.name} 
                  // Improved fallback text
                  onError={(e) => { e.target.src = `https://placehold.co/50x50/e2e8f0/a0aec0?text=${item.name}`; }}
                />
                {/* This div will wrap text */}
                <div className='min-w-0'> 
                  <h1 className='text-lg font-uberMedium'>{item.name}</h1>
                  {/* REMOVED 'truncate' to allow wrapping */}
                  <p className='text-sm text-gray-500'>{item.description}</p>
                  <p className='text-sm text-gray-500'>{item.seat} seats</p>
                </div>
              </div>
              {/* This div will not shrink */}
              <div className='flex-shrink-0'>
                <h1 className='text-lg font-uberMedium'>{displayPrice}</h1>
              </div>
            </div>
          )
        })}
      </div>

      <div className='w-full mt-4'>
        {car ? (
          <button
            onClick={handleRequestClick} // <-- UPDATED handler
            className='w-full bg-black text-white text-lg font-uberMedium py-3 rounded-xl'
          >
            Request {car.name}
          </button>
        ) : (
          <button
            disabled
            className='w-full bg-gray-200 text-gray-400 text-lg font-uberMedium py-3 rounded-xl'
          >
            Select a ride
          </button>
        )}
      </div>
    </div>
  )
}

export default CarListComp

