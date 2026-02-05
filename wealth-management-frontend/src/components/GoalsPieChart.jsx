import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

/* SAFE TOOLTIP */
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
      <div>₹ {value.toLocaleString("en-IN")}</div>
      <div style={{ color: "#94a3b8" }}>{percent}%</div>
    </div>
  );
};

function GoalsPieChart({ goals }) {
  /* GROUP BY GOAL TYPE */
  const dataMap = {};

  goals.forEach(goal => {
    const type = goal.goal_type || "Other";
    const value = Number(goal.target_amount || 0);

    if (value <= 0) return;

    dataMap[type] = (dataMap[type] || 0) + value;
  });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#94a3b8" }}>
        No goals data
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
              <CustomTooltip {...props} total={total} />
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

export default GoalsPieChart;
