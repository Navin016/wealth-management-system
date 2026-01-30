import { useState } from "react";
import API from "../api";


const AddInvestmentForm = ({ onSuccess }) => {
  const [assetType, setAssetType] = useState("");
  const [symbol, setSymbol] = useState("");
  const [units, setUnits] = useState("");
  const [avgBuyPrice, setAvgBuyPrice] = useState("");
  const [lastPrice, setLastPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      asset_type: assetType,
      symbol: symbol.trim(),
      units: Number(units),
      avg_buy_price: Number(avgBuyPrice),
      last_price: Number(lastPrice), // ✅ REQUIRED
    };

    console.log("ADD INVESTMENT PAYLOAD 👉", payload);

    try {
      await API.post("/investments/", payload);
      onSuccess();

      // reset form
      setAssetType("");
      setSymbol("");
      setUnits("");
      setAvgBuyPrice("");
      setLastPrice("");

      alert("Investment added successfully");
    } catch (err) {
      console.error(
        "ADD INVESTMENT FAILED ❌",
        err.response?.status,
        err.response?.data
      );
      alert(err.response?.data?.detail || "Failed to add investment");
    }
  };

  return (
    <form className="investment-form" onSubmit={handleSubmit}>
      <select
        value={assetType}
        onChange={(e) => setAssetType(e.target.value)}
        required
      >
        <option value="">Asset Type</option>
        <option value="stock">Stock</option>
        <option value="etf">ETF</option>
        <option value="mutual_fund">Mutual Fund</option>
        <option value="bond">Bond</option>
      </select>

      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Units"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Avg Buy Price"
        value={avgBuyPrice}
        onChange={(e) => setAvgBuyPrice(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Last Price"
        value={lastPrice}
        onChange={(e) => setLastPrice(e.target.value)}
        required
      />

      <button type="submit">Add Investment</button>
    </form>
  );
};

export default AddInvestmentForm;
