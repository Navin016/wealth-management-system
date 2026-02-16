import { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Reports.css";

/* ===============================
   COLOR PALETTE
   =============================== */

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a78bfa",
  "#14b8a6",
  "#eab308",
];

function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const res = await API.get("/reports/summary");
    setData(res.data);
  };

  const downloadPDF = async () => {
    const res = await API.get(
      "/reports/download",
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "Wealth_Report.pdf";
    link.click();
  };

  if (!data) return <p>Loading Reports...</p>;

  const pieData = data.investments.map((inv) => ({
    name: inv.symbol,
    value: inv.current_value,
  }));

  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="reports-header">
        <h1>Financial Reports</h1>
        <button
          className="download-btn"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {/* SUMMARY */}
      <div className="reports-cards">

        <div className="card">
          <p>Total Invested</p>
          <h3>₹{data.total_invested.toFixed(2)}</h3>
        </div>

        <div className="card">
          <p>Current Value</p>
          <h3>₹{data.current_value.toFixed(2)}</h3>
        </div>

        <div className="card">
          <p>Profit / Loss</p>
          <h3>₹{data.profit_loss.toFixed(2)}</h3>
        </div>

        <div className="card highlight">
          <p>Best Asset</p>
          <h3>{data.best_asset?.symbol}</h3>
          <span>
            {data.best_asset?.percent?.toFixed(2)}%
          </span>
        </div>

        <div className="card danger">
          <p>Worst Asset</p>
          <h3>{data.worst_asset?.symbol}</h3>
          <span>
            {data.worst_asset?.percent?.toFixed(2)}%
          </span>
        </div>

      </div>

      {/* PIE CHART */}
      <div className="chart-card">
        <h2>Asset Allocation</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={110}
              label
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    COLORS[i % COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===============================
          GOALS (UPDATED MODEL)
         =============================== */}
      <div className="reports-section">

        <h2>Goals Overview</h2>

        <div className="goals-grid">

          {data.goals.map((goal, i) => (

            <div
              key={i}
              className="goal-card"
            >

              <div className="goal-top">
                <h4>
                  {goal.goal_type
                    .replace("_", " ")
                    .toUpperCase()}
                </h4>

                <span className="goal-date">
                  {goal.target_date}
                </span>
              </div>

              <p>
                Target:
                ₹{goal.target_amount.toFixed(2)}
              </p>

              <p>
                Saved:
                ₹{goal.current_saved.toFixed(2)}
              </p>

              {/* PROGRESS */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${goal.progress_percent}%`,
                  }}
                />
              </div>

              <span className="progress-text">
                {goal.progress_percent.toFixed(1)}%
              </span>

            </div>
          ))}

        </div>
      </div>

      {/* ===============================
          TRANSACTIONS (CARD STYLE)
         =============================== */}
      {/* ===============================
    RECENT TRANSACTIONS (ROW LAYOUT)
   =============================== */}
<div className="reports-section">

  <h2>Recent Transactions</h2>

  <div className="txn-rows">

    {data.recent_transactions.map((txn) => (

      <div
        key={txn.id}
        className="txn-row"
      >

        {/* LEFT */}
        <div className="txn-left">

          <h4>{txn.symbol}</h4>

          <span
            className={`txn-badge txn-${txn.type}`}
          >
            {txn.type}
          </span>

        </div>

        {/* MIDDLE */}
        <div className="txn-mid">

          <p>
            Qty
            <span>{txn.quantity}</span>
          </p>

          <p>
            Price
            <span>
              ₹{txn.price.toFixed(2)}
            </span>
          </p>

          <p>
            Fees
            <span>
              ₹{txn.fees.toFixed(2)}
            </span>
          </p>

        </div>

        {/* RIGHT */}
        <div className="txn-right">

          {new Date(
            txn.created_at
          ).toLocaleDateString()}

        </div>

      </div>

    ))}

  </div>

</div>
    </div>
  );
}

export default Reports;
