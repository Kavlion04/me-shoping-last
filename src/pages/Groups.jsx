import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Users, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/Avatar';

const Groups = () => {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token]);

  const fetchGroups = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const groupsData = await api.getMyGroups(token);
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !token) return;
    
    try {
      setIsCreatingGroup(true);
      const newGroup = await api.createGroup(token, newGroupName, newGroupPassword);
      setGroups((prev) => [...prev, newGroup]);
      toast.success('Group created successfully!');
      setNewGroupName('');
      setNewGroupPassword('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Groups</h1>
          <div className="animate-pulse h-9 w-32 bg-primary/20 rounded-md"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-lg bg-card p-6">
              <div className="h-6 w-2/3 bg-primary/20 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-primary/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Groups</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Create Group</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent>
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
      
      {groups.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
              <Users size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Groups Yet</h2>
            <p className="text-muted-foreground mb-6">Create a new group to start collaborating</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mx-auto">Create Your First Group</Button>
              </DialogTrigger>
              
              <DialogContent>
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
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card key={group._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar name={group.name} size="md" />
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Created: {formatDate(group.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Members: {group.members?.length || 0}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/group/${group._id}`)}
                >
                  <span>View Group</span>
                  <ChevronRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
