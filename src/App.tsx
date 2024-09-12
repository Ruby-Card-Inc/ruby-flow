import * as React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./components/customNode";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { db, updateNodes, updateEdges } from "./instant";

export default function App() {
  return <Flow />;
}

function Flow() {
  // Query both nodes and edges from the database
  const {
    isLoading: nodesLoading,
    error: nodesError,
    data: nodesData,
  } = db.useQuery({ nodes: {} });
  const {
    isLoading: edgesLoading,
    error: edgesError,
    data: edgesData,
  } = db.useQuery({ edges: {} });

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // // Update nodes when the data is available
  // React.useEffect(() => {
  //   if (nodesData && nodesData.nodes) {
  //     setNodes(nodesData.nodes);
  //   }
  // }, [nodesData, setNodes]);

  // // Update edges when the data is available
  // React.useEffect(() => {
  //   if (edgesData && edgesData.edges) {
  //     setEdges(edgesData.edges);
  //   }
  // }, [edgesData, setEdges]);

  const onConnect: OnConnect = React.useCallback(
    (connection) => {
      const updatedEdges = addEdge(connection, edges);
      setEdges(updatedEdges);

      updateEdges(connection);
    },
    [edges, setEdges]
  );

  const onNodesChangeWrapper = React.useCallback(
    (changes) => {
      onNodesChange(changes);
      const updatedNodes = nodes.map((node) => {
        const change = changes.find(
          (c) => c.id === node.id && c.type === "position"
        );
        if (change) {
          return { ...node, position: change.position };
        }
        return node;
      });
      updateNodes(updatedNodes);
    },
    [nodes, onNodesChange]
  );

  // Handle loading and error states for nodes and edges
  if (nodesLoading || edgesLoading) return <div>Loading...</div>;
  if (nodesError) return <div>Error loading nodes: {nodesError.message}</div>;
  if (edgesError) return <div>Error loading edges: {edgesError.message}</div>;

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChangeWrapper}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
