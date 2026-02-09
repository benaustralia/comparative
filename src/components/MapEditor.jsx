import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Map, Share2, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { getMap, updateMapBridges, updateMapDetails, deleteMap } from '@/lib/db-service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import StackEditor from './StackEditor';
import FlowCanvas from './FlowCanvas';
import ShareModal from './ShareModal';

const modes = [{ key: 'stack', Icon: Edit3 }, { key: 'map', Icon: Map }];

export default function MapEditor({ mapId }) {
  const { firebaseUid } = useFirebaseAuth();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState(null);
  const [bridges, setBridges] = useState([]);
  const [mode, setMode] = useState('stack');
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!mapId || !firebaseUid) return;
    setLoading(true);
    getMap(mapId, firebaseUid).then(data => {
      if (data) { setMapData(data); setBridges(data.bridges || []); }
    }).catch(err => console.error("Failed to load map", err))
      .finally(() => setLoading(false));
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [mapId, firebaseUid]);

  const handleDelete = async () => { await deleteMap(mapId); navigate('/'); };

  const saveBridges = useCallback((updated) => {
    setBridges(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => updateMapBridges(mapId, updated).catch(console.error), 800);
  }, [mapId]);

  const openEdit = () => {
    const d = mapData;
    setEditForm({ sourceA: d.sourceA || '', sourceAAuthor: d.sourceAAuthor || '', sourceAYear: d.sourceAYear || '', sourceB: d.sourceB || '', sourceBAuthor: d.sourceBAuthor || '', sourceBYear: d.sourceBYear || '' });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const f = editForm;
    const hasAll = f.sourceAAuthor && f.sourceAYear && f.sourceBAuthor && f.sourceBYear;
    const title = hasAll
      ? `${f.sourceAAuthor}\u2019s ${f.sourceA} (${f.sourceAYear}) vs. ${f.sourceBAuthor}\u2019s ${f.sourceB} (${f.sourceBYear})`
      : `${f.sourceA} vs. ${f.sourceB}`;
    await updateMapDetails(mapId, { ...f, title });
    setMapData(prev => ({ ...prev, ...f, title }));
    setEditOpen(false);
  };

  const ef = (key, placeholder) => (
    <Input placeholder={placeholder} className="h-8 text-xs" value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  if (loading) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;
  if (!mapData) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><p className="text-sm font-medium">Map not found</p></div>;

  const hasAcademic = mapData.sourceAAuthor && mapData.sourceAYear && mapData.sourceBAuthor && mapData.sourceBYear;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            {hasAcademic ? (
              <>{mapData.sourceAAuthor}{'\u2019'}s <em>{mapData.sourceA}</em> ({mapData.sourceAYear})<span className="font-normal"> vs. </span>{mapData.sourceBAuthor}{'\u2019'}s <em>{mapData.sourceB}</em> ({mapData.sourceBYear})</>
            ) : mapData.title}
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={openEdit} title="Edit project details"><Pencil size={14} /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => setDeleteOpen(true)} title="Delete project"><Trash2 size={15} /></Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            {modes.map(({ key, Icon }) => (
              <Button key={key} size="icon" variant="ghost" className={`h-8 w-8 ${mode === key ? 'bg-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode(key)}><Icon size={16} /></Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {mode === 'stack'
          ? <StackEditor bridges={bridges} onBridgesChange={saveBridges} sourceAForm={mapData.sourceAForm || ''} sourceBForm={mapData.sourceBForm || ''} />
          : <FlowCanvas bridges={bridges} onBridgeDelete={(id) => saveBridges(bridges.filter(b => b.id !== id))} />}
      </div>
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} mapId={mapId} mapData={mapData} />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Project</DialogTitle><DialogDescription>This will permanently delete &ldquo;{mapData.title}&rdquo;. This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Project Details</DialogTitle><DialogDescription>Update metadata for this comparative study.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Text A</div>
              {ef('sourceA', 'Title')}{ef('sourceAAuthor', 'Author')}{ef('sourceAYear', 'Year')}
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">Text B</div>
              {ef('sourceB', 'Title')}{ef('sourceBAuthor', 'Author')}{ef('sourceBYear', 'Year')}
            </div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button><Button onClick={saveEdit}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
