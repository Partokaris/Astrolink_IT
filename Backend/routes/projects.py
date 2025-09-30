from flask import Blueprint, request, jsonify, current_app
from extensions import mysql
from werkzeug.utils import secure_filename
import os

projects_bp = Blueprint("projects", __name__)

# GET all projects
@projects_bp.route("/", methods=["GET"], strict_slashes=False)
def get_projects():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM projects ORDER BY created_at DESC")
    projects = cur.fetchall()
    cur.close()
    return jsonify(projects)

# GET single project by ID
@projects_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
def get_project(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM projects WHERE id=%s", (id,))
    project = cur.fetchone()
    cur.close()
    if project:
        return jsonify(project)
    else:
        return jsonify({"error": "Project not found"}), 404

# POST a new project
@projects_bp.route("/", methods=["POST"], strict_slashes=False)
def add_project():
    # Accept either JSON (request.json) or multipart form-data (request.form + request.files)
    title = None
    description = None
    image_url = None

    if request.content_type and request.content_type.startswith("application/json"):
        data = request.json or {}
        title = data.get("title")
        description = data.get("description")
        image_url = data.get("image_url")  # allow client to pass a remote URL
    else:
        # form-data (file upload)
        form = request.form
        title = form.get("title")
        description = form.get("description")
        file = request.files.get("image") or request.files.get("file")
        if file and file.filename:
            filename = secure_filename(file.filename)
            save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
            # avoid overwriting: add suffix if exists
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(save_path):
                filename = f"{base}_{counter}{ext}"
                save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
                counter += 1
            file.save(save_path)
            # URL that your frontend can request
            image_url = f"/uploads/{filename}"

    # basic validation
    if not title:
        return jsonify({"error": "title is required"}), 400

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO projects (title, description, image_url) VALUES (%s, %s, %s)",
        (title, description, image_url)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Project added successfully", "image_url": image_url}), 201

# DELETE a project by ID
@projects_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
def delete_project(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM projects WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Project deleted"}), 200
