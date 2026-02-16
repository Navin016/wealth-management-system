import { useEffect, useState } from "react";
import API from "../api";
import InvestmentCard from "../components/InvestmentCard";
import InvestmentPieChart from "../components/InvestmentPieChart";
import "./Investments.css";

function Investments() {
  const [investments, setInvestments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [totalValue, setTotalValue] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* 🔥 NEW — Expanded Card Control */
  const [expandedId, setExpandedId] =
    useState(null);

  // ---------------- FETCH INVESTMENTS ----------------
  const fetchInvestments = async () => {
    try {
      const res = await API.get(
        "/investments/"
      );

      const data = res.data || [];

      setInvestments(data);

      const total = data.reduce(
        (sum, inv) =>
          sum +
          Number(inv.current_value || 0),
        0
      );

      setTotalValue(total);
    } catch {
      setError(
        "Failed to load investments"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH ON LOAD + AUTO FETCH ----------------
  useEffect(() => {
    fetchInvestments();

    const interval = setInterval(() => {
      fetchInvestments();
    }, 600000);

    return () =>
      clearInterval(interval);
  }, []);

  // ---------------- AUTO HIDE SUCCESS ----------------
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () =>
        clearTimeout(timer);
    }
  }, [message]);

  // ---------------- REFRESH PRICES ----------------
  const updatePrices = async () => {
    setError("");
    setMessage("");

    try {
      const res = await API.post(
        "/investments/refresh/"
      );

      setMessage(
        res.data.message ||
          "Prices refreshed successfully ✅"
      );

      await fetchInvestments();
    } catch {
      setError(
        "Failed to update prices. Server error."
      );
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="loading">
        Loading investments...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="investments-page">

      {/* HEADER */}
      <div className="portfolio-header">

        <div className="portfolio-left">
          <h1>📊 Investments Overview</h1>
          <p className="subtitle">
            Track allocation,
            performance & growth
          </p>
        </div>

        <div className="portfolio-right">

          <div className="portfolio-total">
            ₹{" "}
            {totalValue.toLocaleString(
              "en-IN"
            )}
            <span>
              Total Portfolio Value
            </span>
          </div>

          <button
            className="refresh-btn"
            onClick={updatePrices}
          >
            🔄 Refresh Prices
          </button>

        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="success-banner">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* CHARTS */}
      {investments.length > 0 && (
        <div className="charts-section">

          <div className="chart-card">
            <h3>
              Symbol Allocation
            </h3>

            <InvestmentPieChart
              investments={investments}
            />
          </div>

          <div className="chart-card stats-card">
            <h3>Quick Stats</h3>

            <div className="stat">
              <span>Total Assets</span>
              <strong>
                {investments.length}
              </strong>
            </div>

            <div className="stat">
              <span>
                Highest Holding
              </span>
              <strong>
                ₹{" "}
                {Math.max(
                  ...investments.map(
                    (i) =>
                      Number(
                        i.current_value ||
                          0
                      )
                  )
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="stat">
              <span>
                Avg Investment
              </span>
              <strong>
                ₹{" "}
                {(
                  totalValue /
                  investments.length
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>
        </div>
      )}

      {/* INVESTMENT LIST */}
      {investments.length === 0 ? (
        <div className="empty-state">
          <h3>
            No investments found
          </h3>
          <p>
            Add transactions to
            start tracking your
            portfolio
          </p>
        </div>
      ) : (
        <div className="investments-list">
          {investments.map((inv) => (
            <InvestmentCard
              key={inv.id}
              investment={inv}

              /* 🔥 Controlled Expand */
              expanded={
                expandedId === inv.id
              }

              onToggle={() =>
                setExpandedId(
                  (prev) =>
                    prev === inv.id
                      ? null
                      : inv.id
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Investments;
