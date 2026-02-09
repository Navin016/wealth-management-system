import { useEffect, useState } from "react";
import API from "../api";
import "./Goals.css";
import GoalsPieChart from "../components/GoalsPieChart";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    goal_type: "custom",
    target_amount: "",
    target_date: "",
    monthly_contribution: 10000,
  });

  /* FETCH USER + GOALS */
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUserId(res.data.id);
        fetchGoals(res.data.id);
      })
      .catch(() => alert("Authentication error"));
  }, []);

  const fetchGoals = (uid) => {
    API.get(`/goals/user/${uid}`)
      .then((res) => setGoals(res.data))
      .catch(() => alert("Failed to fetch goals"));
  };

  /* TARGET DATE PREDICTION */
  const predictTargetDate = (targetAmount, monthly) => {
    if (!targetAmount || !monthly) return "";
    const months = Math.ceil(targetAmount / monthly);
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...form,
      [name]: name === "monthly_contribution" ? Number(value) : value,
    };

    if (name === "monthly_contribution" || name === "target_amount") {
      updated.target_date = predictTargetDate(
        updated.target_amount,
        updated.monthly_contribution
      );
    }

    setForm(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, user_id: userId };

    const req = editingId
      ? API.put(`/goals/${editingId}`, payload)
      : API.post("/goals/", payload);

    req.then(() => {
      fetchGoals(userId);
      setEditingId(null);
      setForm({
        goal_type: "custom",
        target_amount: "",
        target_date: "",
        monthly_contribution: 10000,
      });
    });
  };

  const calculateProgress = (goal) => {
    if (!goal.monthly_contribution || !goal.target_amount || !goal.created_at)
      return 0;

    const created = new Date(goal.created_at);
    const today = new Date();

    let months =
      (today.getFullYear() - created.getFullYear()) * 12 +
      (today.getMonth() - created.getMonth());

    months = Math.max(months, 1);
    const invested = goal.monthly_contribution * months;
    return Math.min((invested / goal.target_amount) * 100, 100);
  };

  const handleEditGoal = (goal) => {
    setEditingId(goal.id);
    setForm({
      goal_type: goal.goal_type || "custom",
      target_amount: goal.target_amount,
      target_date: goal.target_date ? goal.target_date.slice(0, 10) : "",
      monthly_contribution: goal.monthly_contribution,
    });
  };

  const handleDeleteGoal = (id) => {
    if (!window.confirm("Delete this goal?")) return;
    API.delete(`/goals/${id}`).then(() => {
      fetchGoals(userId);
      if (editingId === id) {
        setEditingId(null);
        setForm({
          goal_type: "custom",
          target_amount: "",
          target_date: "",
          monthly_contribution: 10000,
        });
      }
    });
  };

  const sliderPercent =
    ((form.monthly_contribution - 10000) / (100000 - 10000)) * 100;

  return (
    <div className="goals-page">
      <h1>🎯 Financial Goals</h1>

      {/* FORM + PIE CHART (SAME ROW) */}
      <div className="goals-top-grid">
        {/* FORM */}
        <form className="goal-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Goal" : "Create / Update Goal"}</h2>

          <select
            name="goal_type"
            value={form.goal_type}
            onChange={handleChange}
          >
            <option value="retirement">Retirement</option>
            <option value="home">Home</option>
            <option value="education">Education</option>
            <option value="custom">Custom</option>
          </select>

          <input
            type="number"
            name="target_amount"
            placeholder="Target Amount"
            value={form.target_amount}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="monthly_contribution"
            min="10000"
            max="100000"
            step="1000"
            value={form.monthly_contribution}
            onChange={handleChange}
          />

          {/* SLIDER */}
          <div className="slider-wrapper">
            <label>
              Monthly Contribution
              <span>₹{form.monthly_contribution.toLocaleString()}</span>
            </label>

            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              name="monthly_contribution"
              value={form.monthly_contribution}
              onChange={handleChange}
              style={{
                background: `linear-gradient(
                  to right,
                  #22c55e 0%,
                  #22c55e ${sliderPercent}%,
                  #0f172a ${sliderPercent}%,
                  #0f172a 100%
                )`,
              }}
            />
          </div>

          <input
            type="date"
            name="target_date"
            value={form.target_date}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Goal" : "Add Goal"}
          </button>
        </form>

        {/* PIE CHART */}
        {goals.length > 0 && (
          <div className="goals-chart-card">
            <h2>Goals Composition</h2>
            <GoalsPieChart goals={goals} />
          </div>
        )}
      </div>

      {/* GOALS LIST */}
      <div className="goals-list">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);

          return (
            <div key={goal.id} className="goal-card">
              <h3>{goal.goal_type.toUpperCase()}</h3>

              <p className="goal-desc">
                🎯 ₹{goal.target_amount.toLocaleString()}
              </p>
              <p className="goal-desc">
                💸 ₹{goal.monthly_contribution.toLocaleString()} / month
              </p>
              <p className="goal-desc">📅 {goal.target_date}</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="progress-text">
                {progress.toFixed(1)}% completed
              </span>

              <div className="goal-actions">
                <button
                  type="button"
                  className="goal-btn edit"
                  onClick={() => handleEditGoal(goal)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="goal-btn delete"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;
