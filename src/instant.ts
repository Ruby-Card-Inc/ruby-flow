import { init, tx } from "@instantdb/react";
import { AppNode } from "./nodes/types";

// enter your own instantdb app id here
export const APP_ID = "a00b1ff5-793e-429a-8607-6dcc04e92d01";

type Schema = {
  nodes: AppNode[];
};

export const db = init<Schema>({ appId: APP_ID });

export function updateNodes(nodes: AppNode[]) {
  db.transact(nodes.map((node) => tx.nodes[node.id].update({ ...node })));
}
