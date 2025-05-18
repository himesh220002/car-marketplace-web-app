-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "carListing" (
	"id" serial PRIMARY KEY NOT NULL,
	"listingTitle" varchar NOT NULL,
	"tagline" varchar,
	"originalPrice" varchar,
	"category" varchar NOT NULL,
	"condition" varchar NOT NULL,
	"type" varchar NOT NULL,
	"make" varchar NOT NULL,
	"model" varchar NOT NULL,
	"year" varchar NOT NULL,
	"driveType" varchar NOT NULL,
	"transmission" varchar NOT NULL,
	"fuelType" varchar NOT NULL,
	"mileage" varchar NOT NULL,
	"engineSize" varchar,
	"cylinder" varchar,
	"color" varchar NOT NULL,
	"door" varchar NOT NULL,
	"vin" varchar,
	"offerType" varchar,
	"description" varchar NOT NULL,
	"sellingPrice" varchar(255) NOT NULL,
	"features" json
);
--> statement-breakpoint
CREATE TABLE "carImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"imageUrl" varchar NOT NULL,
	"carListingId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_carListingId_carListing_id_fk" FOREIGN KEY ("carListingId") REFERENCES "public"."carListing"("id") ON DELETE no action ON UPDATE no action;
*/