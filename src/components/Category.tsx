
import data from '@/Shared/Data'
import { Link } from 'react-router-dom'

function Category() {
    return (
        <div className="relative py-16 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
            <div className='container mx-auto px-4'>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            Explore Our Collection
                        </span>
                    </div>
                    <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                            Browse By Type
                        </span>
                    </h2>
                </div>

                {/* Category Grid */}
                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4 px-5 md:px-20'>
                    {data.Category.map((category, index) => (
                        <Link key={index} to={'search/' + category.name}>
                            <div className='group relative border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center hover:shadow-xl hover:border-transparent transition-all duration-300 bg-white dark:bg-slate-800 cursor-pointer overflow-hidden'>
                                {/* Gradient Background on Hover */}
                                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                                {/* Icon */}
                                <div className='relative z-10 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300'>
                                    <img src={category.icon} alt={category.name + " category icon"} width={35} height={35} className='drop-shadow-lg' />
                                </div>

                                {/* Text */}
                                <h2 className='relative z-10 mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300'>
                                    {category.name}
                                </h2>

                                {/* Bottom Accent */}
                                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left' />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Category