// import FakeData from '@/Shared/FakeData'

import CarItem from './CarItem';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Service from '@/Shared/Service';
import { db } from './../../configs';
import { CarListing, CarImages } from './../../configs/schema';
import { eq, desc } from 'drizzle-orm';
import { useEffect, useState } from 'react';



function MostSearchedCar() {

    const [carList, setCarList] = useState<any[]>([]);
    useEffect(() => {
        GetPopularCarList();
    }, [])

    const GetPopularCarList = async () => {
        const result = await db.select().from(CarListing)
            .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
            .orderBy(desc(CarListing.id))
            .limit(50)



        const resp = Service.FormatResult(result);
        // console.log(resp); // Removed console.log
        setCarList(resp);
    }

    return (
        <div className="relative py-16 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
            <div className='mx-5 md:mx-24'>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            Popular Choices
                        </span>
                    </div>
                    <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                            Most Searched Cars
                        </span>
                    </h2>
                </div>

                {/* Carousel */}
                <Carousel className=''>
                    <CarouselContent className='p-2'>
                        {carList.sort(() => Math.random() - 0.5) // Random sort kept as per original logic
                            .map((car, index) => ( // index is still available if car.id is not reliable for some reason before FormatResult
                                <CarouselItem key={car.id || index} className='grid grid-cols-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
                                    <CarItem car={car} />
                                </CarouselItem>

                            ))}

                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}

export default MostSearchedCar