# Stock-Share: A Modern Stock Market and Investment Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF.svg)](https://vitejs.dev/)

Stock-Share is a comprehensive stock market and investment platform that allows users to track stocks, read market news, and share investment insights through articles. Built with modern web technologies, it provides real-time market data and a seamless user experience.


## ✨ Features

- 📈 Real-time stock market data and charts
- 📰 Latest financial news and analysis
- 📝 Create and share investment articles
- 👤 User authentication and profiles
- 💾 Watchlist for tracking favorite stocks
- 🔍 Search functionality for stocks and articles
- 📱 Responsive design for all devices

## 🛠 Tech Stack

- **Frontend**: 
  - React 18 with TypeScript
  - Vite 4.4.0
  - Redux Toolkit for state management
  - React Router for navigation
  - TailwindCSS for styling
  - Hero Icons for UI icons

- **Backend**:
  - Appwrite for authentication and database
  - RESTful API for data fetching

- **Development Tools**:
  - ESLint for code quality
  - Prettier for code formatting
  - TypeScript for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Appwrite instance (for backend services)
- Financial API key (Alpha Vantage or similar)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-share.git
   cd stock-share
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_APPWRITE_URL=your_appwrite_url
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📂 Project Structure

```
src/
├── appwrite/           # Appwrite service configuration
├── assets/             # Static assets
├── components/         # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── routes/             # Application routes
├── services/           # API services
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── App.tsx             # Main App component
└── main.tsx            # Application entry point
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APPWRITE_URL` | URL of your Appwrite instance | Yes |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID | Yes |
| `VITE_ALPHA_VANTAGE_API_KEY` | API key for Alpha Vantage | Yes |

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Contact

Your Name Parmod - parmodrns@gmail.com

Project Link: [https://github.com/p1rmod/stock-share](https://github.com/p1rmod/stock-share)

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/)
- [Alpha Vantage](https://www.alphavantage.co/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

```
