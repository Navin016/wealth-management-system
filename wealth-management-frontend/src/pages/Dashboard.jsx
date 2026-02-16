import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  // ---------------- NAVIGATION HANDLERS ----------------
  const handleGoToGoals = () => navigate("/goals");
  const handleGoToInvestments = () => navigate("/investments");
  const handleGoToTransactions = () => navigate("/transactions");
  const handleGoToRecords = () => navigate("/reports");

  // PROGRESS CALCULATION (same as Goals)
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

    return Math.min((investedAmount / goal.target_amount) * 100, 100);
  };

  // FETCH DATA
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userRes = await API.get("/auth/me");
        const userId = userRes.data.id;

        const goalsRes = await API.get(`/goals/user/${userId}`);
        const goals = goalsRes.data || [];

        const totalGoals = goals.length;
        const activeGoals = goals.filter((g) => g.status === "active").length;
        const completedGoals = goals.filter(
          (g) => g.status === "completed"
        ).length;

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

        let txns = [];
        try {
          const txRes = await API.get("/transactions/recent");
          txns = txRes.data || [];
        } catch {
          txns = [];
        }

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

        setRecentTransactions(txns);
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>📊 Dashboard Overview</h1>

      <div className="dashboard-grid-4">
        {/* ---------------- GOALS ---------------- */}
        <div
          className="dashboard-section-card"
          onClick={handleGoToGoals}
          style={{ cursor: "pointer" }}
        >
          <div className="dashboard-section-header">
            <h2>Goals Overview</h2>
            <span className="tag">Planning</span>
          </div>

          <div className="dashboard-cards-single">
            <div className="dash-card">
              <h3>Total Goals</h3>
              <p>{summary.totalGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Active</h3>
              <p>{summary.activeGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Completed</h3>
              <p>{summary.completedGoals}</p>
            </div>

            <div className="dash-card">
              <h3>Total Target</h3>
              <p>
                ₹{" "}
                {summary.totalTargetAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="dash-card">
              <h3>Average Progress</h3>
              <p>{summary.averageProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* ---------------- INVESTMENTS ---------------- */}
        <div
          className="dashboard-section-card"
          onClick={handleGoToInvestments}
          style={{ cursor: "pointer" }}
        >
          <div className="dashboard-section-header">
            <h2>Investments</h2>
            <span className="tag">Portfolio</span>
          </div>

          <div className="dashboard-cards-single">
            <div className="dash-card investment">
              <h3>Portfolio Value</h3>
              <p>
                ₹{" "}
                {summary.totalInvestmentsValue.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div className="dash-card investment">
              <h3>Invested (Cost Basis)</h3>
              <p>
                ₹{" "}
                {summary.totalInvestmentsCostBasis.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div className="dash-card investment">
              <h3>Holdings</h3>
              <p>{summary.holdingsCount}</p>
            </div>
          </div>
        </div>

        {/* ---------------- REPORTS ---------------- */}
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <h2>Reports</h2>
            <span className="tag">Insights</span>
          </div>

          <div className="dashboard-cards-single">
            <div
              className="report-card"
              onClick={handleGoToRecords}
              style={{ cursor: "pointer" }}
            >
              <div className="report-card-main">
                <h3>Records & Reports</h3>
                <p>
                  Open detailed income, expense and investment
                  records.
                </p>
              </div>

              <span className="report-cta">
                Go to Records →
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- TRANSACTIONS ---------------- */}
        <div
          className="dashboard-section-card"
          onClick={handleGoToTransactions}
          style={{ cursor: "pointer" }}
        >
          <div className="dashboard-section-header">
            <h2>Recent Transactions</h2>
            <span className="tag">Activity</span>
          </div>

          <div className="transactions-card">
            {recentTransactions.length === 0 && (
              <p className="transactions-empty">
                No recent transactions.
              </p>
            )}

            {recentTransactions.length > 0 && (
              <ul className="transactions-list">
                {recentTransactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="transaction-row"
                  >
                    <div className="transaction-main">
                      <span className="transaction-title">
                        {tx.symbol} •{" "}
                        {tx.type.toUpperCase()}
                      </span>

                      <span className="transaction-amount">
                        ₹{" "}
                        {tx.amount.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="transaction-meta">
                      <span className="transaction-date">
                        {new Date(
                          tx.date
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
