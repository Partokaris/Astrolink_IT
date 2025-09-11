from flask import Blueprint, request, jsonify
from extensions import mysql

testimonials_bp = Blueprint("testimonials", __name__)

# GET all testimonials
@testimonials_bp.route("/", methods=["GET"])
def get_testimonials():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM testimonials ORDER BY created_at DESC")
    testimonials = cur.fetchall()
    cur.close()
    return jsonify(testimonials)

# GET single testimonial by ID
@testimonials_bp.route("/<int:id>", methods=["GET"])
def get_testimonial(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM testimonials WHERE id=%s", (id,))
    testimonial = cur.fetchone()
    cur.close()
    if testimonial:
        return jsonify(testimonial)
    return jsonify({"error": "Testimonial not found"}), 404

# POST a new testimonial
@testimonials_bp.route("/", methods=["POST"])
def add_testimonial():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO testimonials (name, comment) VALUES (%s, %s)",
        (data["name"], data["comment"])
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Testimonial added successfully"}), 201

# DELETE a testimonial by ID
@testimonials_bp.route("/<int:id>", methods=["DELETE"])
def delete_testimonial(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM testimonials WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Testimonial deleted"}), 200
