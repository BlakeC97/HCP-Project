import os.path as op

from flask import request, redirect, Response, flash, url_for
from werkzeug.exceptions import HTTPException
from flask_admin import Admin
from flask_admin.base import expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.contrib.fileadmin import FileAdmin

from app import app, db
from app.provider import Provider
from app.application import Application
from app.admin import ProviderImportForm

admin = Admin(app, name="Admin", template_mode="bootstrap3")


class ModelView(ModelView):
    def is_accessible(self):
        auth = request.authorization or request.environ.get(
            "REMOTE_USER"
        )  # workaround for Apache
        if (
            not auth
            or (auth.username, auth.password) != app.config["ADMIN_CREDENTIALS"]
        ):
            raise HTTPException(
                "",
                Response(
                    "You have to be an administrator.",
                    401,
                    {"WWW-Authenticate": 'Basic realm="Login Required"'},
                ),
            )
        return True


class ApplicationView(ModelView):
    can_export = True


class ProviderView(ModelView):
    can_export = True

    @expose('/import/', methods=['POST'])
    def import_file(self):
        form = ProviderImportForm()
        if form.validate_on_submit():
            # TODO: Check the contents for its API
            file_content = form.file.data
            # TODO: Parse the content and store it in db
            flash('Providers imported successfully.')
            return redirect(url_for('admin'))


# Applications
admin.add_view(ApplicationView(Application, db.session))

# Providers
admin.add_view(ProviderView(Provider, db.session))

# Static files
path = op.join(op.dirname(__file__), "../static")
admin.add_view(FileAdmin(path, "/static/", name="Static"))
