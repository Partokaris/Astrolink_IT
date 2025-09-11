from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import init_extensions, mysql
from routes.auth import auth_bp
from routes.products import products_bp
from routes.projects import projects_bp
from routes.testimonials import testimonials_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Initialize extensions (DB, CORS, JWT)
init_extensions(app)

# Register routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(testimonials_bp, url_prefix='/api/testimonials')

if __name__ == "__main__":
    app.run(debug=True)
