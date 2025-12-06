import { useEffect, useState, useRef } from 'react';

function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const stats = [
        { label: "Total Cars", value: 2500, suffix: "+" },
        { label: "Verified Dealers", value: 150, suffix: "+" },
        { label: "Happy Customers", value: 12000, suffix: "+" },
        { label: "Daily Listings", value: 50, suffix: "+" },
    ];

    return (
        <div ref={sectionRef} className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-4">
                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                <Counter target={stat.value} isVisible={isVisible} />
                                {stat.suffix}
                            </div>
                            <div className="text-slate-300 font-medium text-lg">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Counter = ({ target, isVisible }: { target: number; isVisible: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = target;
        const duration = 2000;
        const incrementTime = 20; // Update every 20ms
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

export default StatsSection;
