# Generated by Django 4.1.7 on 2023-09-13 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_commentcommunitymodel_avtor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commentcommunitymodel',
            name='image',
            field=models.ImageField(blank=True, upload_to='usermassage/<django.db.models.fields.related.ForeignKey>/2023-09-13 17:23:25.065090'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='bio',
            field=models.TextField(blank=True, null=True),
        ),
    ]
