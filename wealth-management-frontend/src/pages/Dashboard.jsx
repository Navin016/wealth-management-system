import { useEffect, useState } from "react";
import API from "../api";
import "./Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalTargetAmount: 0,
    averageProgress: 0,
    totalInvestmentsValue: 0,
    totalInvestmentsCostBasis: 0,
    holdingsCount: 0,
  });

  /* ------------------------------------
     PROGRESS CALCULATION (SAME AS GOALS)
  ------------------------------------ */
  const calculateProgress = (goal) => {
    if (
      !goal.monthly_contribution ||
      !goal.target_amount ||
      !goal.created_at
    ) {
      return 0;
    }

    const createdDate = new Date(goal.created_at);
    const today = new Date();

    let monthsPassed =
      (today.getFullYear() - createdDate.getFullYear()) * 12 +
      (today.getMonth() - createdDate.getMonth());

    monthsPassed = Math.max(monthsPassed, 1);

    const investedAmount = goal.monthly_contribution * monthsPassed;

    return Math.min(
      (investedAmount / goal.target_amount) * 100,
      100
    );
  };

  /* ------------------------------------
     FETCH USER + GOALS + INVESTMENTS
  ------------------------------------ */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1) Current user
        const userRes = await API.get("/auth/me");
        const userId = userRes.data.id;

        // 2) Goals for this user
        const goalsRes = await API.get(`/goals/user/${userId}`);
        const goals = goalsRes.data || [];

        const totalGoals = goals.length;
        const activeGoals = goals.filter((g) => g.status === "active").length;
        const completedGoals = goals.filter((g) => g.status === "completed").length;

        const totalTargetAmount = goals.reduce(
          (sum, g) => sum + Number(g.target_amount || 0),
          0
        );

        const totalProgress = goals.reduce(
          (sum, g) => sum + calculateProgress(g),
          0
        );

        const averageProgress =
          totalGoals > 0 ? totalProgress / totalGoals : 0;

        // 3) Investments
        const invRes = await API.get("/investments/");
        const investments = invRes.data || [];

        const holdingsCount = investments.length;

        const totalInvestmentsValue = investments.reduce((sum, inv) => {
          const v =
            parseFloat(inv.current_value) ||
            parseFloat(inv.cost_basis) ||
            0;
          return sum + v;
        }, 0);

        const totalInvestmentsCostBasis = investments.reduce((sum, inv) => {
          const c = parseFloat(inv.cost_basis) || 0;
          return sum + c;
        }, 0);

        setSummary({
          totalGoals,
          activeGoals,
          completedGoals,
          totalTargetAmount,
          averageProgress,
          totalInvestmentsValue,
          totalInvestmentsCostBasis,
          holdingsCount,
        });
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>📊 Dashboard Overview</h1>

      <div className="dashboard-sections">
        {/* GOALS SECTION */}
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <h2>Goals</h2>
            <span className="tag">Planning</span>
          </div>
          <div className="dashboard-cards">
            <div className="dash-card">
              <h3>Total Goals</h3>
              <p>{summary.totalGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Active Goals</h3>
              <p>{summary.activeGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Completed Goals</h3>
              <p>{summary.completedGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Total Target Amount</h3>
              <p>₹ {summary.totalTargetAmount.toLocaleString("en-IN")}</p>
            </div>

            <div className="dash-card highlight">
              <h3>Average Goal Progress</h3>
              <p>{summary.averageProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* INVESTMENTS SECTION */}
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <h2>Investments</h2>
            <span className="tag">Portfolio</span>
          </div>
          <div className="dashboard-cards">
            <div className="dash-card investment">
              <h3>Portfolio Value</h3>
              <p>₹ {summary.totalInvestmentsValue.toLocaleString("en-IN")}</p>
            </div>

            <div className="dash-card investment">
              <h3>Invested (Cost Basis)</h3>
              <p>₹ {summary.totalInvestmentsCostBasis.toLocaleString("en-IN")}</p>
            </div>

            <div className="dash-card investment">
              <h3>Holdings</h3>
              <p>{summary.holdingsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
