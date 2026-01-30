import { useEffect, useState } from "react";
import API from "../api";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("buy"); // "buy" | "sell"
  const [error, setError] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    symbol: "",
    asset_type: "stock",
    quantity: "",
    price: "",
    fees: "0",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setError("");
    try {
      const res = await API.get("/transactions/", {
        params: { limit: 100, offset: 0 },
      });
      setTransactions(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load transactions from server"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const body = {
        symbol: formData.symbol.toUpperCase(),
        asset_type: formData.asset_type,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        fees: parseFloat(formData.fees || "0"),
        executed_at: new Date().toISOString(),
      };

      const endpoint =
        mode === "buy" ? "/transactions/buy" : "/transactions/sell";

      await API.post(endpoint, body);

      setFormData({
        symbol: "",
        asset_type: "stock",
        quantity: "",
        price: "",
        fees: "0",
      });
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.detail || "Transaction failed");
    }
  };

  const visibleTransactions = transactions.slice(0, entriesToShow);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="transactions-page">
      {/* HEADER ROW: title + button */}
      <div className="transactions-header-row">
        <div className="page-header">
          <h1>Transactions</h1>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm((prev) => !prev);
            setMode("buy");
          }}
        >
          {showForm ? "Close" : "+ New Transaction"}
        </button>
      </div>

      {/* FILTER ROW BELOW BUTTON */}
      <div className="transactions-filter-row">
        <label className="entries-label">
          Show
          <select
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </label>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <div className="transaction-form">
          <div className="form-tabs">
            <button
              className={mode === "buy" ? "active" : ""}
              onClick={() => setMode("buy")}
              type="button"
            >
              Buy
            </button>
            <button
              className={mode === "sell" ? "active" : ""}
              onClick={() => setMode("sell")}
              type="button"
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <select
              name="asset_type"
              value={formData.asset_type}
              onChange={handleChange}
              required
            >
              <option value="stock">Stock</option>
              <option value="etf">ETF</option>
              <option value="mutual_fund">Mutual Fund</option>
              <option value="bond">Bond</option>
              <option value="cash">Cash</option>
            </select>

            <input
              name="symbol"
              type="text"
              placeholder="Symbol (e.g., TCS)"
              value={formData.symbol}
              onChange={handleChange}
              required
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              step="0.01"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              name="fees"
              type="number"
              placeholder="Fees"
              step="0.01"
              min="0"
              value={formData.fees}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button
                type="submit"
                className={mode === "buy" ? "buy-btn" : "sell-btn"}
              >
                {mode === "buy" ? "Submit Buy" : "Submit Sell"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : visibleTransactions.length === 0 ? (
        <div className="empty-state">
          <h3>No transactions yet</h3>
          <p>Add a buy/sell order to get started.</p>
        </div>
      ) : (
        <div className="transactions-list">
          {visibleTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`transaction-row ${tx.type}`}
            >
              <div className="transaction-main">
                <div className="tx-left">
                  <span className="tx-type-pill">
                    {tx.type?.toUpperCase() || "TX"}
                  </span>
                  <span className="tx-symbol">{tx.symbol}</span>
                  <span className="tx-asset">{tx.asset_type || "-"}</span>
                </div>

                <div className="tx-right">
                  <span className="tx-amount">
                    {tx.price != null && tx.quantity != null
                      ? `₹${(tx.price * tx.quantity).toFixed(2)}`
                      : "-"}
                  </span>
                  <button
                    className="view-more-btn"
                    type="button"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    {expandedId === tx.id ? "Hide" : "View more"}
                  </button>
                </div>
              </div>

              {expandedId === tx.id && (
                <div className="transaction-extra">
                  <div>Quantity: {tx.quantity ?? "-"}</div>
                  <div>Price: {tx.price != null ? `₹${tx.price}` : "-"}</div>
                  <div>Fees: {tx.fees != null ? `₹${tx.fees}` : "-"}</div>
                  <div>
                    Executed at:{" "}
                    {tx.executed_at
                      ? new Date(tx.executed_at).toLocaleString()
                      : "-"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;
