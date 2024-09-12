import type { NodeTypes } from "@xyflow/react";
export { default as CustomNode } from "../components/customNode";
import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";
import CustomNode from "../components/customNode";

//To do:
//1. Each node has a title htat is bolded
//2: Each node can have a logo and a sub heading with a link
//3: Progress bar
//4: Metrics Node as well so two types of nodes, metrics and in progress
//5. In progress can be to do, in progress, done, and has a time bar wiht percent done. Clicking it brings a modal to adjust it
export const initialNodes: any[] = [
  {
    id: "1",
    type: "customNode",
    position: { x: 0, y: 0 },
    data: {
      title: "Custom Node",
      subtitle: "This is a subtitle",
      detailsLink: "https://example.com",
      progress: 75,
      status: "in progress",
    },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode, // Add any of your custom nodes here!
  customNode: CustomNode,
} satisfies NodeTypes;
