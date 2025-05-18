import React from 'react'
import Search from './Search'
import './Css/hero.css'

function Hero() {
    // bg-[#eef0fc] 

    
    return (
        <div className=''>
            <div className='flex flex-col items-center p-10 py-20 
                            gap-6 h-[590px] w-full object-cover hero-section-snap scroll-snap-start'
                            style={{ backgroundImage: "url('/digital-art-1.jpg')" ,  backgroundSize: "cover", backgroundPosition: "bottom"}}>

                <h2 className='text-lg '>Find cars for sale and for rent near you.</h2>
                <h2 className='text-4xl md:text-5xl lg:text-[60px] font-bold'>Find Your Dream Car</h2>

                <Search />


                <img src='/bmw1.png' className='mt-5 w-180 z-20 ' />

                {/* Moving Car (animated below BMW but above bg) */}
                
                    {/* Ring icons at 5% and 90% positions (optional) */}
                    {/* <img src="/black-hole-png.png" className="absolute left-[-20px] bottom-0 w-[90px] z-10" /> */}
                    {/* <img src="/black-hole-png.png" className="absolute left-[94%] bottom-0 w-[90px] opacity-50 z-10" /> */}

                    {/* Moving Car */}
                    <img src="/cpng.png" alt="car" className="car-slide" />
                

            </div>
        </div>
    )   
}

export default Hero