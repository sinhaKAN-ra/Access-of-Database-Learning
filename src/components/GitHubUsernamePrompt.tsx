import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { setGitHubUsername } from '@/services/userInteractionService';
import { Github } from 'lucide-react';

interface GitHubUsernamePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsernameSet: (username: string) => void;
}

export const GitHubUsernamePrompt = ({ open, onOpenChange, onUsernameSet }: GitHubUsernamePromptProps) => {
  const [username, setUsername] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsValidating(true);
    
    try {
      // Basic validation - check if username looks valid
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]$/.test(username) && username.length > 1) {
        throw new Error('Invalid GitHub username format');
      }

      // Store the username
      setGitHubUsername(username);
      onUsernameSet(username);
      onOpenChange(false);
      setUsername('');
    } catch (error) {
      console.error('Error setting GitHub username:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Username Required
          </DialogTitle>
          <DialogDescription>
            To rate or comment on databases, please provide your GitHub username. 
            This helps maintain transparency and allows others to see who contributed what.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="github-username">GitHub Username</Label>
              <Input
                id="github-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-github-username"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your username will be publicly visible with your contributions
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isValidating || !username.trim()}>
              {isValidating ? 'Validating...' : 'Set Username'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};