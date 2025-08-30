import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import MovieCatalog from "@/components/movie-catalog";
import MovieDetailModal from "@/components/movie-detail-modal";
import VideoPlayer from "@/components/video-player";
import MobileNavigation from "@/components/mobile-navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { useFeaturedMovie, useTrendingMovies, usePopularMovies, useContinueWatching } from "@/hooks/use-movies";
import { useIsMobile } from "@/hooks/use-mobile";
import { Movie } from "@shared/schema";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  
  const { data: featuredMovie, isLoading: featuredLoading } = useFeaturedMovie();
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies();
  const { data: popularMovies, isLoading: popularLoading } = usePopularMovies();
  const { data: continueWatchingMovies, isLoading: continueWatchingLoading } = useContinueWatching("user1");

  const isLoading = featuredLoading || trendingLoading || popularLoading || continueWatchingLoading;

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePlayMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        data-testid="header-main"
      />
      
      {featuredMovie && (
        <HeroSection 
          movie={featuredMovie} 
          onPlay={handlePlayMovie}
          onAddToList={() => {}}
          data-testid="hero-section"
        />
      )}
      
      <MovieCatalog
        trendingMovies={trendingMovies || []}
        popularMovies={popularMovies || []}
        continueWatchingMovies={continueWatchingMovies || []}
        onMovieSelect={handleMovieSelect}
        onPlayMovie={handlePlayMovie}
        searchQuery={searchQuery}
        selectedGenre={selectedGenre}
        onGenreFilter={handleGenreFilter}
        data-testid="movie-catalog"
      />

      {selectedMovie && !isPlayerOpen && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onPlay={handlePlayMovie}
          onAddToWatchlist={() => {}}
          onLike={() => {}}
          data-testid="movie-detail-modal"
        />
      )}

      {isPlayerOpen && selectedMovie && (
        <VideoPlayer
          movie={selectedMovie}
          onClose={handleClosePlayer}
          data-testid="video-player"
        />
      )}

      {isMobile && (
        <MobileNavigation data-testid="mobile-navigation" />
      )}
    </div>
  );
}
