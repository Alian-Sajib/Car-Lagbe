from rest_framework import serializers
from authentication.models import User, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from rest_framework import serializers
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    user_type = serializers.CharField()

    def validate(self, attrs):
        # Call the original validate method
        data = super().validate(attrs)

        # Get the user_type passed from frontend
        expected_user_type = self.initial_data.get("user_type")

        # Check if the user's user_type matches
        if self.user.user_type != expected_user_type:
            raise serializers.ValidationError("Invalid user type for this mode.")

        # If everything is fine, return the validated data
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "user_type",
        ]  # Ensure 'user_type' is included

    def create(self, validated_data):
        # Extract necessary fields from validated data
        email = validated_data["email"]
        password = validated_data["password"]
        user_type = validated_data["user_type"]

        # Use the custom manager's create_user method to handle user creation and password hashing
        user = User.objects.create_user(email=email, password=password)

        # Assign the user_type field from validated data
        user.user_type = user_type
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
