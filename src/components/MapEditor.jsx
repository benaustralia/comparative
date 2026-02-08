import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3, Map, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { getMap, updateMapBridges } from '@/lib/db-service';
import StackEditor from './StackEditor';
import FlowCanvas from './FlowCanvas';
import ShareModal from './ShareModal';

export default function MapEditor({ mapId }) {
  const { firebaseUid } = useFirebaseAuth();
  const [mapData, setMapData] = useState(null);
  const [bridges, setBridges] = useState([]);
  const [mode, setMode] = useState('stack');
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMap(mapId, firebaseUid);
        if (data) {
          setMapData(data);
          setBridges(data.bridges || []);
        }
      } catch (error) {
        console.error("Failed to load map", error);
      } finally {
        setLoading(false);
      }
    };
    if (mapId && firebaseUid) {
      load();
    }
  }, [mapId, firebaseUid]);

  const saveBridges = useCallback((updatedBridges) => {
    setBridges(updatedBridges);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateMapBridges(mapId, updatedBridges).catch(err =>
        console.error("Failed to save bridges", err)
      );
    }, 800);
  }, [mapId]);

  const handleDeleteBridge = (bridgeId) => {
    const updated = bridges.filter(b => b.id !== bridgeId);
    saveBridges(updated);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
        <p className="text-sm font-medium">Map not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-3 border-b flex items-center justify-between bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{mapData.title}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-blue-600 font-medium">{mapData.sourceA}</span>
            <span className="text-xs text-slate-300">vs</span>
            <span className="text-xs text-orange-600 font-medium">{mapData.sourceB}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={`h-8 w-8 ${mode === 'stack' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
              onClick={() => setMode('stack')}
            >
              <Edit3 size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`h-8 w-8 ${mode === 'map' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
              onClick={() => setMode('map')}
            >
              <Map size={16} />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'stack' ? (
          <StackEditor
            bridges={bridges}
            onBridgesChange={saveBridges}
            sourceAForm={mapData.sourceAForm || ''}
            sourceBForm={mapData.sourceBForm || ''}
          />
        ) : (
          <FlowCanvas bridges={bridges} onBridgeDelete={handleDeleteBridge} />
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        mapId={mapId}
        mapData={mapData}
      />
    </div>
  );
}
