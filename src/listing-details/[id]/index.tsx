import Header from '@/components/Header'
import  { useEffect, useState } from 'react'
import DetailHearder from '../components/DetailHearder'
import { useParams } from 'react-router-dom'
import { CarImages, CarListing } from './../../../configs/schema';
import { db } from './../../../configs';
import { eq } from 'drizzle-orm';
import Service from '@/Shared/Service';
import ImageGallery from '../components/ImageGallery';
import Description from '../components/Description';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Specification from '../components/Specification';
import OwnersDetail from '../components/OwnersDetail';
import Footer from '@/components/Footer';
import FinancialCalculator from '../components/FinancialCalculator';
import MostSearchedCar from '@/components/MostSearchedCar';

type Feature = {
  label: string;
  name: string;
  fieldType: string;
};

type CarDetailType = {
  id: number;
  listingTitle: string;
  sellingPrice: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  features?: Feature[];  // <-- Correctly typed features
  images: { imageUrl: string }[];
    [key: string]: unknown;
};

function ListingDetail() {

    const { id } = useParams();
    const [carDetail, setCarDetail] = useState<CarDetailType>();

    useEffect(() => {
        // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
        GetCarDetail();
    }, [id])

    const GetCarDetail = async () => {
        const result = await db.select().from(CarListing)
            .innerJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
            .where(eq(CarListing.id, Number(id)))

        const resp = Service.FormatResult(result);
        console.log("CarDetails: ",resp);
        
    setCarDetail(resp[0] as CarDetailType | undefined);
    }

    return (
        <div>
            <Header />

            {/* Header detail component */}

            <div className='p-10 md:px-20'>
                <DetailHearder carDetail={carDetail} />


                <div className='grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5'>
                    {/* Left */}
                    <div className='md:col-span-2'>
                        {/* Image gallary */}
                            <ImageGallery carDetail={carDetail}/>
                        {/* Description */}
                            <Description carDetail={carDetail}/>
                        {/* Features list */}
                            <Features features={carDetail?.features}/>
                        {/* Financial calculator */}
                            <FinancialCalculator carDetail={carDetail}/>

                    </div>

                    {/* Right */}
                    <div >
                        {/* Pricing */}
                            <Pricing carDetail={carDetail}/>
                        {/* Car Specification */}
                            <Specification carDetail= {carDetail}/>
                        {/* Owners Details */}
                            <OwnersDetail carDetail={carDetail}/>
                    </div>
                </div>
                <MostSearchedCar />
            </div>

            <Footer />
        </div>
    )
}

export default ListingDetail