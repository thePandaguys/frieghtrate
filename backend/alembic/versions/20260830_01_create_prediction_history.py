"""Create prediction history tables."""
from alembic import op
import sqlalchemy as sa

revision = "20260830_01"
down_revision = None
branch_labels = None
depends_on = None


def _table(name: str) -> None:
    op.create_table(name, sa.Column("id", sa.Integer(), primary_key=True), sa.Column("inputs", sa.JSON(), nullable=False), sa.Column("result", sa.JSON(), nullable=False), sa.Column("confidence", sa.Float(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False))


def upgrade() -> None:
    _table("freight_forecast_history")
    _table("vessel_idle_prediction_history")
    _table("freight_risk_prediction_history")


def downgrade() -> None:
    op.drop_table("freight_risk_prediction_history")
    op.drop_table("vessel_idle_prediction_history")
    op.drop_table("freight_forecast_history")
