import type { Edge, EdgeTypes } from "@xyflow/react";

export const initialEdges: Edge[] = [
  {
    id: "a->b",
    source: "a",
    target: "c",
  },
  { id: "b->d", source: "b", target: "d" },
  { id: "c->d", source: "c", target: "d", animated: true },
  { id: "d->e", source: "b", target: "c" },
];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
