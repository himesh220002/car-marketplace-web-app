import Header from '@/components/Header'
import Footer from '@/components/Footer'

function About() {
    return (
        <div>
            <Header />
            <div className="container mx-auto px-5 py-10 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        About OneCar
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                        We are redefining the car buying experience. At OneCar, we believe in transparency, quality, and innovation.
                        Our mission is to connect car enthusiasts with their dream vehicles through a seamless, secure, and premium platform.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-2">Innovation</h3>
                            <p className="text-slate-500">Leveraging technology to make car trading effortless.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold mb-2">Trust</h3>
                            <p className="text-slate-500">Verified listings and secure transactions for peace of mind.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                            <div className="text-4xl mb-4">💎</div>
                            <h3 className="text-xl font-bold mb-2">Quality</h3>
                            <p className="text-slate-500">Only the best vehicles make it to our marketplace.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About
