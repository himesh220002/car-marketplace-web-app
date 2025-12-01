import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Link } from 'react-router-dom'
import Service from './Shared/Service'
import { db } from '../configs'
import { CarListing, CarImages } from '../configs/schema'
import { eq } from 'drizzle-orm'

const FeaturedCard: React.FC<{ id?: number | string; title: string; price: string; img: string }> = ({ id, title, price, img }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-blue-600 font-bold mt-2">{price}</p>
      <div className="mt-4">
        {id ? (
          <Link to={`/listing-details/${id}`} className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">View</Link>
        ) : (
          <button className="inline-block bg-slate-300 text-slate-600 py-2 px-4 rounded-lg" disabled>View</button>
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Discover Brand New Cars</h1>
            <p className="mt-4 text-lg text-blue-100 max-w-xl">Curated selection of the latest arrivals — explore new models from top manufacturers with exclusive launch offers and dealer incentives.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/search?cars=New" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition">Browse All New</Link>
              <Link to="/add-listing" className="border border-white/30 px-6 py-3 rounded-lg text-white/90 hover:bg-white/10 transition">Sell Your New Car</Link>
            </div>
          </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            {previewTop.map((s: ListingWithImages | null, i: number) => (
              <div key={i} className="relative overflow-hidden rounded-xl bg-slate-100">
                <img src={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} alt={s?.listingTitle ?? 'Car'} className="w-full h-48 object-cover" />
                <div className="absolute left-4 bottom-4 bg-black/50 text-white rounded-md px-3 py-2">
                  <div className="font-semibold">{s?.listingTitle ?? 'Loading...'}</div>
                  <div className="text-sm">{s?.sellingPrice ? `$${s.sellingPrice}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Featured New Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {gridItems.slice(0,8).map((s: ListingWithImages, i: number) => (
              <FeaturedCard key={i} id={s.id} title={s.listingTitle ?? 'Untitled'} price={s.sellingPrice ? `$${s.sellingPrice}` : '—'} img={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} />
            ))}
          </div>
        </section>

        <section className="mt-12 bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-semibold">Why buy new?</h3>
          <p className="mt-2 text-slate-600">New cars come with full manufacturer warranties, the latest technology, and the joy of zero history. We make it easy to compare specs, incentives, and local inventory for the newest models.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Factory Warranty</h4>
              <p className="text-sm text-slate-600 mt-2">Comprehensive coverage and peace of mind.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Latest Tech</h4>
              <p className="text-sm text-slate-600 mt-2">Driver assists, infotainment, connectivity.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Exclusive Offers</h4>
              <p className="text-sm text-slate-600 mt-2">Launch offers and dealer promotions available.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default NewCars
