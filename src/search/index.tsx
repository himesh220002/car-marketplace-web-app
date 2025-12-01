import Service from '@/Shared/Service';
import { db } from './../../configs';
import { CarImages, CarListing } from './../../configs/schema';
import { eq, and, lte } from 'drizzle-orm';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Search from '@/components/Search';
import Header from '@/components/Header';
import CarItem from '@/components/CarItem';

function SearchByOptions() {

    const [searchParams] = useSearchParams();
    const [carList, setCarList] = useState<any>([]);

    const rawType = searchParams.get('cars');
const rawMake = searchParams.get('make');
const rawPrice = searchParams.get('price');
 const rawParsedPrice = rawPrice? parseInt(rawPrice): undefined;

// Normalize values
const type = rawType !== 'undefined' ? rawType : undefined;
const make = rawMake !== 'undefined' ? rawMake : undefined;
const price = rawPrice !== 'undefined' ? rawParsedPrice : undefined;


    console.log("car="+type+" make="+make+" price= "+price);

    useEffect(()=>{
        console.log("Running useEffect due to URL change");
        GetCarList();
    },[searchParams])

    const GetCarList= async()=>{
        const filters = [];

    if (type) filters.push(eq(CarListing.type, type));
    if (make) filters.push(eq(CarListing.make, make));
    if (price) filters.push(lte(CarListing.sellingPrice, price));

        const result = await db.select().from(CarListing)
        .innerJoin(CarImages,eq(CarListing.id,CarImages.CarListingId))
        .where(and(...filters))

        const resp = Service.FormatResult(result);
        console.log("Filtered car list : ",resp);
        setCarList(resp);
        // console.log("Raw DB prices:", result.map(r => r.carListing.sellingPrice));

    }

  return (
    <div>
      <Header />
      <div className='p-16 bg-black flex justify-center'>
        <Search />
      </div>
      <div className='p-10 md:p-20'>
        <h2 className='font-bold text-4xl '>Search Results</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-7'>
          {carList?.length>0? carList.map((item: any,index: number)=>(
            <div key={index}>
              <CarItem car={item} />
            </div>
          )):
          Array(6).fill(0).map((_,index)=>(
            <div key={index} className='h-[364px] rounded-xl bg-slate-200 animate-pulse'>

            </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default SearchByOptions