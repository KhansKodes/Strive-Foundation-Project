from django.db import migrations, models
import users.models

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        # Add the new fields
        migrations.AddField(
            model_name='user',
            name='full_name',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(default='', max_length=20),
        ),
        
        # Update the email field to be unique
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='email address'),
        ),
        
        # Make username nullable and not required
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=150, null=True, unique=True),
        ),
        
        # Change the model managers
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', users.models.CustomUserManager()),
            ],
        ),
    ]
