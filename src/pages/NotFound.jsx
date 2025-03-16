
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * NotFound component
 * Displayed when a user navigates to a non-existent route
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="mr-2"
          >
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
