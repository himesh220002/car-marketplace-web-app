import React, { useEffect, useState } from 'react'
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
import { db } from '../../configs'
import { CarListing } from '../../configs/schema'
import { eq, lte, and } from 'drizzle-orm'
import { Link } from 'react-router-dom';


function Search() {

    const [cars, setCars] = useState<string | undefined>();
const [make, setMake] = useState<string | undefined>();
const [price, setPrice] = useState<string | undefined>();


    const [isOpen, setIsOpen] = useState(false);
    const [availableMakes, setAvailableMakes] = useState<string[] | null>(null)
    const [availableTypes, setAvailableTypes] = useState<string[] | null>(null)
    const [availablePrices, setAvailablePrices] = useState<string[] | null>(null)

    useEffect(()=>{
        // Recompute availability for each dimension whenever any selection changes.
        const fetchAvailability = async () => {
            try {
                // Using `any` here is necessary because drizzle condition helpers return complex types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filtersForMake: any[] = []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filtersForType: any[] = []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filtersForPriceBase: any[] = []

                if (cars) {
                    filtersForMake.push(eq(CarListing.type, cars))
                    filtersForPriceBase.push(eq(CarListing.type, cars))
                }
                if (make) {
                    filtersForType.push(eq(CarListing.make, make))
                    filtersForPriceBase.push(eq(CarListing.make, make))
                }
                if (price) {
                    const num = parseInt(price || '')
                    if (!Number.isNaN(num)) {
                        filtersForMake.push(lte(CarListing.sellingPrice, num))
                        filtersForType.push(lte(CarListing.sellingPrice, num))
                    }
                }

                // available makes
                const makeRows = await db.select({ make: CarListing.make }).from(CarListing).where(and(...filtersForMake))
                const makes = Array.from(
                    new Set(
                        makeRows
                            .map((r: unknown) => {
                                const obj = r as Record<string, unknown>
                                const v = obj?.make
                                return typeof v === 'string' ? v : undefined
                            })
                            .filter(Boolean) as string[]
                    )
                )
                setAvailableMakes(makes.length ? makes : null)

                // available types
                const typeRows = await db.select({ type: CarListing.type }).from(CarListing).where(and(...filtersForType))
                const types = Array.from(
                    new Set(
                        typeRows
                            .map((r: unknown) => {
                                const obj = r as Record<string, unknown>
                                const v = obj?.type
                                return typeof v === 'string' ? v : undefined
                            })
                            .filter(Boolean) as string[]
                    )
                )
                setAvailableTypes(types.length ? types : null)

                // available prices (thresholds)
                const priceAvail: string[] = []
                for (const p of data.Pricing) {
                    const thresh = parseInt(p.amount as string)
                    if (Number.isNaN(thresh)) continue
                    const rows = await db.select().from(CarListing).where(and(...filtersForPriceBase, lte(CarListing.sellingPrice, thresh)))
                    if (rows && rows.length > 0) priceAvail.push(p.amount as string)
                }
                setAvailablePrices(priceAvail.length ? priceAvail : null)

                // Clear invalid selections
                if (make && Array.isArray(makes) && makes.length && !makes.includes(make)) {
                    setMake(undefined)
                }
                if (cars && Array.isArray(types) && types.length && !types.includes(cars)) {
                    setCars(undefined)
                }
                if (price && Array.isArray(priceAvail) && priceAvail.length && !priceAvail.includes(price)) {
                    setPrice(undefined)
                }
            } catch (err) {
                console.error('Error fetching availability', err)
                setAvailableMakes(null)
                setAvailableTypes(null)
                setAvailablePrices(null)
            }
        }

        fetchAvailability()
    },[cars, make, price])

    return (
        <React.Fragment>
        <div className='p-2 md:p-5 bg-transparent md:bg-white rounded-md md:rounded-full 
                     flex-col sm:justify-end md:flex md:flex-row gap-10 px-5 items-center w-full md:w-[600px] lg:w-[820px]'>
            <Select onValueChange={(value)=>setCars(value === 'all' ? undefined : value)}>
                <SelectTrigger className="w-full outline-none md:border-none shadow-none text-lg bg-white mb-1">
                    <SelectValue placeholder="Car" />
                </SelectTrigger>
                <SelectContent>
                {data.Type.map((type, index)=>{
                        const isDisabled = Array.isArray(availableTypes)
                            ? !availableTypes.includes(type.name)
                            : false
                        return (
                            <SelectItem key={type.name || index} value={type.name} disabled={isDisabled}>
                                {type.name}
                            </SelectItem>
                        )
                    })}
                <SelectItem key="all-cars" value="all">All Cars</SelectItem>
                    
                </SelectContent>
            </Select>
            <Separator orientation="vertical" className='hidden md:block'/>
            <Select onValueChange={(value)=>setMake(value === 'all' ? undefined : value)}>
                <SelectTrigger className="w-full outline-none md:border-none shadow-none text-lg bg-white mb-1">
                    <SelectValue placeholder="Car Makes " />
                </SelectTrigger>
                <SelectContent>
                    {data.CarMakes.map((maker, index)=>{
                        const isDisabled = Array.isArray(availableMakes)
                            ? !availableMakes.includes(maker.name)
                            : false
                        return (
                            <SelectItem key={maker.name || index} value={maker.name} disabled={isDisabled}>
                                {maker.name}
                            </SelectItem>
                        )
                    })}
                    <SelectItem key="all-car-makes" value="all">All Car Makers</SelectItem>
                    
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
                {data.Pricing.map((Price, index)=>{
                        const amt = Price.amount as string
                        const isDisabled = Array.isArray(availablePrices)
                            ? !availablePrices.includes(amt)
                            : false
                        return (
                            <SelectItem key={amt || index} value={amt.toString()} disabled={isDisabled}>
                                {amt}
                            </SelectItem>
                        )
                    })}
                <SelectItem key="all-pricing" value="all">All Pricing</SelectItem>

                </SelectContent>
            </Select>
            
            <Link to={'/search?cars='+cars+'&make='+make+'&price='+price} >
                
                <CiSearch className='text-[50px] bg-blue-700 rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer ml-auto' />
                
            </Link>

        </div>
        </React.Fragment>
    )
}

export default Search