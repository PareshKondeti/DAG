import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';
import { ValidationResult, DAGStats } from '../types';

interface ValidationPanelProps {
  validation: ValidationResult;
  stats: DAGStats;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation, stats }) => {
  const getStatusIcon = () => {
    if (validation.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (validation.isValid) {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon()}
        <h3 className="font-semibold text-gray-800">
          {validation.isValid ? 'Valid DAG' : 'Invalid DAG'}
        </h3>
      </div>

      <div className={`rounded-lg p-3 mb-3 ${getStatusColor()}`}>
        <div className="text-sm">
          <div className="font-medium mb-1">Pipeline Status:</div>
          <div className="text-gray-700">
            {validation.isValid ? 'Ready for execution' : 'Contains errors'}
          </div>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Errors:</span>
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-red-400 mt-0.5">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Info className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Warnings:</span>
          </div>
          <ul className="text-sm text-yellow-600 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-yellow-400 mt-0.5">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-600 space-y-1">
        <div className="font-medium">Statistics:</div>
        <div>Nodes: {stats.nodeCount}</div>
        <div>Edges: {stats.edgeCount}</div>
        <div>Connected: {stats.isConnected ? 'Yes' : 'No'}</div>
        <div>Has Cycles: {stats.hasCycles ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default ValidationPanel;