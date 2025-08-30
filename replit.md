# StreamFlix - Netflix-Style Video Streaming Platform

## Overview

StreamFlix is a modern video streaming platform built with a React frontend, Express backend, and PostgreSQL database. The application mimics Netflix's user experience with features like movie browsing, search functionality, video playback, and watch progress tracking. It includes a hero section for featured content, categorized movie collections (trending, popular), and a responsive design that works across desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **UI Components**: Shadcn/UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme optimized for video streaming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development Setup**: Custom Vite integration for development mode with HMR
- **Data Layer**: In-memory storage implementation (MemStorage) with interface for future database integration
- **API Design**: RESTful endpoints for movies, search, and watch progress
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Component Architecture
- **Layout Components**: Header with search, mobile navigation, hero section
- **Media Components**: Movie cards, detailed modals, video player with custom controls
- **UI Components**: Comprehensive component library including dialogs, buttons, forms, and media controls
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Movies table with comprehensive metadata (title, description, ratings, genres, cast)
- **Watch Progress**: User progress tracking with percentage completion
- **Connection**: Neon Database integration via environment variables

### Video Player Features
- **Custom Controls**: Play/pause, volume control, progress scrubbing, fullscreen
- **Keyboard Shortcuts**: Spacebar for play/pause, 'f' for fullscreen, 'm' for mute, escape to close
- **Progress Tracking**: Automatic saving of watch progress with visual indicators
- **Responsive**: Adapts to different screen sizes with touch-friendly controls

### Search and Discovery
- **Real-time Search**: Search movies by title with instant results
- **Genre Filtering**: Filter movies by genre categories
- **Featured Content**: Hero section highlighting featured movies
- **Collections**: Trending and popular movie sections with horizontal scrolling

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with React DOM, TanStack Query for data fetching
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Modern build tool with HMR and optimized bundling
- **Express**: Node.js web framework for the backend API

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **Lucide React**: Icon library for consistent iconography
- **Shadcn/UI**: Pre-built component system based on Radix UI

### Database and ORM
- **PostgreSQL**: Primary database (configured for Neon)
- **Drizzle ORM**: Type-safe ORM with schema validation
- **Drizzle-Zod**: Schema validation integration
- **@neondatabase/serverless**: Serverless PostgreSQL connection

### Development Tools
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Form Handling and Validation
- **React Hook Form**: Performant form library with validation
- **Zod**: TypeScript schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Media and Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & class-variance-authority**: Dynamic CSS class generation
- **cmdk**: Command palette component
- **embla-carousel-react**: Touch-friendly carousel component for movie collections