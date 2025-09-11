from flask import Flask
from extensions import mysql

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'Patrick'
app.config['MYSQL_PASSWORD'] = '27.drbatman'
app.config['MYSQL_DB'] = 'astrolinkIT'

mysql.init_app(app)

@app.route("/test")
def test_db():
    cur = mysql.connection.cursor()
    cur.execute("SHOW TABLES")
    tables = cur.fetchall()
    cur.close()
    return {"tables": tables}

if __name__ == "__main__":
    app.run(debug=True)
