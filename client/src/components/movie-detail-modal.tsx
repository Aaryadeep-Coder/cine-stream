import { X, Play, Plus, ThumbsUp, Star } from "lucide-react";
import { Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onAddToWatchlist: (movie: Movie) => void;
  onLike: (movie: Movie) => void;
}

export default function MovieDetailModal({
  movie,
  onClose,
  onPlay,
  onAddToWatchlist,
  onLike,
}: MovieDetailModalProps) {
  const handlePlayClick = () => {
    onPlay(movie);
  };

  const handleAddToWatchlistClick = () => {
    onAddToWatchlist(movie);
  };

  const handleLikeClick = () => {
    onLike(movie);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      data-testid="movie-modal-backdrop"
    >
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={movie.backdropImage}
            alt={`${movie.title} backdrop`}
            className="w-full h-64 object-cover rounded-t-lg"
            data-testid="modal-backdrop-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent rounded-t-lg"></div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-foreground hover:text-primary text-2xl"
            onClick={onClose}
            data-testid="modal-close-button"
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="absolute bottom-4 left-6">
            <h3 className="text-3xl font-bold mb-2" data-testid="modal-movie-title">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" data-testid="modal-movie-rating">
                {movie.rating}
              </Badge>
              <span className="text-muted-foreground" data-testid="modal-movie-year">
                {movie.year}
              </span>
              <span className="text-muted-foreground" data-testid="modal-movie-duration">
                {movie.duration}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span data-testid="modal-movie-imdb-rating">{movie.imdbRating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-destructive text-primary-foreground px-8 py-3 font-semibold flex items-center space-x-2 transition-colors"
              onClick={handlePlayClick}
              data-testid="modal-play-button"
            >
              <Play className="w-5 h-5" />
              <span>Play</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 font-semibold flex items-center space-x-2 transition-colors"
              onClick={handleAddToWatchlistClick}
              data-testid="modal-watchlist-button"
            >
              <Plus className="w-5 h-5" />
              <span>Watchlist</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 font-semibold flex items-center space-x-2 transition-colors"
              onClick={handleLikeClick}
              data-testid="modal-like-button"
            >
              <ThumbsUp className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-muted-foreground leading-relaxed mb-4" data-testid="modal-movie-synopsis">
                {movie.synopsis}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className="bg-secondary text-muted-foreground"
                    data-testid={`modal-genre-${genre.toLowerCase()}`}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Cast</h4>
                <p className="text-sm text-muted-foreground" data-testid="modal-movie-cast">
                  {movie.cast}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Director</h4>
                <p className="text-sm text-muted-foreground" data-testid="modal-movie-director">
                  {movie.director}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Language</h4>
                <p className="text-sm text-muted-foreground" data-testid="modal-movie-language">
                  {movie.language}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
