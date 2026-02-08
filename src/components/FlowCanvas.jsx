import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BridgeNode from './BridgeNode';

const nodeTypes = { bridge: BridgeNode };

function buildLayout(bridges, onDelete) {
  const nodes = [];
  const edges = [];
  const colWidth = 320;
  const rowHeight = 280;
  const gapY = 40;

  bridges.forEach((bridge, i) => {
    const y = i * (rowHeight + gapY);

    // Source A node (left)
    nodes.push({
      id: `${bridge.id}-a`,
      type: 'bridge',
      position: { x: 0, y },
      data: {
        label: 'Source A',
        side: 'a',
        tech: bridge.sideA.tech || 'Technique',
        ctx: bridge.sideA.ctx,
        evidence: bridge.sideA.ev,
        meaning: bridge.sideA.meaning,
        formType: bridge.sideA.type,
        bridgeId: bridge.id,
        onDelete,
      },
    });

    // Source B node (right)
    nodes.push({
      id: `${bridge.id}-b`,
      type: 'bridge',
      position: { x: colWidth + 200, y },
      data: {
        label: 'Source B',
        side: 'b',
        tech: bridge.sideB.tech || 'Technique',
        ctx: bridge.sideB.ctx,
        evidence: bridge.sideB.ev,
        meaning: bridge.sideB.meaning,
        formType: bridge.sideB.type,
        bridgeId: bridge.id,
        onDelete,
      },
    });

    // Synthesis node (center below)
    if (bridge.synthesis) {
      nodes.push({
        id: `${bridge.id}-syn`,
        type: 'bridge',
        position: { x: (colWidth + 200) / 2 - 40, y: y + 180 },
        data: {
          label: 'Synthesis',
          side: 'synthesis',
          synthesis: bridge.synthesis,
          bridgeId: bridge.id,
          onDelete,
        },
      });

      edges.push({
        id: `${bridge.id}-a-syn`,
        source: `${bridge.id}-a`,
        target: `${bridge.id}-syn`,
        type: 'default',
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      });
      edges.push({
        id: `${bridge.id}-b-syn`,
        source: `${bridge.id}-b`,
        target: `${bridge.id}-syn`,
        type: 'default',
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      });
    }

    // Direct edge between A and B
    edges.push({
      id: `${bridge.id}-ab`,
      source: `${bridge.id}-a`,
      target: `${bridge.id}-b`,
      type: 'default',
      style: { stroke: '#cbd5e1', strokeWidth: 1 },
    });
  });

  return { nodes, edges };
}

export default function FlowCanvas({ bridges, onBridgeDelete }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildLayout(bridges, onBridgeDelete),
    [bridges, onBridgeDelete]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (bridges.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
        <p className="text-sm italic">No bridges built yet. Switch to Edit mode to add cantilevers.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
