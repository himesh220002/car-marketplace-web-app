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
import  { useEffect , useState } from 'react';



function MostSearchedCar() {

    const [carList, setCarList] = useState<any[]>([]);
    useEffect(()=>{
        GetPopularCarList();
    },[])

    const GetPopularCarList=async()=>{
        const result = await db.select().from(CarListing)
            .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
            .orderBy(desc(CarListing.id))
            .limit(50)



        const resp = Service.FormatResult(result);
        // console.log(resp); // Removed console.log
        setCarList(resp);
    }

    return (
        <div className='mx-20 md:mx-24 '>
            <h2 className='font-bold text-3xl text-center mt-16 mb-7'>Most Searched Car</h2>
            <Carousel className=''>
                <CarouselContent >
                    {carList.sort(() => Math.random() - 0.5) // Random sort kept as per original logic
                    .map((car, index) => ( // index is still available if car.id is not reliable for some reason before FormatResult
                        <CarouselItem key={car.id || index} className='grid grid-cols-1 md:basis-1/3 lg:basis-1/4 '>
                            <CarItem car={car} />
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