
import Search from './Search'
import './Css/hero.css'

function Hero() {

    
    return (
        <div className=''>
            <div className='flex flex-col items-center p-10 py-20 
                            gap-6 h-[590px] w-full object-cover hero-section-snap scroll-snap-start'
                            style={{ backgroundImage: "url('/digital-art-1.jpg')" ,  backgroundSize: "cover", backgroundPosition: "bottom"}}>

                <h2 className='text-lg '>Find cars for sale and for rent near you.</h2>
                <h2 className='text-center text-3xl md:text-5xl lg:text-[60px] font-bold'>Find Your Dream Car</h2>

                <Search />


                <img src='/bmw1.png' alt="BMW car" className='mt-5 w-[180px] z-20 ' />

                {/* Moving Car (animated below BMW but above bg) */}
                
                    {/* Moving Car */}
                    <img src="/cpng.png" alt="Animated car illustration" className="hidden sm:block car-slide" />
                

            </div>
        </div>
    )   
}

export default Hero