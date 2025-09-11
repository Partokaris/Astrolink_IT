from flask import Blueprint, request, jsonify
from extensions import mysql

projects_bp = Blueprint("projects", __name__)

# GET all projects
@projects_bp.route("/", methods=["GET"])
def get_projects():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM projects ORDER BY created_at DESC")
    projects = cur.fetchall()
    cur.close()
    return jsonify(projects)

# GET single project by ID
@projects_bp.route("/<int:id>", methods=["GET"])
def get_project(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM projects WHERE id=%s", (id,))
    project = cur.fetchone()
    cur.close()
    if project:
        return jsonify(project)
    return jsonify({"error": "Project not found"}), 404

# POST a new project
@projects_bp.route("/", methods=["POST"])
def add_project():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO projects (title, description, image_url) VALUES (%s, %s, %s)",
        (data["title"], data.get("description"), data.get("image_url"))
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Project added successfully"}), 201

# DELETE a project by ID
@projects_bp.route("/<int:id>", methods=["DELETE"])
def delete_project(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM projects WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Project deleted"}), 200
