# Granger Vintage Landing Page

A fully responsive landing page built with Next.js, React, TypeScript, and TailwindCSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Fully responsive design
- Clean, minimalist aesthetic
- TailwindCSS for styling
- TypeScript for type safety
- Next.js for optimal performance

## Project Structure

```
/pages
  index.tsx          # Main landing page
  _app.tsx           # App wrapper
  _document.tsx      # Document configuration
/components
  Header.tsx         # Navigation header
  Hero.tsx           # Hero section
/styles
  globals.css        # Global styles
```

## Customization

- Images are sourced from Unsplash. Replace the URLs in `Hero.tsx` with your own images.
- Colors and spacing can be adjusted in the component files or `tailwind.config.ts`.
- Font can be changed in `_document.tsx` and `tailwind.config.ts`.

## Build for Production

```bash
npm run build
npm start
```
