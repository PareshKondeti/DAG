import React from 'react';
import { X } from 'lucide-react';
import { PipelineNode, PipelineEdge } from '../types';

interface InfoPanelProps {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ nodes, edges, onClose }) => {
  const generateJSON = () => {
    return {
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
        type: edge.type || 'default'
      }))
    };
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md max-h-96 overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Pipeline JSON</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm">
        <div className="mb-2">
          <span className="font-medium">Debug Information:</span>
        </div>
        <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
          {JSON.stringify(generateJSON(), null, 2)}
        </pre>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div>Instructions:</div>
        <ul className="mt-1 space-y-1">
          <li>• Click "Add Node" to create new nodes</li>
          <li>• Drag from right handle to left handle to connect</li>
          <li>• Press Delete key to remove selected items</li>
          <li>• Use Auto Layout to organize nodes</li>
          <li>• Right-click for context menu</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoPanel;