# Generated by Django 5.1.1 on 2024-10-30 12:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0004_carsbookingstatus'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CarsBookingStatus',
        ),
    ]
