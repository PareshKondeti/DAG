import { Node, Edge } from 'reactflow';

export interface PipelineNode extends Node {
  id: string;
  data: {
    label: string;
    type?: string;
  };
  position: {
    x: number;
    y: number;
  };
  type: string;
}

export interface PipelineEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DAGStats {
  nodeCount: number;
  edgeCount: number;
  isConnected: boolean;
  hasCycles: boolean;
  isolatedNodes: string[];
}