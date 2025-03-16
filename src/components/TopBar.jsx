
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from './Avatar';
import { toast } from 'sonner';

/**
 * TopBar component
 * Displays the top navigation bar with search and user menu
 * 
 * @param {Object} props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 * @param {boolean} props.isSidebarOpen - Whether the sidebar is currently open
 */
const TopBar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      toast.info(`Searching for "${searchQuery}"`);
    } else {
      toast.error("Please enter a search term");
    }
  };

  return (
    <header className="h-16 border-b px-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-9 w-9"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
        
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <Input
            type="search"
            placeholder="Search groups and users..."
            className="w-64 h-9 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button type="submit" variant="ghost" size="sm" className="absolute right-0">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-9 w-9" 
          onClick={() => navigate('/search')}
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-2 flex items-center gap-2" role="button">
              {user && (
                <>
                  <Avatar name={user.name} size="sm" />
                  <span className="font-medium">{user.username}</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
