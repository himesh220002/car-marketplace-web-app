import { useState } from 'react'
import { ListingWithImages } from '../services/AdminService'
import { GiPathDistance } from 'react-icons/gi'
import { IoIosSpeedometer } from 'react-icons/io'
import { BsFillFuelPumpFill } from 'react-icons/bs'
import { GiGearStickPattern } from 'react-icons/gi'
import { TbAutomaticGearbox } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface UserCardProps {
    email: string
    listingCount: number
    listings: ListingWithImages[]
    onEdit: (listing: ListingWithImages) => void
    onDelete: (id: number) => void
}

const UserCard: React.FC<UserCardProps> = ({ email, listingCount, listings, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            {/* User Header */}
            <div
                className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{email}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {listingCount} {listingCount === 1 ? 'listing' : 'listings'}
                    </p>
                </div>
                <div className="text-gray-400">
                    {isExpanded ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                </div>
            </div>

            {/* Listings Grid */}
            {isExpanded && (
                <div className="p-4 sm:p-6 pt-0 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {listings.map((listing) => {
                            const engineType = listing.fuelType === 'Electric' ? ' Km/C' : ' Km/L'

                            return (
                                <div key={listing.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                    <img
                                        src={listing.images?.[0]?.imageUrl || '/st_road.jpg'}
                                        alt={listing.listingTitle || 'Car'}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-bold text-base mb-3 truncate">{listing.listingTitle}</h4>

                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {listing.type === 'New' ? (
                                                <div className="flex flex-col items-center text-xs">
                                                    <IoIosSpeedometer className="text-base mb-1" />
                                                    <span className="text-center">{listing.mileage}{engineType}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-xs">
                                                    <GiPathDistance className="text-base mb-1" />
                                                    <span className="text-center">{listing.distanceTravelled}</span>
                                                </div>
                                            )}
                                            <div className="flex flex-col items-center text-xs">
                                                <BsFillFuelPumpFill className="text-base mb-1" />
                                                <span className="text-center">{listing.fuelType}</span>
                                            </div>
                                            <div className="flex flex-col items-center text-xs">
                                                {listing.transmission === 'Manual' ? (
                                                    <GiGearStickPattern className="text-base mb-1" />
                                                ) : (
                                                    <TbAutomaticGearbox className="text-base mb-1" />
                                                )}
                                                <span className="text-center">{listing.transmission}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-lg">${listing.sellingPrice}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => onEdit(listing)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={() => listing.id && onDelete(listing.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserCard
