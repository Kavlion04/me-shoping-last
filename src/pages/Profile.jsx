
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Avatar from '@/components/Avatar';
import { toast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Profile page component
 * Displays user profile information and account management options
 */
const Profile = () => {
  const { user, logout } = useAuth();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    if (showCopiedMessage) {
      const timer = setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showCopiedMessage]);

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      setShowCopiedMessage(true);
      toast.success('Username copied to clipboard');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Card className="overflow-hidden bg-white shadow-md">
        <CardHeader className="relative p-0">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="absolute -bottom-12 left-8">
            <Avatar name={user.name} size="xl" className="border-4 border-white shadow-md" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-16 pb-6 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">@{user.username}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleCopyUsername}
              >
                <Copy size={16} />
                {showCopiedMessage ? 'Copied!' : 'Copy Username'}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1">
                    <Trash2 size={16} />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground"
                      onClick={() => {
                        toast.error("Account deletion is disabled in this demo");
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
