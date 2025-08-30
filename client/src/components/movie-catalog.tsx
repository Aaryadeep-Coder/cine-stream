import { useMemo } from "react";
import MovieCard from "./movie-card";
import { Movie } from "@shared/schema";
import { useSearchMovies, useMoviesByGenre } from "@/hooks/use-movies";
import { Button } from "@/components/ui/button";

interface MovieCatalogProps {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  continueWatchingMovies: (Movie & { watchProgress: number })[];
  onMovieSelect: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  searchQuery: string;
  selectedGenre: string | null;
  onGenreFilter: (genre: string) => void;
}

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Adventure", "Romance", "Fantasy"];

export default function MovieCatalog({
  trendingMovies,
  popularMovies,
  continueWatchingMovies,
  onMovieSelect,
  onPlayMovie,
  searchQuery,
  selectedGenre,
  onGenreFilter,
}: MovieCatalogProps) {
  const { data: searchResults } = useSearchMovies(searchQuery);
  const { data: genreMovies } = useMoviesByGenre(selectedGenre || "");

  const displayMovies = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    if (selectedGenre && genreMovies) {
      return genreMovies;
    }
    return null;
  }, [searchQuery, searchResults, selectedGenre, genreMovies]);

  const shouldShowSections = !searchQuery && !selectedGenre;

  return (
    <main className="relative z-10 bg-background -mt-32 pt-32">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Search Results */}
        {searchQuery && displayMovies && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="search-results-title">
              Search Results for "{searchQuery}"
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="search-results-grid">
              {displayMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  data-testid={`search-result-${movie.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Genre Filter Results */}
        {selectedGenre && displayMovies && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="genre-results-title">
              {selectedGenre} Movies
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="genre-results-grid">
              {displayMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  data-testid={`genre-result-${movie.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Continue Watching Section */}
        {shouldShowSections && continueWatchingMovies.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="continue-watching-title">
              Continue Watching
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="continue-watching-grid">
              {continueWatchingMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  watchProgress={movie.watchProgress}
                  onPlay={onPlayMovie}
                  data-testid={`continue-watching-${movie.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending Now Section */}
        {shouldShowSections && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="trending-title">
              Trending Now
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="trending-grid">
              {trendingMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  data-testid={`trending-${movie.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Movies Section */}
        {shouldShowSections && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="popular-title">
              Popular Movies
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="popular-grid">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  data-testid={`popular-${movie.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Genres Filter Section */}
        {shouldShowSections && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" data-testid="browse-by-genre-title">
                Browse by Genre
              </h3>
              <div className="flex space-x-2 overflow-x-auto scroll-container">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "secondary"}
                    className="whitespace-nowrap transition-colors"
                    onClick={() => onGenreFilter(genre)}
                    data-testid={`genre-filter-${genre.toLowerCase()}`}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
