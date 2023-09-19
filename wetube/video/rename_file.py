from uuid import uuid4
import os
from django.core.files.storage import FileSystemStorage


class RenameFile(FileSystemStorage):
    def __call__(self,instance,inpt_filename):
        ext = inpt_filename.split('.')[1]
        outp_filename = f"{uuid4().hex}.{ext}"
        return os.path.join(f'video/{instance.avtor}/{instance.title}/',outp_filename)

    