import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  synopsis: text("synopsis").notNull(),
  year: integer("year").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating").notNull(),
  imdbRating: decimal("imdb_rating", { precision: 3, scale: 1 }).notNull(),
  posterImage: text("poster_image").notNull(),
  backdropImage: text("backdrop_image").notNull(),
  videoUrl: text("video_url"),
  genres: jsonb("genres").$type<string[]>().notNull(),
  cast: text("cast").notNull(),
  director: text("director").notNull(),
  language: text("language").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const watchProgress = pgTable("watch_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  movieId: varchar("movie_id").references(() => movies.id).notNull(),
  userId: text("user_id").notNull(), // For now just a simple string, could be linked to users table later
  progress: integer("progress").notNull(), // Progress percentage 0-100
  lastWatched: timestamp("last_watched").defaultNow(),
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
});

export const insertWatchProgressSchema = createInsertSchema(watchProgress).omit({
  id: true,
  lastWatched: true,
});

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;
export type InsertWatchProgress = z.infer<typeof insertWatchProgressSchema>;
export type WatchProgress = typeof watchProgress.$inferSelect;
