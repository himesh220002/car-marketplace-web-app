import { db } from '../configs/index'; // Import your Drizzle DB instance
import { CarListing } from '../configs/schema'; // Import your schema (adjust the path)

interface Listing {
    id: number;
    title: string;
    description: string;
    images: string[];
    features?: string[]; // Optional features
}


export const fetchListings = async () => {
    try {
        const listings = await db.select().from(CarListing).execute(); // Fetch data from the database
        // console.log("Fetched Listings:", listings); 
        return listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            images: listing.images,
            features: listing.features,
        })); // Returns an array of listings
    } catch (error) {
        console.error("❌ Error fetching listings:", error);
        return []; // Return an empty array in case of an error
    }
};
