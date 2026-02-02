import "./InvestmentCard.css";

function InvestmentCard({ investment }) {
  const units = Number(investment.units || 0);
  const avgPrice = Number(investment.avg_buy_price || 0);
  const costBasis = Number(investment.cost_basis || 0);
  const lastPrice =
    investment.last_price != null ? Number(investment.last_price) : null;
  const currentValue = Number(investment.current_value || 0);

  const gainLoss = Number(investment.gain_loss || 0);
  const gainLossPercent = Number(investment.gain_loss_percent || 0);
  const isProfit = gainLoss >= 0;

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
          ${currentValue.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="investment-metrics">
        <div className="metric">
          <div className="label">Units</div>
          <div className="value">{units.toFixed(2)}</div>
        </div>

        <div className="metric">
          <div className="label">Avg buy Price</div>
          <div className="value">${avgPrice.toFixed(2)}</div>
        </div>

        <div className="metric">
          <div className="label">Cost Basis</div>
          <div className="value">${costBasis.toFixed(0)}</div>
        </div>

        {lastPrice !== null && (
          <div className="metric price">
            <div className="label">Last Price</div>
            <div className="value">${lastPrice.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div className={`gain-loss ${isProfit ? "profit" : "loss"}`}>
        <div className="amount">
          {isProfit ? "+" : "-"}${Math.abs(gainLoss).toFixed(0)}
        </div>
        <div className="percent">({gainLossPercent.toFixed(2)}%)</div>
      </div>
    </div>
  );
}

export default InvestmentCard;
