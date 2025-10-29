'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { useDestinationContext, useSourceContext, useCarSelectionContext } from '@/app/utils/Context';
import GoogleMapComp from './GoogleMapComp';
import CarListComp from './CarListComp';

import { getSupabaseBrowserClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const GooglePlacesAutocomplete = dynamic(
  () => import('react-google-places-autocomplete'),
  { ssr: false }
);

const DirectionComp = () => {

  const [value1, setValue1] = React.useState();
  const [value, setValue] = React.useState();
  const { source, setSource } = useSourceContext()
  const { destination, setDestination } = useDestinationContext()
  const { car, setCar } = useCarSelectionContext() // Get setCar from context

  // State to hold the calculated distance
  const [distance, setDistance] = useState(null);

  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  const getlatlong = (place, type) => {
    // Reset distance and selected car when location changes
    setDistance(null);
    setCar(null);

    const placeId = place?.value?.place_id;
    if (typeof window !== "undefined" && window.google) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry?.location) {
          console.log(place.geometry.location.lat());
          console.log(place.geometry.location.lng());
          if (type === 'source') {
            setSource({
              description: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              label: place.name
            })
          } else {
            setDestination({
              description: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              label: place.name
            })
          }
        }
      });
    }
  }

  useEffect(() => {
    if (source) console.log('source', source);
    if (destination) console.log('destination', destination);
  }, [source, destination]);


  const calculateDistance = () => {
    if (source && destination && window.google && window.google.maps) {
      const distInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
        { lat: source.lat, lng: source.lng },
        { lat: destination.lat, lng: destination.lng }
      );

      // UPDATED: Calculate distance in Kilometers
      const distInKm = (distInMeters / 1000); // Convert meters to km
      
      console.log("Distance in KMs:", distInKm.toFixed(2));
      setDistance(distInKm); // Save the raw KM value
    } else {
      console.error("Source, destination, or Google Maps API not ready");
    }
  }

  return (
    <div className=' w-full  px-20 flex justify-between items-center pt-10 '>
      <div>
        <h1 className='font-uberMedium leading-tight text-5xl font-extrabold tracking-tight'>Request a ride for <br />now or later</h1>
        <div className='pt-10'>
          <div className='w-96 px-4 py-3 flex items-center text-black justify-between rounded-lg border-none bg-gray-200 shadow-sm hover:shadow-md transition-all mb-4'>
            <GooglePlacesAutocomplete
              selectProps={{
                styles: {
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }),
                  input: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginTop: '4px',
                  }),
                },
                components: {
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                },
                value: value1,
                onChange: (place) => { getlatlong(place, 'source'); setValue1(place) },
                placeholder: 'Enter location',
                isClearable: true,
                className: 'text-black w-full h-full outline-none border-none',
              }}
            />
            <Image src={'/navigation-2.svg'} height={25} width={25} alt='' />
          </div>
          <div className='w-96 px-4 py-3 flex items-center text-black justify-between rounded-lg border-none bg-gray-200 shadow-sm hover:shadow-md transition-all mb-4'>
            <GooglePlacesAutocomplete
              selectProps={{
                styles: {
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }),
                  input: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginTop: '4px',
                  }),
                },
                components: {
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                },
                value: value,
                onChange: (place) => { getlatlong(place, 'destination'); setValue(place) },
                placeholder: 'Enter destination',
                isClearable: true,
                className: 'text-black w-full h-full outline-none border-none',
              }}
            />
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
</svg>

          </div>
          <div className='pt-5 flex items-center gap-x-5'>
            {/* UPDATED: Conditionally show "See prices" or the Car List */}
            {distance !== null ? (
              <CarListComp distance={distance} />
            ) : (
              <button
                className='text-sm rounded-xl bg-black text-white px-4 py-3'
                onClick={() => {
                  if (!session) {
                    router.push('/login');
                  } else {
                    calculateDistance();
                  }
                }}
                disabled={!source || !destination} 
              >
                See prices
              </button>
            )}

            
          </div>
        </div>
      </div>

      <div className='w-[600px] h-full'>
        {(!source) ? (
          <Image
            src="/image.png"
            height={500}
            width={500}
            alt="ride image"
            className="rounded-xl"
          />
        ) : (
          <GoogleMapComp />
        )}
      </div>
    </div>
  )
}

export default DirectionComp
