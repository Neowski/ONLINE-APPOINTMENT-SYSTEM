# Generated by Django 4.2.6 on 2025-05-02 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_customuser_sr_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='sr_code',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
