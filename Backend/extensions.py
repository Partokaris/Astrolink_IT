from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager

mysql = MySQL()
jwt = JWTManager()

def init_extensions(app):
    mysql.init_app(app)
    CORS(app)
    jwt.init_app(app)
