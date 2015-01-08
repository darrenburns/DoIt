import os
from app import app

app.secret_key = 'ab4cdds123fsdfa123sdfaef234'
WTF_CSRF_ENABLED = True
SQLALCHEMY_DATABASE_URI = os.environ['DOIT_DATABASE_URL']
