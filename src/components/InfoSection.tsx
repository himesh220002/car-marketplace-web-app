// import React from 'react'

function InfoSection() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">

          <div>
            <img
              src="https://res.cloudinary.com/dbcx5bxea/image/upload/v1747133820/Car-marketplace/cyzomwr0104gdel52q9t.webp"
              className="rounded-xl shadow-2xl border border-amber-50"
              alt="Koenigsegg Agera RS"
            />
          </div>

          <div>
            <div className=" max-w-lg md:max-w-none">
              <h2 className="text-2xl font-extrabold font-serif  sm:text-3xl">
                Koenigsegg Agera RS: A Hypercar Beyond Limits
              </h2>

              <p className="mt-4 text-gray-500 font-sans"><i>
                The Koenigsegg Agera RS is a rare masterpiece combining advanced technology,
                lightweight carbon fiber construction, and a 5.0L twin-turbo V8 engine delivering
                1160+ horsepower. Known for its record-breaking top speed of over 277 mph (446 km/h),
                it blends performance, luxury, and precision engineering. Limited to just 25 units
                worldwide, the Agera RS redefines automotive excellence.</i>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default InfoSection
