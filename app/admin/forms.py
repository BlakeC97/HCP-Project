from flask_wtf import FlaskForm as Form
from wtforms import FileField
from wtforms.validators import DataRequired


class FileSizeValidator(object):
    def __init__(self, message=None, max_size=int(5e6)):
        if message is None:
            message = u'The file size exceeded max_size({})'.format(max_size)
        self.message = message

    def __call__(self, form, field):
        if field.data:
            # TODO: Check if file size is within max_size
            return


class CSVFileValidator(object):
    def __init__(self, message=None):
        if message is None:
            message = u'The provided file didn\'t fit the specification.'
        self.message = message

    def __call__(self, form, field):
        if field.data:
            # TODO: Add logic to
            #  a. Check if extension matches (csv)
            #  b. Check that the file data is valid CSV
            return


class ProviderImportForm(Form):
    file = FileField(
        validators=[DataRequired(),
                    FileSizeValidator(),
                    CSVFileValidator()],
        description="Import Provider data from CSV file.",
    )
