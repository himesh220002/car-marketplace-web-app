import Header from '@/components/Header';

import MyListing from './components/MyListing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from '@/components/Footer';
import Inbox from './components/Inbox';


function Profile() {
  

  return (
    <div>
      <Header />
      <div className='px-1 md:px-20 my-10'>

        <Tabs defaultValue="my-listing" className="w-full">
          <TabsList className=''>
            <TabsTrigger value="my-listing" >My Listing</TabsTrigger>
            <TabsTrigger value="inbox" className='relative' >Inbox
               <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </TabsTrigger>
            <TabsTrigger value="profile" >Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
            </TabsContent>
          <TabsContent value="profile">
            Profile Tab
          </TabsContent>
        </Tabs>




      </div>
      <Footer />
    </div>
  );
}

export default Profile;
