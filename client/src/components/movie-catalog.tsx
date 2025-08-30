import { useMemo } from "react";
import MovieCard from "./movie-card";
import { Movie } from "@shared/schema";
import { useSearchMovies, useMoviesByGenre, useMoviesByLanguage } from "@/hooks/use-movies";
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
  selectedLanguage: string | null;
  onLanguageFilter: (language: string) => void;
}

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Adventure", "Romance", "Fantasy"];
const languages = ["English", "Hindi", "Mandarin", "Korean", "Spanish"];

export default function MovieCatalog({
  trendingMovies,
  popularMovies,
  continueWatchingMovies,
  onMovieSelect,
  onPlayMovie,
  searchQuery,
  selectedGenre,
  onGenreFilter,
  selectedLanguage,
  onLanguageFilter,
}: MovieCatalogProps) {
  const { data: searchResults } = useSearchMovies(searchQuery);
  const { data: genreMovies } = useMoviesByGenre(selectedGenre || "");
  const { data: languageMovies } = useMoviesByLanguage(selectedLanguage || "");

  const displayMovies = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    if (selectedGenre && genreMovies) {
      return genreMovies;
    }
    if (selectedLanguage && languageMovies) {
      return languageMovies;
    }
    return null;
  }, [searchQuery, searchResults, selectedGenre, genreMovies, selectedLanguage, languageMovies]);

  const shouldShowSections = !searchQuery && !selectedGenre && !selectedLanguage;

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

        {/* Language Filter Results */}
        {selectedLanguage && displayMovies && (
          <section>
            <h3 className="text-2xl font-bold mb-6" data-testid="language-results-title">
              {selectedLanguage} Movies
            </h3>
            <div className="movie-carousel grid gap-4" data-testid="language-results-grid">
              {displayMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieSelect}
                  data-testid={`language-result-${movie.id}`}
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

        {/* Sample Movies by Genre Sections */}
        {shouldShowSections && (
          <>
            {/* Action Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="action-movies-title">
                  Action Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onGenreFilter("Action")}
                  data-testid="view-all-action"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="action-movies-grid">
                {trendingMovies.filter(movie => movie.genres.includes("Action")).slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`action-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* Drama Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="drama-movies-title">
                  Drama Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onGenreFilter("Drama")}
                  data-testid="view-all-drama"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="drama-movies-grid">
                {popularMovies.filter(movie => movie.genres.includes("Drama")).slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`drama-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* Comedy Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="comedy-movies-title">
                  Comedy Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onGenreFilter("Comedy")}
                  data-testid="view-all-comedy"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="comedy-movies-grid">
                {trendingMovies.filter(movie => movie.genres.includes("Comedy")).slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`comedy-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Languages Filter Section */}
        {shouldShowSections && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" data-testid="browse-by-language-title">
                Browse by Language
              </h3>
              <div className="flex space-x-2 overflow-x-auto scroll-container">
                {languages.map((language) => (
                  <Button
                    key={language}
                    variant={selectedLanguage === language ? "default" : "secondary"}
                    className="whitespace-nowrap transition-colors"
                    onClick={() => onLanguageFilter(language)}
                    data-testid={`language-filter-${language.toLowerCase()}`}
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sample Movies by Language Sections */}
        {shouldShowSections && (
          <>
            {/* Hindi Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="hindi-movies-title">
                  Hindi Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onLanguageFilter("Hindi")}
                  data-testid="view-all-hindi"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="hindi-movies-grid">
                {trendingMovies.filter(movie => movie.language === "Hindi").slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`hindi-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* English Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="english-movies-title">
                  English Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onLanguageFilter("English")}
                  data-testid="view-all-english"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="english-movies-grid">
                {popularMovies.filter(movie => movie.language === "English").slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`english-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* Mandarin Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="mandarin-movies-title">
                  Mandarin Movies
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onLanguageFilter("Mandarin")}
                  data-testid="view-all-mandarin"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="mandarin-movies-grid">
                {trendingMovies.filter(movie => movie.language === "Mandarin").slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`mandarin-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* Korean Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="korean-movies-title">
                  Korean Movies & Shows
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onLanguageFilter("Korean")}
                  data-testid="view-all-korean"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="korean-movies-grid">
                {trendingMovies.filter(movie => movie.language === "Korean").slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`korean-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>

            {/* Spanish Movies Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" data-testid="spanish-movies-title">
                  Spanish Movies & Shows
                </h3>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onLanguageFilter("Spanish")}
                  data-testid="view-all-spanish"
                >
                  View All
                </Button>
              </div>
              <div className="movie-carousel grid gap-4" data-testid="spanish-movies-grid">
                {trendingMovies.filter(movie => movie.language === "Spanish").slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieSelect}
                    data-testid={`spanish-movie-${movie.id}`}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
