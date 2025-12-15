# Hamsika Travels - Thailand Group Tour Landing Page

## Overview
A complete, production-ready landing page for Hamsika Travels Thailand Group Tour Package with an integrated Admin Panel. Built using only HTML, CSS, and JavaScript in a single file - designed to work on GitHub Pages.

## Project Details
- **Brand**: Hamsika Travels
- **Package**: Thailand Group Trip (February 2026)
- **Group Size**: 50 Members
- **Price**: ₹20,000 per person (includes accommodation, activities, transport)

## Features

### Landing Page
1. **Hero Section** - Attractive Thailand background with tour details and "Book Now" CTA
2. **Itinerary Section** - 5-day breakdown with HD images (fixed layout - no text overlapping):
   - Day 1: Arrival & Hotel Check-in
   - Day 2: Safari World & Marine Park
   - Day 3: Golden Buddha & Tiger Park
   - Day 4: Coral Island Tour
   - Day 5: Departure
3. **Package Inclusions** - Accommodation, Transport, Sightseeing, Group Assistance
4. **Booking Form** - Name, Mobile, Email, Adults (1-50), Children (0-20), Auto price calculation

### Payment Flow
- UPI ID: 9493936084@upi
- Dynamic QR Code generation based on exact payment amount
- "I Have Paid" confirmation saves booking as "Pending Verification"

### Admin Panel
- **Login**: Username: `admin`, Password: `Basam@2212`
- **Bookings Tab**:
  - View all bookings in a table
  - Stats: Total, Pending, Verified, Rejected counts
  - Actions: Verify or Reject bookings
- **Itinerary Management Tab**:
  - Create new itineraries by country (Thailand, Singapore, Malaysia, Dubai, Bali, etc.)
  - Day-wise activity management
  - Add title, description, and image URL
  - Delete existing itinerary items
- All data persisted in LocalStorage

## Technical Stack
- Pure HTML5, CSS3, Vanilla JavaScript
- LocalStorage for data persistence
- Responsive design (Flexbox layouts)
- No external frameworks or backend required

## Running the Project
The project runs on port 5000 using Python's built-in HTTP server:
```bash
python -m http.server 5000 --bind 0.0.0.0
```

## File Structure
```
/
├── index.html          # Complete single-file application
├── replit.md           # Project documentation
├── .gitignore          # Git ignore rules
└── attached_assets/    # Original requirements
```

## Recent Updates
- Fixed UI layout: Text no longer overlaps images in itinerary section
- Updated itinerary order as per requirements
- Added dynamic QR code with exact payment amount
- Added admin itinerary management feature with country selection

## Deployment
Ready to deploy directly to GitHub Pages - just upload the `index.html` file.
