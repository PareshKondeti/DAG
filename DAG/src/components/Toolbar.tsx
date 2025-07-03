import React from 'react';
import { 
  Plus, 
  Layout, 
  Trash2, 
  Save, 
  Upload, 
  RotateCcw,
  Info
} from 'lucide-react';

interface ToolbarProps {
  onAddNode: () => void;
  onAutoLayout: () => void;
  onClearAll: () => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onToggleInfo: () => void;
  canDelete: boolean;
  nodeCount: number;
  edgeCount: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onAutoLayout,
  onClearAll,
  onSave,
  onLoad,
  onReset,
  onToggleInfo,
  canDelete,
  nodeCount,
  edgeCount
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onAddNode}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            title="Add Node (Ctrl+N)"
          >
            <Plus className="w-4 h-4" />
            Add Node
          </button>
          
          <button
            onClick={onAutoLayout}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={nodeCount < 2}
            title="Auto Layout"
          >
            <Layout className="w-4 h-4" />
            Layout
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            disabled={nodeCount === 0}
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            title="Reset to Default"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50"
            disabled={nodeCount === 0}
            title="Save Pipeline"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={onLoad}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            title="Load Pipeline"
          >
            <Upload className="w-4 h-4" />
            Load
          </button>
        </div>

        <button
          onClick={onToggleInfo}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          title="Toggle Info Panel"
        >
          <Info className="w-4 h-4" />
          Info
        </button>

        <div className="text-sm text-gray-600 pt-2 border-t">
          <div>Nodes: {nodeCount}</div>
          <div>Edges: {edgeCount}</div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;