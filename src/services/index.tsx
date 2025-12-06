import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function Services() {
    const services = [
        {
            title: "Buy a Car",
            description: "Explore our extensive inventory of new and pre-owned vehicles. Filter by make, model, price, and more to find your perfect match.",
            icon: "🚗",
            action: "Browse Cars",
            link: "/search"
        },
        {
            title: "Sell Your Car",
            description: "List your vehicle on our premium marketplace. Reach thousands of potential buyers and get the best value for your car.",
            icon: "💰",
            action: "Start Listing",
            link: "/profile"
        },
        {
            title: "Premium Inspection",
            description: "Get a comprehensive 150-point inspection for any vehicle. Ensure quality and safety before you make a purchase.",
            icon: "🔍",
            action: "Learn More",
            link: "/contact"
        },
        {
            title: "Financing Options",
            description: "We offer flexible financing plans tailored to your needs. Drive away in your dream car with low interest rates.",
            icon: "📝",
            action: "Get Approved",
            link: "/contact"
        }
    ]

    return (
        <div>
            <Header />
            <div className="container mx-auto px-5 py-10 md:py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Our Services
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Everything you need for your automotive journey, all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-shadow">
                            <div className="text-5xl mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
                                {service.description}
                            </p>
                            <Link to={service.link}>
                                <Button className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                                    {service.action}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Services
