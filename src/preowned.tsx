import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { Link } from 'react-router-dom'
import Service from './Shared/Service'
import { db } from '../configs'
import { CarListing, CarImages } from '../configs/schema'
import { eq } from 'drizzle-orm'
import { SkeletonCarItem } from '@/components/SkeletonCarItem'
import CarItem from '@/components/CarItem'
import Footer from './components/Footer'

const TrustBadge: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xl group-hover:scale-110 transition-transform duration-300">
      {icon || "✓"}
    </div>
    <div>
      <div className="font-bold text-slate-900 dark:text-white mb-1">{title}</div>
      {subtitle && <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</div>}
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
  const [loading, setLoading] = useState(true)

  const previewTop: (ListingWithImages | null)[] = listings ? listings.slice(0, 4) : Array.from({ length: 4 }).map(() => null)
  const gridItems: ListingWithImages[] = listings && listings.length ? listings : []

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const result = await db.select().from(CarListing).innerJoin(CarImages, eq(CarListing.id, CarImages.CarListingId)).where(eq(CarListing.type, 'Used'))
        const resp = Service.FormatResult(result)
        if (mounted) {
          setListings(resp)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load preowned listings', err)
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-8 md:p-12 mb-16 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-green-500/5 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div>
                <div className="inline-block mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold border border-green-200 dark:border-green-800">
                    Certified & Inspected
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Trusted <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Pre-Owned Cars</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                  Each vehicle is hand-inspected, road-tested and runs through electronic diagnostics and a multi-point mechanical checklist to ensure safety and reliability. Buy with confidence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TrustBadge title="150+ Point Inspection" subtitle="Mechanical, electrical & safety checks" icon="🔧" />
                <TrustBadge title="Road-Tested" subtitle="Real-world driving & handling tests" icon="🛣️" />
                <TrustBadge title="Verified History" subtitle="Accident & title checks (CARFAX-like)" icon="📋" />
                <TrustBadge title="Warranty Options" subtitle="Optional certified pre-owned warranty" icon="🛡️" />
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/search?cars=Used" className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Browse Certified Pre-Owned
                </Link>
                <Link to="/add-listing" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300">
                  Sell a Certified Vehicle
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))
              ) : (
                previewTop.map((s, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-lg aspect-[4/3]">
                    <img
                      src={s?.images?.[0]?.imageUrl ?? '/placeholder-car.jpg'}
                      alt={s?.listingTitle ?? 'Car'}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 border border-green-200 dark:border-green-800 shadow-sm">
                      ✓ Inspected
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {s?.sellingPrice ? `$${s.sellingPrice}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* What we test Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Rigorous Quality Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Battery & Charging", desc: "Complete electrical diagnostic & battery health verified.", icon: "⚡", color: "from-yellow-400 to-orange-500" },
              { title: "Brakes & Suspension", desc: "Pad wear, rotor runout, shock performance and alignment checks.", icon: "🛑", color: "from-red-500 to-pink-500" },
              { title: "Engine & Emissions", desc: "Compression, leak-down, and emissions system checks.", icon: "⚙️", color: "from-blue-500 to-cyan-500" }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-150`} />

                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl text-white shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                  {item.icon}
                </div>

                <h4 className="font-bold text-2xl mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-colors">
                  {item.title}
                </h4>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {item.desc}
                </p>

                <div className="mt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Listings */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Featured Certified Vehicles
            </h3>
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
      </main>
      <Footer />
    </div>
  )
}

export default PreOwned
