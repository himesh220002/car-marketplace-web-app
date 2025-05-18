import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { fetchListings } from '../../utils/fetchListings'; // Function to fetch listings from DB
import { Link } from 'react-router-dom';
import MyListing from './components/MyListing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from '@/components/Footer';
import Inbox from './components/Inbox';


function Profile() {
  // const [listings, setListings] = useState<Listing[]>([]);
  // const [currentPage, setCurrentPage] = useState(1); 
  // const [listingsPerPage] = useState(3); 

  // useEffect(() => {
  //     const loadListings = async () => {
  //         const data = await fetchListings();
  //         setListings(data);
  //     };

  //     loadListings();
  // }, []);


  // const indexOfLastListing = currentPage * listingsPerPage;
  // const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  // const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <div className='px-10 md:px-20 my-10'>

        <Tabs defaultValue="my-listing" className="w-full">
          <TabsList className=''>
            <TabsTrigger value="my-listing" >My Listing</TabsTrigger>
            <TabsTrigger value="inbox" >Inbox</TabsTrigger>
            <TabsTrigger value="profile" >Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox"><Inbox /></TabsContent>
          <TabsContent value="profile">Profile Tab</TabsContent>
        </Tabs>





        {/* <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
                    {currentListings.map((listing, index) => (
                        <div key={index} className='border rounded-xl p-5 shadow-md flex flex-col gap-3'>
                            <h3 className='font-medium text-xl'>{listing.title}</h3>
                            <img
                                src={listing.images?.[0]} 
                                alt={listing.title}
                                className='w-full h-[200px] object-cover rounded-lg'
                            />
                            <p>{listing.description}</p>
                            <div className='flex justify-between mt-5'>
                                <Button className='bg-green-500'>Edit</Button>
                                <Button className='bg-red-500'>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div> */}
        {/* Pagination */}
        {/* <div className="flex justify-center mt-10">
                    {[...Array(Math.ceil(listings.length / listingsPerPage)).keys()].map((number) => (
                        <Button
                            key={number}
                            onClick={() => paginate(number + 1)}
                            className="bg-blue-500 mx-2"
                        >
                            {number + 1}
                        </Button>
                    ))}
                </div> */}


      </div>
      <Footer />
    </div>
  );
}

export default Profile;
