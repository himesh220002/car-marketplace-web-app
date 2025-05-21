// import React from 'react'
import { Separator } from './ui/separator'
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoIosSpeedometer } from "react-icons/io";
import { GiGearStickPattern } from "react-icons/gi";
import { TbAutomaticGearbox } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { Link } from 'react-router-dom';



  
  function CarItem({ car }: any) {

    const engineType = (car?.fuelType == 'Electric' )? ' Km' : ' Km/L';

    

    return (
        <Link to={'/listing-details/'+car?.id}>
        <div className='rounded-xl bg-white border hover:shadow-md cursor-pointer'>
            <h2 className='absolute m-2 bg-green-500 px-2 rounded-full text-sm text-white '>New</h2>
            <img src={car?.images[0]?.imageUrl} width={'100%'} height={250}
             className='rounded-t-xl h-[180px] object-cover' 
             onError={(e) => {
                // e.currentTarget.onerror = null; // prevent infinite loop
                e.currentTarget.src = "/st_road.jpg"; // fallback image from public folder
                e.currentTarget.classList.add("opacity-70"); // Optional effect
                }}
             />
            <div className='p-4'>
                <h2 className='font-bold text-black text-lg mb-2'>{car?.listingTitle}</h2>
                <Separator />

                <div className='grid grid-cols-3 mt-5'>
                    <div className='flex flex-col items-center'>
                        <BsFillFuelPumpFill  className='text-lg mb-2'/>
                        <h2>{car?.mileage}{engineType}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <IoIosSpeedometer  className='text-lg mb-2'/>
                        <h2>{car?.fuelType} </h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        {car?.transmission == 'Manual' ? (
                            < GiGearStickPattern className='text-lg mb-2'/>
                        ) : (
                            < TbAutomaticGearbox className='text-lg mb-2'/>
                        )}
                        
                        <h2>{car?.transmission}</h2>
                    </div>
                </div>

                <Separator className='my-2'/>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold text-black text-xl'>${Math.ceil(car?.sellingPrice)}</h2>
                    <h2 className='text-blue-700 text-sm flex gap-2 items-center'>
                        View Details <MdOpenInNew/></h2>
                </div>

            </div>
        </div>
        </Link>

    )
}

export default CarItem