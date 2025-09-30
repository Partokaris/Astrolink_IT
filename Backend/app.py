from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import init_extensions, mysql
from routes.auth import auth_bp
from routes.products import products_bp
from routes.projects import projects_bp
from routes.testimonials import testimonials_bp
from routes.uploads import upload_bp

app = Flask(__name__)
app.config.from_object(Config)

# make routing accept both /api/projects and /api/projects/
app.url_map.strict_slashes = False

# Configure upload folder and ensure it exists
import os
UPLOAD_FOLDER = os.path.join(app.root_path, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure CORS here
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Initialize extensions (DB, CORS, JWT)
init_extensions(app)

# Register routes


# Register upload route
app.register_blueprint(upload_bp, url_prefix="/api/uploads")

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(testimonials_bp, url_prefix='/api/testimonials')


from flask import send_from_directory
import os

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, "uploads"), filename)


if __name__ == "__main__":
    app.run(debug=True)
