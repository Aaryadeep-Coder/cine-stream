import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  X,
  Captions 
} from "lucide-react";
import { Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onMouseMove={handleMouseMove}
      data-testid="video-player-container"
    >
      <div className="relative flex-1">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={movie.backdropImage}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          data-testid="video-element"
        >
          <source src={movie.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div 
          className={`video-controls absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between text-white mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-2xl hover:text-primary transition-colors"
                onClick={togglePlayPause}
                data-testid="play-pause-button"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary transition-colors"
                onClick={toggleMute}
                data-testid="mute-button"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20"
                  data-testid="volume-slider"
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span data-testid="current-time">{formatTime(currentTime)}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground" data-testid="total-duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary transition-colors"
                data-testid="subtitles-button"
              >
                <Captions className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary transition-colors"
                data-testid="settings-button"
              >
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary transition-colors"
                onClick={toggleFullscreen}
                data-testid="fullscreen-button"
              >
                <Maximize className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary transition-colors"
                onClick={onClose}
                data-testid="close-player-button"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="w-full">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              data-testid="progress-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
