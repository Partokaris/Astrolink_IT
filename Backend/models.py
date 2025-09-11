import mysql.connector
from mysql.connector import errorcode

DB_HOST = 'localhost'
DB_USER = 'Patrick'  # or your new user
DB_PASSWORD = '27.drbatman'  # root has no password for now
DB_NAME = 'AstrolinkIT'

# SQL table definitions
TABLES = {}

TABLES['roles'] = (
    """
    CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,   -- e.g. 'super_admin', 'admin'
        description TEXT
    )
    """
)

TABLES['permissions'] = (
    """
    CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        can_manage_projects BOOLEAN DEFAULT 0,
        can_manage_products BOOLEAN DEFAULT 0,
        can_manage_users BOOLEAN DEFAULT 0,
        can_view_reports BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """
)


TABLES['users'] = """
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""

TABLES['products'] = """
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""

TABLES['projects'] = """
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""

TABLES['testimonials'] = """
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""

# Connect to MySQL
try:
    cnx = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = cnx.cursor()

    # Create database if it doesn't exist
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'")
    cursor.execute(f"USE {DB_NAME}")

    # Create tables
    for table_name, table_sql in TABLES.items():
        cursor.execute(table_sql)
        print(f"Table '{table_name}' created or already exists.")

    cursor.close()
    cnx.close()
    print("All tables are ready!")

except mysql.connector.Error as err:
    print(f"Error: {err}")
