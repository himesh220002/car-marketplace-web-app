import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { FaUsers, FaHandshake, FaLeaf, FaLightbulb, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

function About() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);

    const stats = [
        { label: "Cars Listed", value: 10000, suffix: "+" },
        { label: "Verified Dealers", value: 500, suffix: "+" },
        { label: "Customer Satisfaction", value: 95, suffix: "%" },
        { label: "Cities Covered", value: 50, suffix: "+" },
    ];

    const values = [
        { icon: FaLightbulb, title: "Innovation", desc: "Pioneering new ways to buy and sell cars." },
        { icon: FaHandshake, title: "Trust", desc: "Building relationships based on transparency." },
        { icon: FaUsers, title: "Customer First", desc: "Your journey is our priority, always." },
        { icon: FaLeaf, title: "Sustainability", desc: "Driving towards a greener automotive future." },
    ];

    const team = [
        { name: "Cypher Harley", role: "CEO & Founder", img: "/Company/omen-valorant.jpg" },
        { name: "Priya Sharma", role: "CTO", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOY0gPi7ZyCH5x0vzUde6NQ2Yu8rSYQWOteA&s" },
        { name: "Rohan Mehra", role: "Head of Design", img: "https://images.news18.com/ibnlive/uploads/2023/08/roshan.png" },
        { name: "Taylor kumari", role: "Marketing Lead", img: "https://hips.hearstapps.com/hmg-prod/images/taylor-swift-attends-the-67th-annual-grammy-awards-on-news-photo-1748619744.pjpeg?crop=1xw:0.84383xh;center,top" },
    ];

    const timeline = [
        { year: "2020", title: "Inception", desc: "OneCar was founded with a vision to simplify car buying." },
        { year: "2021", title: "Rapid Growth", desc: "Expanded to 10 major cities and onboarded 100+ dealers." },
        { year: "2022", title: "Tech Innovation", desc: "Launched AI-powered pricing and virtual inspections." },
        { year: "2023", title: "Market Leader", desc: "Became India's most trusted automotive marketplace." },
    ];

    const faqs = [
        { q: "What makes OneCar different?", a: "We offer a fully verified ecosystem with transparent pricing and certified inspections." },
        { q: "Are the dealers verified?", a: "Yes, every dealer on our platform undergoes a strict background check and quality audit." },
        { q: "Do you offer financing?", a: "Absolutely. We partner with leading banks to provide instant loan approvals." },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000')] bg-cover bg-center fixed-bg"></div>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Driving the <span className="text-blue-400">Future</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
                        At OneCar, we’re not just a marketplace — we’re building India’s most trusted automotive ecosystem.
                    </p>
                </div>
            </div>

            {/* Stats Strip */}
            <div ref={statsRef} className="bg-blue-600 py-12 text-white">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    <Counter target={stat.value} isVisible={isVisible} />{stat.suffix}
                                </div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="py-20 container mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                            Our Mission
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                            To revolutionize the way people buy, sell, and own cars by providing a seamless, transparent, and technology-driven experience. We believe in empowering our users with data and trust.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {values.map((val, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                    <val.icon className="text-3xl text-blue-600 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">{val.title}</h3>
                                    <p className="text-sm text-slate-500">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000"
                            alt="Team meeting"
                            className="relative rounded-3xl shadow-2xl"
                        />
                        <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                            <p className="font-bold text-lg mb-2">"Trust is our currency."</p>
                            <p className="text-sm text-slate-500">- Arjun Kapoor, CEO</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-100 dark:bg-slate-900/50 py-20">
                <div className="container mx-auto px-5">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
                        <p className="text-slate-600 dark:text-slate-400">From a garage startup to a market leader.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="w-full md:w-5/12"></div>
                                    <div className="z-10 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg mb-4 md:mb-0">
                                        {item.year.slice(2)}
                                    </div>
                                    <div className="w-full md:w-5/12 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 text-center md:text-left">
                                        <div className="text-blue-600 font-bold text-xl mb-2">{item.year}</div>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-20 container mx-auto px-5">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
                    <p className="text-slate-600 dark:text-slate-400">The minds behind the machine.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="group text-center">
                            <div className="relative mb-6 inline-block">
                                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-48 h-48 rounded-full object-cover shadow-lg mx-auto grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                            <p className="text-blue-600 font-medium">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div className="bg-slate-900 py-20 text-white text-center">
                <div className="container mx-auto px-5">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">See OneCar in Action</h2>
                    <div className="max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                        <iframe
                            className="w-full h-full object-cover"
                            src="https://www.youtube.com/embed/PrqYohBV58o?autoplay=0&mute=0&controls=1&showinfo=0&rel=0"
                            title="OneCar Brand Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>

            {/* FAQ & CTA */}
            <div className="py-20 container mx-auto px-5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Common Questions</h2>
                    <div className="space-y-4 mb-16">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex justify-between items-center p-5 text-left font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    {faq.q}
                                    {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {openFaq === index && (
                                    <div className="p-5 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
                            Join thousands of happy customers and experience the future of car buying today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/search">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl font-bold">
                                    Browse Cars
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" className="border-white text-blue-600 hover:text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl font-bold">
                                    Join as Dealer
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

const Counter = ({ target, isVisible }: { target: number; isVisible: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = target;
        const duration = 2000;
        const incrementTime = 20;
        const step = Math.ceil(end / (duration / incrementTime));

        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [isVisible, target]);

    return <span>{count.toLocaleString()}</span>;
};

export default About
