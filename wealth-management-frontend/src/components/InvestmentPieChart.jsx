import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#a855f7"
];

/* ---------- Custom Tooltip (SAFE) ---------- */
const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value } = payload[0].payload;
  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  return (
    <div
      style={{
        background: "#020617",
        padding: "10px 12px",
        borderRadius: "10px",
        border: "1px solid #1e293b",
        color: "#e5e7eb",
        fontSize: "12px"
      }}
    >
      <strong style={{ display: "block", marginBottom: 4 }}>
        {name}
      </strong>

      {/* ✅ RUPEE SYMBOL */}
      <div>₹ {value.toLocaleString("en-IN")}</div>

      <div style={{ color: "#94a3b8" }}>{percent}%</div>
    </div>
  );
};

/* ---------- Slice Label (SAFE) ---------- */
const renderLabel = ({ name, value, total }) => {
  if (!total || total === 0) return null;

  const percent = (value / total) * 100;
  if (percent < 5) return null; // hide tiny slices

  return `${name} ${percent.toFixed(0)}%`;
};

function InvestmentPieChart({ investments }) {
  /* --------- Group by SYMBOL --------- */
  const dataMap = {};

  investments.forEach(inv => {
    const symbol = inv.symbol || "UNKNOWN";
    const value = Number(inv.current_value || 0);

    if (value <= 0) return;

    dataMap[symbol] = (dataMap[symbol] || 0) + value;
  });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value
  }));

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div
        style={{
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 13
        }}
      >
        No data to display
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            labelLine={false}
            label={(props) =>
              renderLabel({ ...props, total: totalValue })
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} total={totalValue} />
            )}
          />

          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => (
              <span style={{ color: "#e5e7eb", fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InvestmentPieChart;
