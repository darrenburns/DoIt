import os
from app import app

app.secret_key = 'ab4cdds123fsdfa123sdfaef234'
WTF_CSRF_ENABLED = True
SQLALCHEMY_DATABASE_URI = os.environ['DOIT_DATABASE_URL']

GOOGLE_CLIENT_ID = os.environ['DOIT_GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = os.environ['DOIT_GOOGLE_CLIENT_SECRET']
SECRET_KEY = os.environ['DOIT_SECRET_KEY']
REDIRECT_URI = '/auth/google'  # one of the Redirect URIs from Google APIs console
