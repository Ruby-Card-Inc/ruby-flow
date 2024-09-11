import { init, tx } from "@instantdb/react";
import { AppNode } from "./nodes/types";
import { debounce } from "lodash";
export const APP_ID = "b3b3f399-fa4f-4f31-bde3-71d5d8d467cf";

type Schema = {
  nodes: AppNode[];
};

export const db = init<Schema>({ appId: APP_ID });

const debouncedUpdate = debounce((nodes: AppNode[]) => {
  db.transact(nodes.map((node) => tx.nodes[node.id].update({ ...node })));
}, 300);

export function updateNodes(nodes: AppNode[]) {
  debouncedUpdate(nodes);
}
export function cancelPendingUpdates() {
  debouncedUpdate.cancel();
}
