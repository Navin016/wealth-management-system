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

      const total = data.reduce(
        (sum, inv) => sum + Number(inv.current_value || 0),
        0
      );
      setTotalValue(total);
    } catch {
      setError("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  const updatePrices = async () => {
    try {
      await API.post("/investments/update-prices");
      fetchInvestments();
      alert("Prices updated successfully");
    } catch {
      setError("Failed to update prices");
    }
  };

  if (loading) return <div className="loading">Loading investments...</div>;

  return (
    <div className="investments-page">
      <div className="page-header">
        <div>
          <h1>Your Portfolio</h1>
          <p className="portfolio-value">
            ${totalValue.toLocaleString("en-IN")}
          </p>
        </div>

        <button className="add-btn" onClick={updatePrices}>
          🔄 Update Prices
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {investments.length === 0 ? (
        <div className="empty-state">
          <h3>No investments yet</h3>
        </div>
      ) : (
        <div className="investments-grid">
          {investments.map((inv) => (
            <InvestmentCard key={inv.id} investment={inv} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Investments;
