# Generated by Django 4.1.7 on 2023-08-28 06:04

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('video', '0002_alter_reatinguserrelation_date_reating'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ReatingUserRelation',
            new_name='ReatingVideoRelation',
        ),
    ]