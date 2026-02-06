import React, { useState } from 'react';
import { Plus, Trash2, Map, Edit3, ChevronDown, GitMerge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';

const FORMS = {
  prose: {
    label: "Prose Fiction",
    options: [
      { id: 'novel', label: 'Novel', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { id: 'novella', label: 'Novella', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { id: 'anthology', label: 'Short Story Collection', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
    ]
  },
  screen: {
    label: "Film & Screen",
    options: [
      { id: 'film', label: 'Feature Film', color: 'bg-orange-50 text-orange-700 border-orange-200' },
      { id: 'docu', label: 'Documentary', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { id: 'short_film', label: 'Short Film', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      { id: 'series', label: 'Miniseries / TV', color: 'bg-red-50 text-red-700 border-red-200' }
    ]
  },
  stage: {
    label: "Theatre",
    options: [
      { id: 'play', label: 'Play Script', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { id: 'musical', label: 'Musical', color: 'bg-teal-50 text-teal-700 border-teal-200' }
    ]
  },
  visual: {
    label: "Visual Text",
    options: [
      { id: 'gn', label: 'Graphic Novel', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { id: 'pic_book', label: 'Picture Book', color: 'bg-pink-50 text-pink-700 border-pink-200' }
    ]
  },
  reality: {
    label: "Non-Fiction",
    options: [
      { id: 'memoir', label: 'Memoir', color: 'bg-slate-50 text-slate-700 border-slate-200' },
      { id: 'bio', label: 'Biography', color: 'bg-stone-50 text-stone-700 border-stone-200' },
      { id: 'essay', label: 'Essay Collection', color: 'bg-zinc-50 text-zinc-700 border-zinc-200' }
    ]
  }
};

const FORM_LOOKUP = Object.values(FORMS).flatMap(g => g.options).reduce((acc, opt) => ({...acc, [opt.id]: opt}), {});

const TECHS = {
  novel: ['First Person', 'Third Person', 'Metaphor', 'Simile', 'Symbolism', 'Motif', 'Imagery', 'Tone'],
  novella: ['First Person', 'Third Person', 'Metaphor', 'Symbolism', 'Compressed Timeline'],
  anthology: ['Thematic Echo', 'Motif Repetition', 'Linear', 'Non-linear', 'Circular Narrative', 'Frame Story'],
  film: ['Close-up', 'Long Shot', 'Dutch Angle', 'Tracking Shot', 'Diegetic Sound', 'Non-diegetic Score', 'Lighting', 'Montage'],
  docu: ['Talking Head', 'Archival Footage', 'Voice-over', 'Statistics', 'Expert Interview', 'Reconstruction'],
  short_film: ['Minimalism', 'Close-up', 'Ambient Sound', 'Single Location', 'Twist Ending'],
  series: ['Episode Arc', 'Season Arc', 'Cliffhanger', 'Cold Open', 'Flashback', 'Parallel Plot'],
  play: ['Soliloquy', 'Monologue', 'Aside', 'Stage Directions', 'Lighting Cues', 'Prop Usage', 'Silence'],
  musical: ['Leitmotif', 'Diegetic Song', 'Ensemble Number', 'Reprise', 'Underscoring'],
  gn: ['Gutter', 'Splash Page', 'Bleed', 'Emanata', 'Graphic Weight', 'Salience', 'Vectors', 'Speech Balloon'],
  pic_book: ['Visual-Textual Gap', 'Gutter Space', 'Peritext', 'Page Turn', 'Wordless Spread'],
  memoir: ['Anecdote', 'Reflective Voice', 'Emotive Language', 'Selective Memory', 'Fragmentation'],
  bio: ['Chronological Structure', 'Expert Opinion', 'Primary Source', 'Objectivity', 'Historical Context'],
  essay: ['Rhetorical Question', 'Thesis Statement', 'Anecdote', 'Expert Opinion', 'Statistics', 'Emotive Language']
};

const LabelBadge = ({ color, label }) => (
  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
);

function StackCard({ item, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'shadow-xl ring-1 ring-slate-900/5 bg-white' : 'shadow-sm bg-white border'}`}>
      <div onClick={() => setOpen(!open)} className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold ${item.status === 'bridge' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>{index + 1}</div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.status === 'bridge' ? 'Complete Bridge' : 'Building'}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="p-4 space-y-6">
          <div className="space-y-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-full" />
            <div className="pl-4 space-y-2">
              <LabelBadge color="text-blue-600" label="Source A" />
              <div className="grid grid-cols-2 gap-2">
                <Select value={item.sideA.type} onValueChange={v => onUpdate(item.id, 'sideA', 'type', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Form" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.entries(FORMS).map(([key, group], index) => (
                      <React.Fragment key={key}>
                        {index > 0 && <SelectSeparator />}
                        <SelectGroup>
                          <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                          {group.options.map(opt => (
                            <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={item.sideA.tech} onValueChange={v => onUpdate(item.id, 'sideA', 'tech', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Technique" /></SelectTrigger>
                  <SelectContent>
                    {!item.sideA.type ? (
                      <SelectItem value="hint" disabled className="text-slate-400 italic">
                        Select a Form first...
                      </SelectItem>
                    ) : (
                      (TECHS[item.sideA.type] || []).map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Input className="h-8 text-xs" placeholder="Context (e.g. Chapter 1)" value={item.sideA.ctx} onChange={e => onUpdate(item.id, 'sideA', 'ctx', e.target.value)} />
              <Textarea className="min-h-[50px] text-xs resize-none bg-slate-50" placeholder="Evidence / Quote..." value={item.sideA.ev} onChange={e => onUpdate(item.id, 'sideA', 'ev', e.target.value)} />
              <div className="pt-1">
                <Input className="h-8 text-xs font-medium text-blue-900 bg-blue-50 border-blue-100 placeholder:text-blue-300" placeholder="Meaning A (The Effect?)" value={item.sideA.meaning} onChange={e => onUpdate(item.id, 'sideA', 'meaning', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 py-1">
             <div className="h-px bg-slate-200 flex-1"></div>
             <GitMerge size={16} />
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="space-y-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-200 rounded-full" />
            <div className="pl-4 space-y-2">
              <LabelBadge color="text-orange-600" label="Source B" />
              {!item.sideB.type ? (
                <Select value={item.sideB.type} onValueChange={v => onUpdate(item.id, 'sideB', 'type', v)}>
                  <SelectTrigger className="h-10 text-xs border-dashed text-slate-400 hover:text-slate-600 hover:border-slate-300">
                    <SelectValue placeholder="+ Connect Source B" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.entries(FORMS).map(([key, group], index) => (
                      <React.Fragment key={key}>
                        {index > 0 && <SelectSeparator />}
                        <SelectGroup>
                          <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                          {group.options.map(opt => (
                            <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={item.sideB.type} onValueChange={v => onUpdate(item.id, 'sideB', 'type', v)}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Form" /></SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {Object.entries(FORMS).map(([key, group], index) => (
                          <React.Fragment key={key}>
                            {index > 0 && <SelectSeparator />}
                            <SelectGroup>
                              <SelectLabel className="text-[10px] uppercase font-bold text-slate-400 pl-2 py-1">{group.label}</SelectLabel>
                              {group.options.map(opt => (
                                <SelectItem key={opt.id} value={opt.id} className="text-xs pl-4">{opt.label}</SelectItem>
                              ))}
                            </SelectGroup>
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={item.sideB.tech} onValueChange={v => onUpdate(item.id, 'sideB', 'tech', v)}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Technique" /></SelectTrigger>
                      <SelectContent>
                        {!item.sideB.type ? (
                          <SelectItem value="hint" disabled className="text-slate-400 italic">
                            Select a Form first...
                          </SelectItem>
                        ) : (
                          (TECHS[item.sideB.type] || []).map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input className="h-8 text-xs" placeholder="Context (e.g. Scene 1)" value={item.sideB.ctx} onChange={e => onUpdate(item.id, 'sideB', 'ctx', e.target.value)} />
                  <Textarea className="min-h-[50px] text-xs resize-none bg-slate-50" placeholder="Evidence / Visuals..." value={item.sideB.ev} onChange={e => onUpdate(item.id, 'sideB', 'ev', e.target.value)} />
                  <div className="pt-1">
                    <Input className="h-8 text-xs font-medium text-orange-900 bg-orange-50 border-orange-100 placeholder:text-orange-300" placeholder="Meaning B (The Effect?)" value={item.sideB.meaning} onChange={e => onUpdate(item.id, 'sideB', 'meaning', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>

          {item.sideB.type && (
            <div className="pt-2 animate-in fade-in">
              <LabelBadge color="text-purple-600" label="The Synthesis (Shared Meaning)" />
              <Textarea className="mt-1 min-h-[60px] text-xs resize-none !bg-slate-900 !text-white !border-slate-700 placeholder:!text-slate-400" placeholder="How does the meaning shift or evolve between texts?" value={item.synthesis} onChange={e => onUpdate(item.id, 'root', 'synthesis', e.target.value)} />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" className="text-red-400 h-8 text-xs hover:text-red-600" onClick={() => onDelete(item.id)}>
              <Trash2 size={14} className="mr-1"/> Remove Bridge
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BridgeVisualizer({ item, index }) {
  const metaA = FORM_LOOKUP[item.sideA.type];
  const metaB = FORM_LOOKUP[item.sideB.type];

  return (
    <div className="relative">
      <div className="absolute -left-3 top-0 bottom-0 border-l-2 border-slate-100"></div>
      <div className="absolute -left-[17px] top-0 h-6 w-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 flex items-center justify-center border-4 border-white">{index + 1}</div>

      <div className="space-y-1">
        <div className="flex items-stretch gap-1">
          <div className={`flex-1 rounded-l-lg p-3 border-y border-l ${metaA ? metaA.color : 'bg-slate-100 text-slate-400'}`}>
            <div className="text-[10px] font-bold uppercase opacity-70 mb-1">{metaA ? metaA.label : 'Source A'}</div>
            <div className="font-bold text-sm mb-2">{item.sideA.tech || "Technique"}</div>
            <div className="text-xs opacity-90 italic mb-2">"{item.sideA.ev || '...'}"</div>
            {item.sideA.meaning && (
              <div className="text-[10px] font-medium p-1.5 bg-white/50 rounded leading-tight">{item.sideA.meaning}</div>
            )}
          </div>

          <div className="w-8 flex items-center justify-center bg-slate-800 rounded mx-[-4px] z-10 shadow-lg">
             <GitMerge size={14} className="text-white" />
          </div>

          {item.sideB.type ? (
            <div className={`flex-1 rounded-r-lg p-3 border-y border-r text-right ${metaB ? metaB.color : 'bg-slate-100 text-slate-400'}`}>
              <div className="text-[10px] font-bold uppercase opacity-70 mb-1">{metaB ? metaB.label : 'Source B'}</div>
              <div className="font-bold text-sm mb-2">{item.sideB.tech || "Technique"}</div>
              <div className="text-xs opacity-90 italic mb-2">"{item.sideB.ev || '...'}"</div>
              {item.sideB.meaning && (
                <div className="text-[10px] font-medium p-1.5 bg-white/50 rounded leading-tight text-right">{item.sideB.meaning}</div>
              )}
            </div>
          ) : (
            <div className="flex-1 rounded-r-lg border-2 border-dashed border-slate-200 flex items-center justify-center p-4">
               <span className="text-[10px] uppercase font-bold text-slate-300">Unfinished</span>
            </div>
          )}
        </div>

        {item.synthesis && (
          <div className="mx-4 bg-slate-900 text-white p-3 rounded-b-lg rounded-t-sm text-xs leading-relaxed shadow-lg relative -mt-1 z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-800"></div>
             <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Synthesis</span>
             {item.synthesis}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparativeApp() {
  const [mode, setMode] = useState('stack');
  const [items, setItems] = useState([
    { 
      id: 1, 
      status: 'cantilever', 
      sideA: { type: '', tech: '', ctx: '', ev: '', meaning: '' }, 
      sideB: { type: '', tech: '', ctx: '', ev: '', meaning: '' },
      synthesis: ''
    }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      status: 'cantilever', 
      sideA: { type: 'novel', tech: '', ctx: '', ev: '', meaning: '' }, 
      sideB: { type: '', tech: '', ctx: '', ev: '', meaning: '' },
      synthesis: ''
    }]);
  };

  const update = (id, side, field, val) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      if (side === 'root') return { ...item, [field]: val };
      const newItem = { ...item, [side]: { ...item[side], [field]: val } };
      newItem.status = (newItem.sideA.type && newItem.sideB.type) ? 'bridge' : 'cantilever';
      return newItem;
    }));
  };

  const deleteItem = (id) => setItems(items.filter(i => i.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto border-x bg-white flex flex-col">
      <div className="pt-8 pb-4 px-6 bg-white border-b sticky top-0 z-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comparative</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bridge Your Meanings</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
          <Button size="icon" variant="ghost" className={`h-8 w-8 ${mode === 'stack' ? 'bg-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode('stack')}><Edit3 size={16}/></Button>
          <Button size="icon" variant="ghost" className={`h-8 w-8 ${mode === 'map' ? 'bg-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode('map')}><Map size={16}/></Button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-32">
        {mode === 'stack' && (
          <div className="space-y-6">
            {items.map((item, index) => (
              <StackCard key={item.id} item={item} index={index} onUpdate={update} onDelete={deleteItem} />
            ))}
            <Button onClick={addItem} className="w-full py-8 border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl flex flex-col items-center gap-2 transition-all">
              <Plus size={24} />
              <span className="font-bold text-sm uppercase">Add Cantilever</span>
            </Button>
          </div>
        )}

        {mode === 'map' && (
          <div className="space-y-12 py-6 px-2">
            {items.map((item, index) => (
              <BridgeVisualizer key={item.id} item={item} index={index} />
            ))}
            {items.length === 0 && <div className="text-center text-slate-400 italic">No bridges built yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
