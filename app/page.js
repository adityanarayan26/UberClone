'use client'

import DirectionComp from '@/components/DirectionComp'
import GoogleMapComp from '@/components/GoogleMapComp'
import Navbar from '@/components/Navbar'
import SubNavbar from '@/components/SubNavbar'
import React from 'react'

import { useJsApiLoader } from "@react-google-maps/api"; 
import { Loader2 } from 'lucide-react'

// ---
// NOTE: For security, you should move your API key to a .env.local file
// Create a file named .env.local in the root of your project:
// NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your...key...
//
// Then you can access it here:
// const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// ---
const libraries = ["places", "maps", "geometry"]; // Added "geometry" for calculateDistance

const page = () => {
  // IMPORTANT: Replace this hardcoded key by loading from environment variables
  const apiKey = "AIzaSyClCtjYWV5HMBmudoUUOmlqSruZzyyra98"; 

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: libraries, 
  });


  const renderContent = () => {
    if (loadError) {
      return <div className='flex justify-center items-center p-10 text-red-500'>Error loading maps. Please check your API key and network connection.</div>;
    }

    // This component will now render correctly once the `apiKey` props are removed
    // from DirectionComp.jsx
    if (!isLoaded) {
      return <div className='flex justify-center items-center p-10'><Loader2 className='animate-spin size-7 '/></div>;
    }


    return (
      <div className='bg-zinc-100'>
        <DirectionComp />
      </div>
    );
  };

  return (
    <div className='h-screen w-full bg-zinc-100'>
      <Navbar />
      <SubNavbar />
      
      {/* This will now switch from "Loading Maps..." to your component */}
      {renderContent()}

    </div>
  )
}

export default page
