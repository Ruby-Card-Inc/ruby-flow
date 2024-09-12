import type { NodeTypes } from "@xyflow/react";
export { default as CustomNode } from "../components/customNode";
import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";
import ProgressNode from "../components/customNode";
import { StatsNode } from "../components/customNode";
import { AINode, DataNode, EndNode } from "../components/customNode";

//To do:
//1. Each node has a title htat is bolded
//2: Each node can have a logo and a sub heading with a link
//3: Progress bar
//4: Metrics Node as well so two types of nodes, metrics and in progress
//5. In progress can be to do, in progress, done, and has a time bar wiht percent done. Clicking it brings a modal to adjust it
export const initialNodes: any[] = [
  {
    id: "1",
    type: "ProgressNode",
    position: { x: 0, y: 0 },
    data: {
      title: "Custom Node",
      subtitle: "This is a subtitle",
      detailsLink: "https://example.com",
      progress: 75,
      status: "in progress",
    },
  },
  {
    id: "2",
    type: "StatsNode",
    position: { x: 0, y: 0 },
    data: {
      title: "Custom Node",
      meter: 75,
      source: "API",
      method: "GET",
      dataItems: [
        { time: "15:30", data: "1.23 MB", change: 5.4 },
        { time: "16:00", data: "1.45 MB", change: -2.1 },
        { time: "16:30", data: "1.37 MB", change: 3.8 },
      ],
    },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode, // Add any of your custom nodes here!
  ProgressNode: ProgressNode,
  StatsNode: StatsNode,
  AINode: AINode,
  DataNode: DataNode,
  EndNode: EndNode,
} satisfies NodeTypes;
