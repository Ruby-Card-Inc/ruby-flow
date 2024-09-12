// RubyThing
// https://instantdb.com/dash?s=main&t=home&app=b3b3f399-fa4f-4f31-bde3-71d5d8d467cf

import { i } from "@instantdb/react";

const INSTANT_APP_ID = "b3b3f399-fa4f-4f31-bde3-71d5d8d467cf";

const graph = i.graph(
  INSTANT_APP_ID,
  {
    edges: i.entity({
      animated: i.any(),
      source: i.any(),
      target: i.any(),
    }),
    nodes: i.entity({
      data: i.any(),
      dragging: i.any(),
      label: i.any(),
      logo: i.any(),
      node_type: i.any(),
      position: i.any(),
      progress: i.any(),
      selected: i.any(),
      tag: i.any(),
      type: i.any(),
      x: i.any(),
      y: i.any(),
    }),
    test: i.entity({
      password: i.any(),
      username: i.any(),
    }),
  },
  {}
);

export default graph;
