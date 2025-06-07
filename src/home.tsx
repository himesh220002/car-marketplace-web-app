
import  { useEffect } from 'react'

import Header from './components/Header'
import Hero from './components/Hero'
import MostSearchedCar from './components/MostSearchedCar'
import InfoSection from './components/InfoSection'
import Footer from './components/Footer'
import Category from './components/Category'
import New from './components/New'
import PreOwned from './components/PreOwned'



function Home() {

  useEffect(()=>{
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  },[])

  return (
    <div>
      {/* Header */}
      <Header />
      
      {/* Hero */}
      <Hero />
      {/* {Catogary} */}
      <Category />
      {/* Most Searched Cars */}
      <MostSearchedCar />
      {/* InfoSection */}
      <InfoSection />
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home