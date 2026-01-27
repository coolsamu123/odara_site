# Odara ETL Website

Data Pipelines, Beautifully Orchestrated.

A modern, animated landing page for Odara ETL — the AI-native ETL platform.

## Features

- Animated hero section with interactive particle canvas showing data flow
- Smooth scroll animations powered by Framer Motion
- Glassmorphism design with gradient effects
- Responsive layout for all screen sizes
- Interactive node gallery showcasing ETL components
- AI chat demo animation
- Performance stats with animated counters
- Comparison table with Traditional ETL tools

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx         # Fixed navigation with mobile menu
│   ├── Hero.tsx           # Animated hero with canvas
│   ├── Problem.tsx        # Before/after comparison
│   ├── Solution.tsx       # Feature showcase
│   ├── NodeShowcase.tsx   # Interactive node gallery
│   ├── AIIntegration.tsx  # AI chat demo
│   ├── Performance.tsx    # Stats and benchmarks
│   ├── OpenSource.tsx     # GitHub showcase
│   ├── UseCases.tsx       # Use case cards
│   ├── Comparison.tsx     # Feature comparison table
│   ├── GettingStarted.tsx # Quick start guide
│   └── Footer.tsx         # CTA and links
├── App.tsx
├── main.tsx
└── index.css              # Tailwind + custom styles
```

## Design System

### Colors

- **Primary**: `#4F46E5` → `#7C3AED` (Indigo/Violet gradient)
- **Accent**: `#06B6D4` (Cyan)
- **Success**: `#10B981` (Emerald)
- **Background**: `#0A0A0F` (Near-black)

### Typography

- **Headings**: Inter (bold, geometric)
- **Body**: Inter (clean, legible)
- **Code**: JetBrains Mono
