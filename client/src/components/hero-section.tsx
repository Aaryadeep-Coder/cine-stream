import { Play, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@shared/schema";

interface HeroSectionProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onAddToList: (movie: Movie) => void;
}

export default function HeroSection({ movie, onPlay, onAddToList }: HeroSectionProps) {
  const handlePlayClick = () => {
    onPlay(movie);
  };

  const handleAddToListClick = () => {
    onAddToList(movie);
  };

  return (
    <section className="relative h-screen flex items-center justify-start">
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropImage}
          alt={`${movie.title} backdrop`}
          className="w-full h-full object-cover"
          data-testid="hero-backdrop-image"
        />
        <div className="hero-gradient absolute inset-0"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 max-w-xl">
        <h2 className="text-5xl md:text-7xl font-bold mb-4" data-testid="hero-title">
          {movie.title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed" data-testid="hero-description">
          {movie.description}
        </p>
        
        <div className="flex items-center space-x-4 mb-8">
          <span className="bg-secondary px-3 py-1 rounded text-sm" data-testid="hero-rating">
            {movie.rating}
          </span>
          <span className="text-muted-foreground" data-testid="hero-year">
            {movie.year}
          </span>
          <span className="text-muted-foreground" data-testid="hero-duration">
            {movie.duration}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span data-testid="hero-imdb-rating">{movie.imdbRating}</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-destructive text-primary-foreground px-8 py-3 font-semibold flex items-center space-x-2 transition-all duration-200"
            onClick={handlePlayClick}
            data-testid="hero-play-button"
          >
            <Play className="w-5 h-5" />
            <span>Play</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="bg-muted/50 hover:bg-muted text-foreground px-8 py-3 font-semibold flex items-center space-x-2 transition-all duration-200"
            onClick={handleAddToListClick}
            data-testid="hero-add-to-list-button"
          >
            <Plus className="w-5 h-5" />
            <span>My List</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
