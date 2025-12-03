import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { Link } from 'react-router-dom'
import Service from './Shared/Service'
import { db } from '../configs'
import { CarListing, CarImages } from '../configs/schema'
import { eq } from 'drizzle-orm'

const TrustBadge: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-md font-bold text-sm sm:text-base">✓</div>
    <div>
      <div className="font-semibold text-sm sm:text-base">{title}</div>
      {subtitle && <div className="text-xs sm:text-sm text-slate-500">{subtitle}</div>}
    </div>
  </div>
)

const CarCard: React.FC<{ id?: number | string; title: string; price: string; img: string; mileage?: string }> = ({ id, title, price, img, mileage }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <img src={img} alt={title} className="w-full h-32 sm:h-36 md:h-44 object-cover" />
    <div className="p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base truncate">{title}</h3>
        <span className="text-green-600 font-bold text-xs sm:text-sm">Certified</span>
      </div>
      <div className="mt-2 text-slate-600 text-xs sm:text-sm">{mileage ?? 'Low mileage'}</div>
      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="text-base sm:text-lg font-bold">{price}</div>
        {id ? (
          <Link to={`/listing-details/${id}`} className="text-xs sm:text-sm bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md">View</Link>
        ) : (
          <button className="text-xs sm:text-sm bg-slate-200 text-slate-500 px-2 sm:px-3 py-1 rounded-md" disabled>View</button>
        )}
      </div>
    </div>
  </div>
)

const PreOwned: React.FC = () => {
  type ListingWithImages = {
    id?: number
    listingTitle?: string
    sellingPrice?: number
    images?: { imageUrl?: string }[]
    mileage?: string
    [k: string]: unknown
  }

  const [listings, setListings] = useState<ListingWithImages[] | null>(null)
  const previewTop: (ListingWithImages | null)[] = listings ? listings.slice(0, 4) : Array.from({ length: 4 }).map(() => null)
  const gridItems: ListingWithImages[] = listings && listings.length ? listings : []

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const result = await db.select().from(CarListing).innerJoin(CarImages, eq(CarListing.id, CarImages.CarListingId)).where(eq(CarListing.type, 'Used'))
        const resp = Service.FormatResult(result)
        if (mounted) setListings(resp)
      } catch (err) {
        console.error('Failed to load preowned listings', err)
        if (mounted) setListings([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <section className="rounded-2xl sm:rounded-3xl bg-white shadow-xl p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Trusted Pre-Owned Cars — Certified & Inspected</h1>
            <p className="mt-3 sm:mt-4 text-slate-600 text-sm sm:text-base md:text-lg">Each vehicle is hand-inspected, road-tested and runs through electronic diagnostics and a multi-point mechanical checklist to ensure safety and reliability. Buy with confidence.</p>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
              <TrustBadge title="150+ Point Inspection" subtitle="Mechanical, electrical & safety checks" />
              <TrustBadge title="Road-Tested" subtitle="Real-world driving & handling tests" />
              <TrustBadge title="Verified History" subtitle="Accident & title checks (CARFAX-like)" />
              <TrustBadge title="Warranty Options" subtitle="Optional certified pre-owned warranty" />
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/search?cars=Used" className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:scale-105 transition text-sm sm:text-base text-center">Browse Certified Pre-Owned</Link>
              <Link to="/add-listing" className="border px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base text-center">Sell a Certified Vehicle</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {previewTop.map((s, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                <img src={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} alt={s?.listingTitle ?? 'Car'} className="w-full h-24 sm:h-32 md:h-40 object-cover" />
                <div className="absolute left-2 sm:left-3 top-2 sm:top-3 bg-white/80 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold">Inspected</div>
                <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 bg-black/50 text-white rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm">{s?.sellingPrice ? `$${s.sellingPrice}` : ''}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 sm:mt-8 md:mt-10">
          <h2 className="text-xl sm:text-2xl font-bold">What we test</h2>
          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-sm sm:text-base">Battery & Charging Systems</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Complete electrical diagnostic & battery health verified.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-sm sm:text-base">Brakes & Suspension</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Pad wear, rotor runout, shock performance and alignment checks.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-sm sm:text-base">Engine & Emissions</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Compression, leak-down, and emissions system checks.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 sm:mt-8 md:mt-12">
          <h3 className="text-lg sm:text-xl font-semibold">Featured Certified Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            {gridItems.slice(0, 8).map((s, i) => (
              <CarCard key={i} id={s.id} title={s.listingTitle ?? 'Untitled'} price={s.sellingPrice ? `$${s.sellingPrice}` : '—'} img={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'} mileage={s?.mileage as string} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default PreOwned
