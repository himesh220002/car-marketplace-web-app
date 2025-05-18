import IconField from '@/add-listing/components/IconField'
import CarSpecification from '@/Shared/CarSpecification'
import React,{useState} from 'react'

function Specification({carDetail}) {
  const [hoveredField, setHoveredField] = useState(null)

  if (!carDetail) return null

  let trans_img= '';
  if(carDetail?.transmission == 'Manual'){
    trans_img = 'manual-transmission.webp';
  }else{
    trans_img= 'auto-transmission.jpg'
  }
  const getDriveType = (driveType :string) => {
    switch (driveType) {
        case 'FWD':
            return '/FWDDriveType.png';
        case 'RWD':
            return '/RWDDriveType.png';
        case '4WD':
            return '/4WDDriveType.png';
        case 'AWD':
            return '/AWDDriveType.png';
        default:
           return '/AWDDriveType.png' 
    }
  }   
           const driveType = carDetail?.driveType;
           const driveType_img = getDriveType(driveType);

  const imageMap = {
    driveType: `/icons/${driveType_img}`,
    transmission: `/icons/${trans_img}`,
  }
    

return (
<div className='p-10 rounded-xl border shadow-md mt-7'>
      <h2 className='font-medium text-2xl'>Specification</h2>
      {carDetail?CarSpecification.map((item, index) => {
        // 🔒 Show "Distance Travelled" only if type === "New"
        if (item.name === 'distanceTravelled' && carDetail.type === 'New') {
          return null;
        }
        if(item.name === 'cylinder' && carDetail.fuelType === 'Electric'){
            return null;
        }

        // 🛠 Append suffix for mileage (if required)
        const isMileage = item.name === 'mileage';
        const suffix = isMileage
          ? carDetail.fuelType === 'Electric'
            ? ' Km/Chrg.'
            : ' Km/L'
          : '';

        return (
          <div key={index} 
          className='mt-5 flex items-center justify-between relative'
          onMouseEnter={() => setHoveredField(item.name)}
                onMouseLeave={() => setHoveredField(null)}
          >
            <h2 className='flex flex-wrap gap-2'>
              <IconField icon={item?.icon} /> {item.label}
               {/* ✅ Hover Image Preview */}
               {['driveType', 'transmission'].includes(item.name) &&
                    hoveredField === item.name && (
                      <img
                        src={imageMap[item.name]}
                        alt={item.name}
                        className='absolute bottom-0 right-25 md:right-60 lg:right-90 w-[0px] md:w-[150px] object-cover rounded-xl shadow border z-50'
                      />
                    )}
            </h2>
            <h2>{carDetail?.[item?.name]}{suffix}</h2>
          </div>
        );
      }):
      <div className='w-full h-[500px] rounded-xl bg-slate-200 animate-pulse'></div>
      }
    </div>
  );
}

export default Specification