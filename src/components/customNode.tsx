import React from "react";
import { Handle, Position } from "@xyflow/react";
import "./customNode.css";

interface ProgressNodeProps {
  data: {
    title: string;
    subtitle: string;
    detailsLink: string;
    progress: number;
    status: string;
  };
}
const ProgressNode: React.FC<ProgressNodeProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "#ffd700";
      case "in progress":
        return "#3498db";
      case "done":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "#e74c3c";
    if (progress < 70) return "#f39c12";
    return "#2ecc71";
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />

      <div className="node-content">
        <h3 className="node-title">{data.title}</h3>
        <p className="node-subtitle">{data.subtitle}</p>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${data.progress}%`,
                backgroundColor: getProgressColor(data.progress),
              }}
            ></div>
          </div>
          <span className="progress-text">{data.progress}%</span>
        </div>

        <div className="status-section">
          <div
            className="status-tag"
            style={{ backgroundColor: getStatusColor(data.status) }}
          >
            {data.status}
          </div>
        </div>

        <a href={data.detailsLink} className="node-link">
          Details
        </a>
      </div>
    </div>
  );
};

type DataItem = {
  time: string;
  data: string;
  change: number;
};

interface StatsNodeProps {
  data: {
    title: string;
    source: string;
    method: string;
    dataItems: DataItem[];
  };
}
const StatsNode: React.FC<StatsNodeProps> = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />

      <div className="node-content">
        <h3 className="node-title">{data.title}</h3>

        <div className="node-info">
          <span className="meter-icon">📊</span>
          <span className="source">{data.source}</span>
          <span className="dot">•</span>
          <span className="method">{data.method}</span>
        </div>

        <hr className="divider" />

        <div className="node-data-container">
          {data.dataItems.map((item, index) => (
            <div key={index} className="node-data-item">
              <div className="stat-row">
                <span className="stat-label">Time</span>
                <span className="stat-value">{item.time}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Data</span>
                <span className="stat-value">{item.data}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Change</span>
                <span
                  className={`stat-value ${
                    item.change >= 0 ? "positive" : "negative"
                  }`}
                >
                  {item.change >= 0 ? "↑" : "↓"} {Math.abs(item.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressNode;
export { StatsNode };
