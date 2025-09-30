import mysql.connector
from mysql.connector import errorcode

# MySQL connection settings
DB_HOST = 'localhost'
DB_USER = 'Patrick'
DB_PASSWORD = '27.drbatman'
DB_NAME = 'astrolinkIT'

# SQL statements for tables
TABLES = {}

# 1. Roles
TABLES['roles'] = """
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB
"""

# 2. Users (linked to roles)
TABLES['users'] = """
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
"""

# 3. Permissions
TABLES['permissions'] = """
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB
"""

# 4. Role-Permissions (many-to-many link)
TABLES['role_permissions'] = """
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
        ON DELETE CASCADE
) ENGINE=InnoDB
"""

# 5. Products
TABLES['products'] = """
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category VARCHAR(100) DEFAULT 'uncategorized',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
"""

# 6. Projects
TABLES['projects'] = """
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
"""

# 7. Testimonials
TABLES['testimonials'] = """
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
"""

def main():
    try:
        cnx = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = cnx.cursor()

        # Create DB
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'")
        print(f"Database '{DB_NAME}' is ready.")
        cnx.database = DB_NAME

        # Create tables in correct order
        for table_name in [
            'roles', 'users', 'permissions', 'role_permissions',
            'products', 'projects', 'testimonials'
        ]:
            table_sql = TABLES[table_name]
            try:
                print(f"Creating table '{table_name}'...", end="")
                cursor.execute(table_sql)
                print("OK")
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)

            # Seed default roles if not present
            try:
                cursor.execute("SELECT COUNT(*) FROM roles")
                count = cursor.fetchone()[0]
                if count == 0:
                    print("Seeding default roles...")
                    cursor.execute("INSERT INTO roles (name, description) VALUES (%s, %s)", ("super_admin", "Full access"))
                    cursor.execute("INSERT INTO roles (name, description) VALUES (%s, %s)", ("admin", "Limited admin"))
                    cursor.execute("INSERT INTO roles (name, description) VALUES (%s, %s)", ("user", "Regular user"))
                    cnx.commit()
            except Exception as e:
                print("Failed to seed roles:", e)

        cursor.close()
        cnx.close()
        print("✅ All tables created successfully!")

        # Migration: ensure 'category' column exists on products for older DBs
        try:
            cnx = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
            cur = cnx.cursor()
            cur.execute("SHOW COLUMNS FROM products LIKE 'category'")
            col = cur.fetchone()
            if not col:
                print("Adding missing 'category' column to products table...")
                cur.execute("ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'uncategorized'")
                cnx.commit()
                print("'category' column added.")
            cur.close()
            cnx.close()
        except Exception as e:
            print("Migration check failed (non-fatal):", e)

    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    main()
