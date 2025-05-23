import  { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { db } from './../../../configs'
import { CarImages, CarListing } from './../../../configs/schema'
import { desc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/clerk-react'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'
import { FaTrashAlt } from "react-icons/fa";


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'



function MyListing() {

    const { user } = useUser();
    const [carList, setCarList] = useState<any>([]);
    const [isAlertOpen, setAlertIsOpen] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

    useEffect(() => {
         // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
        user && GetUserCarListing();
    }, [user])

    const GetUserCarListing = async () => {
        const result = await db.select().from(CarListing)
            .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
            .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress as string))
            .orderBy(desc(CarListing.id))

        const resp = Service.FormatResult(result)
        console.log(resp);
        setCarList(resp);
    }

    const deleteListItem = async () => {

        if (!selectedCarId) return;

        // 🔍 Find the car in state by ID
    const carToDelete = carList.find((car: any) => car.id === selectedCarId);

    if (!carToDelete) {
        console.warn('Car not found in list for ID:', selectedCarId);
        return;
    }

    try {
        console.log(`🗑 Deleting Car ID: ${selectedCarId} | Title: ${carToDelete.listingTitle}`);

        // Step 1: Delete all images for the listing
        await db.delete(CarImages).where(eq(CarImages.CarListingId, selectedCarId));

        // Step 2: Delete the listing itself
        await db.delete(CarListing).where(eq(CarListing.id, selectedCarId));

        // Step 3: Update UI
        setCarList((prevList : any) => prevList.filter((car : any) => car.id !== selectedCarId));

        toast.success(`Deleted "${carToDelete.listingTitle}"`);
        setAlertIsOpen(false);
    } catch (error) {
        console.error('❌ Error deleting car:', error);
        toast.error('Failed to delete listing.');
    }
        



    };

    return (
        <div>
            <div className='flex justify-between items-center mt-6'>
                <h2 className='font-bold text-4xl'>My Listing</h2>
                <Link to={'/add-listing'}>
                    <Button className='cursor-pointer hover:bg-green-600'>+ Add New Listing</Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-7 gap-5'>
                {carList.map((item : any, index: number) => (
                    <div key={index}>
                        <CarItem car={item} />
                        <div className='p-2 bg-gray-50 rounded-lg flex justify-between gap-3'>
                            <Link to={'/add-listing?mode=edit&id=' + item?.id} className='flex-grow flex'>
                                <Button variant='outline' className='w-full'>Edit</Button>
                            </Link>

                            <AlertDialog open={isAlertOpen && selectedCarId === item.id} onOpenChange={setAlertIsOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant='destructive' className='w-auto cursor-pointer'
                                        onClick={() => {
                                            setSelectedCarId(item.id);
                                            setAlertIsOpen(true);
                                        }}><FaTrashAlt /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will permanently delete the listing and cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setAlertIsOpen(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={deleteListItem}>Yes, Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyListing