---
title: Star Schema → Snowflake — load with Maestro
slug: star-schema
estimated_min: 12
prereqs: [getting-started, monitor, sql-join]
last_updated: 2026-06-11
---

# Star Schema → Snowflake

> One line: model a tiny **star schema** (3 dimensions + 1 fact), wire
> each table to its own **CSV → Snowflake** pipeline, and let a
> **Maestro** load all four into Snowflake in parallel — four loads
> finished in 3.2 seconds.

This walkthrough ships four CSVs, four pipelines, and a Maestro that
orchestrates them. Reading time **12 minutes**.

By the end you will know how to:

1. Lay out a star schema as **one pipeline per table** (one fact + N
   dimensions) instead of one giant pipeline with branches
2. Configure the **Snowflake Target** node — account, warehouse,
   database, schema, role, and the `Drop & Create` table operation
3. Wrap the per-table pipelines in a **Maestro** with a single
   **Parallel Group** so all four loads run concurrently
4. Read the Maestro execution detail in Monitor and see each child
   pipeline's row count and duration

## Prerequisites

You need a **Snowflake account** and a warehouse/database/schema you
can write to. Snowflake's 30-day trial ($400 free credit) is more
than enough for this tutorial — every load finishes in seconds.

Note the seven coordinates Snowflake asks for; you'll need all of
them in §3:

| Field | Example | Where to find it |
|---|---|---|
| **Account** | `ucpvzth-wk39075` | URL: `<account>.snowflakecomputing.com` |
| **Warehouse** | `ODARA_WH` | Snowflake UI → Admin → Warehouses |
| **Database** | `ODARA_TEST` | Snowflake UI → Data → Databases |
| **Schema** | `PUBLIC` | Inside the database |
| **Username** | `SAMUEL` | Snowflake user |
| **Password** | (set by you) | — |
| **Role** | `ACCOUNTADMIN` | Whatever role can `CREATE TABLE` in the schema |

## Files

Download into a folder on the same machine as the Odara API. The
demo uses `/tmp/tutorials/star-schema/`:

- **[dim_customers.csv](./files/dim_customers.csv)** — 20 rows
  (customer_key, customer_name, email, country, tier)
- **[dim_products.csv](./files/dim_products.csv)** — 10 rows
  (product_key, product_name, category, unit_price)
- **[dim_dates.csv](./files/dim_dates.csv)** — 30 rows
  (date_key, full_date, year, month_num, month_name,
  day_of_month, day_of_week)
- **[fact_orders.csv](./files/fact_orders.csv)** — 100 rows
  (order_key, customer_key, product_key, date_key, quantity,
  total_amount)

The fact references all three dims by their `*_key` columns — the
classic star.

---

## 1. The shape

Four loaders, one orchestrator:

![Sidebar showing 4 pipelines + 1 Maestro filtered by "tutorial-star"](./screenshots/01-sidebar-overview.png)

```
                    Maestro: tutorial-star-schema
                    └── Parallel Group: "Load star schema"
                          ├── tutorial-star-dim-customers
                          ├── tutorial-star-dim-products
                          ├── tutorial-star-dim-dates
                          └── tutorial-star-fact-orders
```

Each child is a tiny two-node pipeline: `CSV Source → Snowflake
Target`. Splitting the work this way (instead of one mega-pipeline
with four branches) means:

- Each table can be re-run, retried, or scheduled **independently**.
- The Maestro is the only place that knows about ordering — swap
  parallel for sequential without touching any pipeline.
- Failures are scoped: if `fact_orders` fails, the dim loads still
  succeed and you don't redo their work.

---

## 2. One child pipeline

Open `tutorial-star-dim-customers` from the sidebar — two nodes:

![dim_customers pipeline — CSV source on the left, Snowflake target on the right](./screenshots/02-dim-pipeline-canvas.png)

The CSV source is identical to anything you've done before — path,
delimiter, has-header. Nothing Snowflake-specific.

---

## 3. The Snowflake Target

Click the Snowflake node on the right of the canvas:

![Snowflake Target Properties — 7 coords + table + Drop & Create](./screenshots/03-snowflake-target.png)

Snowflake is the only target that **has no `connection_string`** —
the seven fields *are* the configuration. Fill in every one:

| Field | What goes in |
|---|---|
| **Account** | Your Snowflake account locator (everything before `.snowflakecomputing.com`). |
| **Warehouse** | A compute warehouse the role can use. Tiny is fine — XS suspends in 60 s. |
| **Database** | The target database. |
| **Schema** | The target schema (commonly `PUBLIC` on a fresh account). |
| **Username** | Snowflake user. |
| **Password** | The user's password. Stored encrypted at rest; only ever displayed as `●●●●●●` after save. |
| **Role** | The role with `USAGE` on warehouse + `CREATE TABLE` on schema. `ACCOUNTADMIN` always works, but in production you'd use a least-privilege role. |
| **Table Name** | `DIM_CUSTOMERS` — Snowflake uppercases unquoted identifiers, so keep your table names UPPER_SNAKE to avoid surprises later. |
| **Table Operation (DDL)** | `Drop & Create` — drops the table if it exists and recreates from the Arrow schema. Idempotent re-runs. |
| **Data Operation (DML)** | `Insert` for the demo. Switch to **`Copy Into`** for production loads — it stages the data on the Snowflake side and bulk-loads, **20–100× faster** than row-by-row INSERTs for anything > 10k rows. |

Repeat for `dim_products`, `dim_dates`, and `fact_orders`. Same shape
each time, just a different CSV path and Table Name. The whole point
of the maestro pattern is that these four pipelines are clones of
each other with two-line variations.

---

## 4. The Maestro

Open `tutorial-star-schema` (also in the sidebar, under the
**MAESTROS** section):

![Maestro canvas — Parallel group with 4 pipeline_call steps](./screenshots/04-maestro-canvas.png)

The maestro has **one step**: a **Parallel Group** named "Load star
schema". Inside it, four `pipeline_call` children, one per table.
The pill at the top reads "**4 steps, max 4 concurrent**" — every
child fires immediately and they all run side-by-side.

Click the parallel group to see its config:

![Parallel Group properties — max_concurrency, continue_on_failure](./screenshots/05-maestro-parallel-group.png)

The two knobs that matter:

- **Max concurrency** — how many child pipelines can run at the same
  time. We use **4** for four children, so they really do run in
  parallel. Set to 1 and the group becomes sequential. Set to 2 and
  any two run at a time.
- **Continue on failure** — if a child fails, do we keep going or
  short-circuit? Default is `false` (fail fast). Set `true` if you
  want every dim attempted even when one fails.

> **Tip:** real-world star loads usually want dims **before** fact
> (so foreign keys exist). You'd model that with **two** sequential
> groups: a parallel group of dims first, then a single step for the
> fact. For the demo we cheat and load all four in parallel because
> the warehouse has no foreign keys defined — Snowflake doesn't
> enforce them.

---

## 5. Execute the Maestro

Hit **Execute** in the toolbar.

![Maestro running — Parallel group lit up, child steps queued/running](./screenshots/06-maestro-executing.png)

Behind the scenes the Maestro executor:

1. Spawns four async tasks (one per `pipeline_call`).
2. Each task POSTs `/api/v1/pipelines/<child_id>/run-stream` against
   the API.
3. Joins when all four finish (or one errors, if `continue_on_failure
   = false`).

---

## 6. Watch it in Monitor

Switch to **Monitor**. Filter by `tutorial-star` and you'll see five
fresh entries — four pipeline runs **plus** the parent Maestro run.

![Monitor — 4 child pipelines + 1 Maestro, all started Just now, COMPLETED in 3.2s](./screenshots/07-monitor-parallel-runs.png)

A few things to read off this list:

- **Type** column lets you separate `Pipeline` from `Maestro` at a
  glance — useful when a maestro orchestrates dozens of children.
- **Started: Just now** on all five — confirms they really started
  concurrently.
- **Duration: 3.2s** for every row — the wall-clock is dominated by
  Snowflake INSERT round-trips; CPU/network on Odara's side is
  negligible.
- **Rows** — each child shows its own row count (20 dim_customers,
  10 dim_products, 30 dim_dates, 100 fact_orders); the Maestro row
  shows `4` (= number of child pipelines).

Click the **Maestro** row to see the orchestration trace:

![Maestro detail — Step started ×4, Step completed ×4, 4/4 succeeded](./screenshots/08-maestro-detail.png)

Read it top to bottom:

- `Maestro started: tutorial-star-schema`
- `Step started: Load star schema (parallel_group)` — the parent
- `Step started: Load DIM_PRODUCTS / DIM_CUSTOMERS / FACT_ORDERS / DIM_DATES (pipeline_call)` — all four fire in the same millisecond
- four `SUCCESS Step …` lines, each with its individual duration
  (3.2s ± a few ms)
- `SUCCESS Maestro completed: 4/4 pipelines succeeded (3246ms)`

The four children are interleaved (DIM_PRODUCTS shows up first, not
DIM_CUSTOMERS) — that's a real signal of parallel execution: the OS
scheduler decides which Tokio task gets its first slice.

---

## 7. Verify in Snowflake

Open the Snowflake worksheet and run:

```sql
USE WAREHOUSE ODARA_WH;
USE DATABASE ODARA_TEST;
USE SCHEMA PUBLIC;

SELECT 'DIM_CUSTOMERS' AS table_name, COUNT(*) AS rows FROM DIM_CUSTOMERS
UNION ALL SELECT 'DIM_PRODUCTS', COUNT(*) FROM DIM_PRODUCTS
UNION ALL SELECT 'DIM_DATES',    COUNT(*) FROM DIM_DATES
UNION ALL SELECT 'FACT_ORDERS',  COUNT(*) FROM FACT_ORDERS;
```

Expected:

| table_name | rows |
|---|---|
| DIM_CUSTOMERS | 20 |
| DIM_PRODUCTS | 10 |
| DIM_DATES | 30 |
| FACT_ORDERS | 100 |

And a quick star-join sanity check:

```sql
SELECT
  d.month_name,
  c.country,
  p.category,
  SUM(f.total_amount) AS revenue
FROM FACT_ORDERS f
JOIN DIM_CUSTOMERS c ON c.customer_key = f.customer_key
JOIN DIM_PRODUCTS  p ON p.product_key  = f.product_key
JOIN DIM_DATES     d ON d.date_key     = f.date_key
GROUP BY 1, 2, 3
ORDER BY revenue DESC
LIMIT 10;
```

If the joins return rows, the star is loaded and consistent.

---

## Cheat sheet

| I want to… | Do this |
|---|---|
| Load N tables in parallel | One pipeline per table + one Maestro with a Parallel Group |
| Load dims before fact | Two Maestro steps — parallel group of dims, then a single fact step |
| Limit concurrency (small warehouse) | Parallel Group → **Max concurrency** = N |
| Keep going even if one child fails | Parallel Group → **Continue on failure** = true |
| Idempotent re-runs | Snowflake Target → **Table Operation = Drop & Create** |
| Fast bulk loads (> 10k rows) | Snowflake Target → **Data Operation = Copy Into** |
| Move from trial to prod | Replace `ACCOUNTADMIN` role with a least-privilege role; same field, same UI |

---

## What you learned

- A **star schema load** doesn't need one giant pipeline — model it
  as one pipeline per table and let a **Maestro** be the only place
  that knows about ordering.
- The **Snowflake Target** has no connection string — its seven
  configuration fields *are* the connection, and the password is
  encrypted at rest.
- A **Parallel Group** with `max_concurrency = N` actually runs the
  children concurrently — Monitor's `Started: Just now` on every row
  and interleaved `Step completed` lines are how you can tell.
- For production loads, swap **`Insert`** → **`Copy Into`** on the
  Snowflake target — same UI, dramatically faster on real volumes.

That closes the first six walkthroughs. From here every pipeline you
build is a remix: connectors, transforms, schedules, alerts,
orchestration — you've seen the building blocks.
