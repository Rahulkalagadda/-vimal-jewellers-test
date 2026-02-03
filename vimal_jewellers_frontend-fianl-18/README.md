# Vimal Jewellers - Frontend Application

## Overview
This is the Next.js frontend for Vimal Jewellers, an e-commerce platform for premium jewelry. It features a modern, responsive design with dynamic product pages, cart management, and user profiles.

## Technologies
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: Redux Toolkit (Cart)
- **Image Optimization**: `sharp` & Next.js Image
- **Icons**: Lucide React

## Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Environment Configuration**:
    Create a `.env.local` file in the root of the `frontend` directory. A sample configuration is provided below:

    ```env
    NEXT_PUBLIC_API_URL=https://backend.vimaljewellers.com/api
    NEXT_PUBLIC_BACKEND_URL=https://backend.vimaljewellers.com
    FRONTEND_URL=https://vimaljewellers.com
    ```
    *Note: `NEXT_PUBLIC_API_URL` should point to your backend API endpoint.*

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server after building:

```bash
npm start
```

## Key Features
- **Dynamic Mega Menu**: Fetches categories and collections from the backend.
- **Product Detail Page**: Includes "Care Instructions", dynamic price breakup, and size selection.
- **Cart & Checkout**: Persistent cart state managed via Redux.
- **User Profile**: Order history, wishlist, and profile management.
- **SEO Optimized**: Uses Next.js metadata and optimized images.

## Project Structure
- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and API configuration (`api.ts`).
- `/public`: Static assets.
