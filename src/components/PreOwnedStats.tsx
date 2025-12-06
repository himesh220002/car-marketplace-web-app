import { useEffect, useState, useRef } from 'react';
import { FaShieldAlt, FaCar, FaHistory, FaAward } from 'react-icons/fa';

function PreOwnedStats() {
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
        {
            label: "Certified Vehicles",
            value: 500,
            suffix: "+",
            icon: FaAward,
            color: "text-yellow-500"
        },
        {
            label: "Accident-Free",
            value: 100,
            suffix: "%",
            icon: FaShieldAlt,
            color: "text-green-500"
        },
        {
            label: "Happy Buyers",
            value: 8500,
            suffix: "+",
            icon: FaHistory,
            color: "text-blue-500"
        },
        {
            label: "Models Available",
            value: 120,
            suffix: "+",
            icon: FaCar,
            color: "text-purple-500"
        },
    ];

    return (
        <div ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 text-center group">
                            <div className={`inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-700 mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="text-3xl" />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                                <Counter target={stat.value} isVisible={isVisible} />
                                {stat.suffix}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
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

export default PreOwnedStats;
