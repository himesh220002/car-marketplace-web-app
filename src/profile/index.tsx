
import Header from '@/components/Header';

import MyListing from './components/MyListing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from '@/components/Footer';
import Inbox from './components/Inbox';
import ProfileView from './components/ProfileView';


function Profile() {


  return (
    <div>
      <Header />
      <div className='px-2 sm:px-4 md:px-10 lg:px-20 my-6 sm:my-8 md:my-10'>

        <Tabs defaultValue="my-listing" className="w-full">
          <TabsList className='w-full justify-start bg-transparent p-0 mb-8 gap-4 overflow-x-auto flex-nowrap'>
            <TabsTrigger
              value="my-listing"
              className='data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-white dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-blue-400'
            >
              My Listing
            </TabsTrigger>
            <TabsTrigger
              value="inbox"
              className='relative data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-white dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-blue-400'
            >
              Inbox
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className='data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-white dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-blue-400'
            >
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileView />
          </TabsContent>
        </Tabs>




      </div>
      <Footer />
    </div>
  );
}

export default Profile;
