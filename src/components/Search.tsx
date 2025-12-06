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

    useEffect(() => {
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
    }, [cars, make, price])

    return (
        <React.Fragment>
            <div className='p-4 md:p-5 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 md:bg-white rounded-2xl md:rounded-full 
                     flex flex-col md:flex-row gap-4 md:gap-10 px-4 md:px-5 items-center w-full md:w-[600px] lg:w-[820px] shadow-xl md:shadow-none border border-white/20 md:border-none'>

                <div className="flex flex-col md:flex-row gap-1 md:gap-10 w-full">
                    <Select onValueChange={(value) => setCars(value === 'all' ? undefined : value)}>
                        <SelectTrigger className="w-full outline-none border-none shadow-none text-lg bg-transparent dark:bg-transparent p-0 h-auto focus:ring-0">
                            <SelectValue placeholder="Car" />
                        </SelectTrigger>
                        <SelectContent>
                            {data.Type.map((type, index) => {
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

                    <Separator orientation="horizontal" className='md:hidden w-full bg-slate-200 dark:bg-slate-700' />
                    <Separator orientation="vertical" className='hidden md:block h-8' />

                    <Select onValueChange={(value) => setMake(value === 'all' ? undefined : value)}>
                        <SelectTrigger className="w-full outline-none border-none shadow-none text-lg bg-transparent dark:bg-transparent p-0 h-auto focus:ring-0">
                            <SelectValue placeholder="Car Makes" />
                        </SelectTrigger>
                        <SelectContent>
                            {data.CarMakes.map((maker, index) => {
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

                    <Separator orientation="horizontal" className='md:hidden w-full bg-slate-200 dark:bg-slate-700' />
                    <Separator orientation="vertical" className='hidden md:block h-8' />

                    <Select
                        onOpenChange={(open) => setIsOpen(open)}
                        onValueChange={(value) => setPrice(value === 'all' ? undefined : value)}>
                        <SelectTrigger className="w-full outline-none border-none shadow-none text-lg bg-transparent dark:bg-transparent p-0 h-auto focus:ring-0">
                            <SelectValue placeholder={isOpen ? "Pricing(<=)" : "Pricing"} />
                        </SelectTrigger>
                        <SelectContent>
                            {data.Pricing.map((Price, index) => {
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
                </div>

                <div className="w-full md:w-auto">
                    <Link to={'/search?cars=' + cars + '&make=' + make + '&price=' + price} className="block w-full">
                        <div className='flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-full p-3 md:p-3 transition-all cursor-pointer shadow-lg hover:shadow-blue-500/30 active:scale-95'>
                            <CiSearch className='text-2xl md:text-[28px]' />
                            <span className="md:hidden ml-2 font-semibold">Search</span>
                        </div>
                    </Link>
                </div>

            </div>
        </React.Fragment>
    )
}

export default Search