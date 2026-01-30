// src/components/InvestmentCard.jsx
import "./InvestmentCard.css";

function InvestmentCard({ investment, onUpdate }) {
  // Safely convert numeric fields
  const units = investment.units != null ? Number(investment.units) : 0;
  const avgPrice =
    investment.avg_buy_price != null ? Number(investment.avg_buy_price) : 0;
  const costBasis =
    investment.cost_basis != null ? Number(investment.cost_basis) : 0;
  const lastPrice =
    investment.last_price != null ? Number(investment.last_price) : null;
  const currentValue =
    investment.current_value != null ? Number(investment.current_value) : 0;

  const assetType = investment.asset_type || "stock";

  return (
    <div className="investment-card">
      <div className="investment-header">
        <div className="symbol-info">
          <h3>{investment.symbol}</h3>
          <span className={`asset-type ${assetType}`}>
            {assetType.toUpperCase()}
          </span>
        </div>

        <div className="current-value">
          ₹{currentValue.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="investment-metrics">
        <div className="metric">
          <div className="label">Units</div>
          <div className="value">{units.toFixed(2)}</div>
        </div>

        <div className="metric">
          <div className="label">Avg Price</div>
          <div className="value">₹{avgPrice.toFixed(2)}</div>
        </div>

        <div className="metric">
          <div className="label">Cost Basis</div>
          <div className="value">₹{costBasis.toFixed(0)}</div>
        </div>

        {lastPrice !== null && (
          <div className="metric price">
            <div className="label">Last Price</div>
            <div className="value">₹{lastPrice.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestmentCard;
