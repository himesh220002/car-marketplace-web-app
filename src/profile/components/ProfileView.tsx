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
    ;(async () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside className="col-span-1 bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4">
          <img src={(user as unknown as { imageUrl?: string })?.imageUrl ?? '/alt_user.avif'} className="w-20 h-20 rounded-full object-cover" alt="profile" />
          <div>
            <div className="text-xl font-bold">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Profile'}</div>
            <div className="text-sm text-slate-500">{isDealer ? 'Dealer' : 'Private Seller'}</div>
            <div className="mt-2 text-sm text-slate-600">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-sm text-slate-500">Listings</div>
            <div className="text-lg font-bold">{stats.count}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500">Avg Price</div>
            <div className="text-lg font-bold">{stats.avg ? `$${stats.avg.toLocaleString()}` : '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500">Total Value</div>
            <div className="text-lg font-bold">{stats.total ? `$${stats.total.toLocaleString()}` : '—'}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-slate-500">Price trend</div>
    <div className="mt-2 h-72">
            {priceSeriesNumbers.length ? (
              ChartComp ? (
                <ChartComp data={chartData as unknown} options={chartOptions as unknown} />
              ) : (
                <div className="text-sm text-slate-500">Chart library not installed — run <code>npm i chart.js react-chartjs-2</code></div>
              )
            ) : (
              <div className="text-sm text-slate-500">No price history</div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-slate-500">Top Makes</div>
          <div className="mt-2 space-y-2">
            {stats.topMakes.map(([make, count]) => {
              const pct = stats.count ? Math.round((count / stats.count) * 100) : 0
              return (
                <div key={make} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{make}</span>
                      <span className="text-xs text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
            {stats.topMakes.length === 0 && <div className="text-sm text-slate-500">No makes yet</div>}
          </div>
        </div>

        {/* Upgrade/Repair/Modify estimator */}
        <div className="mt-6">
          <div className="text-sm text-slate-500">Estimated Costs (Upgrade / Repair / Modify)</div>
          <div className="mt-3 text-sm text-slate-700">
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
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">Upgrade</div>
                      <div className="font-semibold">${totalUpgrade.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">Repair</div>
                      <div className="font-semibold">${totalRepair.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">Modify</div>
                      <div className="font-semibold">${totalModify.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-500">Per vehicle estimate (sample)</div>
                    <div className="mt-2 space-y-2 max-h-40 overflow-auto">
                      {per.map((p) => (
                        <div key={p.id} className="flex justify-between text-sm border-b pb-2">
                          <div className="truncate" style={{ maxWidth: 220 }}>{p.title ?? `#${p.id}`}</div>
                          <div className="text-slate-600">U:${p.upgrade} R:${p.repair} M:${p.modify}</div>
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

      <div className="col-span-2">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Owned Vehicles</h3>
            <div className="text-sm text-slate-500">Showing latest {listings ? listings.length : 0}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings && listings.length ? listings.slice(0, visibleCount).map((l: Listing) => (
              <div key={l.id} className="border rounded-2xl overflow-hidden">
                <CarItem car={l} />
              </div>
            )) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 bg-slate-100 rounded-lg animate-pulse" />
              ))
            )}
          </div>

          {/* Show more button: load 3 more per click */}
          {listings && listings.length > visibleCount && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setVisibleCount((v) => Math.min((listings?.length ?? 0), v + 3))}
              >
                Show more
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="text-lg font-semibold">Top Features Across Your Cars</h4>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {featuresItems.length ? featuresItems.map(([k, c]) => (
              <div key={k} className="p-3 bg-slate-50 rounded-lg text-sm">
                <div className="font-medium">{k}</div>
                <div className="text-slate-500 text-xs">{c} cars</div>
              </div>
            )) : <div className="text-sm text-slate-500">No features recorded</div>}
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold">Future Upgrade Ideas</h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Battery & Range Optimizer</div>
                <div className="text-sm text-slate-500">Improved cells & software tuning for EVs.</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">ADAS Upgrade</div>
                <div className="text-sm text-slate-500">Enhanced driver assistance modules for safety.</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Performance Tune</div>
                <div className="text-sm text-slate-500">ECU remap, intake/exhaust for sportier feel.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
