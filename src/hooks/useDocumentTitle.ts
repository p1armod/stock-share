import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let pageTitle = 'Stock-Share';

    // Set page title based on the current route
    switch (pathname) {
      case '/':
        pageTitle = 'Home | Stock-Share';
        break;
      case '/about':
        pageTitle = 'About | Stock-Share';
        break;
      case '/news':
        pageTitle = 'News | Stock-Share';
        break;
      case '/articles':
        pageTitle = 'Articles | Stock-Share';
        break;
      case '/profile':
        pageTitle = 'My Profile | Stock-Share';
        break;
      case '/watchlist':
        pageTitle = 'My Watchlist | Stock-Share';
        break;
      case '/login':
        pageTitle = 'Login | Stock-Share';
        break;
      case '/signup':
        pageTitle = 'Sign Up | Stock-Share';
        break;
      case '/create-article':
        pageTitle = 'Create Article | Stock-Share';
        break;
      default:
        // Handle dynamic routes like /stock/:symbol
        if (pathname.startsWith('/stock/')) {
          const symbol = pathname.split('/')[2];
          pageTitle = `${symbol} | Stock Details | Stock-Share`;
        } else if (pathname.startsWith('/articles/')) {
          pageTitle = 'Article | Stock-Share';
        }
    }

    document.title = pageTitle;
  }, [location]);
};

export default useDocumentTitle;
