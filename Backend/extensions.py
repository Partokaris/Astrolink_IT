from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager

mysql = MySQL()
jwt = JWTManager()

def init_extensions(app):
    mysql.init_app(app)
    # CORS is configured centrally in app.py; do not re-initialize here to avoid
    # overriding or adding duplicate CORS handlers which can cause missing
    # Access-Control-Allow-Origin on preflight responses.
    jwt.init_app(app)
