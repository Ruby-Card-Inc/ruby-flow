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
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { nodeTypes } from "./nodes";
import { db, updateNodes, updateEdges, addNodeDB } from "./instant";
import { deleteNodeDB, deleteEdgeDB } from "./instant";
const CustomDottedEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: data.color as string,
          strokeWidth: 2,
          strokeDasharray: "5,5",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#ffffff",
            padding: "4px",
            borderRadius: "4px",
            fontSize: 12,
            fontWeight: 700,
            pointerEvents: "all",
          }}
        >
          {data.label as React.ReactNode}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// Edge Types
const edgeTypes = {
  customDotted: CustomDottedEdge,
};

export default function App() {
  return <Flow />;
}

function Flow() {
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

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = React.useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = React.useState(false);
  const [nodeType, setNodeType] = React.useState<
    "progress" | "stats" | "data" | "ai" | "end" | null
  >(null);
  const [formData, setFormData] = React.useState<any>({});
  const [dataItems, setDataItems] = React.useState<any[]>([]);

  // New state for edge creation
  const [sourceNode, setSourceNode] = React.useState<string | null>(null);
  const [targetNode, setTargetNode] = React.useState<string | null>(null);
  const [edgeColor, setEdgeColor] = React.useState("#000000");
  const [edgeLabel, setEdgeLabel] = React.useState("");

  React.useEffect(() => {
    if (nodesData?.nodes) {
      setNodes(nodesData.nodes);
    }
    if (edgesData?.edges) {
      setEdges(edgesData.edges);
    }
  }, [nodesData, edgesData, setNodes, setEdges]);

  const onConnect: OnConnect = React.useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "customDotted",
        data: {
          label: edgeLabel || `Edge ${params.source}-${params.target}`,
          color: edgeColor,
        },
      };
      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        updateEdges(newEdge);
        return newEdges;
      });
    },
    [setEdges, edgeColor, edgeLabel]
  );

  const createEdge = React.useCallback(() => {
    if (sourceNode && targetNode) {
      const newEdge = {
        id: `edge-${sourceNode}-${targetNode}`,
        source: sourceNode,
        target: targetNode,
        type: "customDotted",
        data: {
          label: edgeLabel || `Edge ${sourceNode}-${targetNode}`,
          color: edgeColor,
        },
      };
      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        updateEdges(newEdge);
        return newEdges;
      });
      setIsEdgeDialogOpen(false);
      setSourceNode(null);
      setTargetNode(null);
      setEdgeColor("#000000");
      setEdgeLabel("");
    }
  }, [sourceNode, targetNode, edgeColor, edgeLabel, setEdges]);

  const onNodesChangeWrapper = React.useCallback(
    (changes) => {
      onNodesChange(changes);
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          const change = changes.find(
            (c) => c.id === node.id && c.type === "position"
          );
          if (change) {
            return { ...node, position: change.position };
          }
          return node;
        });
        updateNodes(updatedNodes);
        return updatedNodes;
      });
    },
    [onNodesChange]
  );

  const addNode = React.useCallback(() => {
    let newNode;
    switch (nodeType) {
      case "progress":
        newNode = {
          id: `node-${Date.now()}`,
          type: "ProgressNode",
          data: { ...formData, progress: Number(formData.progress) },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        };
        break;
      case "stats":
        newNode = {
          id: `node-${Date.now()}`,
          type: "StatsNode",
          data: { ...formData, dataItems },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        };
        break;
      case "data":
        newNode = {
          id: `node-${Date.now()}`,
          type: "DataNode",
          data: { ...formData, dataItems },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        };
        break;
      case "ai":
        newNode = {
          id: `node-${Date.now()}`,
          type: "AINode",
          data: { ...formData, confidence: Number(formData.confidence) },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        };
        break;
      case "end":
        newNode = {
          id: `node-${Date.now()}`,
          type: "EndNode",
          data: { ...formData },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        };
        break;
    }

    if (newNode) {
      setNodes((nds) => [...nds, newNode]);
      addNodeDB(newNode);
    }

    setIsNodeDialogOpen(false);
    setNodeType(null);
    setFormData({});
    setDataItems([]);
  }, [nodeType, formData, dataItems]);

  const onNodesDelete = React.useCallback((deleted) => {
    deleted.forEach((node) => deleteNodeDB(node.id));
  }, []);

  const onEdgesDelete = React.useCallback((deleted) => {
    deleted.forEach((edge) => deleteEdgeDB(edge.id));
  }, []);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSliderChange = React.useCallback((value: number[]) => {
    setFormData((prev) => ({ ...prev, progress: value[0] }));
  }, []);

  const addDataItem = React.useCallback(() => {
    setDataItems((prev) => [...prev, { label: "", value: "" }]);
  }, []);

  const updateDataItem = React.useCallback(
    (index: number, field: string, value: string) => {
      setDataItems((prev) => {
        const newDataItems = [...prev];
        newDataItems[index] = { ...newDataItems[index], [field]: value };
        return newDataItems;
      });
    },
    []
  );

  if (nodesLoading || edgesLoading) return <div>Loading...</div>;
  if (nodesError) return <div>Error loading nodes: {nodesError.message}</div>;
  if (edgesError) return <div>Error loading edges: {edgesError.message}</div>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={(value) =>
              setNodeType(value as "progress" | "stats" | "data" | "ai" | "end")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select node type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress Node</SelectItem>
              <SelectItem value="stats">Stats Node</SelectItem>
              <SelectItem value="data">Data Node</SelectItem>
              <SelectItem value="ai">AI Node</SelectItem>
              <SelectItem value="end">End Node</SelectItem>
            </SelectContent>
          </Select>
          {nodeType === "progress" && (
            <>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={handleInputChange} />
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                onChange={handleInputChange}
              />
              <Label htmlFor="detailsLink">Details Link</Label>
              <Input
                id="detailsLink"
                name="detailsLink"
                onChange={handleInputChange}
              />
              <Label htmlFor="progress">Progress</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
              />
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" onChange={handleInputChange} />
            </>
          )}
          {nodeType === "stats" && (
            <>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={handleInputChange} />
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" onChange={handleInputChange} />
              <Label htmlFor="method">Method</Label>
              <Input id="method" name="method" onChange={handleInputChange} />
              {dataItems.map((item, index) => (
                <div key={index}>
                  <Input
                    placeholder="time"
                    value={item.time}
                    onChange={(e) =>
                      updateDataItem(index, "time", e.target.value)
                    }
                  />
                  <Input
                    placeholder="data"
                    value={item.data}
                    onChange={(e) =>
                      updateDataItem(index, "data", e.target.value)
                    }
                  />
                  <Input
                    placeholder="change"
                    value={item.change}
                    onChange={(e) =>
                      updateDataItem(index, "change", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button onClick={addDataItem}>Add Data Item</Button>
            </>
          )}
          {nodeType === "data" && (
            <>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={handleInputChange} />
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" onChange={handleInputChange} />
              {dataItems.map((item, index) => (
                <div key={index}>
                  <Input
                    placeholder="label"
                    value={item.label}
                    onChange={(e) =>
                      updateDataItem(index, "label", e.target.value)
                    }
                  />
                  <Input
                    placeholder="value"
                    value={item.value}
                    onChange={(e) =>
                      updateDataItem(index, "value", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button onClick={addDataItem}>Add Data Item</Button>
            </>
          )}
          {nodeType === "ai" && (
            <>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={handleInputChange} />
              <Label htmlFor="task">Task</Label>
              <Input id="task" name="task" onChange={handleInputChange} />
              <Label htmlFor="confidence">Confidence</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, confidence: value[0] }))
                }
              />
            </>
          )}
          {nodeType === "end" && (
            <>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={handleInputChange} />
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, outcome: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Manual Review">Manual Review</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Button onClick={addNode}>Confirm</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isEdgeDialogOpen} onOpenChange={setIsEdgeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Edge</DialogTitle>
          </DialogHeader>
          <Select onValueChange={(value) => setSourceNode(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select source node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.data.title || node.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setTargetNode(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select target node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.data.title || node.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="edgeColor">Edge Color</Label>
          <Input
            id="edgeColor"
            type="color"
            value={edgeColor}
            onChange={(e) => setEdgeColor(e.target.value)}
          />
          <Label htmlFor="edgeLabel">Edge Label</Label>
          <Input
            id="edgeLabel"
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
          />
          <Button onClick={createEdge}>Create Edge</Button>
        </DialogContent>
      </Dialog>

      <Button
        className="absolute top-4 left-4 z-10"
        onClick={() => setIsNodeDialogOpen(true)}
      >
        Add Node
      </Button>
      <Button
        className="absolute top-4 left-40 z-10"
        onClick={() => setIsEdgeDialogOpen(true)}
      >
        Create Edge
      </Button>

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChangeWrapper}
        onNodesDelete={onNodesDelete}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
