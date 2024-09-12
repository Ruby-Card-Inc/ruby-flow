import { init, tx } from "@instantdb/react";
import { debounce } from "lodash";
import { Node, Edge } from "@xyflow/react";
import { id } from "@instantdb/react";
export const APP_ID = "b3b3f399-fa4f-4f31-bde3-71d5d8d467cf";

type Schema = {
  nodes: Node[];
  edges: any;
};

export const db = init<Schema>({ appId: APP_ID });

const debouncedUpdateNodes = debounce((nodes: Node[]) => {
  console.log("Call", nodes);
  const updatedNodes = nodes.map((node) => {
    const { measured, ...rest } = node;
    return rest;
  });

  console.log(updatedNodes);
  db.transact(updatedNodes.map((node) => tx.nodes[node.id].update(node)));
}, 300);

export function updateNodes(nodes: Node[]) {
  debouncedUpdateNodes(nodes);
}

export function updateEdges(edge: any) {
  if (!edge) return;
  console.log(edge);
  db.transact([
    tx.edges[id()].update({
      animated: false,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      data: edge.data,
    }),
  ]);
}

export function addNodeDB(node: any) {
  const data = {
    data: node.data,
    dragging: true,
    label: node.data.title,
    node_type: node.type,
    position: node.position,
    type: node.type,
    selected: false,
  };
  db.transact([tx.nodes[id()].update(data)]);
}

export function deleteNodeDB(nodeId: string) {
  db.transact([tx.nodes[nodeId].delete()]);
}

export function deleteEdgeDB(edgeId: string) {
  db.transact([tx.edges[edgeId].delete()]);
}

export function cancelPendingUpdates() {
  debouncedUpdateNodes.cancel();
}
