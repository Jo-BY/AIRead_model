import os
from pathlib import Path

from db import get_connection


CREATE_USERS_TABLE = """
CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    school VARCHAR(200) NOT NULL,
    level INT NOT NULL,
    room INT NOT NULL,
    num INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_identity (school, level, room, num, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""

CREATE_ACTIONS_TABLE = """
CREATE TABLE IF NOT EXISTS `action` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    book VARCHAR(200) NOT NULL,
    sentence TEXT NOT NULL,
    total_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""


def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(CREATE_ACTIONS_TABLE)
        conn.commit()
        print("Database initialized successfully.")
    finally:
        conn.close()


if __name__ == "__main__":
    init_db()
