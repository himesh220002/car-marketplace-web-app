
import Search from './Search'
import './Css/hero.css'

function Hero() {


    return (
        <div className=''>
            <div className='relative flex flex-col items-center p-2 sm:p-10 py-20 
                            gap-6 h-[590px] w-full object-cover hero-section-snap scroll-snap-start overflow-hidden'
                style={{ backgroundImage: "url('/wallpapersden.com_sci-fi-cool-landscape-art-2k23_2912x1632.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Badge */}
                    <div className="inline-block">
                        <span className='px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white text-sm font-semibold backdrop-blur-sm shadow-lg'>
                            Find cars for sale and for rent near you
                        </span>
                    </div>

                    {/* Main Heading with Gradient */}
                    <h2 className='text-center text-4xl md:text-6xl lg:text-7xl font-bold'>
                        <span className='bg-gradient-to-r from-blue-200 via-purple-200 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl'>
                            Find Your Dream Car
                        </span>
                    </h2>

                    <Search />
                </div>

                <img src='/bmw1.png' alt="BMW car" className='mt-10 md:mt-15 lg:mt-10 w-[250px] md:w-[350px] lg:w-[580px] z-20 drop-shadow-2xl' />

                {/* Moving Car (animated below BMW but above bg) */}
                <img src="/cpng.png" alt="Animated car illustration" className="hidden sm:block car-slide" />

            </div>
        </div>
    )
}

export default Hero