# Generated by Django 5.1.3 on 2024-11-19 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llm', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shorturls',
            name='llm_query',
        ),
        migrations.AddField(
            model_name='shorturls',
            name='long_url',
            field=models.CharField(default='', max_length=1050, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='queries',
            name='llm_query',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
