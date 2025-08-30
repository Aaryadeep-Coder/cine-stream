import { type Movie, type InsertMovie, type WatchProgress, type InsertWatchProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMovies(): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  getFeaturedMovie(): Promise<Movie | undefined>;
  getTrendingMovies(): Promise<Movie[]>;
  getPopularMovies(): Promise<Movie[]>;
  searchMovies(query: string): Promise<Movie[]>;
  getMoviesByGenre(genre: string): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  getWatchProgress(movieId: string, userId: string): Promise<WatchProgress | undefined>;
  updateWatchProgress(progress: InsertWatchProgress): Promise<WatchProgress>;
  getContinueWatching(userId: string): Promise<(Movie & { watchProgress: number })[]>;
}

export class MemStorage implements IStorage {
  private movies: Map<string, Movie>;
  private watchProgresses: Map<string, WatchProgress>;

  constructor() {
    this.movies = new Map();
    this.watchProgresses = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleMovies: InsertMovie[] = [
      {
        title: "The Crown",
        description: "A biographical drama that chronicles the reign of Queen Elizabeth II, from her wedding in 1947 to the early 2000s, offering an intimate look at the British royal family.",
        synopsis: "The Crown offers an intimate portrait of the British royal family's reign through decades of political intrigue, personal relationships, and historical events that shaped a nation.",
        year: 2016,
        duration: "4 Seasons",
        rating: "TV-MA",
        imdbRating: "8.7",
        posterImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://pixabay.com/get/gcffa9dfd9237680731fd641bf48d03dc6fb8a7da6c0521d487da31463bd20ccb906c5e92425d02ec10db4087b17a454f105b82e2685bfc089a1bb63ee8666b15_1280.jpg",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        genres: ["Drama", "Biography", "History"],
        cast: "Claire Foy, Olivia Colman, Imelda Staunton",
        director: "Peter Morgan",
        language: "English",
        isFeatured: true,
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Avengers: Endgame",
        description: "The epic conclusion to the Infinity Saga as the remaining heroes fight to undo Thanos' devastating snap.",
        synopsis: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        year: 2019,
        duration: "3h 1m",
        rating: "PG-13",
        imdbRating: "8.4",
        posterImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        genres: ["Action", "Adventure", "Drama"],
        cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
        director: "Anthony Russo, Joe Russo",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Blade Runner 2049",
        description: "A young blade runner discovers a secret that could plunge what's left of society into chaos.",
        synopsis: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
        year: 2017,
        duration: "2h 44m",
        rating: "R",
        imdbRating: "8.0",
        posterImage: "https://pixabay.com/get/g51430837caa86bf69a982d69882a7c821016a171672498a5883b6fe8e1b2408d0638e25648ddb74d767a8e9addf2671ef71ec90f6e7666bd4b67b1764089d0c4_1280.jpg",
        backdropImage: "https://pixabay.com/get/g51430837caa86bf69a982d69882a7c821016a171672498a5883b6fe8e1b2408d0638e25648ddb74d767a8e9addf2671ef71ec90f6e7666bd4b67b1764089d0c4_1280.jpg",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        genres: ["Sci-Fi", "Drama", "Thriller"],
        cast: "Ryan Gosling, Harrison Ford, Ana de Armas",
        director: "Denis Villeneuve",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "The Pursuit of Happyness",
        description: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
        synopsis: "Based on a true story, a struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
        year: 2006,
        duration: "1h 57m",
        rating: "PG-13",
        imdbRating: "8.0",
        posterImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        genres: ["Biography", "Drama"],
        cast: "Will Smith, Jaden Smith, Thandiwe Newton",
        director: "Gabriele Muccino",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "A Quiet Place",
        description: "A family is forced to live in silence while hiding from creatures that hunt by sound.",
        synopsis: "In a post-apocalyptic world, a family is forced to live in silence while hiding from creatures that hunt by sound.",
        year: 2018,
        duration: "1h 30m",
        rating: "PG-13",
        imdbRating: "7.5",
        posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        genres: ["Horror", "Drama", "Sci-Fi"],
        cast: "Emily Blunt, John Krasinski, Millicent Simmonds",
        director: "John Krasinski",
        language: "English",
        isTrending: true,
        isPopular: false,
      },
      {
        title: "The Grand Budapest Hotel",
        description: "A legendary concierge and his protégé become involved in a murder mystery and theft.",
        synopsis: "The adventures of Gustave H, a legendary concierge at a famous European hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
        year: 2014,
        duration: "1h 39m",
        rating: "R",
        imdbRating: "8.1",
        posterImage: "https://pixabay.com/get/gd6246710f019771b0a03d91b14de718ed41c00fe5e40cbcddc92099b367c462a44257c56cbf7f5d3085f5de32966c37c47a2b05ccc687008198da842a705a806_1280.jpg",
        backdropImage: "https://pixabay.com/get/gd6246710f019771b0a03d91b14de718ed41c00fe5e40cbcddc92099b367c462a44257c56cbf7f5d3085f5de32966c37c47a2b05ccc687008198da842a705a806_1280.jpg",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        genres: ["Comedy", "Drama", "Adventure"],
        cast: "Ralph Fiennes, F. Murray Abraham, Mathieu Amalric",
        director: "Wes Anderson",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        synopsis: "Earth's future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel.",
        year: 2014,
        duration: "2h 49m",
        rating: "PG-13",
        imdbRating: "8.6",
        posterImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
        director: "Christopher Nolan",
        language: "English",
        isPopular: true,
      },
      {
        title: "La La Land",
        description: "A jazz musician and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
        synopsis: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        year: 2016,
        duration: "2h 8m",
        rating: "PG-13",
        imdbRating: "8.0",
        posterImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        genres: ["Comedy", "Drama", "Music"],
        cast: "Ryan Gosling, Emma Stone, Rosemarie DeWitt",
        director: "Damien Chazelle",
        language: "English",
        isPopular: true,
      },
    ];

    sampleMovies.forEach(movie => {
      const id = randomUUID();
      this.movies.set(id, { ...movie, id, createdAt: new Date() });
    });

    // Add some sample watch progress
    const movieIds = Array.from(this.movies.keys());
    const progressData = [
      { movieId: movieIds[0], userId: "user1", progress: 65 },
      { movieId: movieIds[1], userId: "user1", progress: 32 },
      { movieId: movieIds[2], userId: "user1", progress: 78 },
      { movieId: movieIds[3], userId: "user1", progress: 45 },
      { movieId: movieIds[4], userId: "user1", progress: 12 },
      { movieId: movieIds[5], userId: "user1", progress: 89 },
    ];

    progressData.forEach(progress => {
      const id = randomUUID();
      this.watchProgresses.set(id, { 
        ...progress, 
        id, 
        lastWatched: new Date() 
      });
    });
  }

  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getFeaturedMovie(): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(movie => movie.isFeatured);
  }

  async getTrendingMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values()).filter(movie => movie.isTrending);
  }

  async getPopularMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values()).filter(movie => movie.isPopular);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.movies.values()).filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm) ||
      movie.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
      movie.cast.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm)
    );
  }

  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    return Array.from(this.movies.values()).filter(movie => 
      movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const newMovie: Movie = { ...movie, id, createdAt: new Date() };
    this.movies.set(id, newMovie);
    return newMovie;
  }

  async getWatchProgress(movieId: string, userId: string): Promise<WatchProgress | undefined> {
    return Array.from(this.watchProgresses.values()).find(
      progress => progress.movieId === movieId && progress.userId === userId
    );
  }

  async updateWatchProgress(progressData: InsertWatchProgress): Promise<WatchProgress> {
    const existing = await this.getWatchProgress(progressData.movieId, progressData.userId);
    
    if (existing) {
      existing.progress = progressData.progress;
      existing.lastWatched = new Date();
      return existing;
    } else {
      const id = randomUUID();
      const newProgress: WatchProgress = {
        ...progressData,
        id,
        lastWatched: new Date()
      };
      this.watchProgresses.set(id, newProgress);
      return newProgress;
    }
  }

  async getContinueWatching(userId: string): Promise<(Movie & { watchProgress: number })[]> {
    const userProgress = Array.from(this.watchProgresses.values()).filter(
      progress => progress.userId === userId && progress.progress > 0 && progress.progress < 100
    );

    const moviesWithProgress = userProgress.map(progress => {
      const movie = this.movies.get(progress.movieId);
      if (movie) {
        return { ...movie, watchProgress: progress.progress };
      }
      return null;
    }).filter(Boolean) as (Movie & { watchProgress: number })[];

    return moviesWithProgress.sort((a, b) => b.watchProgress - a.watchProgress);
  }
}

export const storage = new MemStorage();
