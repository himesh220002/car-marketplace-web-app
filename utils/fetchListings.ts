/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../configs/index'; // Import your Drizzle DB instance
import { CarListing } from '../configs/schema'; // Import your schema (adjust the path)

export const fetchListings = async () => {
    try {
        const listings = await db.select().from(CarListing).execute(); // Fetch data from the database
        // console.log("Fetched Listings:", listings); 
        return listings.map((listing) => ({
            id: listing.id,
            title: listing.listingTitle ?? (listing as any).title,
            description: listing.description,
            images: (listing as any).images ?? [],
            features: listing.features,
        })); // Returns an array of listings
    } catch (error) {
        console.error("❌ Error fetching listings:", error);
        return []; // Return an empty array in case of an error
    }
};
