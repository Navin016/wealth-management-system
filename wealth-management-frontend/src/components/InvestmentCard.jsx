import { useEffect, useState } from "react";
import "./InvestmentCard.css";

function InvestmentCard({
  investment,
  expanded,
  onToggle,
}) {
  const units = Number(investment.units || 0);
  const avgPrice = Number(
    investment.avg_buy_price || 0
  );
  const costBasis = Number(
    investment.cost_basis || 0
  );
  const lastPrice =
    investment.last_price != null
      ? Number(investment.last_price)
      : null;

  const currentValue = Number(
    investment.current_value || 0
  );

  const gainLoss = Number(
    investment.gain_loss || 0
  );
  const gainLossPercent = Number(
    investment.gain_loss_percent || 0
  );

  const isProfit = gainLoss >= 0;
  const assetType =
    investment.asset_type || "stock";

  /* ================= SIMULATION ================= */

  const [amount, setAmount] =
    useState(1000);
  const [returnPct, setReturnPct] =
    useState(0);
  const [futureValue, setFutureValue] =
    useState(0);

  /* ---------- Slider Steps (5K increments) ---------- */

  const sliderMarks = [
    1000,
    ...Array.from(
      { length: 20 },
      (_, i) => (i + 1) * 5000
    ),
  ];
  // Ends at 100000

  const sliderIndex =
    sliderMarks.indexOf(amount);

  const handleSliderChange = (e) => {
    const index = Number(e.target.value);
    setAmount(sliderMarks[index]);
  };

  /* Reset when collapsed */
  useEffect(() => {
    if (!expanded) {
      setAmount(1000);
    }
  }, [expanded]);

  /* Use backend return */
  useEffect(() => {
    const pct = Number(
      investment.one_year_return_rate || 0
    );
    setReturnPct(pct);
  }, [investment.one_year_return_rate]);

  /* Calculate future */
  useEffect(() => {
    const value =
      amount + (amount * returnPct) / 100;
    setFutureValue(value);
  }, [amount, returnPct]);

  const isReturnProfit =
    returnPct >= 0;

  /* ================= UI ================= */

  return (
    <div
      className="investment-card"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      {/* HEADER */}
      <div className="investment-header">
        <div className="symbol-info">
          <h3>{investment.symbol}</h3>
          <span
            className={`asset-type ${assetType}`}
          >
            {assetType.toUpperCase()}
          </span>
        </div>

        <div className="current-value">
          ₹
          {currentValue.toLocaleString(
            "en-IN"
          )}
        </div>
      </div>

      {/* METRICS */}
      <div className="investment-metrics">
        <div className="metric">
          <div className="label">Units</div>
          <div className="value">
            {units.toFixed(2)}
          </div>
        </div>

        <div className="metric">
          <div className="label">
            Avg buy Price
          </div>
          <div className="value">
            ₹{avgPrice.toFixed(2)}
          </div>
        </div>

        <div className="metric">
          <div className="label">
            Cost Basis
          </div>
          <div className="value">
            ₹{costBasis.toFixed(0)}
          </div>
        </div>

        {lastPrice !== null && (
          <div className="metric price">
            <div className="label">
              Last Price
            </div>
            <div className="value">
              ₹{lastPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* GAIN LOSS */}
      <div
        className={`gain-loss ${
          isProfit ? "profit" : "loss"
        }`}
      >
        <div className="amount">
          {isProfit ? "+" : "-"}₹
          {Math.abs(gainLoss).toFixed(0)}
        </div>

        <div className="percent">
          ({gainLossPercent.toFixed(2)}%)
        </div>
      </div>

      {/* ================= SIMULATION ================= */}

      {expanded && (
        <div
          className="simulation-box"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* TOP TEXT */}
          <div className="simulation-summary top">
            If you had invested:{" "}
            <strong>
              ₹
              {amount.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          {/* SLIDER */}
          <input
            type="range"
            min="0"
            max={
              sliderMarks.length - 1
            }
            step="1"
            value={sliderIndex}
            onChange={handleSliderChange}
            className="simulation-slider"
            style={{
              "--progress":
                (sliderIndex /
                  (sliderMarks.length -
                    1)) *
                  100 +
                "%",
            }}
          />

          {/* BOTTOM TEXT */}
          <div className="simulation-summary">
            Your total investment would be:{" "}
            <strong>
              ₹
              {futureValue.toLocaleString(
                "en-IN"
              )}
            </strong>

            {/* 🔥 RETURN % */}
            <span
              className={`return-rate ${
                isReturnProfit
                  ? "profit"
                  : "loss"
              }`}
            >
              ({returnPct.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestmentCard;
