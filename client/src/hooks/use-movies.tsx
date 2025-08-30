import { useQuery } from "@tanstack/react-query";
import { Movie } from "@shared/schema";

export function useFeaturedMovie() {
  return useQuery<Movie>({
    queryKey: ["/api/movies/featured"],
  });
}

export function useTrendingMovies() {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies/trending"],
  });
}

export function usePopularMovies() {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies/popular"],
  });
}

export function useMovies() {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });
}

export function useMovie(id: string) {
  return useQuery<Movie>({
    queryKey: ["/api/movies", id],
    enabled: !!id,
  });
}

export function useSearchMovies(query: string) {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies/search", { q: query }],
    enabled: !!query,
  });
}

export function useMoviesByGenre(genre: string) {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies/genre", genre],
    enabled: !!genre,
  });
}

export function useContinueWatching(userId: string) {
  return useQuery<(Movie & { watchProgress: number })[]>({
    queryKey: ["/api/continue-watching", userId],
    enabled: !!userId,
  });
}

export function useMoviesByLanguage(language: string) {
  return useQuery<Movie[]>({
    queryKey: ["/api/movies/language", language],
    enabled: !!language,
  });
}
