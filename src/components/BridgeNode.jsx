import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { FORM_LOOKUP } from '@/lib/form-data';

const DelBtn = ({ onClick, cls }) => (
  <button onClick={onClick} className={`absolute -top-2 -right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm ${cls}`} title="Delete Bridge">
    <Trash2 size={12} />
  </button>
);

export default function BridgeNode({ data }) {
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
      <div className="text-sm font-bold text-slate-800 mb-1">{data.tech}</div>
      {data.ctx && <div className="text-[10px] text-slate-500 mb-1">{data.ctx}</div>}
      {data.evidence && <div className="text-xs font-serif italic text-slate-600 bg-slate-50 p-2 rounded mb-1.5 leading-relaxed">"{data.evidence}"</div>}
      {data.meaning && <div className={`text-[10px] font-medium p-1.5 rounded font-serif ${isA ? 'bg-blue-50 text-blue-900' : 'bg-orange-50 text-orange-900'}`}>{data.meaning}</div>}
    </div>
  );
}
