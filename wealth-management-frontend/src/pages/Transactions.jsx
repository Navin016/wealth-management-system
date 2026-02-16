import { useEffect, useState } from "react";
import API from "../api";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("buy");
  const [error, setError] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    symbol: "",
    asset_type: "stock",
    quantity: "",
    fees: "0",
    amount: "",
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
      setTransactions(res.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load transactions");
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

  // ✅ UPDATED SUBMIT LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let body = {};
      let endpoint = `/transactions/${mode}`;

      if (mode === "buy" || mode === "sell") {
        body = {
          symbol: formData.symbol.toUpperCase(),
          asset_type: formData.asset_type,
          quantity: parseFloat(formData.quantity),
          fees: parseFloat(formData.fees || "0"),
        };
      } else {
        body = {
          amount: parseFloat(formData.amount),
        };
      }

      await API.post(endpoint, body);

      // Reset form
      setFormData({
        symbol: "",
        asset_type: "stock",
        quantity: "",
        fees: "0",
        amount: "",
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
      {/* HEADER */}
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

      {/* FILTER */}
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

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="transaction-form">
          {/* TABS */}
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

            <button
              className={mode === "contribute" ? "active" : ""}
              onClick={() => setMode("contribute")}
              type="button"
            >
              Contribute
            </button>

            <button
              className={mode === "withdraw" ? "active" : ""}
              onClick={() => setMode("withdraw")}
              type="button"
            >
              Withdraw
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* INVESTMENT FIELDS */}
            {(mode === "buy" || mode === "sell") && (
              <>
                <select
                  name="asset_type"
                  value={formData.asset_type}
                  onChange={handleChange}
                  required
                >
                  <option value="stock">Stock</option>
                  <option value="etf">ETF</option>
                  <option value="mutual_fund">Mutual Fund</option>
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
                  name="fees"
                  type="number"
                  placeholder="Fees"
                  step="0.01"
                  min="0"
                  value={formData.fees}
                  onChange={handleChange}
                />
              </>
            )}

            {/* CASH FIELDS */}
            {(mode === "contribute" || mode === "withdraw") && (
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            )}

            {/* ACTIONS */}
            <div className="form-actions">
              <button type="submit" className={`${mode}-btn`}>
                Submit {mode}
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

      {/* ================= LIST ================= */}
      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : visibleTransactions.length === 0 ? (
        <div className="empty-state">
          <h3>No transactions yet</h3>
        </div>
      ) : (
        <div className="transactions-list">
          {visibleTransactions.map((tx) => (
            <div key={tx.id} className={`transaction-row ${tx.type}`}>
              {/* MAIN ROW */}
              <div className="transaction-main">
                <div className="tx-left">
                  <span className="tx-type-pill">
                    {tx.type?.toUpperCase()}
                  </span>

                  {tx.symbol && (
                    <span className="tx-symbol">{tx.symbol}</span>
                  )}

                  {tx.asset_type && (
                    <span className="tx-asset">{tx.asset_type}</span>
                  )}
                </div>

                <div className="tx-right">
                  <span className="tx-amount">
                    {tx.type === "contribute" ||
                    tx.type === "withdraw"
                      ? `₹${tx.price?.toFixed(2)}`
                      : `₹${(
                          tx.price * tx.quantity
                        ).toFixed(2)}`}
                  </span>

                  <button
                    className="view-more-btn"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    {expandedId === tx.id
                      ? "Hide"
                      : "View more"}
                  </button>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expandedId === tx.id && (
                <div className="transaction-extra">
                  {(tx.type === "buy" ||
                    tx.type === "sell") && (
                    <>
                      <div>
                        Quantity: {tx.quantity}
                      </div>
                      <div>Price: ₹{tx.price}</div>
                      <div>Fees: ₹{tx.fees}</div>
                    </>
                  )}

                  {(tx.type === "contribute" ||
                    tx.type === "withdraw") && (
                    <div>
                      Amount: ₹{tx.amount}
                    </div>
                  )}

                  <div>
                    Executed at:{" "}
                    {new Date(
                      tx.created_at
                    ).toLocaleString()}
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
