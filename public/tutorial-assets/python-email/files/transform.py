"""
External Python transform invoked by the Odara `python_transform` node.

Contract:
    - Receives a pandas DataFrame `df` (built by Odara from the upstream
      Arrow RecordBatch — column types come straight from the CSV reader).
    - Returns a pandas DataFrame whose columns become the next stage's schema.

What this script does:
    Group the raw sales rows by month + region, sum the amounts, and emit a
    tidy monthly summary that downstream nodes can write to a CSV and mail.
"""
import pandas as pd


def transform(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["sale_date"] = pd.to_datetime(df["sale_date"])
    df["month"] = df["sale_date"].dt.strftime("%Y-%m")
    df["amount"] = pd.to_numeric(df["amount"])

    out = (
        df.groupby(["month", "region"], as_index=False)
          .agg(orders=("sale_id", "count"),
               total_amount=("amount", "sum"))
          .sort_values(["month", "region"])
          .reset_index(drop=True)
    )
    out["total_amount"] = out["total_amount"].round(2)
    return out
