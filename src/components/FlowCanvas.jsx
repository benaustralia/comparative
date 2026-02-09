import React, { useMemo, useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BridgeNode from './BridgeNode';

const nodeTypes = { bridge: BridgeNode };
const mkNode = (id, pos, data) => ({ id, type: 'bridge', position: pos, data });
const mkEdge = (id, src, tgt, stroke = '#cbd5e1', width = 1) => ({ id, source: src, target: tgt, type: 'default', style: { stroke, strokeWidth: width } });

function buildMacroLayout(segments, onDelete, onExplode) {
  const nodes = [], edges = [];
  let y = 0;
  segments.forEach((seg, i) => {
    if (seg.kind === 'foundation' || seg.kind === 'keystone') {
      nodes.push(mkNode(seg.id, { x: 120, y }, { variant: 'segment', kind: seg.kind, content: seg.content }));
    } else if (seg.kind === 'cantilever') {
      const teel = seg.teel || {};
      nodes.push(mkNode(seg.id, { x: 100, y }, {
        variant: 'cantilever-summary', segmentId: seg.id, topic: teel.topic, blocks: teel.blocks,
        onDelete, onExplode,
      }));
    }
    if (i > 0) edges.push(mkEdge(`e-${segments[i - 1].id}-${seg.id}`, segments[i - 1].id, seg.id, '#94a3b8', 1.5));
    y += 200;
  });
  return { nodes, edges };
}

function buildExplodedLayout(segment, onUpdate) {
  const teel = segment.teel || {};
  const blocks = teel.blocks || [];
  const nodes = [], edges = [];
  let y = 0;
  const topicId = `${segment.id}-topic`;
  nodes.push(mkNode(topicId, { x: 120, y }, { variant: 'teel-topic', text: teel.topic, onUpdate }));
  y += 160;

  blocks.forEach((block, bi) => {
    const attribution = bi === 0 ? 'a' : bi === 1 ? 'b' : 'a';
    const nodeId = `${segment.id}-ee-${bi}`;
    nodes.push(mkNode(nodeId, { x: 100, y }, {
      variant: 'teel-ee', blockIndex: bi, evidence: block.evidence, explanation: block.explanation, attribution, onUpdate,
    }));
    const prevId = bi === 0 ? topicId : `${segment.id}-ee-${bi - 1}`;
    edges.push(mkEdge(`e-${prevId}-${nodeId}`, prevId, nodeId, '#94a3b8', 1.5));
    y += 180;
  });

  const linkId = `${segment.id}-link`;
  nodes.push(mkNode(linkId, { x: 120, y }, { variant: 'teel-link', text: teel.link, onUpdate }));
  const lastEE = blocks.length ? `${segment.id}-ee-${blocks.length - 1}` : topicId;
  edges.push(mkEdge(`e-${lastEE}-${linkId}`, lastEE, linkId, '#94a3b8', 1.5));

  return { nodes, edges };
}

export default function FlowCanvas({ segments, onSegmentDelete, onSegmentUpdate }) {
  const [explodedId, setExplodedId] = useState(null);

  const handleExplode = useCallback((id) => setExplodedId(id), []);
  const handleBack = useCallback(() => setExplodedId(null), []);

  const explodedSegment = explodedId ? (segments || []).find(s => s.id === explodedId) : null;

  const handleFieldUpdate = useCallback((path, value) => {
    if (!explodedId) return;
    onSegmentUpdate?.(explodedId, path, value);
  }, [explodedId, onSegmentUpdate]);

  const { nodes: init, edges: initE } = useMemo(() => {
    if (explodedSegment) return buildExplodedLayout(explodedSegment, handleFieldUpdate);
    return buildMacroLayout(segments || [], onSegmentDelete, handleExplode);
  }, [segments, onSegmentDelete, handleExplode, explodedSegment, handleFieldUpdate]);

  const [nodes, , onNodesChange] = useNodesState(init);
  const [edges, , onEdgesChange] = useEdgesState(initE);

  if (!segments?.length) return (
    <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
      <p className="text-sm italic">No segments yet. Switch to Edit mode to add content.</p>
    </div>
  );

  return (
    <div className="h-full w-full relative">
      {explodedId && (
        <div className="absolute top-3 left-3 z-10">
          <Button variant="outline" size="sm" onClick={handleBack} className="shadow-md">
            <ArrowLeft size={14} className="mr-1" /> Back to Overview
          </Button>
        </div>
      )}
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#e2e8f0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
