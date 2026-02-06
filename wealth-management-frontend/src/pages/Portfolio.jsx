import { useEffect, useState } from "react";
import API from "../api";
import InvestmentPieChart from "../components/InvestmentPieChart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./Portfolio.css";

export default function Portfolio() {
  const [summary, setSummary] = useState(null);
  const [investments, setInvestments] = useState([]);      // ← same shape as Investments page
  const [performance, setPerformance] = useState([]);
  const [period, setPeriod] = useState("1mo");
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const [s, inv, p] = await Promise.all([
        API.get("/portfolio/summary"),
        API.get("/investments/"),                          // ← reuse investments endpoint
        API.get(`/portfolio/performance?period=${period}`),
      ]);

      setSummary(s.data);
      setInvestments(inv.data || []);
      setPerformance(p.data.performance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [period]);

  if (loading || !summary) {
    return <div className="portfolio-loading">Loading Portfolio...</div>;
  }

  return (
    <div className="portfolio-page">
      {/* SUMMARY CARDS */}
      <div className="summary-section">
        {/* Top row: main totals */}
        <div className="summary-row summary-row-top">
          <Card
            title="Portfolio Value"
            value={`₹${summary.total_portfolio_value?.toLocaleString("en-IN")}`}
            variant="big"
          />
          <Card
            title="Total Invested"
            value={`₹${summary.total_invested?.toLocaleString("en-IN")}`}
            variant="big"
          />
          <Card
            title="Gain / Loss"
            value={`₹${summary.total_gain_loss?.toLocaleString("en-IN")}`}
            highlight={summary.total_gain_loss >= 0}
            variant="big"
          />
        </div>

        {/* Bottom row: compact stats */}
        <div className="summary-row summary-row-bottom">
          <Card
            title="Return %"
            value={`${summary.total_gain_loss_percent}%`}
            highlight={summary.total_gain_loss_percent >= 0}
            variant="compact"
          />
          <Card
            title="Wallet"
            value={`₹${summary.wallet_balance?.toLocaleString("en-IN")}`}
            variant="compact"
          />
          <Card
            title="Net Worth"
            value={`₹${summary.net_worth?.toLocaleString("en-IN")}`}
            variant="compact"
          />
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-section">
        {/* Allocation pie chart using the same component as Investments */}
        {investments.length > 0 && (
          <div className="chart-card">
            <h2 className="chart-title">Symbol Allocation</h2>
            <InvestmentPieChart investments={investments} />
          </div>
        )}

        {/* PERFORMANCE LINE */}
        <div className="chart-card">
          <div className="performance-header">
            <h2 className="chart-title">Portfolio Performance</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="period-select"
            >
              <option value="1d">1D</option>
              <option value="5d">1W</option>
              <option value="1mo">1M</option>
              <option value="6mo">6M</option>
              <option value="1y">1Y</option>
              <option value="max">ALL</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#0ee978"
                opacity={0.2}
              />
              <XAxis dataKey="date" stroke="#67e8f9" />
              <YAxis stroke="#67e8f9" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #2ec449",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey="portfolio_value"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// CARD COMPONENT
function Card({ title, value, highlight, variant = "normal" }) {
  const classes = ["summary-card"];
  if (variant === "big") classes.push("summary-card-big");
  if (variant === "compact") classes.push("summary-card-compact");

  return (
    <div className={classes.join(" ")}>
      <p className="summary-card-title">{title}</p>
      <h3
        className={
          "summary-card-value" +
          (highlight ? " summary-card-value-positive" : "")
        }
      >
        {value}
      </h3>
      <div className="summary-card-accent" />
    </div>
  );
}
\