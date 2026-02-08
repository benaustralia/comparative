import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BridgeNode from './BridgeNode';

const nodeTypes = { bridge: BridgeNode };
const mkNode = (id, pos, data) => ({ id, type: 'bridge', position: pos, data });
const mkEdge = (id, src, tgt, stroke = '#cbd5e1', width = 1) => ({ id, source: src, target: tgt, type: 'default', style: { stroke, strokeWidth: width } });

function buildLayout(bridges, onDelete) {
  const nodes = [], edges = [];
  bridges.forEach((b, i) => {
    const y = i * 320;
    const sideData = (side, label) => ({ label, side, tech: b[`side${side.toUpperCase()}`].tech || 'Technique', ctx: b[`side${side.toUpperCase()}`].ctx, evidence: b[`side${side.toUpperCase()}`].ev, meaning: b[`side${side.toUpperCase()}`].meaning, formType: b[`side${side.toUpperCase()}`].type, bridgeId: b.id, onDelete });
    nodes.push(mkNode(`${b.id}-a`, { x: 0, y }, sideData('a', 'Source A')));
    nodes.push(mkNode(`${b.id}-b`, { x: 520, y }, sideData('b', 'Source B')));
    if (b.synthesis) {
      nodes.push(mkNode(`${b.id}-syn`, { x: 220, y: y + 180 }, { label: 'Synthesis', side: 'synthesis', synthesis: b.synthesis, bridgeId: b.id, onDelete }));
      edges.push(mkEdge(`${b.id}-a-syn`, `${b.id}-a`, `${b.id}-syn`, '#94a3b8', 1.5));
      edges.push(mkEdge(`${b.id}-b-syn`, `${b.id}-b`, `${b.id}-syn`, '#94a3b8', 1.5));
    }
    edges.push(mkEdge(`${b.id}-ab`, `${b.id}-a`, `${b.id}-b`));
  });
  return { nodes, edges };
}

export default function FlowCanvas({ bridges, onBridgeDelete }) {
  const { nodes: init, edges: initE } = useMemo(() => buildLayout(bridges, onBridgeDelete), [bridges, onBridgeDelete]);
  const [nodes, , onNodesChange] = useNodesState(init);
  const [edges, , onEdgesChange] = useEdgesState(initE);

  if (!bridges.length) return (
    <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
      <p className="text-sm italic">No bridges built yet. Switch to Edit mode to add cantilevers.</p>
    </div>
  );

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#e2e8f0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
