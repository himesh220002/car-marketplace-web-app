// import React from 'react'

function InfoSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              Featured Hypercar
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Automotive Excellence
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          {/* Image */}
          <div className="group relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition duration-500" />

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
              <img
                src="https://res.cloudinary.com/dbcx5bxea/image/upload/v1747133820/Car-marketplace/cyzomwr0104gdel52q9t.webp"
                className="w-full transform group-hover:scale-110 transition-transform duration-500"
                alt="Koenigsegg Agera RS"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="max-w-lg md:max-w-none">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Koenigsegg Agera RS: A Hypercar Beyond Limits
              </h3>

              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  The Koenigsegg Agera RS is a rare masterpiece combining advanced technology,
                  lightweight carbon fiber construction, and a 5.0L twin-turbo V8 engine delivering
                  <span className="font-semibold text-blue-600 dark:text-blue-400"> 1160+ horsepower</span>.
                </p>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Known for its record-breaking top speed of over
                  <span className="font-semibold text-purple-600 dark:text-purple-400"> 277 mph (446 km/h)</span>,
                  it blends performance, luxury, and precision engineering.
                </p>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Limited to just <span className="font-semibold text-pink-600 dark:text-pink-400">25 units worldwide</span>,
                  the Agera RS redefines automotive excellence.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    1160+
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Horsepower</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    277
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">MPH Top Speed</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                    25
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Units Made</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection
