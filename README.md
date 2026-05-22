# SpendAI - Smart Expense Tracker

A premium SaaS-style expense tracker frontend built with Vite + React + TypeScript + Tailwind CSS. Features AI-powered receipt parsing, budget tracking, and beautiful analytics.

## Features

### Core Functionality
- **Expense Management**: Create, read, update, and delete expenses with categories
- **Budget Alerts**: Set category budgets and receive alerts when approaching limits
- **Analytics Dashboard**: View spending trends with charts and statistics
- **AI Receipt Parser**: Extract expense details from receipt text using Grok AI
- **CSV Export**: Download expense history as CSV

### Authentication
- Secure JWT-based authentication
- User registration and login
- Token persistence with localStorage
- Protected routes and automatic redirects

### UI/UX
- Modern, minimal professional design (inspired by Linear, Vercel, Stripe)
- Responsive mobile-first layout
- Smooth animations with Framer Motion
- Reusable component system
- Light theme with blue/slate color palette

## Tech Stack

### Frontend
- **Framework**: React 19 with Hooks
- **Build Tool**: Vite 8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend Integration
- **HTTP Client**: Fetch API with custom wrapper
- **API Base URL**: Configurable via `VITE_API_BASE_URL`

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── MainLayout.tsx          # Dashboard layout with sidebar
│   ├── dashboard/
│   │   ├── StatsCard.tsx           # Statistics cards
│   │   ├── ExpenseTable.tsx        # Expenses list table
│   │   └── AIExtractor.tsx         # AI receipt parser
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       └── Spinner.tsx
├── context/
│   └── AuthContext.tsx             # Authentication state management
├── hooks/
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── pages/
│   ├── Landing/                    # Landing page
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Dashboard/                  # Main dashboard
│   ├── Home/                       # Redirect component
│   └── NotFound/                   # 404 page
├── services/
│   ├── authService.ts              # Authentication API
│   ├── expensesService.ts          # Expenses API
│   ├── budgetsService.ts           # Budgets API
│   └── aiService.ts                # AI extraction API
├── types/
│   ├── auth.ts
│   ├── expense.ts
│   └── budget.ts
├── lib/
│   ├── api.ts                      # API client with auth
│   └── utils.ts
├── store/
│   └── theme.context.tsx           # Theme context
├── App.tsx                         # Main app with routing
├── main.tsx                        # Entry point
└── index.css                       # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cord4-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## API Integration

### Environment Variables

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Endpoints Used

#### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

#### Expenses
- `POST /expenses` - Create expense
- `GET /expenses` - List expenses (with filters)
- `GET /expenses/:id` - Get expense details
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/stats` - Get analytics stats
- `GET /expenses/export` - Export as CSV

#### Budgets
- `POST /budgets` - Create budget
- `GET /budgets` - List budgets
- `GET /budgets/:id` - Get budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `GET /budgets/alerts` - Get budget alerts

#### AI
- `POST /ai/extract` - Extract from receipt

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
