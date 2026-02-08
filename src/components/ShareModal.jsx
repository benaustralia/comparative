import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { shareMap } from '@/lib/db-service';

const CollabRow = ({ email, label, color }) => (
  <div className="flex items-center justify-between text-sm py-1">
    <span className="text-slate-700">{email}</span>
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${color}`}>{label}</span>
  </div>
);

export default function ShareModal({ open, onOpenChange, mapId, mapData }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [sharing, setSharing] = useState(false);

  const handleShare = () => {
    if (!email.trim()) return;
    setSharing(true);
    shareMap(mapId, email.trim(), role)
      .then(() => { setEmail(''); onOpenChange(false); })
      .catch(err => console.error("Failed to share", err))
      .finally(() => setSharing(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>Add collaborators by email.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" type="email" />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleShare} disabled={!email.trim() || sharing} size="sm"><UserPlus className="h-4 w-4" /></Button>
          </div>
          {(mapData?.editors?.length > 0 || mapData?.viewers?.length > 0) && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Access</div>
              {mapData.editors?.map(e => <CollabRow key={e} email={e} label="Editor" color="text-emerald-600 bg-emerald-50" />)}
              {mapData.viewers?.map(v => <CollabRow key={v} email={v} label="Viewer" color="text-blue-600 bg-blue-50" />)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
