import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { shareMap } from '@/lib/db-service';

export default function ShareModal({ open, onOpenChange, mapId, mapData }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) return;
    try {
      setSharing(true);
      await shareMap(mapId, email.trim(), role);
      setEmail('');
      // Update local state would require lifting state -- for now just close
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to share", error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>Add collaborators by email.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Add new collaborator */}
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1"
              type="email"
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleShare} disabled={!email.trim() || sharing} size="sm">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current collaborators */}
          {(mapData?.editors?.length > 0 || mapData?.viewers?.length > 0) && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Access</div>
              {mapData.editors?.map(e => (
                <div key={e} className="flex items-center justify-between text-sm py-1">
                  <span className="text-slate-700">{e}</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Editor</span>
                </div>
              ))}
              {mapData.viewers?.map(v => (
                <div key={v} className="flex items-center justify-between text-sm py-1">
                  <span className="text-slate-700">{v}</span>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Viewer</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
