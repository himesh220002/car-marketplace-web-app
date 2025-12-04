/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react'
import { Separator } from './ui/separator'
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoIosSpeedometer } from "react-icons/io";
import { GiGearStickPattern, GiPathDistance } from "react-icons/gi";
import { TbAutomaticGearbox } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { Link } from 'react-router-dom';




function CarItem({ car }: any) {

    const engineType = (car?.fuelType == 'Electric') ? ' Km/C' : ' Km/L';



    return (
        <Link to={'/listing-details/' + car?.id}>
            <div className='group relative rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-transparent hover:shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden'>
                {/* Gradient Glow on Hover */}
                <div className='absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-75 blur-3xl transition duration-300' />

                {/* Content */}
                <div className='relative'>
                    {/* Badge */}
                    <div className='absolute top-3 left-3 z-10'>
                        <span className='bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg'>
                            New
                        </span>
                    </div>

                    {/* Image */}
                    <div className='relative overflow-hidden rounded-t-2xl'>
                        <img src={car?.images[0]?.imageUrl}
                            alt={car?.listingTitle || 'Car image'}
                            width={'100%'} height={250}
                            className='h-[180px] object-cover transform group-hover:scale-110 transition-transform duration-500'
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/st_road.jpg";
                                e.currentTarget.classList.add("opacity-70");
                            }}
                        />
                        {/* Gradient Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>

                    {/* Card Body */}
                    <div className='p-5'>
                        <h2 className='font-bold text-slate-900 dark:text-white text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300'>
                            {car?.listingTitle}
                        </h2>

                        <Separator className='bg-slate-200 dark:bg-slate-700' />

                        {/* Specs Grid */}
                        <div className='grid grid-cols-3 gap-4 mt-5'>
                            {car?.type === 'New' ? (
                                <div className='flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300'>
                                    <IoIosSpeedometer className='text-2xl mb-2 text-blue-600 dark:text-blue-400' />
                                    <h2 className='text-xs font-medium text-slate-600 dark:text-slate-400'>{car?.mileage}{engineType}</h2>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300'>
                                    <GiPathDistance className='text-2xl mb-2 text-blue-600 dark:text-blue-400' />
                                    <h2 className='text-xs font-medium text-slate-600 dark:text-slate-400'>{car?.distanceTravelled}</h2>
                                </div>
                            )}
                            <div className='flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300'>
                                <BsFillFuelPumpFill className='text-2xl mb-2 text-purple-600 dark:text-purple-400' />
                                <h2 className='text-xs font-medium text-slate-600 dark:text-slate-400'>{car?.fuelType}</h2>
                            </div>
                            <div className='flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300'>
                                {car?.transmission == 'Manual' ? (
                                    <GiGearStickPattern className='text-2xl mb-2 text-pink-600 dark:text-pink-400' />
                                ) : (
                                    <TbAutomaticGearbox className='text-2xl mb-2 text-pink-600 dark:text-pink-400' />
                                )}
                                <h2 className='text-xs font-medium text-slate-600 dark:text-slate-400'>{car?.transmission}</h2>
                            </div>
                        </div>

                        <Separator className='my-4 bg-slate-200 dark:bg-slate-700' />

                        {/* Footer */}
                        <div className='flex items-center justify-between'>
                            <h2 className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                ${Math.ceil(car?.sellingPrice).toLocaleString()}
                            </h2>
                            <div className='flex gap-2 items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300'>
                                View Details
                                <MdOpenInNew className='transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

    )
}

export default CarItem