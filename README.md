# GigNest - Freelance Job Board

A modern job board filter and search interface for a fictional freelance marketplace. Browse, filter, and apply to gigs that match your skills.

## About

GigNest is a single-page application built with React and TypeScript that allows users to:
- Browse a curated list of 20+ freelance gigs
- Filter by category, budget range, and experience level
- Search in real-time using keywords
- Sort results by date or budget
- View detailed gig information
- Track applied gigs in their profile
- Get personalized gig recommendations based on their skills

## Features

✨ **Core Features:**
- 📋 Browse gigs in a responsive grid or list view
- 🔍 Real-time search across gig titles and descriptions
- 🏷️ Filter by multiple categories (Web Development, Mobile Dev, Design, Writing, Marketing)
- 💰 Budget range filtering (₹5k - ₹50k)
- 📊 Filter by experience level (Beginner, Intermediate, Expert)
- 📈 Sort by date (newest/oldest) or budget (high/low)
- 🎯 Personalized recommendations based on your skills
- 👤 User profiles with applied gigs tracking
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Loading states with skeleton loaders
- 🎨 Smooth animations and transitions
- 📊 Active filter indicators and results counter

## Screenshots

### 1. Home Page - Browse All Gigs
The landing page displays all 21 gigs in a clean 2-column grid layout. The left sidebar shows the Filters panel with category checkboxes (Web Development, Mobile Dev, Design), budget range inputs, and a "Reset All Filters" button. The main area shows **21 gigs found** with view toggle buttons (grid/list), sorting dropdown (Newest by default), and gig cards displaying category badges, budget amounts, titles, descriptions, location, posted date, and client name. Each card has a hover effect that slightly lifts it for better interactivity.

### 2. Profile Page - Track Your Applications
The user profile page shows your account information on the left with a profile avatar, username (sdyui), freelancer designation, email, verified badge, and Sign Out button. Below is a Quick Stats section showing applied count and earnings. On the right, the Professional Skills section shows your selected skills (Mobile Dev, Design) with an Edit Skills button. The Applied Gigs section lists jobs you've applied to with briefcase icons, job titles, client names, budgets, and Applied status badges. At the bottom is a light sage green "Build Your Freelance Career" callout encouraging you to add professional skills for personalized recommendations.

### 3. Filtered View - Multi-Filter Search (Recommended + Categories)
Shows filtered results with the RECOMMENDED badge active and category filters for Web Development and Mobile Dev applied. The result displays **4 gigs found** matching the selected criteria. Active filter tags appear below the results counter showing which filters are active. The cards displayed include Expert React Native Developer, Lead Android Developer, and other relevant gigs within the selected categories.

### 4. Real-Time Search - Marketing Keyword
Demonstrates the real-time search functionality with "marketing" typed in the search bar. The results update instantly showing **3 gigs found** all related to marketing: Klaviyo Email Marketing Automation Expert (₹30,000), Performance Marketing / Google Ads Specialist (₹15,000), and Growth-focused Social Media Marketing Manager (₹12,000). The search works across gig titles and descriptions.

### 5. Complex Filtering - Search + Budget Range + Experience Level
Shows advanced filtering capabilities with multiple filters combined: search for "marketing", budget range set to ₹5,000 - ₹30,002, and Expert experience level selected. Active filter tags display showing EXPERT and ₹5000 - ₹30002. The budget inputs show Min: 50 and Max: 0230 (interactive state). Only **1 gig found** - Klaviyo Email Marketing Automation Expert - matching all filter criteria simultaneously, demonstrating AND logic across all filters.

### 6. Gig Detail Modal - Complete Job Information
A modal popup showing full details of the Klaviyo Email Marketing Automation Expert gig. Displays the Marketing category badge at the top, job title, and key information badges showing Budget (₹30,000), Experience Level (Expert), Location (Remote), and Posted date (10 Mar 2026). Below is the JOB DESCRIPTION section with detailed information about the email marketing strategy work needed. The ABOUT THE CLIENT section shows hiring details. An "Apply Now" button with briefcase icon sits at the bottom right with green styling. An X button closes the modal.

### 7. Applied Gigs - Application Tracking
Shows the profile page's Applied Gigs section after applying to a job. Displays the Klaviyo Email Marketing Automation Expert gig with a briefcase icon, full job title, client name (Manoj Bajpayee), and budget (₹30,000) in blue. An "Applied" status badge in emerald green with checkmark indicates successful application. Quick Stats show 1 APPLIED and 0 EARNINGS. The light sage green career builder section below provides motivation to add more skills for better recommendations.

## Tech Stack

- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Build Tool:** Vite
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useMemo, useEffect)

## How to Use

### Setup & Installation

**Prerequisites:** Node.js (v16 or higher)

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will start at `http://localhost:3000` 

3. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment

### Deploy on Vercel (Recommended)

**Option 1: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts to connect your GitHub repository and deploy.

**Option 2: Connect GitHub to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

**Option 3: Deploy to Netlify**
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables
No environment variables required for this project. All data is mocked locally.

### Performance
- Build time: ~5 seconds
- Bundle size: ~385 KB (gzipped: ~119 KB)
- Fully optimized for production

### Using the App

#### Sign Up
1. When you first visit the app, you'll see a sign-up modal
2. Enter your name and choose your professional skills (optional but recommended)
3. Click "Sign Up" or skip to browse as a guest

#### Browsing Gigs
1. View all available gigs in the main grid
2. hover over any gig card to see more details 
3. Click on a gig card to open the detailed modal with full information

#### Searching
1. Use the search bar at the top to find gigs by keyword
2. Search works across gig titles and descriptions (case-insensitive)
3. Results update in real-time as you type
4. Click the "X" icon to clear your search

#### Filtering

**Category Filter:**
- Select one or multiple categories
- "All Categories" option clears the filter
- Available categories: Web Development, Mobile Dev, Design, Writing, Marketing

**Budget Range:**
- Set minimum and maximum budget in Rupees
- Default range: ₹5,000 - ₹50,000
- Only gigs within your range will be shown

**Experience Level:**
- Choose your experience level: All, Beginner, Intermediate, Expert
- See only gigs that match your skill level

#### Sorting
- **Newest First (Default):** Recently posted gigs first
- **Oldest First:** Oldest posted gigs first
- **Highest Budget:** Shows highest paying gigs first
- **Lowest Budget:** Shows lowest paying gigs first

#### View Modes
- **Grid View:** See gigs in a 2-column layout (3 on larger screens)
- **List View:** See gigs in a single-column list

#### Active Filters & Results
- See "Active Filters" tags showing which filters are applied
- View the total count of results ("X gigs found")
- "Clear All Filters" button resets everything to defaults

#### Gig Details Modal
1. Click any gig card to open the detail view
2. View complete information including:
   - Full description
   - Client name and company
   - Budget and experience level
   - Location and posted date
   - Client rating
3. Click "Apply Now" to apply for the gig
4. Close the modal to return to the gig list

#### Profile Page
1. Click the user icon in the top-right corner
2. View your profile information
3. Edit your professional skills
4. See all gigs you've applied to
5. View quick stats (applications, etc.)
6. Sign out when done

#### Personalized Recommendations
1. Add your professional skills to your profile
2. Click the "Recommended" button to filter for gigs matching your skills
3. See only gigs in categories you've selected as your expertise

## Edge Cases & Features

✅ **No Results Handling:** When filters return zero results, a helpful message appears
✅ **Loading States:** 1-second loading simulation with skeleton loaders
✅ **Filter Combinations:** All filters work together (AND logic)
✅ **Responsive Design:** Optimized for 375px (mobile), 768px (tablet), 1440px (desktop)
✅ **Data Persistence:** Your profile is saved in local storage
✅ **Invalid Input Handling:** Budget filters validate min/max values
✅ **Results Counter:** Shows "Showing X gigs" based on current filters

## Mock Data

The app uses 21 realistic gig objects with:
- Real-world job titles and descriptions
- Varied budgets (₹5,000 - ₹50,000)
- Multiple experience levels
- Different categories and locations
- Client information (name, company, type, rating)

## Project Structure

```
src/
├── components/
│   ├── filters/
│   │   ├── FiltersPanel.tsx      # Filter controls
│   │   └── ActiveFilters.tsx      # Active filter tags
│   ├── gigs/
│   │   ├── GigCard.tsx            # Gig list item
│   │   ├── GigDetailModal.tsx     # Detail view
│   │   └── GigSkeleton.tsx        # Loading skeleton
│   ├── ui/
│   │   ├── Badge.tsx              # Reusable badge
│   │   ├── Button.tsx             # Reusable button
│   │   └── Input.tsx              # Reusable input
│   ├── ProfilePage.tsx            # User profile page
│   └── SignUpModal.tsx            # Registration modal
├── App.tsx                         # Main app component
├── data.ts                         # Mock gig data (21 gigs)
├── types.ts                        # TypeScript interfaces
├── main.tsx                        # App entry point
└── index.css                       # Global styles
```

## Code Quality

- Clean separation of concerns with functional components
- Custom hooks for reusable logic (useDebounce)
- Proper TypeScript typing throughout
- Meaningful variable and function names
- Filter logic clearly commented (search, category, experience, budget)
- Responsive design using Tailwind CSS utilities
- No console errors in production
- Component composition with reusable UI elements

## Performance

- useMemo for optimized filtering logic
- Debounced search (300ms delay) to reduce re-renders
- Lazy animations with Framer Motion
- Efficient state management with React Hooks
- Responsive images and optimized bundle size

## Assumptions & Design Decisions

### Technical Choices:
1. **React + TypeScript** - Chosen for strong type safety and developer experience
2. **Tailwind CSS** - Utility-first approach for rapid, consistent styling
3. **Framer Motion** - Smooth animations without heavy animation libraries
4. **Local Storage** - Simple persistence for user profiles without backend
5. **useMemo for Filtering** - Performance optimization for complex filter combinations
6. **Debounced Search** - 300ms delay balances real-time feedback with performance

### Design Decisions:
1. **Mock Data Only** - No backend API (as per requirements)
2. **Single Page App** - All features in one app without page reloads
3. **Horizontal Budget Filters** - Side-by-side inputs for better visibility
4. **Grid + List View** - Flexibility in how users browse gigs
5. **User Profiles** - Beyond requirements to add value (track applications, personalization)
6. **Sign-Up on Load** - Immediate user context collection for recommendations
7. **Recommended Gigs** - Based on user skills for better UX

### Defensive Programming:
1. Budget validation prevents negative numbers
2. Input sanitization on search queries
3. Proper null checks for user data
4. Error states for invalid filter combinations
5. Responsive design with mobile-first approach

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ JavaScript support
- CSS Grid and Flexbox support
