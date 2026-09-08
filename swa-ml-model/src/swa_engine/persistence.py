import json
import sqlite3
import threading
from collections.abc import Iterable
from pathlib import Path
from typing import Any


class SQLitePersistence:
    """Small SQLite adapter; repositories own validation and domain behavior."""

    def __init__(self, path: str | Path = ":memory:") -> None:
        self._connection = sqlite3.connect(str(path), check_same_thread=False)
        self._lock = threading.RLock()
        self._connection.row_factory = sqlite3.Row
        self._create_tables()

    def _create_tables(self) -> None:
        self._connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS user_goals (
                goal_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS skill_states (
                state_key TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS exercise_events (
                event_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS exercise_attempts (
                attempt_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                exercise_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS mastery_history (
                snapshot_key TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pattern_history (
                snapshot_key TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS difficulty_history (
                snapshot_key TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS interaction_events (
                event_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                recommendation_id TEXT NOT NULL,
                exercise_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            """
        )
        self._connection.commit()

    def upsert(self, table: str, key_column: str, key: str, payload: dict[str, Any], **columns: str) -> None:
        allowed = {"user_profiles": "user_id", "user_goals": "goal_id", "skill_states": "state_key", "exercise_events": "event_id", "exercise_attempts": "attempt_id", "mastery_history": "snapshot_key", "pattern_history": "snapshot_key", "difficulty_history": "snapshot_key", "interaction_events": "event_id"}
        if table not in allowed or allowed[table] != key_column:
            raise ValueError("unsupported persistence table")
        names = [key_column, *columns.keys(), "payload"]
        values = [key, *columns.values(), json.dumps(payload, default=str)]
        placeholders = ", ".join("?" for _ in names)
        updates = ", ".join(f"{name}=excluded.{name}" for name in [*columns.keys(), "payload"])
        with self._lock:
            self._connection.execute(f"INSERT INTO {table} ({', '.join(names)}) VALUES ({placeholders}) ON CONFLICT({key_column}) DO UPDATE SET {updates}", values)
            self._connection.commit()

    def rows(self, table: str, where: str = "", parameters: Iterable[Any] = ()) -> list[sqlite3.Row]:
        allowed = {"user_profiles", "user_goals", "skill_states", "exercise_events", "exercise_attempts", "mastery_history", "pattern_history", "difficulty_history", "interaction_events"}
        if table not in allowed:
            raise ValueError("unsupported persistence table")
        query = f"SELECT payload FROM {table}"
        if where:
            query += f" WHERE {where}"
        with self._lock:
            return list(self._connection.execute(query, tuple(parameters)))

    def close(self) -> None:
        with self._lock:
            self._connection.close()
