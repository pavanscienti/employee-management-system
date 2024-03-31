from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Add a new user'

    def handle(self, *args, **kwargs):
        # Create a new user object
        new_user = User()

        # Set the username and password
        new_user.username = 'sneha'
        new_user.set_password('password')  # Use set_password to properly hash the password

        # Save the user object to the database
        new_user.save()

        self.stdout.write(self.style.SUCCESS('User added successfully!'))
