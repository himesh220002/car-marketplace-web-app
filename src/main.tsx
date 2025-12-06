import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { /*ClerkLoaded,*/ ClerkProvider, /*SignIn, SignUp*/ } from '@clerk/clerk-react'
import './index.css'
import Home from './home'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Contact from './contact/index'
import Profile from './profile'
import AddListing from './add-listing'
import { Toaster } from 'sonner'
import SearchByCategory from './search/[category]'
import SearchByOptions from './search'
import ListingDetail from './listing-details/[id]'
import ChatFloating from './components/ChatFloating'
import NewCars from './new'
import PreOwned from './preowned'
import AdminPanel from './admin'
import About from './about'
import Services from './services'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/services',
    element: <Services />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/new',
    element: <NewCars />
  },
  {
    path: '/preowned',
    element: <PreOwned />
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
    path: '/search',
    element: <SearchByOptions />
  },
  {
    path: '/search/:category',
    element: <SearchByCategory />
  },
  {
    path: '/listing-details/:id',
    element: <ListingDetail />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  },
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
      <ChatFloating />
      <Toaster />
      {/* </ClerkLoaded> */}
    </ClerkProvider>
  </StrictMode>,
)
