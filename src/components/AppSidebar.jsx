
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, User, Users, Search, LogOut } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { toast } from 'sonner';
import AppLogo from './AppLogo';

const AppSidebar = ({ isSidebarOpen }) => {
  const { user, token, logout } = useAuth();
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !token) return;
    
    try {
      setIsCreatingGroup(true);
      const newGroup = await api.createGroup(token, newGroupName, newGroupPassword);
      toast.success('Group created successfully!');
      setNewGroupName('');
      setNewGroupPassword('');
      setIsDialogOpen(false);
      navigate(`/group/${newGroup._id}`);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isSidebarOpen) {
    return (
      <aside className="w-16 border-r bg-sidebar flex flex-col py-4 transition-all duration-300 ease-in-out">
        <div className="mb-6 px-4">
          <AppLogo showText={false} />
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                to="/profile"
                className={cn(
                  "flex justify-center py-2 rounded-md",
                  location.pathname === '/profile' ? "bg-primary text-white" : "text-foreground hover:bg-accent"
                )}
              >
                <User size={20} />
              </Link>
            </li>
            <li>
              <Link
                to="/groups"
                className={cn(
                  "flex justify-center py-2 rounded-md",
                  location.pathname === '/groups' || location.pathname.startsWith('/group/') 
                    ? "bg-primary text-white" 
                    : "text-foreground hover:bg-accent"
                )}
              >
                <Users size={20} />
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className={cn(
                  "flex justify-center py-2 rounded-md",
                  location.pathname === '/search' ? "bg-primary text-white" : "text-foreground hover:bg-accent"
                )}
              >
                <Search size={20} />
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="mx-auto w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="mx-auto mb-6 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <PlusCircle size={20} />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="Group password (optional)"
                value={newGroupPassword}
                onChange={(e) => setNewGroupPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleCreateGroup}
                disabled={isCreatingGroup || !newGroupName.trim()}
                className="w-full"
              >
                {isCreatingGroup ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col transition-all duration-300 ease-in-out">
      <div className="h-16 border-b flex items-center px-4">
        <AppLogo />
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === '/profile' ? "bg-primary text-white" : "text-foreground hover:bg-accent"
              )}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/groups"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === '/groups' || location.pathname.startsWith('/group/') 
                  ? "bg-primary text-white" 
                  : "text-foreground hover:bg-accent"
              )}
            >
              <Users size={18} />
              <span>Groups</span>
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === '/search' ? "bg-primary text-white" : "text-foreground hover:bg-accent"
              )}
            >
              <Search size={18} />
              <span>Search</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Create Group</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="Group password (optional)"
                value={newGroupPassword}
                onChange={(e) => setNewGroupPassword(e.target.value)}
                className="h-12"
              />
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleCreateGroup}
                disabled={isCreatingGroup || !newGroupName.trim()}
                className="w-full"
              >
                {isCreatingGroup ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        {user && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut size={18} />
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
