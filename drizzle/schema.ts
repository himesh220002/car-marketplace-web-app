import { pgTable, serial, varchar, json, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const carListing = pgTable("carListing", {
	id: serial().primaryKey().notNull(),
	listingTitle: varchar().notNull(),
	tagline: varchar(),
	originalPrice: varchar(),
	category: varchar().notNull(),
	condition: varchar().notNull(),
	type: varchar().notNull(),
	make: varchar().notNull(),
	model: varchar().notNull(),
	year: varchar().notNull(),
	driveType: varchar().notNull(),
	transmission: varchar().notNull(),
	fuelType: varchar().notNull(),
	mileage: varchar().notNull(),
	engineSize: varchar(),
	cylinder: varchar(),
	color: varchar().notNull(),
	door: varchar().notNull(),
	vin: varchar(),
	offerType: varchar(),
	description: varchar().notNull(),
	sellingPrice: varchar({ length: 255 }).notNull(),
	features: json(),
});

export const carImages = pgTable("carImages", {
	id: serial().primaryKey().notNull(),
	imageUrl: varchar().notNull(),
	carListingId: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.carListingId],
			foreignColumns: [carListing.id],
			name: "carImages_carListingId_carListing_id_fk"
		}),
]);
