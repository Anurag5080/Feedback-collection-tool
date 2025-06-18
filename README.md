# FeedbackPro - Modern Feedback Collection Tool

A beautiful, modern feedback collection system with real-time analytics and glassy UI effects.

## Features

- **Anonymous Feedback Form** with star ratings
- **Real-time Admin Dashboard** with interactive charts
- **JWT Authentication** for admin access
- **PostgreSQL Database** for reliable data storage
- **WebSocket Integration** for live updates
- **Beautiful Glassy UI** with dark theme
- **Responsive Design** for all devices
- **Theme Switching** (Light/Dark)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Real-time**: WebSockets
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd feedback-collection-tool
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/feedback_tool
JWT_SECRET=your-very-secure-secret-key-change-in-production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Visit `http://localhost:3000` to see the feedback form
6. Visit `http://localhost:3000/admin` to access the admin dashboard

### Admin Credentials

Default admin login:
- **Username**: admin
- **Password**: admin123

## Database Schema

The application automatically creates the necessary tables:

- `feedbacks` - Stores user feedback with ratings
- `admin_users` - Stores admin credentials

## Features Overview

### User Feedback Form
- Clean, modern interface with glassy effects
- Star rating system (1-5 stars)
- Optional name and email fields
- Required feedback text
- Form validation and error handling
- Success animation after submission

### Admin Dashboard
- Real-time statistics cards
- Interactive charts showing rating distribution
- Recent feedback list with infinite scroll
- Live updates via WebSocket
- Responsive design for all devices

### Real-time Updates
- WebSocket connection for live data updates
- Automatic dashboard refresh when new feedback arrives
- Real-time charts and statistics

## API Endpoints

- `POST /api/feedback` - Submit new feedback
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify` - Verify JWT token
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/feedbacks` - Get all feedback entries

## Deployment

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.