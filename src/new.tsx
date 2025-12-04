import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Link } from 'react-router-dom'
import Service from './Shared/Service'
import { db } from '../configs'
import { CarListing, CarImages } from '../configs/schema'
import { eq } from 'drizzle-orm'
import { SkeletonCarItem } from '@/components/SkeletonCarItem'
import CarItem from '@/components/CarItem'
import Footer from './components/Footer'

const NewCars: React.FC = () => {
  type ListingWithImages = {
    id?: number
    listingTitle?: string
    sellingPrice?: number
    images?: { imageUrl?: string }[]
    [k: string]: unknown
  }
  const [listings, setListings] = useState<ListingWithImages[] | null>(null)
  const [loading, setLoading] = useState(true)

  const previewTop: (ListingWithImages | null)[] = listings ? listings.slice(0, 4) : Array.from({ length: 4 }).map(() => null)
  const gridItems: ListingWithImages[] = listings && listings.length ? listings : []

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const result = await db.select().from(CarListing).innerJoin(CarImages, eq(CarListing.id, CarImages.CarListingId)).where(eq(CarListing.type, 'New'))
        const resp = Service.FormatResult(result)
        if (mounted) {
          setListings(resp)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load new listings', err)
        if (mounted) {
          setListings([])
          setLoading(false)
        }
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900/50 to-violet-900/50 bg-blend-overlay backdrop-blur opacity-90 dark:opacity-80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20" />

          <div className="relative p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold">
                  New Arrivals
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                Discover <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Brand New Cars</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
                Curated selection of the latest arrivals — explore new models from top manufacturers with exclusive launch offers and dealer incentives.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/search?cars=New" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Browse All New
                </Link>
                <Link to="/add-listing" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                  Sell Your Car
                </Link>
              </div>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl bg-white/10 backdrop-blur-sm animate-pulse" />
                ))
              ) : (
                previewTop.map((s, i) => (
                  <div key={i} className="relative group/item overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-[4/3] shadow-lg">
                    <img
                      src={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'}
                      alt={s?.listingTitle ?? 'Car'}
                      className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/item:translate-y-0 transition-transform duration-300">
                      <div className="font-bold text-white text-sm truncate">{s?.listingTitle ?? 'Loading...'}</div>
                      <div className="text-blue-300 text-xs font-semibold">{s?.sellingPrice ? `$${s.sellingPrice}` : ''}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Featured New Cars
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Explore our hand-picked selection of premium new vehicles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCarItem key={i} />
              ))
            ) : (
              gridItems.slice(0, 8).map((s, i) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <CarItem key={i} car={s as any} />
              ))
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Why buy new?</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-lg mb-10">
              New cars come with full manufacturer warranties, the latest technology, and the joy of zero history. We make it easy to compare specs, incentives, and local inventory for the newest models.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Factory Warranty", desc: "Comprehensive coverage and peace of mind directly from the manufacturer.", icon: "🛡️" },
                { title: "Latest Tech", desc: "Advanced driver assists, cutting-edge infotainment, and connectivity.", icon: "🚀" },
                { title: "Exclusive Offers", desc: "Access to special launch offers, financing rates, and dealer promotions.", icon: "💎" }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default NewCars
