import dagre from 'dagre';
import { PipelineNode, PipelineEdge } from '../types';

export class LayoutService {
  static applyAutoLayout(nodes: PipelineNode[], edges: PipelineEdge[]): PipelineNode[] {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));


    dagreGraph.setGraph({
      rankdir: 'TB', 
      align: 'UL',
      nodesep: 100,
      ranksep: 100,
      marginx: 50,
      marginy: 50,
    });

  
    nodes.forEach(node => {
      dagreGraph.setNode(node.id, {
        width: 200,
        height: 80,
      });
    });

    
    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });


    dagre.layout(dagreGraph);

    
    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        },
      };
    });

    return layoutedNodes;
  }

  static distributeNodes(nodes: PipelineNode[]): PipelineNode[] {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const nodeSpacing = 250;
    const startX = 100;
    const startY = 100;

    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: startX + (index % cols) * nodeSpacing,
        y: startY + Math.floor(index / cols) * nodeSpacing,
      },
    }));
  }
}