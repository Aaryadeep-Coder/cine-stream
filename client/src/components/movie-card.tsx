import { Play } from "lucide-react";
import { Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  watchProgress?: number;
  onPlay?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick, watchProgress, onPlay }: MovieCardProps) {
  const handleClick = () => {
    onClick(movie);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(movie);
    }
  };

  return (
    <div 
      className="movie-card group cursor-pointer relative" 
      onClick={handleClick}
      data-testid={`movie-card-${movie.id}`}
    >
      <img
        src={movie.posterImage}
        alt={`${movie.title} poster`}
        className="w-full aspect-[2/3] object-cover rounded-md"
        data-testid={`movie-poster-${movie.id}`}
      />
      
      {/* Watch Progress Bar */}
      {watchProgress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-md">
          <div className="w-full bg-secondary rounded-full h-1 mb-2">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300" 
              style={{ width: `${watchProgress}%` }}
              data-testid={`progress-bar-${movie.id}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-white" data-testid={`movie-title-${movie.id}`}>
              {movie.title}
            </h4>
            {onPlay && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-primary"
                onClick={handlePlayClick}
                data-testid={`resume-play-${movie.id}`}
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Hover Overlay */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <h4 className="font-semibold" data-testid={`movie-hover-title-${movie.id}`}>
          {movie.title}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`movie-hover-year-${movie.id}`}>
          {movie.year}
        </p>
      </div>
    </div>
  );
}
