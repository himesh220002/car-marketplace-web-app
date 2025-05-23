import  { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from './ui/separator'

import { CiSearch } from "react-icons/ci";
import data from '@/Shared/Data';
import { Link } from 'react-router-dom';


function Search() {

    const [cars, setCars] = useState<string | undefined>();
const [make, setMake] = useState<string | undefined>();
const [price, setPrice] = useState<string | undefined>();


    const [isOpen, setIsOpen] = useState(false);
    


    return (
        <div className='p-2 md:p-5 bg-transparent md:bg-white rounded-md md:rounded-full 
                     flex-col sm:justify-end md:flex md:flex-row gap-10 px-5 items-center w-[60%] md:w-[600px] lg:w-[820px]'>
            <Select onValueChange={(value)=>setCars(value === 'all' ? undefined : value)}>
                <SelectTrigger className="w-full outline-none md:border-none shadow-none text-lg bg-white mb-1">
                    <SelectValue placeholder="Car" />
                </SelectTrigger>
                <SelectContent>
                {data.Type.map((type,_index)=>(
                        <SelectItem value={type.name}>{type.name}</SelectItem>
                    ))}
                <SelectItem value="all">All Cars</SelectItem>
                    
                </SelectContent>
            </Select>
            <Separator orientation="vertical" className='hidden md:block'/>
            <Select onValueChange={(value)=>setMake(value === 'all' ? undefined : value)}>
                <SelectTrigger className="w-full outline-none md:border-none shadow-none text-lg bg-white mb-1">
                    <SelectValue placeholder="Car Makes " />
                </SelectTrigger>
                <SelectContent>
                
                    {data.CarMakes.map((maker,_index)=>(
                        <SelectItem value={maker.name}>{maker.name}</SelectItem>
                    ))}
                    <SelectItem value="all">All Car Makers</SelectItem>
                    
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className='hidden md:block'/>
            
            <Select
            onOpenChange={(open) => setIsOpen(open)} 
            onValueChange={(value)=>setPrice(value === 'all' ? undefined : value)}>
                <SelectTrigger className="w-full outline-none md:border-none shadow-none text-lg bg-white mb-1">
                    <SelectValue placeholder={isOpen ? "Pricing(<=)" : "Pricing"} />
                </SelectTrigger>
                <SelectContent>
                {data.Pricing.map((Price,_index)=>(
                        <SelectItem value={Price.amount}>{Price.amount}</SelectItem>
                    ))}
                <SelectItem value="all">All Pricing</SelectItem>

                </SelectContent>
            </Select>
            
            <Link to={'/search?cars='+cars+'&make='+make+'&price='+price} >
                
                <CiSearch className='text-[50px] bg-blue-700 rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer ml-auto' />
                
            </Link>

        </div>
    )
}

export default Search