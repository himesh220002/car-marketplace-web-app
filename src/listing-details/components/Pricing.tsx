import  { useState } from 'react';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { Button } from '@/components/ui/button';


function Pricing({ carDetail }: any) {
  const [currency, setCurrency] = useState('USD');
  const exchangeRate = 85; // Static for now — replace with API for live rates

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'USD' ? 'INR' : 'USD'));
  };

  // Format numbers with commas
  const formatPrice = (price: number, currency:string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN').format(price); // 1,00,000
    } else {
      return new Intl.NumberFormat('en-US').format(price); // 100,000
    }
  };

  const getPrice = () => {
    if (!carDetail?.sellingPrice) return 0;

    return currency === 'USD'
      ? `$${formatPrice(carDetail.sellingPrice, 'USD')}`
      : `₹${formatPrice(carDetail.sellingPrice * exchangeRate, 'INR')}`;
  };

  return (
    <div className="p-10 rounded-xl border shadow-md">
      <h2>Our Price</h2>
      {carDetail ? (
        <div>
          <div className="flex items-center justify-between ">
          
            <h2 className="font-bold text-4xl">{getPrice()}</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-2xl"
              onClick={toggleCurrency}
            >
              {currency === 'USD' ? '₹' : '$'}
            </Button>
          </div>

          <Button className="bg-blue-700 w-full mt-7" size="lg">
            <MdOutlineLocalOffer className="text-lg mr-2" />
            Make an Offer Price
          </Button>
        </div>
      ) : (
        <div className="w-full rounded-xl h-[110px] bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default Pricing;
