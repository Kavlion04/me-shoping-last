
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { Loader2, Search as SearchIcon, Users, FolderClosed } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import Avatar from '../components/Avatar';
import { useDebounce } from '../hooks/use-debounce';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');
  const [searchResults, setSearchResults] = useState({ groups: [], users: [] });
  
  // Join group password dialog state
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Extract search query from URL parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  // Perform search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
      
      // Update URL with search query without triggering a navigation
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('q', debouncedSearchTerm);
      const newRelativePathQuery = `${location.pathname}?${searchParams.toString()}`;
      navigate(newRelativePathQuery, { replace: true });
    } else {
      // Clear results if search term is empty
      setSearchResults({ groups: [], users: [] });
    }
  }, [debouncedSearchTerm, activeTab]);

  const performSearch = async (query) => {
    if (!query.trim() || !token) return;

    setIsSearching(true);
    try {
      console.log(`Searching for ${activeTab} with query: ${query}`);
      
      if (activeTab === 'groups' || activeTab === 'all') {
        const groupResults = await api.searchGroups(token, query);
        setSearchResults(prev => ({ ...prev, groups: groupResults || [] }));
      }
      
      if (activeTab === 'users' || activeTab === 'all') {
        const userResults = await api.searchUsers(token, query);
        setSearchResults(prev => ({ ...prev, users: userResults || [] }));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(`Failed to search for ${query}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    }
  };

  const initiateJoinGroup = (groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setPassword('');
    setShowPasswordDialog(true);
  };

  const handleJoinGroup = async () => {
    if (!selectedGroupId || !token) return;
    
    try {
      setIsJoiningGroup(true);
      await api.joinGroup(token, selectedGroupId, password);
      toast.success('Joined group successfully!');
      setShowPasswordDialog(false);
      navigate('/groups'); // Redirect to groups page after joining
    } catch (error) {
      console.error('Failed to join group:', error);
      // Toast error is handled by the API service
    } finally {
      setIsJoiningGroup(false);
    }
  };

  const renderGroups = () => {
    if (isSearching) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!searchResults.groups || searchResults.groups.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {debouncedSearchTerm ? 'No groups found' : 'Enter a search term to find groups'}
        </div>
      );
    }

    return searchResults.groups.map(group => (
      <Card key={group._id} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <FolderClosed className="mr-2 h-5 w-5 text-primary" />
            {group.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 text-sm text-muted-foreground">
          <p>Members: {group.members?.length || 0}</p>
          <p>Created on: {new Date(group.createdAt).toLocaleDateString()}</p>
        </CardContent>
        <CardFooter>
          <Button 
            size="sm" 
            onClick={() => initiateJoinGroup(group._id, group.name)}
          >
            Join Group
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  const renderUsers = () => {
    if (isSearching) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!searchResults.users || searchResults.users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {debouncedSearchTerm ? 'No users found' : 'Enter a search term to find users'}
        </div>
      );
    }

    return searchResults.users.map(user => (
      <Card key={user._id} className="mb-4">
        <CardContent className="p-4 flex items-center">
          <Avatar name={user.name} className="mr-3" />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for groups or users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="groups">
            <FolderClosed className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="mt-0">
          {renderGroups()}
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          {renderUsers()}
        </TabsContent>
      </Tabs>

      {/* Password Dialog for Joining Groups */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Group Password</DialogTitle>
            <DialogDescription>
              {selectedGroupName ? `Join "${selectedGroupName}"` : 'Enter password to join this group'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Password (leave empty if none)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleJoinGroup}
              disabled={isJoiningGroup}
              className="w-full"
            >
              {isJoiningGroup ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
