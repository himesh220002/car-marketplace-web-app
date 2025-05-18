import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { /*ClerkLoaded,*/ ClerkProvider, /*SignIn, SignUp*/} from '@clerk/clerk-react'
import './index.css'
import Home from './home'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Contact  from './contact'
import Profile from './profile'
import AddListing from './add-listing'
import { Toaster } from 'sonner'
import SearchByCategory from './search/[category]'
import SearchByOptions from './search'
import ListingDetail from './listing-details/[id]'

const router=createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/contact',
    element: <Contact/>
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/add-listing',
    element: <AddListing />
  },
  {
    path:'/search',
    element: <SearchByOptions />
  },
  {
    path: '/search/:category',  // dynamic route
    element: <SearchByCategory/>
  },
  {
    path: '/listing-details/:id',  // dynamic route
    element: <ListingDetail/>
  },
  // {
  //   path: '/sign-in',
  //   element: <SignIn routing="path" path="/sign-in" />
  // },
  // {
  //   path: '/sign-up',
  //   element: <SignUp routing="path" path="/sign-up" />
  // }
])

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {/* <ClerkLoaded> */}
      <RouterProvider router={router} />
      <Toaster />
      {/* </ClerkLoaded> */}
    </ClerkProvider>
  </StrictMode>,
)
