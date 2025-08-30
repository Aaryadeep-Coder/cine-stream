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
  getMoviesByLanguage(language: string): Promise<Movie[]>;
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
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" as string,
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
      {
        title: "Dangal",
        description: "A biographical sports drama film based on the Phogat family, where a former wrestler trains his daughters to become world-class wrestlers.",
        synopsis: "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become India's first world-class female wrestlers, overcoming societal barriers and achieving international success.",
        year: 2016,
        duration: "2h 41m",
        rating: "PG",
        imdbRating: "8.4",
        posterImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" as string,
        genres: ["Biography", "Drama", "Sport"],
        cast: "Aamir Khan, Fatima Sana Shaikh, Sanya Malhotra",
        director: "Nitesh Tiwari",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "3 Idiots",
        description: "Two friends search for their long-lost companion who was once considered the third idiot in their engineering college.",
        synopsis: "Rancho, Farhan, and Raju are engineering students who challenge the conventional education system and learn about friendship, love, and following one's passion.",
        year: 2009,
        duration: "2h 50m",
        rating: "PG-13",
        imdbRating: "8.4",
        posterImage: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" as string,
        genres: ["Comedy", "Drama"],
        cast: "Aamir Khan, Kareena Kapoor, R. Madhavan",
        director: "Rajkumar Hirani",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Hero",
        description: "A nameless warrior battles three deadly assassins to save a kingdom and win the heart of his beloved.",
        synopsis: "In ancient China, a nameless warrior defeats three deadly assassins and earns an audience with the King of Qin, but his real motives may be more complex than they appear.",
        year: 2002,
        duration: "1h 39m",
        rating: "PG-13",
        imdbRating: "7.9",
        posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" as string,
        genres: ["Action", "Adventure", "Drama"],
        cast: "Jet Li, Tony Leung Chiu-wai, Maggie Cheung",
        director: "Zhang Yimou",
        language: "Mandarin",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Crouching Tiger, Hidden Dragon",
        description: "A young Chinese warrior steals a sword from a famed swordsman and then escapes into a world of romantic adventure with a mysterious man.",
        synopsis: "In 19th century China, a master warrior gives his sword to his beloved and retires, but the sword is stolen, leading to an epic adventure involving honor, love, and martial arts.",
        year: 2000,
        duration: "2h 0m",
        rating: "PG-13",
        imdbRating: "7.9",
        posterImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" as string,
        genres: ["Action", "Adventure", "Drama"],
        cast: "Chow Yun-fat, Michelle Yeoh, Zhang Ziyi",
        director: "Ang Lee",
        language: "Mandarin",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Wednesday",
        description: "A supernatural dark comedy about Wednesday Addams as she navigates her years as a student at Nevermore Academy.",
        synopsis: "Wednesday Addams is sent to Nevermore Academy, a supernatural boarding school where she attempts to master her psychic powers, thwart a monstrous killing spree that has terrorized the local town, and solve the murder mystery that embroiled her parents.",
        year: 2022,
        duration: "1 Season",
        rating: "TV-14",
        imdbRating: "8.1",
        posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" as string,
        genres: ["Comedy", "Horror", "Fantasy"],
        cast: "Jenna Ortega, Emma Myers, Enid Sinclair",
        director: "James Lovato",
        language: "English",
        isFeatured: false,
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Stranger Things",
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        synopsis: "In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits. As they search for answers, the children unravel a series of extraordinary mysteries.",
        year: 2016,
        duration: "4 Seasons",
        rating: "TV-14",
        imdbRating: "8.7",
        posterImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" as string,
        genres: ["Drama", "Fantasy", "Horror"],
        cast: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder",
        director: "The Duffer Brothers",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "The Bear",
        description: "A young chef from the fine dining world returns to Chicago to run his deceased brother's Italian beef sandwich shop.",
        synopsis: "Carmen 'Carmy' Berzatto, a young chef from the fine dining world, returns to Chicago to run his deceased brother's sandwich shop while dealing with grief, debt, and a hostile kitchen crew.",
        year: 2022,
        duration: "2 Seasons",
        rating: "TV-MA",
        imdbRating: "8.7",
        posterImage: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" as string,
        genres: ["Comedy", "Drama"],
        cast: "Jeremy Allen White, Ebon Moss-Bachrach, Ayo Edebiri",
        director: "Christopher Storer",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "House of the Dragon",
        description: "An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.",
        synopsis: "The Targaryen civil war, known as the Dance of the Dragons, between siblings Aegon II and Rhaenyra for control of the Iron Throne and the realm, nearly destroying the Targaryen dynasty.",
        year: 2022,
        duration: "1 Season",
        rating: "TV-MA",
        imdbRating: "8.5",
        posterImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" as string,
        genres: ["Action", "Adventure", "Drama"],
        cast: "Paddy Considine, Emma D'Arcy, Olivia Cooke",
        director: "Miguel Sapochnik",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Squid Game",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
        synopsis: "A story of people who fail at life for various reasons, but suddenly receive an invitation to participate in a survival game to win 45.6 billion won. The game is played on a remote island and involves classic Korean children's games, but with deadly consequences.",
        year: 2021,
        duration: "1 Season",
        rating: "TV-MA",
        imdbRating: "8.0",
        posterImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" as string,
        genres: ["Action", "Drama", "Thriller"],
        cast: "Lee Jung-jae, Park Hae-soo, Wi Ha-joon",
        director: "Hwang Dong-hyuk",
        language: "Korean",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Scam 1992",
        description: "A biographical crime drama series based on the life of Harshad Mehta, a stockbroker who single-handedly took the stock market to dizzying heights.",
        synopsis: "Set in 1980s and 90s Bombay, the series chronicles the life and times of Harshad Mehta, the ambitious and charismatic stockbroker who manipulated the securities scam of 1992.",
        year: 2020,
        duration: "1 Season",
        rating: "TV-14",
        imdbRating: "9.5",
        posterImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" as string,
        genres: ["Biography", "Crime", "Drama"],
        cast: "Pratik Gandhi, Shreya Dhanwanthary, Hemant Kher",
        director: "Hansal Mehta",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Dune",
        description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the dangerous planet Arrakis to ensure the future of his family and his people.",
        year: 2021,
        duration: "2h 35m",
        rating: "PG-13",
        imdbRating: "8.0",
        posterImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" as string,
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac",
        director: "Denis Villeneuve",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Top Gun: Maverick",
        description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.",
        synopsis: "After more than thirty years of service as one of the Navy's top aviators, Pete 'Maverick' Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
        year: 2022,
        duration: "2h 10m",
        rating: "PG-13",
        imdbRating: "8.3",
        posterImage: "https://pixabay.com/get/g51430837caa86bf69a982d69882a7c821016a171672498a5883b6fe8e1b2408d0638e25648ddb74d767a8e9addf2671ef71ec90f6e7666bd4b67b1764089d0c4_1280.jpg",
        backdropImage: "https://pixabay.com/get/g51430837caa86bf69a982d69882a7c821016a171672498a5883b6fe8e1b2408d0638e25648ddb74d767a8e9addf2671ef71ec90f6e7666bd4b67b1764089d0c4_1280.jpg",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" as string,
        genres: ["Action", "Drama"],
        cast: "Tom Cruise, Jennifer Connelly, Miles Teller",
        director: "Joseph Kosinski",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Breaking Bad",
        description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's future.",
        synopsis: "Walter White, a struggling high school chemistry teacher, is diagnosed with inoperable lung cancer and turns to manufacturing and selling methamphetamine to secure his family's financial future.",
        year: 2008,
        duration: "5 Seasons",
        rating: "TV-MA",
        imdbRating: "9.5",
        posterImage: "https://images.unsplash.com/photo-1489599856040-3672055b06d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1489599856040-3672055b06d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" as string,
        genres: ["Crime", "Drama", "Thriller"],
        cast: "Bryan Cranston, Aaron Paul, Anna Gunn",
        director: "Vince Gilligan",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "The Witcher",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        synopsis: "Based on the best-selling fantasy series, The Witcher follows Geralt of Rivia, a solitary monster hunter, who struggles to find his place in a world where people often prove more wicked than beasts.",
        year: 2019,
        duration: "3 Seasons",
        rating: "TV-MA",
        imdbRating: "8.2",
        posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" as string,
        genres: ["Action", "Adventure", "Fantasy"],
        cast: "Henry Cavill, Anya Chalotra, Freya Allan",
        director: "Lauren Schmidt Hissrich",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Money Heist",
        description: "A criminal mastermind who goes by 'The Professor' has a plan to pull off the biggest heist in recorded history.",
        synopsis: "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.",
        year: 2017,
        duration: "5 Seasons",
        rating: "TV-MA",
        imdbRating: "8.3",
        posterImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" as string,
        genres: ["Action", "Crime", "Drama"],
        cast: "Álvaro Morte, Itziar Ituño, Pedro Alonso",
        director: "Álex Pina",
        language: "Spanish",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Sacred Games",
        description: "A police officer and a criminal overlord become entangled in a conspiracy that threatens Mumbai.",
        synopsis: "A police officer receives a call from a gangster who tells him he has 25 days to save Mumbai. Based on Vikram Chandra's novel, this series explores the criminal underworld of Mumbai.",
        year: 2018,
        duration: "2 Seasons",
        rating: "TV-MA",
        imdbRating: "8.6",
        posterImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" as string,
        genres: ["Crime", "Drama", "Thriller"],
        cast: "Saif Ali Khan, Nawazuddin Siddiqui, Radhika Apte",
        director: "Anurag Kashyap",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "The Office",
        description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        synopsis: "The everyday lives of office employees in the Scranton branch of the fictional Dunder Mifflin Paper Company, documented by a film crew.",
        year: 2005,
        duration: "9 Seasons",
        rating: "TV-14",
        imdbRating: "9.0",
        posterImage: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" as string,
        genres: ["Comedy"],
        cast: "Steve Carell, John Krasinski, Jenna Fischer",
        director: "Greg Daniels",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Narcos",
        description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar.",
        synopsis: "The true-life story of the growth and spread of cocaine drug cartels across the globe and attendant efforts of law enforcement to meet them head on in brutal, bloody conflict.",
        year: 2015,
        duration: "3 Seasons",
        rating: "TV-MA",
        imdbRating: "8.8",
        posterImage: "https://images.unsplash.com/photo-1578662015968-3a2b9f2b1719?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662015968-3a2b9f2b1719?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" as string,
        genres: ["Biography", "Crime", "Drama"],
        cast: "Wagner Moura, Boyd Holbrook, Pedro Pascal",
        director: "Chris Brancato",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Friends",
        description: "Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.",
        synopsis: "Rachel, Monica, Phoebe, Ross, Chandler, and Joey are six friends in their twenties and thirties who live and work in New York City, dealing with relationships, careers, and personal growth.",
        year: 1994,
        duration: "10 Seasons",
        rating: "TV-14",
        imdbRating: "8.9",
        posterImage: "https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" as string,
        genres: ["Comedy", "Romance"],
        cast: "Jennifer Aniston, Courteney Cox, Lisa Kudrow",
        director: "David Crane",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Game of Thrones",
        description: "Nine noble families wage war against each other in order to gain control over the mythical land of Westeros.",
        synopsis: "In the mythical continent of Westeros, several powerful families fight for control of the Seven Kingdoms. As conflict erupts, an ancient enemy rises to threaten them all.",
        year: 2011,
        duration: "8 Seasons",
        rating: "TV-MA",
        imdbRating: "9.3",
        posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" as string,
        genres: ["Action", "Adventure", "Drama"],
        cast: "Emilia Clarke, Peter Dinklage, Kit Harington",
        director: "David Benioff",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Spider-Man: No Way Home",
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
        synopsis: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man.",
        year: 2021,
        duration: "2h 28m",
        rating: "PG-13",
        imdbRating: "8.4",
        posterImage: "https://images.unsplash.com/photo-1635308500860-bad7c4e2bcc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1635308500860-bad7c4e2bcc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" as string,
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: "Tom Holland, Zendaya, Benedict Cumberbatch",
        director: "Jon Watts",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "The Batman",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        synopsis: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
        year: 2022,
        duration: "2h 56m",
        rating: "PG-13",
        imdbRating: "7.8",
        posterImage: "https://images.unsplash.com/photo-1599571330481-5a3779c8f3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1599571330481-5a3779c8f3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" as string,
        genres: ["Action", "Crime", "Drama"],
        cast: "Robert Pattinson, Zoë Kravitz, Paul Dano",
        director: "Matt Reeves",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Ozark",
        description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
        synopsis: "Marty Byrde, a financial advisor, relocates his family to the Missouri Ozarks where he must launder $500 million in five years to appease a Mexican drug cartel.",
        year: 2017,
        duration: "4 Seasons",
        rating: "TV-MA",
        imdbRating: "8.5",
        posterImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" as string,
        genres: ["Crime", "Drama", "Thriller"],
        cast: "Jason Bateman, Laura Linney, Sofia Hublitz",
        director: "Bill Dubuque",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Euphoria",
        description: "A group of high school students navigate love and friendships in a world of drugs, sex, trauma and social media.",
        synopsis: "Rue Bennett is a 17-year-old drug addict fresh from rehab with no plans to stay clean. Euphoria follows a group of high school students as they navigate love and friendships.",
        year: 2019,
        duration: "2 Seasons",
        rating: "TV-MA",
        imdbRating: "8.4",
        posterImage: "https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" as string,
        genres: ["Drama"],
        cast: "Zendaya, Hunter Schafer, Jacob Elordi",
        director: "Sam Levinson",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Family Man",
        description: "A middle-class man secretly works as an intelligence officer for the T.A.S.C while trying to protect his family.",
        synopsis: "Srikant Tiwari is a middle-class man who secretly works as an intelligence officer for the T.A.S.C, a fictitious branch of the National Investigation Agency.",
        year: 2019,
        duration: "2 Seasons",
        rating: "TV-MA",
        imdbRating: "8.7",
        posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" as string,
        genres: ["Action", "Drama", "Thriller"],
        cast: "Manoj Bajpayee, Priyamani, Sharib Hashmi",
        director: "Raj Nidimoru",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Arya",
        description: "A young man falls in love with a girl and tries to win her heart through various means.",
        synopsis: "Arya is a carefree young man who falls in love with Geetha at first sight. He tries various means to win her love, but she is already in love with someone else.",
        year: 2004,
        duration: "2h 45m",
        rating: "U",
        imdbRating: "8.0",
        posterImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1594736797933-d0edbe1ab183?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" as string,
        genres: ["Romance", "Drama"],
        cast: "Allu Arjun, Anu Mehta, Siva Balaji",
        director: "Sukumar",
        language: "Hindi",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Kingdom",
        description: "While strange rumors about their ill King grip a kingdom, the crown prince becomes their only hope against a mysterious plague.",
        synopsis: "Set in Korea's Joseon period, a crown prince is sent to investigate a mysterious plague that is spreading throughout the kingdom, only to discover that zombies are behind the outbreak.",
        year: 2019,
        duration: "2 Seasons",
        rating: "TV-MA",
        imdbRating: "8.3",
        posterImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" as string,
        genres: ["Action", "Drama", "Horror"],
        cast: "Ju Ji-hoon, Bae Doona, Ryu Seung-ryong",
        director: "Kim Seong-hun",
        language: "Korean",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Parasite",
        description: "A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.",
        synopsis: "The Kims, a poor family, con their way into becoming the servants of the Parks, a rich family, without letting on that they know each other.",
        year: 2019,
        duration: "2h 12m",
        rating: "R",
        imdbRating: "8.5",
        posterImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" as string,
        genres: ["Comedy", "Drama", "Thriller"],
        cast: "Kang-ho Song, Sun-kyun Lee, Yeo-jeong Jo",
        director: "Bong Joon Ho",
        language: "Korean",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Raise the Red Lantern",
        description: "A young woman becomes the fourth wife of a wealthy lord and must compete for his affections with his other wives.",
        synopsis: "In 1920s China, nineteen-year-old Songlian becomes a concubine of a powerful lord and is forced to compete with his three other wives for his attention and their survival.",
        year: 1991,
        duration: "2h 5m",
        rating: "PG",
        imdbRating: "8.1",
        posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" as string,
        genres: ["Drama", "Romance"],
        cast: "Gong Li, Ma Jingwu, He Caifei",
        director: "Zhang Yimou",
        language: "Mandarin",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "In the Mood for Love",
        description: "Two neighbors form a strong bond after both suspect extramarital activities of their spouses.",
        synopsis: "In Hong Kong 1962, two neighbors discover their spouses are having an affair. They form a bond and fall in love, but decide to not consummate their relationship.",
        year: 2000,
        duration: "1h 38m",
        rating: "PG",
        imdbRating: "8.1",
        posterImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" as string,
        genres: ["Drama", "Romance"],
        cast: "Tony Leung Chiu-wai, Maggie Cheung, Rebecca Pan",
        director: "Wong Kar-wai",
        language: "Mandarin",
        isTrending: true,
        isPopular: true,
      },
      {
        title: "Shang-Chi and the Legend of the Ten Rings",
        description: "Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.",
        synopsis: "Martial-arts master Shang-Chi confronts the past he thought he left behind when he's drawn into the web of the mysterious Ten Rings organization.",
        year: 2021,
        duration: "2h 12m",
        rating: "PG-13",
        imdbRating: "7.4",
        posterImage: "https://images.unsplash.com/photo-1635308500860-bad7c4e2bcc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        backdropImage: "https://images.unsplash.com/photo-1635308500860-bad7c4e2bcc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" as string,
        genres: ["Action", "Adventure", "Fantasy"],
        cast: "Simu Liu, Awkwafina, Tony Leung Chiu-wai",
        director: "Destin Daniel Cretton",
        language: "English",
        isTrending: true,
        isPopular: true,
      },
    ];

    sampleMovies.forEach(movie => {
      const id = randomUUID();
      this.movies.set(id, { ...movie, id, createdAt: new Date(), videoUrl: movie.videoUrl || null });
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

  async getMoviesByLanguage(language: string): Promise<Movie[]> {
    return Array.from(this.movies.values()).filter(movie => 
      movie.language.toLowerCase() === language.toLowerCase()
    );
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const newMovie: Movie = { ...movie, id, createdAt: new Date(), videoUrl: movie.videoUrl || null };
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
