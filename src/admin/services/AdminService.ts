import { db } from '../../../configs'
import { CarListing, CarImages } from '../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import Service from '@/Shared/Service'

export interface UserWithListings {
    email: string
    listingCount: number
}

export interface ListingWithImages {
    id?: number
    listingTitle?: string
    sellingPrice?: number | string
    fuelType?: string
    transmission?: string
    mileage?: number | string
    distanceTravelled?: number | string
    type?: string
    createdBy?: string
    images?: { imageUrl?: string }[]
    [key: string]: unknown
}

class AdminService {
    // Get all unique users with their listing counts
    async getAllUsers(): Promise<UserWithListings[]> {
        try {
            const result = await db.select().from(CarListing)

            // Group by email and count listings
            const userMap = new Map<string, number>()
            result.forEach((listing) => {
                const email = listing.createdBy as string
                if (email) {
                    userMap.set(email, (userMap.get(email) || 0) + 1)
                }
            })

            // Convert to array and sort by listing count
            return Array.from(userMap.entries())
                .map(([email, listingCount]) => ({ email, listingCount }))
                .sort((a, b) => b.listingCount - a.listingCount)
        } catch (error) {
            console.error('Error fetching users:', error)
            return []
        }
    }

    // Get all listings for a specific user
    async getUserListings(email: string): Promise<ListingWithImages[]> {
        try {
            const result = await db
                .select()
                .from(CarListing)
                .leftJoin(CarImages, eq(CarListing.id, CarImages.CarListingId))
                .where(eq(CarListing.createdBy, email))
                .orderBy(desc(CarListing.id))

            return Service.FormatResult(result)
        } catch (error) {
            console.error('Error fetching user listings:', error)
            return []
        }
    }

    // Update a listing
    async updateListing(id: number, data: Partial<ListingWithImages>): Promise<boolean> {
        try {
            // Remove images and index signature from data as they're in a separate table
            const { images, ...rest } = data

            // Convert string numbers to actual numbers for database
            const listingData: Record<string, unknown> = {}
            Object.entries(rest).forEach(([key, value]) => {
                if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
                    listingData[key] = Number(value)
                } else if (value !== undefined) {
                    listingData[key] = value
                }
            })

            // Update listing data
            await db
                .update(CarListing)
                .set(listingData as typeof CarListing.$inferInsert)
                .where(eq(CarListing.id, id))

            // Update images if provided
            if (images) {
                // Delete all existing images
                await db.delete(CarImages).where(eq(CarImages.CarListingId, id))

                // Insert new images
                if (images.length > 0) {
                    await db.insert(CarImages).values(
                        images.map((img) => ({
                            imageUrl: img.imageUrl || '',
                            CarListingId: id,
                        }))
                    )
                }
            }

            return true
        } catch (error) {
            console.error('Error updating listing:', error)
            return false
        }
    }

    // Delete a listing
    async deleteListing(id: number): Promise<boolean> {
        try {
            // Delete images first (foreign key constraint)
            await db.delete(CarImages).where(eq(CarImages.CarListingId, id))

            // Then delete the listing
            await db.delete(CarListing).where(eq(CarListing.id, id))

            return true
        } catch (error) {
            console.error('Error deleting listing:', error)
            return false
        }
    }
}

export default new AdminService()
