import FakeData from '@/Shared/FakeData'
// import React from 'react'
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
import React, { useEffect , useState } from 'react';



function MostSearchedCar() {

    const [carList, setCarList] = useState([]);
    useEffect(()=>{
        GetPopularCarList();
    },[])

    const GetPopularCarList=async()=>{
        const result = await db.select().from(CarListing)
            .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
            .orderBy(desc(CarListing.id))
            .limit(50)



        const resp = Service.FormatResult(result);
        console.log(resp);
        setCarList(resp);
    }

    return (
        <div className='mx-24 hidden md:block'>
            <h2 className='font-bold text-3xl text-center mt-16 mb-7'>Most Searched Car</h2>
            <Carousel className=''>
                <CarouselContent >
                    {carList.map((car, index) => (
                        <CarouselItem key={index} className='basis-1/2 md:basis-1/3 lg:basis-1/4 '>
                            <CarItem car={car} key={index} />
                        </CarouselItem>

                    ))}

                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>



        </div>
    )
}

export default MostSearchedCar