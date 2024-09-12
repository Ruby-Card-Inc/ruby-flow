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
import { edgeTypes } from "./edges";
import { db, updateNodes, updateEdges, addNodeDB } from "./instant";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [nodeType, setNodeType] = React.useState<"progress" | "stats" | null>(
    null
  );
  const [formData, setFormData] = React.useState<any>({});
  const [dataItems, setDataItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (nodesData?.nodes) {
      setNodes(nodesData.nodes);
    }
    if (edgesData?.edges) {
      setEdges(edgesData.edges);
    }
  }, [nodesData, edgesData, setNodes, setEdges]);

  const onConnect: OnConnect = React.useCallback(
    (connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(connection, eds);
        updateEdges(connection);
        return newEdges;
      });
    },
    [setEdges]
  );

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
    const newNode =
      nodeType === "progress"
        ? {
            id: `node-${Date.now()}`,
            type: "ProgressNode",
            data: { ...formData, progress: Number(formData.progress) },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
          }
        : nodeType === "stats"
        ? {
            id: `node-${Date.now()}`,
            type: "StatsNode",
            data: { ...formData, dataItems },
            position: { x: Math.random() * 500, y: Math.random() * 500 },
          }
        : null;

    if (newNode) {
      setNodes((nds) => [...nds, newNode]);
      addNodeDB(newNode);
    }

    setIsOpen(false);
    setNodeType(null);
    setFormData({});
    setDataItems([]);
  }, [nodeType, formData, dataItems]);

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
    setDataItems((prev) => [...prev, { time: "", data: "", change: "" }]);
  }, []);

  const updateDataItem = React.useCallback(
    (index: number, field: "data" | "time" | "change", value: string) => {
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="absolute top-4 left-4 z-10">Add Node</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={(value) =>
              setNodeType(value as "progress" | "stats")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select node type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress Node</SelectItem>
              <SelectItem value="stats">Stats Node</SelectItem>
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
          <Button onClick={addNode}>Confirm</Button>
        </DialogContent>
      </Dialog>
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
    </div>
  );
}
