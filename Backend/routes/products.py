from flask import Blueprint, request, jsonify
from extensions import mysql

# This must match the import name in app.py
products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_products():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM products ORDER BY created_at DESC")
    products = cur.fetchall()
    cur.close()
    return jsonify(products)

@products_bp.route("/", methods=["POST"])
def add_product():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO products (name, price, description, image_url) VALUES (%s,%s,%s,%s)",
        (data["name"], data["price"], data.get("description"), data.get("image_url"))
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Product added successfully"})
