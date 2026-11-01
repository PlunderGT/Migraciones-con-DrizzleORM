ALTER TABLE "books" ADD COLUMN "isbn" varchar(20);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "genre" varchar(60) DEFAULT 'General' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_isbn_unique" UNIQUE("isbn");