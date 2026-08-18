import os
from pathlib import Path

import pymysql
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if value is None or value == "":
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def get_db_config() -> dict:
    ca_path = Path(_require_env("DB_CA_PATH")).resolve()
    if not ca_path.exists():
        raise FileNotFoundError(f"SSL CA certificate not found: {ca_path}")

    return {
        "host": _require_env("DB_HOST"),
        "port": int(_require_env("DB_PORT")),
        "user": _require_env("DB_USER"),
        "password": _require_env("DB_PASSWORD"),
        "database": _require_env("DB_NAME"),
        "charset": "utf8mb4",
        "autocommit": True,
        "cursorclass": pymysql.cursors.DictCursor,
        "ssl": {"ca": str(ca_path)},
    }


def get_connection():
    config = get_db_config()
    return pymysql.connect(**config)


def fetch_one(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchone()


def fetch_all(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()


def execute(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            result = cursor.execute(query, params or ())
            conn.commit()
            return result
