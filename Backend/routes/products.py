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


@products_bp.route("/<int:id>", methods=["GET"])
def get_product(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM products WHERE id=%s", (id,))
    product = cur.fetchone()
    cur.close()
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@products_bp.route("/", methods=["POST"])
def add_product():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute(
    "INSERT INTO products (name, price, description, image_url, category) VALUES (%s,%s,%s,%s,%s)",
    (data["name"], data["price"], data.get("description"), data.get("image_url"), data.get("category", "uncategorized"))
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Product added successfully"})


@products_bp.route("/<int:id>", methods=["PUT"])
def update_product(id):
    data = request.json or {}
    cur = mysql.connection.cursor()
    cur.execute(
    "UPDATE products SET name=%s, price=%s, description=%s, image_url=%s, category=%s WHERE id=%s",
    (data.get("name"), data.get("price"), data.get("description"), data.get("image_url"), data.get("category", "uncategorized"), id)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Product updated"})


@products_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM products WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Product deleted"})
