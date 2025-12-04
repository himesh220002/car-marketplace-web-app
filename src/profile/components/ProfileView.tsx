/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { db } from '../../../configs'
import { CarListing, CarImages } from '../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'
// Chart.js will be dynamically imported at runtime if available (run `npm install` to add chart.js + react-chartjs-2)

// Chart.js Line chart will be used for price trend (react-chartjs-2 + chart.js must be installed).

type Listing = {
  id?: number
  sellingPrice?: number | string
  make?: string
  listingTitle?: string
  images?: { imageUrl?: string }[]
  features?: Record<string, boolean>
  [k: string]: unknown
}

const ProfileView: React.FC = () => {
  const { user } = useUser()
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [ChartComp, setChartComp] = useState<React.ComponentType<any> | null>(null)
  // number of visible cards in the Owned Vehicles grid
  const [visibleCount, setVisibleCount] = useState<number>(6)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      try {
        const result = await db.select().from(CarListing).leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId)).where(eq(CarListing.createdBy, user.primaryEmailAddress?.emailAddress as string)).orderBy(desc(CarListing.id))
        const resp = Service.FormatResult(result)
        if (mounted) setListings(resp)
      } catch (err) {
        console.error('Failed to load profile listings', err)
        if (mounted) setListings([])
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  // Reset visibleCount when listings change (fresh load) so UI shows initial 6
  useEffect(() => {
    setVisibleCount(6)
  }, [listings])

  const stats = useMemo(() => {
    if (!listings) return { count: 0, total: 0, avg: 0, topMakes: [] as [string, number][] }
    const count = listings.length
    const total = listings.reduce((s, it) => s + (Number(it.sellingPrice) || 0), 0)
    const avg = count ? Math.round(total / count) : 0
    const makes: Record<string, number> = {}
    listings.forEach(it => { const m = it.make || it.listingTitle || 'Unknown'; makes[m] = (makes[m] || 0) + 1 })
    const topMakes = Object.entries(makes).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { count, total, avg, topMakes }
  }, [listings])

  const toNumber = (v: unknown) => {
    if (v == null) return 0
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      // strip non-numeric except dot and minus
      const cleaned = v.replace(/[^0-9.-]/g, '')
      const n = Number(cleaned)
      return Number.isFinite(n) ? n : 0
    }
    return Number(v) || 0
  }

  // priceSeriesNumbers: build a chronological (old -> new) time series.
  // Sort by postedOn (if present) otherwise fallback to numeric id. Take up to the last 12 entries.
  const { priceSeriesNumbers, priceLabels } = useMemo(() => {
    const nums: number[] = []
    const labels: string[] = []
    if (!listings) return { priceSeriesNumbers: nums, priceLabels: labels }

    // Defensive copy and compute a numeric key for sorting
    const normalized = listings.map((l) => {
      const posted = l.postedOn ? new Date(String(l.postedOn)) : null
      const t = posted && !Number.isNaN(posted.getTime()) ? posted.getTime() : (typeof l.id === 'number' ? l.id : 0)
      return { src: l, key: t }
    })

    // sort ascending by key (oldest first)
    normalized.sort((a, b) => a.key - b.key)

    // take at most the last 12 entries (most recent), but keep chronological order
    const last = normalized.slice(Math.max(0, normalized.length - 12))

    last.forEach(({ src }) => {
      const n = toNumber(src.sellingPrice)
      nums.push(n)
      // Format label from postedOn when available, otherwise show price or index
      let label = ''
      if (src.postedOn) {
        const d = new Date(String(src.postedOn))
        if (!Number.isNaN(d.getTime())) {
          // e.g. "6 Dec" or "06 Dec" depending on locale
          label = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
        }
      }
      if (!label) label = `$${n ? n.toLocaleString() : '0'}`
      labels.push(label)
    })

    return { priceSeriesNumbers: nums, priceLabels: labels }
  }, [listings])

  const chartData = useMemo(() => {
    const labels = priceLabels.length ? priceLabels : priceSeriesNumbers.map((_, i) => `#${i + 1}`)
    return {
      labels,
      datasets: [
        {
          label: 'Selling price',
          data: priceSeriesNumbers,
          fill: true,
          backgroundColor: 'rgba(79,70,229,0.12)',
          borderColor: 'rgba(79,70,229,1)',
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    }
  }, [priceSeriesNumbers, priceLabels])

  const chartOptions = useMemo(() => {
    const nums = priceSeriesNumbers
    const min = nums.length ? Math.min(...nums) : 0
    const max = nums.length ? Math.max(...nums) : 0
    const padding = Math.max(1, Math.round((max - min) * 0.1))
    const suggestedMin = Math.max(0, Math.floor(min - padding))
    const suggestedMax = Math.ceil(max + padding)
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false, callbacks: { label: (context: any) => `$${Number(context.parsed.y).toLocaleString()}` } },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          suggestedMin,
          suggestedMax,
          ticks: { callback: (v: unknown) => `$${Number(v as number).toLocaleString()}` },
        },
      },
    }
  }, [priceSeriesNumbers])

  // Dynamically load Chart.js + react-chartjs-2 at runtime if available.
  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const [chartJsMod, reactChartMod] = await Promise.all([import('chart.js'), import('react-chartjs-2')])
          const chartModAny = chartJsMod as any
          const ChartJS = chartModAny.Chart
          // register chart components
          ChartJS.register(chartModAny.CategoryScale, chartModAny.LinearScale, chartModAny.PointElement, chartModAny.LineElement, chartModAny.Tooltip, chartModAny.Legend, chartModAny.Filler)
          if (!mounted) return
          const LineComp = (reactChartMod as unknown as { Line: React.ComponentType<unknown> }).Line
          setChartComp(() => LineComp)
        } catch (err) {
          // chart packages not installed or failed to load — leave ChartComp null and show fallback
          console.warn('Chart.js not available:', err)
        }
      })()
    return () => { mounted = false }
  }, [])

  // Heuristic: treat as dealer if user has >= 5 listings
  const isDealer = Boolean(listings && listings.length >= 5)

  const featuresItems = useMemo(() => {
    const featuresCount: Record<string, number> = {}
    const list = listings ?? []
    list.forEach((l: Listing) => {
      const f = (l.features || {}) as Record<string, boolean>
      Object.entries(f).forEach(([k, v]) => { if (v) featuresCount[k] = (featuresCount[k] || 0) + 1 })
    })
    return Object.entries(featuresCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [listings])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-2 md:gap-8">
      <aside className="col-span-1 space-y-6">
        {/* User Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
          <div className="relative mt-8 flex flex-col items-center">
            <div className="p-1 bg-white dark:bg-slate-800 rounded-full mb-4">
              <img src={(user as unknown as { imageUrl?: string })?.imageUrl ?? '/alt_user.avif'} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" alt="profile" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Profile'}</div>
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full mt-2">
              {isDealer ? 'Verified Dealer' : 'Private Seller'}
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-700 pt-6">
            <div className="text-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Listings</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.count}</div>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Price</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.avg ? `$${(stats.avg / 1000).toFixed(1)}k` : '—'}</div>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Value</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.total ? `$${(stats.total / 1000).toFixed(1)}k` : '—'}</div>
            </div>
          </div>
        </div>

        {/* Price Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-lg text-slate-900 dark:text-white">Price Trend</div>
            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">Last 12 Listings</span>
          </div>
          <div className="h-64">
            {priceSeriesNumbers.length ? (
              ChartComp ? (
                <ChartComp data={chartData as unknown} options={chartOptions as unknown} />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-500">Chart library loading...</div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-500">No price history available</div>
            )}
          </div>
        </div>

        {/* Top Makes */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <div className="font-bold text-lg text-slate-900 dark:text-white mb-4">Top Makes</div>
          <div className="space-y-4">
            {stats.topMakes.map(([make, count]) => {
              const pct = stats.count ? Math.round((count / stats.count) * 100) : 0
              return (
                <div key={make} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{make}</span>
                    <span className="text-xs text-slate-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 group-hover:opacity-80" style={{ width: `${Math.max(4, pct)}%` }} />
                  </div>
                </div>
              )
            })}
            {stats.topMakes.length === 0 && <div className="text-sm text-slate-500">No makes yet</div>}
          </div>
        </div>

        {/* Upgrade/Repair/Modify estimator */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <div className="font-bold text-lg text-slate-900 dark:text-white mb-4">Estimated Costs</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            {(() => {
              if (!listings || listings.length === 0) return <div className="text-slate-500">No listings to estimate.</div>
              // Simple heuristics: base upgrade cost, repair factor from mileage, modification bucket
              let totalUpgrade = 0
              let totalRepair = 0
              let totalModify = 0
              const per = listings.map((l) => {
                const price = Number(l.sellingPrice) || 0
                const upgrade = Math.round(Math.min(10000, price * 0.06) + 300) // 6% of price + base 300
                const repair = Math.round(Math.min(8000, (price * 0.02) + 200)) // 2% + 200
                const modify = Math.round(100 + (l.features ? Object.keys(l.features).length * 50 : 0))
                totalUpgrade += upgrade
                totalRepair += repair
                totalModify += modify
                return { id: l.id, title: l.listingTitle, upgrade, repair, modify }
              })

              return (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Upgrade</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-1">${(totalUpgrade / 1000).toFixed(1)}k</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                      <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">Repair</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-1">${(totalRepair / 1000).toFixed(1)}k</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Modify</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-1">${(totalModify / 1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Per vehicle breakdown</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {per.map((p) => (
                        <div key={p.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                          <div className="truncate font-medium text-slate-700 dark:text-slate-300 w-1/2">{p.title ?? `#${p.id}`}</div>
                          <div className="text-xs text-slate-500 flex gap-2">
                            <span className="text-blue-500">U:${(p.upgrade / 1000).toFixed(1)}k</span>
                            <span className="text-orange-500">R:${(p.repair / 1000).toFixed(1)}k</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </aside>

      <div className="col-span-2 mt-5 sm:mt-0">
        <div className="col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Owned Vehicles</h3>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300">
                {listings ? listings.length : 0} Vehicles
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
              {listings && listings.length ? listings.slice(0, visibleCount).map((l: Listing) => (
                <div key={l.id} className="transform hover:scale-105 transition-transform duration-300">
                  <CarItem car={l} />
                </div>
              )) : (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-slate-100 dark:bg-slate-700 rounded-2xl animate-pulse" />
                ))
              )}
            </div>

            {/* Show more button: load 3 more per click */}
            {listings && listings.length > visibleCount && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => setVisibleCount((v) => Math.min((listings?.length ?? 0), v + 3))}
                >
                  Show More Vehicles
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100 dark:border-slate-700">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Features Across Your Cars</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuresItems.length ? featuresItems.map(([k, c]) => (
                <div key={k} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{k}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">{c} cars equipped</div>
                </div>
              )) : <div className="text-sm text-slate-500">No features recorded</div>}
            </div>

            <div className="mt-10">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Future Upgrade Ideas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Battery & Range", desc: "Improved cells & software tuning for EVs.", icon: "🔋", color: "bg-green-50 text-green-600" },
                  { title: "ADAS Upgrade", desc: "Enhanced driver assistance modules for safety.", icon: "🛡️", color: "bg-blue-50 text-blue-600" },
                  { title: "Performance Tune", desc: "ECU remap, intake/exhaust for sportier feel.", icon: "🚀", color: "bg-purple-50 text-purple-600" }
                ].map((item, i) => (
                  <div key={i} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white dark:bg-slate-800">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
