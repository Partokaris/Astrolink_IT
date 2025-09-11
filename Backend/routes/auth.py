from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import mysql

auth_bp = Blueprint("auth", __name__)

# -----------------------
# 🔹 User Signup (Default: role = user)
# -----------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    cur = mysql.connection.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    existing_user = cur.fetchone()
    if existing_user:
        cur.close()
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)

    # Default role_id = 3 (assuming 1=super_admin, 2=admin, 3=user)
    cur.execute(
        "INSERT INTO users (username, email, password, role_id) VALUES (%s, %s, %s, %s)",
        (username, email, hashed_password, 3)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "User created successfully"}), 201


# -----------------------
# 🔹 User Login
# -----------------------
# 🔹 User Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT id, username, email, password, role 
        FROM users 
        WHERE email=%s
    """, (email,))
    user = cur.fetchone()
    cur.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "id": user["id"],
        "email": user["email"],
        "role": user["role"]
    })

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200



# -----------------------
# 🔹 Protected route (Profile)
# -----------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200


# -----------------------
# 🔹 Create Admin (Only Super Admins)
# -----------------------
@auth_bp.route("/create-admin", methods=["POST"])
@jwt_required()
def create_admin():
    current_user = get_jwt_identity()

    # ✅ Only super_admin can create admins
    if current_user["role"] != "super_admin":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role_id = data.get("role_id")  # must provide role_id

    if not username or not email or not password or not role_id:
        return jsonify({"error": "All fields (username, email, password, role_id) are required"}), 400

    cur = mysql.connection.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    existing_user = cur.fetchone()
    if existing_user:
        cur.close()
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (username, email, password, role_id) VALUES (%s, %s, %s, %s)",
        (username, email, hashed_password, role_id)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": f"Admin '{username}' created with role_id {role_id}"}), 201
