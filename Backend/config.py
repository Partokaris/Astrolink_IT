import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'Patrick'
    MYSQL_PASSWORD = '27.drbatman'
    MYSQL_DB = 'astrolinkIT'
    MYSQL_CURSORCLASS = 'DictCursor'  # Returns dict instead of tuple
