import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
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
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Avatar from '../components/Avatar';
import { toast } from '../hooks/use-toast';
import { Plus, X, ShoppingCart, Trash2, UserPlus, MoreVertical, Loader2, AlertCircle } from 'lucide-react';

const GroupDetail = () => {
  const { groupId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (token && groupId) {
      fetchGroupData();
    }
  }, [token, groupId, retryCount]);

  const fetchGroupData = async () => {
    if (!token || !groupId) return;
    
    try {
      setIsLoading(true);
      setLoadError(null);
      
      // Fetch group details
      const groupData = await api.getGroup(token, groupId);
      
      if (!groupData) {
        throw new Error("Failed to load group data");
      }
      
      setGroup(groupData);
      
      // Check if user is admin (creator) of the group
      const isCreator = groupData.owner && groupData.owner._id === user?._id;
      setIsAdmin(isCreator);
      
      // Fetch group items
      const itemsData = await api.getGroupItems(token, groupId);
      setItems(itemsData || []);
      
      // Set members from group data
      if (groupData.members && Array.isArray(groupData.members)) {
        setMembers(groupData.members);
      }
      
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      setLoadError(error.message || 'Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleAddItem = async () => {
    if (!newItemTitle.trim() || !token || !groupId) return;
    
    try {
      setIsAddingItem(true);
      const newItem = await api.createItem(token, groupId, newItemTitle);
      setItems((prev) => [...prev, newItem]);
      setNewItemTitle('');
      toast.success('Item added successfully!');
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item');
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!token || !groupId) return;
    
    try {
      await api.deleteItem(token, groupId, itemId);
      setItems((prev) => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim() || !token) return;
    
    try {
      setIsSearching(true);
      const results = await api.searchUsers(token, searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (memberId) => {
    if (!token || !groupId) return;
    
    try {
      await api.addMember(token, groupId, memberId);
      toast.success('Member added to group');
      setIsDialogOpen(false);
      fetchGroupData(); // Refresh the data
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!token || !groupId || !isAdmin) return;
    
    try {
      await api.removeMember(token, groupId, memberId);
      toast.success('Member removed from group');
      fetchGroupData(); // Refresh the data
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleLeaveGroup = async () => {
    if (!token || !groupId) return;
    
    try {
      await api.leaveGroup(token, groupId);
      toast.success('You left the group');
      navigate('/groups');
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!token || !groupId) return;
    
    try {
      await api.deleteGroup(token, groupId);
      toast.success('Group deleted successfully');
      navigate('/groups');
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error('Failed to delete group');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse h-10 w-1/3 bg-primary/20 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-primary/20 rounded"></div>
            <div className="h-12 w-full bg-primary/10 rounded"></div>
            <div className="space-y-2">
              <div className="h-16 w-full bg-card rounded-lg"></div>
              <div className="h-16 w-full bg-card rounded-lg"></div>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-primary/20 rounded"></div>
            <div className="space-y-2">
              <div className="h-16 w-full bg-card rounded-lg"></div>
              <div className="h-16 w-full bg-card rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Error Loading Group</h1>
        <p className="text-muted-foreground mb-6">{loadError}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={handleRetry} variant="default">
            Retry
          </Button>
          <Button onClick={() => navigate('/groups')} variant="outline">
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Group not found</h1>
        <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/groups')}
          >
            Back to Groups
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && (
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  Add member
                </DropdownMenuItem>
              )}
              {!isAdmin && (
                <DropdownMenuItem onClick={handleLeaveGroup}>
                  Leave group
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem className="text-destructive" onClick={handleDeleteGroup}>
                  Delete group
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Created by {isAdmin ? 'you' : group.owner?.name || 'unknown'} on {formatDate(group.createdAt)}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Items</span>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-primary text-white">
                {items.length}
              </span>
            </h2>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add new item"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="h-12"
            />
            <Button 
              onClick={handleAddItem} 
              disabled={isAddingItem || !newItemTitle.trim()}
              className="flex-shrink-0"
            >
              {isAddingItem ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No items in this group yet</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item._id} 
                  className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Added by {item.createdBy === user?._id ? 'you' : 'someone else'} on {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteItem(item._id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Members Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Members</span>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-primary text-white">
                {members.length}
              </span>
            </h2>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(true)}
              >
                Add Member
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {members.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No members in this group yet</p>
              </div>
            ) : (
              members.map((member) => (
                <div 
                  key={member._id} 
                  className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} size="sm" />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">@{member.username}</p>
                    </div>
                  </div>
                  
                  {isAdmin && member._id !== user?._id && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveMember(member._id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
              <Button 
                onClick={handleSearchUsers} 
                disabled={isSearching || !searchQuery.trim()}
                className="flex-shrink-0"
              >
                Search
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {isSearching ? 'Searching...' : 'No users found'}
                </p>
              ) : (
                searchResults.map((user) => (
                  <div 
                    key={user._id} 
                    className="p-3 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddMember(user._id)}
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <AlertDialog>
        <AlertDialogTrigger className="hidden">Delete Group</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group "{group.name}" and all its items.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGroup}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupDetail;
