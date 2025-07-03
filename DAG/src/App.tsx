import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { PipelineNode as PipelineNodeType, PipelineEdge, ValidationResult, DAGStats } from './types';
import { DAGValidationService } from './services/dagValidation';
import { LayoutService } from './services/layoutService';
import PipelineNode from './components/PipelineNode';
import Toolbar from './components/Toolbar';
import ValidationPanel from './components/ValidationPanel';
import InfoPanel from './components/InfoPanel';
import NodeTypeModal from './components/NodeTypeModal';

const nodeTypes = {
  pipelineNode: PipelineNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    strokeWidth: 2,
    stroke: '#64748b',
  },
};

const initialNodes: PipelineNodeType[] = [
  {
    id: '1',
    type: 'pipelineNode',
    position: { x: 100, y: 100 },
    data: { label: 'Data Source', type: 'source' },
  },
  {
    id: '2',
    type: 'pipelineNode',
    position: { x: 400, y: 100 },
    data: { label: 'Process Data', type: 'process' },
  },
];

const initialEdges: PipelineEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

function PipelineEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PipelineNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PipelineEdge>(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(3);
  const { fitView } = useReactFlow();

  const validation: ValidationResult = useMemo(() => {
    return DAGValidationService.validateDAG(nodes, edges);
  }, [nodes, edges]);

  const stats: DAGStats = useMemo(() => {
    return DAGValidationService.getDAGStats(nodes, edges);
  }, [nodes, edges]);

  const handleAddNode = useCallback((label: string, type: string) => {
    const newNode: PipelineNodeType = {
      id: `node-${nodeCounter}`,
      type: 'pipelineNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label, type },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((prev) => prev + 1);
  }, [nodeCounter, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        return;
      }
      const newEdge: PipelineEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      } as PipelineEdge;
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = LayoutService.applyAutoLayout(nodes, edges);
    setNodes(layoutedNodes);
    setTimeout(() => {
      fitView({ duration: 500, padding: 0.2 });
    }, 100);
  }, [nodes, edges, setNodes, fitView]);

  const handleClearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNodeCounter(3);
  }, [setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const data = {
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.data.label,
        type: node.data.type || 'default',
        position: node.position
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            const loadedNodes = data.nodes.map((node: any) => ({
              id: node.id,
              type: 'pipelineNode',
              position: node.position,
              data: { label: node.label, type: node.type }
            }));
            const loadedEdges = data.edges.map((edge: any) => ({
              ...edge,
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed }
            }));
            setNodes(loadedNodes);
            setEdges(loadedEdges);
          } catch (error) {
            alert('Error loading file: Invalid JSON format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        setIsModalOpen(true);
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter(node => node.selected);
        const selectedEdges = edges.filter(edge => edge.selected);
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          const nodeIdsToRemove = selectedNodes.map(node => node.id);
          const edgesToRemove = [
            ...selectedEdges.map(edge => edge.id),
            ...edges.filter(edge => 
              nodeIdsToRemove.includes(edge.source) || 
              nodeIdsToRemove.includes(edge.target)
            ).map(edge => edge.id)
          ];
          setNodes(nodes.filter(node => !nodeIdsToRemove.includes(node.id)));
          setEdges(edges.filter(edge => !edgesToRemove.includes(edge.id)));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Strict}
        fitView
        className="react-flow-pipeline"
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'source': return '#3b82f6';
              case 'process': return '#10b981';
              case 'sink': return '#8b5cf6';
              default: return '#64748b';
            }
          }}
        />
      </ReactFlow>
      <Toolbar
        onAddNode={() => setIsModalOpen(true)}
        onAutoLayout={handleAutoLayout}
        onClearAll={handleClearAll}
        onSave={handleSave}
        onLoad={handleLoad}
        onReset={handleReset}
        onToggleInfo={() => setShowInfo(!showInfo)}
        canDelete={nodes.some(n => n.selected) || edges.some(e => e.selected)}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />
      <ValidationPanel validation={validation} stats={stats} />
      {showInfo && (
        <InfoPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowInfo(false)}
        />
      )}
      <NodeTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddNode}
      />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <PipelineEditor />
    </ReactFlowProvider>
  );
}

export default App;
