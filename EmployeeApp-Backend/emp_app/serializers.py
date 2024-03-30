from rest_framework import serializers
from django.contrib.auth.hashers import make_password  # Import make_password for password hashing
from .models import User

class UserSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True)  # Define password field as write-only

    class Meta:
        model = User
        fields = ['id', 'username', 'password']  # Adjust fields as needed

    def create(self, validated_data):
        # Hash the password before saving the user
        password = validated_data.pop('password')  # Remove password from validated_data
        validated_data['password'] = make_password(password)  # Hash the password
        user = User.objects.create(**validated_data)
        return user
