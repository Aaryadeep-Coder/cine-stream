import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWatchProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all movies
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  // Get featured movie
  app.get("/api/movies/featured", async (req, res) => {
    try {
      const movie = await storage.getFeaturedMovie();
      if (!movie) {
        return res.status(404).json({ message: "No featured movie found" });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured movie" });
    }
  });

  // Get trending movies
  app.get("/api/movies/trending", async (req, res) => {
    try {
      const movies = await storage.getTrendingMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending movies" });
    }
  });

  // Get popular movies
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const movies = await storage.getPopularMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  // Search movies
  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const movies = await storage.searchMovies(query);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  // Get movies by genre
  app.get("/api/movies/genre/:genre", async (req, res) => {
    try {
      const { genre } = req.params;
      const movies = await storage.getMoviesByGenre(genre);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies by genre" });
    }
  });

  // Get single movie
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // Get continue watching
  app.get("/api/continue-watching/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const movies = await storage.getContinueWatching(userId);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch continue watching" });
    }
  });

  // Update watch progress
  app.post("/api/watch-progress", async (req, res) => {
    try {
      const progressData = insertWatchProgressSchema.parse(req.body);
      const progress = await storage.updateWatchProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update watch progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
