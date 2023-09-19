# Generated by Django 4.1.7 on 2023-09-13 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0010_alter_playlist_status_alter_playlist_title_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='videomodel',
            name='status',
            field=models.CharField(choices=[('Open', 'Open'), ('On link', 'On link'), ('Close', 'Close')], default=1, max_length=50),
            preserve_default=False,
        ),
    ]
