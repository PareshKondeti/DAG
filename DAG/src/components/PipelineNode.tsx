import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Database, Workflow, Target } from 'lucide-react';
import { PipelineNode as PipelineNodeType } from '../types';

const PipelineNode = memo(({ id, data, selected }: NodeProps<PipelineNodeType>) => {
  const getNodeIcon = () => {
    switch (data.type) {
      case 'source':
        return <Database className="w-5 h-5 text-blue-600" />;
      case 'process':
        return <Workflow className="w-5 h-5 text-green-600" />;
      case 'sink':
        return <Target className="w-5 h-5 text-purple-600" />;
      default:
        return <Workflow className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNodeColor = () => {
    switch (data.type) {
      case 'source':
        return 'border-blue-300 bg-blue-50';
      case 'process':
        return 'border-green-300 bg-green-50';
      case 'sink':
        return 'border-purple-300 bg-purple-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`relative ${getNodeColor()} ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-gray-600 transition-colors"
      />
      
      <div className="px-4 py-3 rounded-lg border-2 bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-[180px]">
        <div className="flex items-center gap-2">
          {getNodeIcon()}
          <span className="font-medium text-gray-800 truncate">
            {data.label}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ID: {id}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-gray-600 transition-colors"
      />
    </div>
  );
});

PipelineNode.displayName = 'PipelineNode';

export default PipelineNode;