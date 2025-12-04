
import { HiCalendarDays } from "react-icons/hi2";
import { IoSpeedometerOutline   } from "react-icons/io5";
import { GiGearStickPattern } from "react-icons/gi";
import { TbAutomaticGearbox } from "react-icons/tb";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { FaChargingStation } from "react-icons/fa";
import { BsFuelPumpFill } from "react-icons/bs";
import { RiChargingPileFill } from "react-icons/ri";
import { GiPathDistance } from "react-icons/gi";


type CarDetailPreview = {
    make?: string;
    listingTitle?: string;
    tagline?: string | null;
    category?: string;
    year?: string | number | null;
    mileage?: string | number | null;
    transmission?: string | null;
    fuelType?: string | null;
    type?: string | null;
    distanceTravelled?: string | number | null;
        [k: string]: unknown;
};

type props = {
        carDetail?: CarDetailPreview | null;
}

function DetailHearder({ carDetail }: props) {
    const carengine = (carDetail?.fuelType == 'Electric') ? 'Km' : 'Km';

    const getCategoryImage = (category?: string) => {
            switch (category) {
            case 'SUV':
                return '/suv-car.png';
            case 'Sedan':
                return '/sedan.png';
            case 'Truck':
                return '/big-truck.png';
            case 'Off-road':
                return '/adventure.png';
            case 'Convertible':
                return '/convertible.png';
            case 'Sports':
                return '/sports-car.png';
            case 'Hatchback':
                return '/hatchback.png';
            case 'Van':
                return '/van.png';
            case 'Electric':
                return '/charging-station.png';
            case 'Hybrid':
                return '/hybrid-car.png';
            default:
                return '/coupe.png';
        }
    };
    const getMakeLogo = (make?: string) => {
            switch (make) {
            case 'Toyota':
                return '/Company Logos/toyotalogo.png';
            case 'Honda':
                return '/Company Logos/hondalogo.png';
            case 'Ford':
                return '/Company Logos/fordlogo.png';
            case 'Chevrolet':
                return '/Company Logos/chevroletlogo.png';
            case 'Nissan':
                return '/Company Logos/nissanlogo.png';
            case 'BMW':
                return '/Company Logos/bmwlogo.png';
            case 'Mercedes-Benz':
                return '/Company Logos/mercedeslogo.png';
            case 'Audi':
                return '/Company Logos/audilogo.png';
            case 'Tesla':
                return '/Company Logos/teslalogo.png';
            case 'Kia':
                return '/Company Logos/kialogo.png';
            case 'Suzuki':
                return '/Company Logos/suzuki.png';
            case 'Tata':
                return '/Company Logos/tatalogo.png';
            case 'Jaguar-Land-Rover':
                return '/Company Logos/JLRlogo.png';
            case 'Mahindra':
                return '/Company Logos/mahindralogo.png';
            case 'Koenigsegg':
                return '/Company Logos/koneglogo.png';
            case 'New_temporary':
                return '/Company Logos/defaultcarlogo.png';
            default:
                return 'defaultcarlogo.png';
        }
    };

    // Usage
    const make = carDetail?.make;
    console.log('make : ', make);
    const makeLogo = getMakeLogo(make);
    console.log('makelogo: ', makeLogo)


    // Example:
    const category = carDetail?.category;
    const category_img = getCategoryImage(category);


    return (
        <div>
            {carDetail?.listingTitle ?
                <div>
                    <div className="flex items-centre justify-between gap-3">

                        <div className='flex gap-2 items-center justify-between'>
                            {carDetail?.make && (

                                <img
                                    src={makeLogo}
                                    alt="Company Logo"
                                    className=" w-15 h-15 object-contain border-2 p-1 rounded-xl"
                                />
                            )}
                            <div>
                                <h2 className="font-bold text-3xl">{carDetail?.listingTitle}</h2>
                                <p className='text-sm'>{carDetail?.tagline}</p>
                            </div>


                        </div>
                        {carDetail?.category && (

                            <img
                                src={category_img}
                                alt="Company Logo"
                                className=" w-15 h-15 object-contain"
                            />
                        )}
                    </div>


                    <div className='flex flex-wrap gap-2 mt-3'>
                        <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
                            <HiCalendarDays className='h-7 w-7 text-blue-700' />
                            <h2 className='text-blue-700 text-sm'>{carDetail?.year}</h2>
                        </div>
                        <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
                            <IoSpeedometerOutline   className='h-7 w-7 text-blue-700' />
                            <h2 className='text-blue-700 text-sm'>{carDetail?.mileage} {carengine}</h2>
                        </div>
                        <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
                            {carDetail?.transmission == 'Manual' ? (
                                < GiGearStickPattern className='h-7 w-7 text-blue-700' />
                            ) : (
                                < TbAutomaticGearbox className='h-7 w-7 text-blue-700' />
                            )}

                            <h2 className='text-blue-700 text-sm'>{carDetail?.transmission}</h2>
                        </div>
                        <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
                            {(() => {
                                switch (carDetail?.fuelType) {
                                    case 'Diesel':
                                        return <BsFillFuelPumpDieselFill className='h-7 w-7 text-blue-700' />;
                                    case 'Petrol':
                                        return <BsFuelPumpFill className='h-7 w-7 text-blue-700' />;
                                    case 'Hybrid':
                                        return <RiChargingPileFill className='h-7 w-7 text-blue-700' />;
                                    case 'Electric':
                                        return <FaChargingStation className='h-7 w-7 text-blue-700' />;
                                    default:
                                        return null;
                                }
                            })()}


                            <h2 className='text-blue-700 text-sm'>{carDetail?.fuelType}</h2>
                        </div>
                        {carDetail?.type != 'New' ? (
                            <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>

                                < GiPathDistance className='h-7 w-7 text-blue-700' />
                                <h2 className='text-blue-700 text-sm'>{carDetail?.distanceTravelled}</h2>

                            </div>) : (
                            <></>
                        )}
                    </div>
                </div> :
                <div className='w-full rounded-xl h-[100px] bg-slate-200 animate-pulse'>

                </div>}
        </div>
    )
}

export default DetailHearder