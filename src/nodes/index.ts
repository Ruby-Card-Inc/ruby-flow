import type { NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";

export const initialNodes: AppNode[] = [
  {
    id: "1ca42bcc-606d-447f-8995-acbc41c0a497",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "wire" },
  },
  {
    id: "5c6cb931-46a5-453a-a7f1-f62ce01e3aac",
    type: "position-logger",
    position: { x: -100, y: 100 },
    data: { label: "drag me!" },
  },
  {
    id: "a462ad02-83c2-4fee-91b8-4cf8ad753e13",
    position: { x: 100, y: 100 },
    data: { label: "your ideas" },
  },
  {
    id: "4d218c5f-7bbd-4a2b-883d-4159acde4ecc",
    type: "output",
    position: { x: 0, y: 200 },
    data: { label: "with React Flow" },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
