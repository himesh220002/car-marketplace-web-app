import Header from '@/components/Header'
import { FormEvent, useEffect } from 'react'
import carDetails from './../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
// import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import features from './../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { db } from './../../configs/index'
import { useNavigate, useSearchParams } from 'react-router-dom'

import TextAreaField from './components/TextAreaField'
import { CarImages, CarListing } from './../../configs/schema'
import IconField from './components/IconField'
import UploadImages from './components/UploadImages'
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from 'sonner'
import { useUser } from '@clerk/clerk-react'
import moment from 'moment'
import { eq } from 'drizzle-orm'
import Service from '@/Shared/Service'





type formDataType = {
    [key: string]: string | number | boolean;
};

type FeatureType = {
  name: string;
  label: string;
};

// type CarFieldType = {
//   name: string;
//   label: string;
//   icon?: any;
//   required?: boolean;
//   fieldType: 'text' | 'number' | 'dropdown' | 'textarea';
//   options?: string[];
// };

const defaultFeatures = features?.features?.reduce((acc: any, feature: FeatureType) => {
    acc[feature.name] = true;
    return acc;
}, {});


function AddListing() {
    const [formData, setFormData] = useState<formDataType>({});
    const [featuresData, setFeaturesData] = useState(defaultFeatures);
    const [uploadedImageURLs, _setUploadedImageURLs] = useState<string | null>(null);
    const [triggerUploadImages, setTriggerUploadImages] = useState<any >([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [carInfo, setCarInfo] = useState<any>();

    const { user } = useUser();
    // console.log("userfName "+user?.fullName+", metaPublic: "+user?.publicMetadata.fullName+", email: "+user?.primaryEmailAddress?.emailAddress);

    // const recordId = new URLSearchParams(location.search).get("id");

    const mode = searchParams.get("mode");
    const recordId = searchParams.get("id");

    useEffect(() => {
        if (mode === "edit" && recordId) {
            setTriggerUploadImages(recordId);
            GetListingDetail();
        }
    }, [recordId, uploadedImageURLs, mode]);

    

    useEffect(() => {
        console.log("🚀 📦 Recieved triggerUploadImages ID:", triggerUploadImages);
    }, [triggerUploadImages]);

    
      


    const GetListingDetail = async (): Promise<void> => {
        try {
            const result = await db
                .select()
                .from(CarListing)
                .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))  // changed from innerJoin to leftJoin It fetches CarListing even if CarImages is missing (null).
                // Prevents the form from breaking after last image is deleted.
                .where(eq(CarListing.id, Number(recordId)));


            if (!result || result.length === 0) {
                console.warn("⚠️ No data found for record ID:", recordId);
                return;
            }
            console.log("result db select(): ",result);

            const resp = Service.FormatResult(result);
            setCarInfo(resp[0]);
            setFormData(resp[0]);
            setFeaturesData(resp[0].features);

        } catch (error) {
            console.error("❌ Error fetching listing details:", error);
        }
    };

    /**
     * use to capture user input from form
     */
    const handleInputChange = (name: string, value: string | number | boolean) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        })

    };



    /**
     * Handle feature change
     */
    const handleFeatureChange = (name: string, value: boolean) => {
        setFeaturesData((prevData: any) => {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        })
    }




    const onSubmit = async (e: FormEvent): Promise<void> => {
        setLoader(true);
        e.preventDefault();


        const requiredFields = carDetails.CarDetails
            .filter((field: any) => field.required)
            .map((field: any) => field.name);

        // Find missing fields
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            console.warn("Missing required fields:", missingFields);
            alert(`Please fill in all required fields:\n${missingFields.join(", ")}`);
            return;
        }

        toast('please wait....');


        if (mode == 'edit') {
            const result = await db.update(CarListing).set({
                ...formData,
                features: featuresData,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName ?? "Alias",
                userImageUrl: user?.imageUrl,
                postedOn: moment().format('DD/MM/yyyy')
            }).where(eq(CarListing.id, Number(recordId))).returning({ id: CarListing.id });
            console.log(result);
            navigate('/profile');



            // 🔥 Update images instead of inserting new ones
            // await db.update(CarImages)
            // .set({ imageUrl: uploadedImageURLs }) // ✅ Use new image URLs
            // .where(eq(CarImages.CarListingId, recordId)); // ✅ Ensure images update for the correct listing
            setLoader(false);
        }
        else {

            try {
                const result = await db.insert(CarListing).values({
                    ...formData,
                    features: featuresData,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    userName: user?.fullName ?? user?.publicMetadata.fullName ?? "Unknown User",
                    userImageUrl: user?.imageUrl,
                    postedOn: moment().format('DD/MM/yyyy')

                }).returning({ id: CarListing.id });
                if (result) {
                    console.log("✅ Data Saved");
                    
                    setTriggerUploadImages(result[0]?.id);

                    // navigate('/profile', { replace: true });


                }
            } catch (error) {
                console.error("❌ Submission Error:", error);
            } finally {
                setLoader(false);
                // 
            }
        }
    };




    try {
        return (
            <div>
                <Header />
                <div className='px-10 md:px-20 my-10'>
                    {mode === 'edit' ? (
                        <h2 className='font-bold text-4xl'>Edit Listing</h2>
                    ) : (
                        <h2 className='font-bold text-4xl'>Add New Listing</h2>
                    )}
                    {/* <h2 className='font-bold text-4xl'>Add New Listing </h2> */}
                    <form className='p-10 border rounded-xl mt-10' onSubmit={(e) => onSubmit(e)} >
                        {/* Car details  */}
                        <div>
                            <h2 className='font-medium text-xl mb-6'>Car Details</h2>
                            <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-5 '>
                                {carDetails.CarDetails.map((item: any, index: number) => (
                                    <div key={index}>
                                        <label className='text-sm flex gap-2 items-center mb-1'>
                                            <IconField icon={item?.icon} />
                                            {item?.label} 
                                            {item.required && <span className='text-red-500'>*</span>}
                                        </label>

                                        {item.fieldType === "text" || item.fieldType == 'number'
                                            ? <InputField item={item} handleInputChange={handleInputChange} carInfo={carInfo} />
                                            : item.fieldType == "dropdown" ? <DropdownField item={item} handleInputChange={handleInputChange} carInfo={carInfo} />
                                            : item.fieldType == "textarea" ? 
                                            <TextAreaField
                                                item={item}
                                                handleInputChange={handleInputChange}
                                                carInfo={carInfo}
                                            />
                                            : null}

                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className='my-6' />
                        {/* Features List  */}
                        <div>
                            <h2 className='font-medium text-xl my-6'>Features</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {features?.features?.map((item) => (
                                    <div key={item.name} className='flex gap-2 items-center'>
                                        <Checkbox
                                            checked={featuresData?.[item.name]}
                                            onCheckedChange={(value: boolean ) => handleFeatureChange(item.name, value)}
                                            id={item.name}

                                            className='data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700' 
                                        />

                                        <label htmlFor={item.name}>{item.label}</label>
                                        {/* <h2>{item.label}</h2> */}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔍 Show live form data for debugging */}
                        {/* <pre className='text-xs bg-gray-100 p-4 rounded max-h-64 overflow-y-scroll'>
                            {JSON.stringify({formData,featuresData}, null, 2)}
                        </pre> */}

                        {/* Car images  */}
                        <Separator className='my-6' />

                        {triggerUploadImages && triggerUploadImages !== 0 && (
                            <UploadImages
                                triggerUploadImages={triggerUploadImages}
                                setTriggerUploadImages={setTriggerUploadImages}
                                carInfo={carInfo}
                                mode={mode ?? "default"}
                                recordId={recordId ? Number(recordId) : 0}
                                setLoader={(v) => { setLoader(v); }}
                            />
                        )}



                        <div className=' mt-10 flex justify-end'>
                            <Button type="submit" className='bg-blue-700 cursor-pointer hover:bg-purple-900 hover:text-green-200'
                                disabled={loader}
                            >
                                {!loader ? 'Submit' : <BiLoaderAlt className='animate-spin text-lg' />}
                            </Button>
                        </div>

                    </form>

                </div>
            </div>
        )
    } catch (error) {
        console.error("UI Render Error:", error);
        return <div className='text-red-600 font-bold'>🚨 Something went wrong!</div>;
    }
}

export default AddListing