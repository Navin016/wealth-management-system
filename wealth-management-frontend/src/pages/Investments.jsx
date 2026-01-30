import { useEffect, useState } from "react";
import API from "../api";
import InvestmentCard from "../components/InvestmentCard";
import "./Investments.css";

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setError("");
    try {
      const res = await API.get("/investments/");
      const data = res.data || [];
      setInvestments(data);

      const total = data.reduce((sum, inv) => {
        const val =
          parseFloat(inv.current_value) ||
          parseFloat(inv.cost_basis) ||
          0;
        return sum + val;
      }, 0);
      setTotalValue(total);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load investments from server"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading investments...</div>;

  return (
    <div className="investments-page">
      <div className="page-header">
        <div>
          <h1>Your Portfolio</h1>
          <p className="portfolio-value">
            ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="investments-stats">
        <div className="stat-card">
          <div className="stat-number">{investments.length}</div>
          <div className="stat-label">Holdings</div>
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="empty-state">
          <h3>No investments yet</h3>
          <p>Record a buy transaction to create your first holding.</p>
        </div>
      ) : (
        <div className="investments-grid">
          {investments.map((inv) => (
            <InvestmentCard key={inv.id} investment={inv} onUpdate={fetchInvestments} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Investments;
