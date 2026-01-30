# app/services/investment_service.py
from sqlalchemy.orm import Session
from decimal import Decimal
from app.models.investment import Investment, AssetType
from app.models.transaction import Transaction, TransactionType

class InvestmentService:
    @staticmethod
    def get_or_create_investment(db: Session, user_id: int, symbol: str, asset_type: AssetType) -> Investment:
        """Get existing investment or create new one"""
        investment = db.query(Investment).filter(
            Investment.user_id == user_id,
            Investment.symbol == symbol,
            Investment.asset_type == asset_type
        ).first()
        
        if not investment:
            investment = Investment(
                user_id=user_id,
                symbol=symbol,
                asset_type=asset_type,
                units=Decimal('0'),
                cost_basis=Decimal('0'),
                current_value=Decimal('0')
            )
            db.add(investment)
            db.flush()  # Get ID without committing
        return investment

    @staticmethod
    def process_buy_transaction(db: Session, investment: Investment, quantity: Decimal, 
                              price: Decimal, fees: Decimal):
        """Process BUY transaction - update units, avg price, cost basis"""
        total_cost = (quantity * price) + fees
        
        if investment.units > 0:
            # Weighted average price calculation
            new_total_cost = investment.cost_basis + total_cost
            new_total_units = investment.units + quantity
            investment.avg_buy_price = new_total_cost / new_total_units
        else:
            investment.avg_buy_price = price
        
        investment.units += quantity
        investment.cost_basis += total_cost
        investment.last_price = price
        investment.last_price_at = None  # Will be updated by price fetcher
        
        db.commit()
        return investment

    @staticmethod
    def process_sell_transaction(db: Session, investment: Investment, quantity: Decimal, price: Decimal):
        """Process SELL transaction - reduce units, update cost basis proportionally"""
        if investment.units < quantity:
            raise ValueError("Insufficient units to sell")
        
        # Proportional cost basis reduction
        cost_per_unit = investment.cost_basis / investment.units
        cost_sold = quantity * cost_per_unit
        
        investment.units -= quantity
        investment.cost_basis -= cost_sold
        investment.last_price = price
        investment.last_price_at = None
        
        # Reset avg price if no units left
        if investment.units <= 0:
            investment.units = Decimal('0')
            investment.cost_basis = Decimal('0')
            investment.avg_buy_price = None
        
        db.commit()
        return investment

    @staticmethod
    def process_dividend(db: Session, investment: Investment, amount: Decimal):
        """Process DIVIDEND - cash inflow, doesn't affect holdings"""
        # Could add to cash holdings or track separately
        investment.last_price_at = None
        db.commit()
        return investment

    @staticmethod
    def process_contribution(db: Session, investment: Investment, amount: Decimal, price: Decimal = None):
        """Process CONTRIBUTION - treat as cash addition or buy at current price"""
        if price:
            quantity = amount / price
            return InvestmentService.process_buy_transaction(db, investment, quantity, price, Decimal('0'))
        db.commit()
        return investment

    @staticmethod
    def process_withdrawal(db: Session, investment: Investment, amount: Decimal):
        """Process WITHDRAWAL - cash outflow"""
        db.commit()
        return investment
