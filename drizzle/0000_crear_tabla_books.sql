CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"author" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
