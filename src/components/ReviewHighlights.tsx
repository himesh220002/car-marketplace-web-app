import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const reviews = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Verified Buyer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        rating: 5,
        text: "I was hesitant about buying a used car, but the transparency here is unmatched. The full service history and accident-free guarantee gave me total peace of mind.",
        car: "2020 BMW 3 Series"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Car Enthusiast",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        rating: 5,
        text: "Found a rare spec Mustang in pristine condition. The dealer was professional, and the car was exactly as described. Highly recommend for premium pre-owned vehicles.",
        car: "2018 Ford Mustang GT"
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "First-Time Buyer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
        rating: 4,
        text: "Great experience! The 7-day return policy really took the pressure off. I love my new (to me) SUV. It runs like a dream.",
        car: "2021 Hyundai Tucson"
    },
    {
        id: 4,
        name: "David Wilson",
        role: "Verified Buyer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        rating: 5,
        text: "The certified pre-owned program is the real deal. My Audi looked and felt brand new, but at a fraction of the price. Excellent value.",
        car: "2019 Audi A4"
    }
];

function ReviewHighlights() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextReview, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="py-16 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Trusted by Thousands
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        See what our customers have to say about their experience buying premium pre-owned vehicles.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Main Card */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 relative">
                        <FaQuoteLeft className="text-4xl text-blue-200 dark:text-blue-900 absolute top-8 left-8" />

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                                    <img
                                        src={reviews[currentIndex].image}
                                        alt={reviews[currentIndex].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex justify-center md:justify-start gap-1 mb-3 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < reviews[currentIndex].rating ? "fill-current" : "text-slate-300 dark:text-slate-600"} />
                                    ))}
                                </div>

                                <blockquote className="text-xl md:text-2xl font-medium text-slate-800 dark:text-white mb-6 italic">
                                    "{reviews[currentIndex].text}"
                                </blockquote>

                                <div>
                                    <div className="font-bold text-lg text-slate-900 dark:text-white">
                                        {reviews[currentIndex].name}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {reviews[currentIndex].role} • Purchased {reviews[currentIndex].car}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevReview}
                        className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all z-20"
                        aria-label="Previous review"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={nextReview}
                        className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all z-20"
                        aria-label="Next review"
                    >
                        <FaChevronRight />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "bg-blue-600 w-8"
                                        : "bg-slate-300 dark:bg-slate-600 hover:bg-blue-400"
                                    }`}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewHighlights;
