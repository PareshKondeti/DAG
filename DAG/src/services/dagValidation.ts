import { PipelineNode, PipelineEdge, ValidationResult, DAGStats } from '../types';

export class DAGValidationService {
  static validateDAG(nodes: PipelineNode[], edges: PipelineEdge[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    
    if (nodes.length < 2) {
      errors.push('Pipeline must have at least 2 nodes');
    }

    
    const hasCycles = this.detectCycles(nodes, edges);
    if (hasCycles) {
      errors.push('Pipeline contains cycles - DAGs cannot have cycles');
    }

    const isolatedNodes = this.findIsolatedNodes(nodes, edges);
    if (isolatedNodes.length > 0) {
      errors.push(`Isolated nodes detected: ${isolatedNodes.join(', ')}`);
    }


    const selfLoops = edges.filter(edge => edge.source === edge.target);
    if (selfLoops.length > 0) {
      errors.push('Self-loops are not allowed in DAGs');
    }

    if (nodes.length > 20) {
      warnings.push('Large number of nodes may impact performance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static getDAGStats(nodes: PipelineNode[], edges: PipelineEdge[]): DAGStats {
    const isolatedNodes = this.findIsolatedNodes(nodes, edges);
    
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      isConnected: isolatedNodes.length === 0,
      hasCycles: this.detectCycles(nodes, edges),
      isolatedNodes
    };
  }

  private static detectCycles(nodes: PipelineNode[], edges: PipelineEdge[]): boolean {
    const adjList = this.buildAdjacencyList(nodes, edges);
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true;
      }

      if (visited.has(nodeId)) {
        return false; 
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (hasCycleDFS(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

 
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycleDFS(node.id)) {
          return true;
        }
      }
    }

    return false;
  }

  private static findIsolatedNodes(nodes: PipelineNode[], edges: PipelineEdge[]): string[] {
    const connectedNodes = new Set<string>();
    
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    return nodes
      .filter(node => !connectedNodes.has(node.id))
      .map(node => node.data.label);
  }

  private static buildAdjacencyList(nodes: PipelineNode[], edges: PipelineEdge[]): Map<string, string[]> {
    const adjList = new Map<string, string[]>();
    
 
    nodes.forEach(node => {
      adjList.set(node.id, []);
    });


    edges.forEach(edge => {
      const neighbors = adjList.get(edge.source) || [];
      neighbors.push(edge.target);
      adjList.set(edge.source, neighbors);
    });

    return adjList;
  }
}