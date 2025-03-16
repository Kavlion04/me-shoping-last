
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Index page component
 * This component serves as the landing page and redirects users based on authentication state
 */
const Index = () => {
  const { user, isLoading } = useAuth();
  
  // Update page title when component mounts
  useEffect(() => {
    document.title = 'ShopList - Home';
  }, []);

  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="h-4 w-32 rounded bg-primary/20"></div>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to profile page
  if (user) {
    return <Navigate to="/profile" replace />;
  }

  // Redirect unauthenticated users to login page
  return <Navigate to="/login" replace />;
};

export default Index;
