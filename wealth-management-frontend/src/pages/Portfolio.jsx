import { useState } from "react";
import "./Portfolio.css";

function Portfolio() {
  const [assets] = useState([
    { type: "Equity", value: 60 },
    { type: "Debt", value: 25 },
    { type: "Gold", value: 15 },
  ]);

  return (
    <div className="page">
      <h1>Portfolio</h1>

      <table>
        <thead>
          <tr>
            <th>Asset Type</th>
            <th>Allocation (%)</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => (
            <tr key={i}>
              <td>{a.type}</td>
              <td>{a.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Portfolio;
