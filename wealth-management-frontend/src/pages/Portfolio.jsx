import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import API from "../api";

// 🎨 Pie colors (cyan theme shades)
const PIE_COLORS = [
  "#22d3ee",
  "#06b6d4",
  "#67e8f9",
  "#0891b2",
  "#0e7490",
  "#38bdf8",
];

export default function Portfolio() {
  const [summary, setSummary] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [period, setPeriod] = useState("1mo");
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const [s, a, p] = await Promise.all([
        API.get("/portfolio/summary"),
        API.get("/portfolio/allocation"),
        API.get(`/portfolio/performance?period=${period}`),
      ]);

      setSummary(s.data);
      setAllocation(a.data.allocation);
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
    return (
      <div className="text-center text-cyan-300 mt-20 text-lg animate-pulse">
        Loading Portfolio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#03122f] text-white p-6 space-y-8">

      {/* ---------------- SUMMARY CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">

        <Card title="Portfolio Value" value={`$${summary.total_portfolio_value}`} />
        <Card title="Total Invested" value={`$${summary.total_invested}`} />
        <Card
          title="Gain / Loss"
          value={`$${summary.total_gain_loss}`}
          highlight={summary.total_gain_loss >= 0}
        />
        <Card
          title="Return %"
          value={`${summary.total_gain_loss_percent}%`}
          highlight={summary.total_gain_loss_percent >= 0}
        />
        <Card title="Wallet" value={`$${summary.wallet_balance}`} />
        <Card title="Net Worth" value={`$${summary.net_worth}`} />

      </div>

      {/* ---------------- CHARTS ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ---------- SYMBOL ALLOCATION PIE ---------- */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">
            Symbol Allocation
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocation}
                dataKey="value"
                nameKey="symbol"
                outerRadius={110}
              >
                {allocation.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`$${value}`, name]}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #22d3ee",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2 text-sm">
            {allocation.map((item, i) => (
              <div
                key={item.symbol}
                className="flex justify-between px-3 py-2 rounded-lg bg-[#020617]/60 border border-cyan-500/20"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-cyan-300">
                    {item.symbol}
                  </span>
                </div>
                <span className="text-gray-300">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- PERFORMANCE LINE ---------- */}
        <div className="glass-card p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">
              Portfolio Performance
            </h2>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-[#020617] border border-cyan-500 rounded-lg px-3 py-1 text-cyan-300"
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
                stroke="#0ea5e9"
                opacity={0.2}
              />
              <XAxis dataKey="date" stroke="#67e8f9" />
              <YAxis stroke="#67e8f9" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #22d3ee",
                  borderRadius: "12px",
                  color: "white",
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

// ---------------- CARD COMPONENT ----------------
function Card({ title, value, highlight }) {
  return (
    <div className="bg-[#020617]/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-lg shadow-cyan-500/10 hover:scale-[1.02] transition-all duration-300">
      <p className="text-sm text-gray-400 bg-transparent">
        {title}
      </p>
      <h3
        className={`text-2xl font-semibold mt-1 ${
          highlight ? "text-green-400" : "text-cyan-300"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}
