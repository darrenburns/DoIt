from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='', template_folder='templates')
app.config.from_object('config')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'

db = SQLAlchemy(app)

from flask.ext.login import LoginManager
from flask.ext.openid import OpenID

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'
oid = OpenID(app, 'tmp')

