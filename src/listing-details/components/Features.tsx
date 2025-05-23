
import { FaCheck} from "react-icons/fa";
import { ImCross  } from "react-icons/im";

type featu ={
    features: any
}


function Features({ features }: featu) {
    if (!features) return null; 

   
    return (
        
            <div className='p-4 md:p-10 mt-7  bg-white rounded-xl border shadow-md '>
                <h2 className='text-xl md:text-2xl font-semibold'>Features</h2>
                <div 
                className={`
          grid gap-4 mt-4 
          grid-cols-1 
          sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          sm:max-h-none 
          max-h-[400px] overflow-y-auto
        `}
                >
                    {Object.entries(features).map(([features,value])=>(
                        <div key={features} className='flex  items-center gap-2'>
                            {value ? (<FaCheck className='text-sm md:text-lg p-1 rounded-full bg-blue-100 text-blue-600'/>):(<ImCross  className='text-sm md:text-lg p-1 rounded-full bg-red-100 text-red-500'/>)}
                            {/* <FaCheck className='text-lg p-1 rounded-full text-green-600'/> */}
                           <h2 className='text-sm break-all'> {features}</h2>
                        </div>
                    ))}
                </div>
                {/* {[features]?.map((item,index)=>(
                    <div key={index}>
                        <FaCheck className='text-lg bg-blue-100 text-blue-700'/>
                    </div>
                ))} */}
            </div>
        
    )
}

export default Features