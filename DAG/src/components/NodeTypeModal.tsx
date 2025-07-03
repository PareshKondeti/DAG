import React, { useState } from 'react';
import { X, Database, Workflow, Target } from 'lucide-react';

interface NodeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (label: string, type: string) => void;
}

const NodeTypeModal: React.FC<NodeTypeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [label, setLabel] = useState('');
  const [selectedType, setSelectedType] = useState('process');

  const nodeTypes = [
    { id: 'source', label: 'Data Source', icon: Database, color: 'blue' },
    { id: 'process', label: 'Process', icon: Workflow, color: 'green' },
    { id: 'sink', label: 'Data Sink', icon: Target, color: 'purple' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onConfirm(label.trim(), selectedType);
      setLabel('');
      setSelectedType('process');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Node</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Node Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter node name..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {nodeTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      selectedType === type.id ? `text-${type.color}-600` : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      selectedType === type.id ? `text-${type.color}-800` : 'text-gray-600'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!label.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeTypeModal;