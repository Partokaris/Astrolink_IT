from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import mysql
from MySQLdb.cursors import DictCursor   # ✅ DictCursor
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
import json


auth_bp = Blueprint("auth", __name__)

# Roles:
# 1 = super_admin
# 2 = admin
# 3 = user
role_map = {
    1: "super_admin",
    2: "admin",
    3: "user"
}

# -----------------------
# 🔹 User Signup (defaults to user)
# -----------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        cur.close()
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (username, email, password, role_id) VALUES (%s, %s, %s, %s)",
        (username, email, hashed_password, 3)  # default role_id = 3
    )
    mysql.connection.commit()

    cur.execute("SELECT id, username, email, role_id FROM users WHERE email=%s", (email,))
    new_user = cur.fetchone()
    cur.close()

    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": new_user["id"],
            "username": new_user["username"],
            "email": new_user["email"],
            "role_id": new_user["role_id"],
            "role": role_map.get(new_user["role_id"], "user")
        }
    }), 201


# -----------------------
# 🔹 User Login
# -----------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT id, username, email, password, role_id FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ ensure all values are strings in JWT identity
    token = create_access_token(
    identity=str(user["id"]),   # 👈 subject must be a string
    additional_claims={
        "email": user["email"],
        "role_id": user["role_id"]
    }
)


    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role_id": user["role_id"],
            "role": role_map.get(user["role_id"], "user")
        }
    }), 200


# -----------------------
# 🔹 Get Current User
# -----------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()   # string
    claims = get_jwt()             # dict with email + role_id

    return jsonify({
        "user": {
            "id": int(user_id),
            "email": claims.get("email"),
            "role_id": int(claims.get("role_id")),
            "role": role_map.get(int(claims.get("role_id")), "user")
        }
    }), 200



# -----------------------
# 🔹 Create Admin (super_admin only)
# -----------------------
@auth_bp.route("/create-admin", methods=["POST"])
@jwt_required()
def create_admin():
    user_id = get_jwt_identity()
    claims = get_jwt()

    # only super_admin (role_id 1)
    if not claims or int(claims.get("role_id", 0)) != 1:
        return jsonify({"error": "Access denied"}), 403

    # read JSON and provide detailed errors for debugging
    data = request.get_json(silent=True)
    if not data:
        print("create_admin: missing JSON payload; headers:", dict(request.headers))
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role_id_raw = data.get("role_id")
    try:
        role_id = int(role_id_raw) if role_id_raw is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "role_id must be a number"}), 400

    missing = [k for k in ("username", "email", "password", "role_id") if not data.get(k)]
    if missing:
        return jsonify({"error": "Missing required fields", "missing": missing, "received": data}), 400
    # ensure the requested role exists to satisfy FK constraint
    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT id FROM roles WHERE id=%s", (role_id,))
    if not cur.fetchone():
        cur.close()
        return jsonify({"error": f"role_id {role_id} does not exist"}), 400

    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        cur.close()
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (username, email, password, role_id) VALUES (%s, %s, %s, %s)",
        (username, email, hashed_password, role_id)
    )
    mysql.connection.commit()

    cur.execute("SELECT id, username, email, role_id FROM users WHERE email=%s", (email,))
    new_admin = cur.fetchone()
    cur.close()

    return jsonify({
        "message": f"Admin '{username}' created successfully",
        "user": {
            "id": new_admin["id"],
            "username": new_admin["username"],
            "email": new_admin["email"],
            "role_id": new_admin["role_id"],
            "role": role_map.get(new_admin["role_id"], "user")
        }
    }), 201


# -----------------------
# 🔹 Get All Admins (super_admin only)
# -----------------------
# Get all admins (super_admin + admin)
@auth_bp.route("/admins", methods=["GET"])
@jwt_required()
def get_admins():
    claims = get_jwt()  # claims contain role_id, email
    if int(claims.get("role_id", 0)) != 1:
        return jsonify({"error": "Access denied"}), 403

    cur = mysql.connection.cursor(DictCursor)
    try:
        cur.execute("SELECT id, username, email, role_id FROM users WHERE role_id IN (1,2)")
        admins = cur.fetchall()
        for admin in admins:
            admin["role"] = {1: "super_admin", 2: "admin"}.get(admin["role_id"], "user")
        return jsonify(admins), 200
    except Exception as e:
        print("Error fetching admins:", e)
        return jsonify({"error": "Failed to fetch admins"}), 500
    finally:
        cur.close()


# 🔹 Get roles (public) - helper for testing/seed verification
@auth_bp.route("/roles", methods=["GET"])
def get_roles():
    cur = mysql.connection.cursor(DictCursor)
    try:
        cur.execute("SELECT id, name, description FROM roles ORDER BY id ASC")
        roles = cur.fetchall()
        return jsonify(roles), 200
    except Exception as e:
        print("Error fetching roles:", e)
        return jsonify({"error": "Failed to fetch roles"}), 500
    finally:
        cur.close()

# -----------------------
# 🔹 Delete Admin (super_admin only)
# -----------------------
@auth_bp.route("/admin/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_admin(user_id):
    claims = get_jwt()
    if int(claims.get("role_id", 0)) != 1:
        return jsonify({"error": "Access denied"}), 403

    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT * FROM users WHERE id=%s AND role_id IN (2,3)", (user_id,))
    admin = cur.fetchone()

    if not admin:
        cur.close()
        return jsonify({"error": "Admin not found"}), 404

    cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": f"Admin '{admin['username']}' deleted successfully"}), 200
