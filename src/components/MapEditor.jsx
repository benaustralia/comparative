import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Map, Share2, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirebaseAuth } from './FirebaseAuthConfig';
import { getMap, updateMapSegments, updateMapDetails, deleteMap } from '@/lib/db-service';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import StackEditor from './StackEditor';
import FlowCanvas from './FlowCanvas';
import ShareModal from './ShareModal';

const modes = [{ key: 'stack', Icon: Edit3 }, { key: 'map', Icon: Map }];


export default function MapEditor({ mapId }) {
  const { firebaseUid } = useFirebaseAuth();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState(null);
  const [segments, setSegments] = useState([]);
  const [mode, setMode] = useState('stack');
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [mentorResponse, setMentorResponse] = useState(null);
  const [exampleOverlay, setExampleOverlay] = useState(null);
  const [vocabularyWords, setVocabularyWords] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!mapId || !firebaseUid) return;
    setLoading(true);
    getMap(mapId, firebaseUid).then(data => {
      if (data) { setMapData(data); setSegments(data.segments || []); }
    }).catch(err => console.error("Failed to load map", err))
      .finally(() => setLoading(false));
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [mapId, firebaseUid]);

  const handleDelete = async () => { await deleteMap(mapId); navigate('/'); };

  const saveSegments = useCallback((updated) => {
    setSegments(updated);
    window.dispatchEvent(new CustomEvent('segments-updated', { detail: { mapId, segments: updated } }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => updateMapSegments(mapId, updated).catch(console.error), 800);
  }, [mapId]);

  const handleSegmentDelete = useCallback((segId) => {
    saveSegments(segments.filter(s => s.id !== segId));
  }, [segments, saveSegments]);

  const handleSegmentUpdate = useCallback((segId, path, value) => {
    const updated = segments.map(s => {
      if (s.id !== segId) return s;
      const clone = JSON.parse(JSON.stringify(s));
      const parts = path.split('.');
      let target = clone.teel;
      for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]];
      target[parts[parts.length - 1]] = value;
      return clone;
    });
    saveSegments(updated);
  }, [segments, saveSegments]);

  const getMetadata = useCallback(() => {
    const cantilever = segments.find(s => s.kind === 'cantilever');
    const side = cantilever?.teel?.sideA;
    return {
      form: side?.type || mapData?.sourceAForm,
      convention: side?.convention,
      feature: side?.feature,
      effect: side?.effect,
      lens: side?.lens,
      essayQuestion: mapData?.essayQuestion,
    };
  }, [segments, mapData]);

  const handleMentor = useCallback(async (segData) => {
    const side = segData?.teel?.sideA;
    if (!side?.feature) { setMentorResponse('Fill in the Form and Feature fields first to get mentoring advice.'); return; }
    setAiLoading(true);
    try {
      const { mentorMe } = await import('@/lib/db-service');
      const response = await mentorMe({ form: side.type, convention: side.convention, feature: side.feature, effect: side.effect, lens: side.lens, context: side.ctx });
      setMentorResponse(response);
    } catch { setMentorResponse('Mentor feature requires a Gemini API key. Set VITE_GEMINI_API_KEY in your .env file.'); }
    finally { setAiLoading(false); }
  }, []);

  const handleExample = useCallback(async () => {
    setAiLoading(true);
    try {
      const { generateExample } = await import('@/lib/db-service');
      const meta = getMetadata();
      const response = await generateExample(meta);
      setExampleOverlay(response);
    } catch { setExampleOverlay('Example feature requires a Gemini API key. Set VITE_GEMINI_API_KEY in your .env file.'); }
    finally { setAiLoading(false); }
  }, [getMetadata]);

  const handleVocabulary = useCallback(async () => {
    setAiLoading(true);
    try {
      const { generateVocabulary } = await import('@/lib/db-service');
      const meta = getMetadata();
      const words = await generateVocabulary(meta);
      setVocabularyWords(words);
    } catch { setVocabularyWords(null); }
    finally { setAiLoading(false); }
  }, [getMetadata]);

  const openEdit = () => {
    const d = mapData;
    setEditForm({ sourceA: d.sourceA || '', sourceAAuthor: d.sourceAAuthor || '', sourceAYear: d.sourceAYear || '', sourceB: d.sourceB || '', sourceBAuthor: d.sourceBAuthor || '', sourceBYear: d.sourceBYear || '', essayQuestion: d.essayQuestion || '' });
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
    <Input placeholder={placeholder} className="h-9 text-sm" value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  if (loading) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><div className="h-6 w-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;
  if (!mapData) return <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400"><p className="text-sm font-medium">Map not found</p></div>;

  const hasAcademic = mapData.sourceAAuthor && mapData.sourceAYear && mapData.sourceBAuthor && mapData.sourceBYear;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="shrink-0" />
          <h2 className="text-lg font-bold text-slate-900 font-serif truncate">
            {hasAcademic ? (
              <>{mapData.sourceAAuthor}{'\u2019'}s <em>{mapData.sourceA}</em> ({mapData.sourceAYear})<span className="font-normal"> vs. </span>{mapData.sourceBAuthor}{'\u2019'}s <em>{mapData.sourceB}</em> ({mapData.sourceBYear})</>
            ) : mapData.title}
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0" onClick={openEdit} title="Edit essay details"><Pencil size={14} /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0" onClick={() => setDeleteOpen(true)} title="Delete essay"><Trash2 size={15} /></Button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            {modes.map(({ key, Icon }) => (
              <Button key={key} size="icon" variant="ghost" className={`h-8 w-8 ${mode === key ? 'bg-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode(key)}><Icon size={16} /></Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
        </div>
      </div>
      {mapData.essayQuestion && <div className="px-6 py-2 bg-purple-50 border-b border-purple-100 text-xs text-purple-700 italic font-serif">{mapData.essayQuestion}</div>}
      <div className="flex-1 overflow-hidden">
        {mode === 'stack'
          ? <StackEditor
              segments={segments}
              onSegmentsChange={saveSegments}
              onExample={handleExample}
              onMentor={handleMentor}
              onVocabulary={handleVocabulary}
              vocabularyWords={vocabularyWords}
              aiLoading={aiLoading}
            />
          : <FlowCanvas segments={segments} onSegmentDelete={handleSegmentDelete} onSegmentUpdate={handleSegmentUpdate} />}
      </div>
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} mapId={mapId} mapData={mapData} />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Essay</DialogTitle><DialogDescription>This will permanently delete &ldquo;{mapData.title}&rdquo;. This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Essay Details</DialogTitle><DialogDescription>Update metadata for this comparative essay.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Topic</div>
              <Input placeholder="Essay question" className="h-9 text-sm" value={editForm.essayQuestion || ''} onChange={e => setEditForm(p => ({ ...p, essayQuestion: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Source Text</div>
              {ef('sourceA', 'Title')}{ef('sourceAAuthor', 'Author')}{ef('sourceAYear', 'Year')}
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Transformed Text</div>
              {ef('sourceB', 'Title')}{ef('sourceBAuthor', 'Author')}{ef('sourceBYear', 'Year')}
            </div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button><Button onClick={saveEdit}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!mentorResponse} onOpenChange={() => setMentorResponse(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Mentor Advice</DialogTitle></DialogHeader>
          <div className="text-sm font-serif leading-relaxed whitespace-pre-wrap py-2">{mentorResponse}</div>
          <DialogFooter><Button variant="ghost" onClick={() => setMentorResponse(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!exampleOverlay} onOpenChange={() => setExampleOverlay(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Model Paragraph</DialogTitle><DialogDescription>This is a read-only example. Study the structure, do not copy.</DialogDescription></DialogHeader>
          <div className="text-sm font-serif leading-relaxed whitespace-pre-wrap py-2 select-none" style={{ userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
            {exampleOverlay}
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setExampleOverlay(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
