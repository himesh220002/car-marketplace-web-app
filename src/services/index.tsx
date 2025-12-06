import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { FaCar, FaMoneyBillWave, FaClipboardCheck, FaFileContract, FaShieldAlt, FaUserCheck, FaStar, FaArrowRight } from 'react-icons/fa'

function Services() {
    const services = [
        {
            title: "Buy a Car",
            description: "Unlock thousands of verified listings — from brand-new launches to certified pre-owned gems — all tailored to your lifestyle and budget.",
            icon: FaCar,
            action: "Browse Inventory",
            link: "/search",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            stats: "10,000+ Cars Available"
        },
        {
            title: "Sell Your Car",
            description: "Turn your car into cash faster. Our marketplace connects you with serious buyers and guarantees transparent pricing.",
            icon: FaMoneyBillWave,
            action: "List Your Car",
            link: "/add-listing",
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/20",
            stats: "Avg. Sale in 3 Days"
        },
        {
            title: "Premium Inspection",
            description: "Drive with confidence. Every inspection covers 150+ checkpoints, giving you a certified report you can trust.",
            icon: FaClipboardCheck,
            action: "Book Inspection",
            link: "/contact",
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            stats: "150+ Checkpoints"
        },
        {
            title: "Financing Options",
            description: "Flexible plans, low interest, instant approvals — because your dream car shouldn't wait.",
            icon: FaFileContract,
            action: "Get Approved",
            link: "/contact",
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            stats: "98% Approval Rate"
        }
    ]

    const testimonials = [
        {
            quote: "I sold my car in 3 days! The process was seamless and I got a great price.",
            author: "Alex M.",
            role: "Seller"
        },
        {
            quote: "The inspection report saved me from buying a lemon. Worth every penny.",
            author: "Sarah J.",
            role: "Buyer"
        },
        {
            quote: "Financing was approved in minutes. drove my new car home the same day.",
            author: "David K.",
            role: "Buyer"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

                <div className="container mx-auto px-5 relative z-10 text-center">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold backdrop-blur-sm">
                        Comprehensive Auto Services
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Automotive Partner</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Buy, sell, finance, and drive with confidence. We provide the tools and services to make your car journey smooth and secure.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/search">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20">
                                Explore Services
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trust Strip */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-5 py-8">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                            <FaShieldAlt className="text-blue-500 text-xl" /> Verified Dealers
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                            <FaUserCheck className="text-green-500 text-xl" /> Certified Inspections
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                            <FaStar className="text-yellow-500 text-xl" /> 4.9/5 Customer Rating
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-5 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {services.map((service, index) => (
                        <div key={index} className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${service.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}></div>

                            <div className="relative z-10">
                                <div className={`inline-flex p-4 rounded-2xl ${service.bg} ${service.color} mb-6`}>
                                    <service.icon className="text-3xl" />
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">{service.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {service.stats}
                                    </div>
                                    <Link to={service.link} className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                                        {service.action} <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-slate-100 dark:bg-slate-900/50 py-20">
                <div className="container mx-auto px-5">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
                        <p className="text-slate-600 dark:text-slate-400">Real stories from real customers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{t.quote}"</p>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{t.author}</div>
                                    <div className="text-sm text-slate-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Services
