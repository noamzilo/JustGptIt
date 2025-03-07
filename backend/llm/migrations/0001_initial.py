# Generated by Django 5.1.3 on 2024-11-15 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Queries',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('llm_query', models.CharField(max_length=255)),
                ('llm_response', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ShortUrls',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('llm_query', models.CharField(max_length=1050)),
                ('short_url', models.CharField(max_length=30, unique=True)),
            ],
        ),
    ]
