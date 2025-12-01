
import { integer, jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const CarListing= pgTable('carListing',{
    id:serial('id').primaryKey(),
    listingTitle:varchar('listingTitle').notNull(),
    tagline:varchar('tagline'),
    originalPrice:integer('originalPrice'),
    sellingPrice:integer('sellingPrice').notNull(),
    category:varchar('category').notNull(),
    condition:varchar('condition').notNull(),
    type:varchar('type').notNull(),
    make:varchar('make').notNull(),
    model:varchar('model').notNull(),
    year:varchar('year').notNull(),
    driveType:varchar('driveType').notNull(),
    transmission:varchar('transmission').notNull(),
    fuelType:varchar('fuelType').notNull(),
    mileage:varchar('mileage').notNull(),
    distanceTravelled:varchar('distanceTravelled'),
    engineSize:varchar('engineSize'),
    cylinder:varchar('cylinder'),
    color:varchar('color').notNull(),
    door:varchar('door').notNull(),
    vin:varchar('vin'),
    offerType:varchar('offerType'),
    description:varchar('description').notNull(),
    features:jsonb('features').$type<Record<string, boolean>>().notNull().default({}),
    createdBy:varchar('createdBy').notNull(),
    userName:varchar('userName').notNull().default('anonymousUser'),
    userImageUrl:varchar('userImageUrl').default('/user_profile_img.jpg'),
    postedOn:varchar('postedOn')
})


export const CarImages = pgTable('carImages',{
    id:serial('id').primaryKey(),
    imageUrl:varchar('imageUrl').notNull(),
    CarListingId:integer('carListingId').notNull().references(()=>CarListing.id)
})
//for those required:true -> .notNull()
