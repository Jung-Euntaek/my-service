import sqlite3
from pathlib import Path
from datetime import datetime, timezone

DB_PATH = Path("app.db")

def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # dict처럼 접근
    return conn

def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                action TEXT NOT NULL,
                model TEXT NOT NULL,
                input TEXT NOT NULL,
                output TEXT NOT NULL
            )
            """
        )
        conn.commit()

def insert_history(action: str, model: str, input_text: str, output_text: str) -> int:
    ts = datetime.now(timezone.utc).isoformat()
    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO history (timestamp, action, model, input, output)
            VALUES (?, ?, ?, ?, ?)
            """,
            (ts, action, model, input_text, output_text),
        )
        conn.commit()
        return int(cur.lastrowid)

def list_history(limit: int = 50):
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, timestamp, action, model
            FROM history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]

def get_history(history_id: int):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM history WHERE id = ?",
            (history_id,),
        ).fetchone()
        return dict(row) if row else None

def delete_history(history_id: int) -> bool:
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM history WHERE id = ?", (history_id,))
        conn.commit()
        return cur.rowcount > 0
