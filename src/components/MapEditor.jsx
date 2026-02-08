import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3, Map, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { getMap, updateMapBridges } from '@/lib/db-service';
import StackEditor from './StackEditor';
import FlowCanvas from './FlowCanvas';
import ShareModal from './ShareModal';

const modes = [{ key: 'stack', Icon: Edit3 }, { key: 'map', Icon: Map }];

export default function MapEditor({ mapId }) {
  const { firebaseUid } = useFirebaseAuth();
  const [mapData, setMapData] = useState(null);
  const [bridges, setBridges] = useState([]);
  const [mode, setMode] = useState('stack');
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
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

  const saveBridges = useCallback((updated) => {
    setBridges(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => updateMapBridges(mapId, updated).catch(console.error), 800);
  }, [mapId]);

  if (loading) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;
  if (!mapData) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><p className="text-sm font-medium">Map not found</p></div>;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-3 border-b flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-slate-900">{mapData.title}</h2>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            {modes.map(({ key, Icon }) => (
              <Button key={key} size="icon" variant="ghost" className={`h-8 w-8 ${mode === key ? 'bg-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode(key)}>
                <Icon size={16} />
              </Button>
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
    </div>
  );
}
