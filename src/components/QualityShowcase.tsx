import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiShield, FiTool, FiFileText, FiKey, FiSun } from 'react-icons/fi';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

interface ProcessStep {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    gradient: string;
}

const QualityShowcase = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [api, setApi] = useState<CarouselApi>()
    const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])

    const processSteps: ProcessStep[] = [
        {
            icon: <FiTool className="w-10 h-10" />,
            title: "Testing Grounds",
            description: "Every vehicle undergoes rigorous testing on our specialized tracks to ensure peak performance and safety standards.",
            color: "from-blue-500 to-cyan-500",
            gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
        },
        {
            icon: <FiCheckCircle className="w-10 h-10" />,
            title: "Quality Assurance",
            description: "Our certified technicians perform comprehensive 150-point inspections to guarantee excellence in every detail.",
            color: "from-purple-500 to-pink-500",
            gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
        },
        {
            icon: <FiShield className="w-10 h-10" />,
            title: "Electronics Supervised",
            description: "Advanced diagnostic systems monitor all electronic components, ensuring cutting-edge technology functions flawlessly.",
            color: "from-green-500 to-emerald-500",
            gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20"
        },
        {
            icon: <FiFileText className="w-10 h-10" />,
            title: "Insurance & Documentation",
            description: "Complete insurance coverage and verified documentation provide peace of mind for every transaction.",
            color: "from-orange-500 to-red-500",
            gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20"
        },
        {
            icon: <FiKey className="w-10 h-10" />,
            title: "Purchase Process",
            description: "Streamlined buying experience with transparent pricing, flexible financing, and hassle-free paperwork.",
            color: "from-indigo-500 to-blue-500",
            gradient: "bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
        },
        {
            icon: <FiSun className="w-10 h-10" />,
            title: "Vacation Rentals",
            description: "Premium fleet available for your dream getaways, with flexible rental terms and 24/7 roadside assistance.",
            color: "from-yellow-500 to-orange-500",
            gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
        }
    ];

    useEffect(() => {
        if (!api) {
            return
        }

        const handleSelect = () => {
            // Pause all videos when slide changes
            videoRefs.current.forEach((iframe) => {
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
                }
            })
        }

        api.on("select", handleSelect)

        return () => {
            api.off("select", handleSelect)
        }
    }, [api])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only need to trigger once
                }
            },
            { threshold: 0.1 } // Trigger earlier
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const handleScroll = () => {
            if (!sectionRef.current) return;

            // Use requestAnimationFrame for performance
            requestAnimationFrame(() => {
                if (!sectionRef.current) return;
                const rect = sectionRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate scroll progress (0 to 1)
                const scrollStart = rect.top - windowHeight;
                const scrollEnd = rect.bottom;
                const scrollRange = scrollEnd - scrollStart;
                const currentScroll = -scrollStart;

                // Make progress reach 1.0 faster (e.g., when element is centered)
                // Original: currentScroll / scrollRange
                // New: Map 0.0-0.6 range to 0.0-1.0 to finish earlier
                const rawProgress = currentScroll / scrollRange;

                // Boost progress so it finishes when the section is roughly centered
                // 0.5 is center. We want to be done by then or shortly after.
                const progress = Math.max(0, Math.min(1, rawProgress * 1.5));
                setScrollProgress(progress);
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header with Enhanced Animation */}
                <div className="text-center mb-20">
                    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-block mb-4">
                            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                Our Commitment to Excellence
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                Quality Promise
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Every vehicle on our platform undergoes a meticulous journey through our
                            <span className="font-semibold text-blue-600 dark:text-blue-400"> six-stage quality process</span>,
                            ensuring you receive nothing but excellence
                        </p>
                    </div>
                </div>

                {/* Process Steps with Staggered Animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {processSteps.map((step, index) => {
                        const delay = index * 150;
                        const itemProgress = Math.max(0, Math.min(1, (scrollProgress - index * 0.08) * 3));

                        return (
                            <div
                                key={index}
                                className="group relative"
                                style={{
                                    opacity: itemProgress,
                                    transform: `translateY(${(1 - itemProgress) * 60}px) scale(${0.9 + itemProgress * 0.1})`,
                                    transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`
                                }}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500`} />

                                {/* Card */}
                                <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm">
                                    {/* Animated Background Pattern */}
                                    <div className={`absolute inset-0 ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon Container */}
                                        <div className={`relative w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                                            {step.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                                    {/* Corner Accent */}
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.color} opacity-10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced Stats Section */}
                <div className={`mt-24 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-3xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
                        {[
                            { value: "150+", label: "Point Inspection", icon: "✓" },
                            { value: "100%", label: "Verified Cars", icon: "★" },
                            { value: "24/7", label: "Support", icon: "◉" },
                            { value: "5.0", label: "Customer Rating", icon: "♥" }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="text-center group cursor-pointer"
                                style={{
                                    animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                                }}
                            >
                                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Embedded Video Carousel Section */}
                <div className={`mt-16 max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <Carousel setApi={setApi} className="w-full relative group">
                        <CarouselContent>
                            {[
                                { id: "PrqYohBV58o", title: "Top Gear" },
                                { id: "sM7dhUQLvJQ", title: "Performance Testing" },
                                { id: "lYI5WF2D59g", title: "Safety Crash Test" },

                            ].map((video, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-3 py-1  rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                                            Live Testing Feed • {video.title}
                                        </span>
                                    </div>
                                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 aspect-video">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none z-10" />
                                        <iframe
                                            ref={(el) => { videoRefs.current[index] = el; return; }}
                                            className="w-full h-full object-cover"
                                            src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&loop=1&playlist=${video.id}&controls=1&showinfo=0&rel=0&enablejsapi=1`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-12 -bottom-12 top-auto translate-y-0 sm:top-auto sm:translate-y-0 sm:left-12 xl:top-1/2 xl:-translate-y-1/2 xl:-left-12 bg-gray-700/10 hover:bg-black border-white/20 hover:text-white text-black backdrop-blur-md cursor-pointer" />
                        <CarouselNext className="absolute right-12 -bottom-12 top-auto translate-y-0 md:top-auto md:translate-y-0 md:right-12 xl:top-1/2 xl:-translate-y-1/2 xl:-right-12 bg-gray-700/10 hover:bg-black border-white/20 hover:text-white text-black backdrop-blur-md cursor-pointer" />
                    </Carousel>
                </div>

                {/* Progress Indicator */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${scrollProgress * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-center mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Scroll to explore our quality journey • {Math.round(scrollProgress * 100)}% Complete
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .bg-grid-slate-200\\/50 {
          background-image: linear-gradient(to right, rgb(226 232 240 / 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgb(226 232 240 / 0.5) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }

        .dark .bg-grid-slate-800\\/50 {
          background-image: linear-gradient(to right, rgb(30 41 59 / 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgb(30 41 59 / 0.5) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
        </section>
    );
};

export default QualityShowcase;
