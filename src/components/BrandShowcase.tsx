import { SiToyota, SiHonda, SiBmw, SiMercedes, SiAudi, SiTesla, SiFord, SiHyundai, SiVolkswagen, SiNissan } from "react-icons/si";

function BrandShowcase() {
    const brands = [
        { name: "Toyota", icon: SiToyota },
        { name: "Honda", icon: SiHonda },
        { name: "BMW", icon: SiBmw },
        { name: "Mercedes", icon: SiMercedes },
        { name: "Audi", icon: SiAudi },
        { name: "Tesla", icon: SiTesla },
        { name: "Ford", icon: SiFord },
        { name: "Hyundai", icon: SiHyundai },
        { name: "Volkswagen", icon: SiVolkswagen },
        { name: "Nissan", icon: SiNissan },
    ];

    return (
        <div className="py-12 bg-slate-50 dark:bg-slate-900 overflow-hidden rounded-2xl">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    Trusted by Top Brands
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Explore vehicles from the world's most renowned manufacturers.
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
                    {/* First set of brands */}
                    {brands.map((brand, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer mx-4">
                            <brand.icon className="text-5xl md:text-6xl" />
                            <span className="text-sm font-medium">{brand.name}</span>
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {brands.map((brand, index) => (
                        <div key={`duplicate-${index}`} className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer mx-4">
                            <brand.icon className="text-5xl md:text-6xl" />
                            <span className="text-sm font-medium">{brand.name}</span>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-12 items-center ml-12">
                    {/* Second duplicate set for seamless loop logic if needed, but standard marquee usually just needs double content in one container or two containers. 
               Let's stick to the standard CSS animation approach. 
               Actually, for a true infinite scroll with Tailwind, we often need a custom animation in tailwind.config.js.
               I'll assume standard 'animate-marquee' is not defined and use inline styles or standard CSS if possible, 
               or just a simple overflow-x-auto for now if animation is complex to add without config access.
               
               Wait, I can add the animation keyframes in index.css or use a simple scroll snap.
               Let's try a simple flex wrap or overflow-auto for safety first, or better yet, a CSS-based marquee.
           */}
                </div>
            </div>

            {/* Fallback/Simple version if animation is tricky without config */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8 opacity-80">
                {/* This is a static grid fallback, I'll use the marquee if I can inject styles */}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}

export default BrandShowcase;
