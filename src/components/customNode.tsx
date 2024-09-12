import React from "react";
import { Handle, Position } from "@xyflow/react";
import "./customNode.css";

const CustomNode: React.FC<any> = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />

      <div className="node-content">
        <h3 className="node-title">{data.title}</h3>
        <p className="node-subtitle">{data.subtitle}</p>
        <a href={data.detailsLink} className="node-link">
          Details
        </a>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{data.progress}%</span>

        <div className={`status-tag ${data.status.replace(" ", "-")}`}>
          {data.status}
        </div>
      </div>
    </div>
  );
};

export default CustomNode;
