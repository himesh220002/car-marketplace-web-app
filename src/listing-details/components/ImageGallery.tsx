
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

type Props = {
    carDetail: any
}

function ImageGallery({ carDetail }: Props) {
    if (!carDetail?.images || carDetail.images.length === 0) return null;

    if (carDetail?.images.length <= 1) {
        return (
            <div>
                <img
                    src={carDetail?.images[0]?.imageUrl}
                    className="w-full h-[250px] sm:h-[300px] md:h-[500px] lg:h-[600px] object-cover rounded-xl"
                />
            </div>
        );
    }

    return (
        <div className="relative group w-full">
            <Carousel>
                <CarouselContent>
                    {carDetail.images.map((img: any, index: number) => (
                        <CarouselItem key={index}>
                            <img
                                src={img.imageUrl}
                                alt={`Car image ${index + 1}`}
                                className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] 2xl:h-[600px] object-cover rounded-xl"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='left-2 sm:left-2 md:left-2 size-5 opacity-70 lg:opacity-0 group-hover:size-8  group-hover:opacity-100 transition-all duration-800' />
                <CarouselNext className='right-2 sm:right-2 md:right-2 size-5 opacity-70 lg:opacity-0 group-hover:size-8  group-hover:opacity-100 transition-all duration-800' />
            </Carousel>
        </div>
    );
}

export default ImageGallery;
