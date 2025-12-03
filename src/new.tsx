import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Link } from 'react-router-dom'
import Service from './Shared/Service'
import { db } from '../configs'
import { CarListing, CarImages } from '../configs/schema'
import { eq } from 'drizzle-orm'

const FeaturedCard: React.FC<{ id?: number | string; title: string; price: string; img: string }> = ({ id, title, price, img }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <img src={img} alt={title} className="w-full h-32 sm:h-40 md:h-48 object-cover" />
    <div className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold truncate">{title}</h3>
      <p className="text-blue-600 font-bold mt-2 text-sm sm:text-base">{price}</p>
      <div className="mt-3 sm:mt-4">
        {id ? (
          <Link to={`/listing-details/${id}`} className="inline-block bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg shadow-md hover:bg-blue-700 text-sm sm:text-base">View</Link>
        ) : (
          <button className="inline-block bg-slate-300 text-slate-600 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base" disabled>View</button>
        )}
      </div>
    </div>
  </div>
)

const NewCars: React.FC = () => {
  type ListingWithImages = {
    id?: number
    listingTitle?: string
    sellingPrice?: number
    images?: { imageUrl?: string }[]
    [k: string]: unknown
  }
  const [listings, setListings] = useState<ListingWithImages[] | null>(null)
  const previewTop: (ListingWithImages | null)[] = listings ? listings.slice(0, 4) : Array.from({ length: 4 }).map(() => null)
  const gridItems: ListingWithImages[] = listings && listings.length ? listings : []

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const result = await db.select().from(CarListing).innerJoin(CarImages, eq(CarListing.id, CarImages.CarListingId)).where(eq(CarListing.type, 'New'))
        const resp = Service.FormatResult(result)
        if (mounted) setListings(resp)
      } catch (err) {
        console.error('Failed to load new listings', err)
        if (mounted) setListings([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-4 sm:p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">Discover Brand New Cars</h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-blue-100 max-w-xl">Curated selection of the latest arrivals — explore new models from top manufacturers with exclusive launch offers and dealer incentives.</p>
            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/search?cars=New" className="bg-white text-blue-700 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:scale-105 transition text-sm sm:text-base text-center">Browse All New</Link>
              <Link to="/add-listing" className="border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white/90 hover:bg-white/10 transition text-sm sm:text-base text-center">Sell Your New Car</Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {previewTop.map((s: ListingWithImages | null, i: number) => (
              <div key={i} className="relative overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                <img src={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} alt={s?.listingTitle ?? 'Car'} className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover" />
                <div className="absolute left-2 sm:left-3 md:left-4 bottom-2 sm:bottom-3 md:bottom-4 bg-black/50 text-white rounded-md px-2 sm:px-3 py-1 sm:py-2">
                  <div className="font-semibold text-xs sm:text-sm md:text-base truncate">{s?.listingTitle ?? 'Loading...'}</div>
                  <div className="text-xs sm:text-sm">{s?.sellingPrice ? `$${s.sellingPrice}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 sm:mt-8 md:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold">Featured New Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            {gridItems.slice(0, 8).map((s: ListingWithImages, i: number) => (
              <FeaturedCard key={i} id={s.id} title={s.listingTitle ?? 'Untitled'} price={s.sellingPrice ? `$${s.sellingPrice}` : '—'} img={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} />
            ))}
          </div>
        </section>

        <section className="mt-6 sm:mt-8 md:mt-12 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold">Why buy new?</h3>
          <p className="mt-2 text-sm sm:text-base text-slate-600">New cars come with full manufacturer warranties, the latest technology, and the joy of zero history. We make it easy to compare specs, incentives, and local inventory for the newest models.</p>
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 border rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Factory Warranty</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Comprehensive coverage and peace of mind.</p>
            </div>
            <div className="p-3 sm:p-4 border rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Latest Tech</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Driver assists, infotainment, connectivity.</p>
            </div>
            <div className="p-3 sm:p-4 border rounded-lg">
              <h4 className="font-semibold text-sm sm:text-base">Exclusive Offers</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Launch offers and dealer promotions available.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default NewCars
