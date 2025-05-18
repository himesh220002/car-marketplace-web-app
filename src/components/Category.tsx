import React from 'react'
import data from '@/Shared/data'
import { Link } from 'react-router-dom'

function Category() {
  return (
    <div>
        <div className='mt-40'>
            <h2 className='font-bold text-3xl text-center mb-6'>Browse By Type</h2>
            <div className='grid grid-col-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10  gap-5 px-20 ' >
                {data.Category.map((category, index) => (
                    <Link to={'search/'+category.name}>
                    <div className='border rounded-xl p-3 flex flex-col items-center hover:shadow-md hover:bg-amber-200 hover:text-black cursor-pointer'>
                        <img src={category.icon} width={35} height={35}/>
                        <h2 className='mt-2'>{category.name}</h2>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Category