import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FORM_LOOKUP } from '@/lib/form-data';

const DelBtn = ({ onClick, cls }) => (
  <Button variant="ghost" size="icon" onClick={onClick} className={`absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm ${cls}`} title="Delete">
    <Trash2 size={12} />
  </Button>
);

function SegmentNode({ data }) {
  const isFoundation = data.kind === 'foundation';
  return (
    <div className={`${isFoundation ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-800 text-white border-slate-700'} border rounded-lg shadow-md min-w-[280px] max-w-[340px] p-3 relative group`}>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isFoundation ? 'text-emerald-700' : 'text-slate-400'}`}>
        {isFoundation ? 'Foundation (Intro)' : 'Keystone (Conclusion)'}
      </div>
      <div className={`text-xs leading-relaxed font-serif ${isFoundation ? 'text-slate-700' : 'text-slate-200'}`}>
        {data.content || <span className="italic text-slate-400">No content yet...</span>}
      </div>
    </div>
  );
}

function CantileverSummaryNode({ data }) {
  const topic = data.topic || 'Untitled paragraph';
  const filled = (data.blocks || []).filter(b => b.evidence || b.explanation).length;
  const total = (data.blocks || []).length || 3;
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg min-w-[300px] max-w-[360px] p-3 relative group cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all" onClick={() => data.onExplode?.(data.segmentId)}>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <DelBtn onClick={(e) => { e.stopPropagation(); data.onDelete?.(data.segmentId); }} cls="bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600 border" />
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cantilever</div>
      <div className="text-sm font-bold text-slate-800 mb-2 font-serif">{topic}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-slate-400">{pct}%</span>
      </div>
      <div className="text-[10px] text-blue-500 mt-1">Click to expand TEEL view</div>
    </div>
  );
}

function TeelTopicNode({ data }) {
  const [val, setVal] = useState(data.text || '');
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-lg shadow-md min-w-[280px] max-w-[340px] p-3 relative group">
      <Handle type="source" position={Position.Bottom} className="!bg-violet-400" />
      <Handle type="target" position={Position.Top} className="!bg-violet-400" />
      <div className="text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-1">Topic Sentence</div>
      <textarea className="w-full text-xs font-serif bg-transparent border-0 outline-none resize-none min-h-[40px]" value={val}
        onChange={(e) => setVal(e.target.value)} onBlur={() => data.onUpdate?.('topic', val)} placeholder="Topic sentence..." />
    </div>
  );
}

function TeelLinkNode({ data }) {
  const [val, setVal] = useState(data.text || '');
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg shadow-md min-w-[280px] max-w-[340px] p-3 relative group">
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400" />
      <Handle type="target" position={Position.Top} className="!bg-emerald-400" />
      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Link Sentence</div>
      <textarea className="w-full text-xs font-serif bg-transparent border-0 outline-none resize-none min-h-[40px]" value={val}
        onChange={(e) => setVal(e.target.value)} onBlur={() => data.onUpdate?.('link', val)} placeholder="Link sentence..." />
    </div>
  );
}

function TeelEENode({ data }) {
  const [ev, setEv] = useState(data.evidence || '');
  const [ex, setEx] = useState(data.explanation || '');
  const isA = data.attribution === 'a';
  return (
    <div className={`bg-white border ${isA ? 'border-blue-200' : 'border-orange-200'} rounded-lg shadow-md min-w-[280px] max-w-[340px] p-3 relative group`}>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isA ? 'text-blue-600' : 'text-orange-600'}`}>
        Evidence + Explanation {data.blockIndex + 1} ({isA ? 'Source A' : 'Source B'})
      </div>
      <textarea className="w-full text-xs font-serif italic bg-slate-50 rounded p-1.5 border-0 outline-none resize-none min-h-[30px] mb-1" value={ev}
        onChange={(e) => setEv(e.target.value)} onBlur={() => data.onUpdate?.(`blocks.${data.blockIndex}.evidence`, ev)} placeholder="Evidence..." />
      <textarea className="w-full text-xs font-serif bg-slate-50 rounded p-1.5 border-0 outline-none resize-none min-h-[30px]" value={ex}
        onChange={(e) => setEx(e.target.value)} onBlur={() => data.onUpdate?.(`blocks.${data.blockIndex}.explanation`, ex)} placeholder="Explanation..." />
    </div>
  );
}

export default function BridgeNode({ data }) {
  const variant = data.variant;
  if (variant === 'segment') return <SegmentNode data={data} />;
  if (variant === 'cantilever-summary') return <CantileverSummaryNode data={data} />;
  if (variant === 'teel-topic') return <TeelTopicNode data={data} />;
  if (variant === 'teel-link') return <TeelLinkNode data={data} />;
  if (variant === 'teel-ee') return <TeelEENode data={data} />;

  // Legacy fallback for unmigrated bridge nodes
  const del = (e) => { e.stopPropagation(); data.onDelete?.(data.bridgeId); };
  if (data.side === 'synthesis') return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg min-w-[240px] max-w-[300px] relative group">
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Synthesis</div>
      <div className="text-xs leading-relaxed">{data.synthesis}</div>
      <DelBtn onClick={del} cls="bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700" />
    </div>
  );
  const meta = FORM_LOOKUP[data.formType];
  const isA = data.side === 'a';
  return (
    <div className={`bg-white border ${isA ? 'border-blue-200' : 'border-orange-200'} rounded-lg shadow-md min-w-[260px] max-w-[300px] p-3 relative group`}>
      <Handle type="source" position={isA ? Position.Right : Position.Left} className="!bg-slate-400" />
      <Handle type="target" position={isA ? Position.Left : Position.Right} className="!bg-slate-400" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-slate-400" />
      <DelBtn onClick={del} cls="bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600 border" />
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isA ? 'text-blue-600' : 'text-orange-600'}`}>{data.label}</div>
      {meta && <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1.5 ${meta.color}`}>{meta.label}</span>}
      <div className="text-sm font-bold text-slate-800 mb-1">{data.feature}</div>
      {data.ctx && <div className="text-[10px] text-slate-500 mb-1">{data.ctx}</div>}
      {data.evidence && <div className="text-xs font-serif italic text-slate-600 bg-slate-50 p-2 rounded mb-1.5 leading-relaxed">&ldquo;{data.evidence}&rdquo;</div>}
      {data.meaning && <div className={`text-[10px] font-medium p-1.5 rounded font-serif ${isA ? 'bg-blue-50 text-blue-900' : 'bg-orange-50 text-orange-900'}`}>{data.meaning}</div>}
    </div>
  );
}
