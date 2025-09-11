from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mysql

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/create-admin", methods=["POST"])
@jwt_required()
def create_admin():
    current_user = get_jwt_identity()

    # Only allow super_admin
    cur = mysql.connection.cursor(dictionary=True)
    cur.execute("SELECT role_id FROM users WHERE id=%s", (current_user["id"],))
    user = cur.fetchone()
    
    if not user or user["role_id"] != 1:  # role_id=1 is super_admin
        return jsonify({"error": "Permission denied"}), 403

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role_id = data.get("role_id")

    if not username or not email or not password or not role_id:
        return jsonify({"error": "All fields required"}), 400

    hashed_password = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (username, email, password, role_id) VALUES (%s, %s, %s, %s)",
        (username, email, hashed_password, role_id)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Admin created successfully"}), 201
