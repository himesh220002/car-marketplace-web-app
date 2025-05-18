import { relations } from "drizzle-orm/relations";
import { carListing, carImages } from "./schema";

export const carImagesRelations = relations(carImages, ({one}) => ({
	carListing: one(carListing, {
		fields: [carImages.carListingId],
		references: [carListing.id]
	}),
}));

export const carListingRelations = relations(carListing, ({many}) => ({
	carImages: many(carImages),
}));