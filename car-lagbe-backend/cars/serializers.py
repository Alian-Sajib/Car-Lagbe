from rest_framework import serializers
from .models import Cars, BookingCars
from authentication.serializers import ProfileSerializer
from authentication.models import Profile


class CarsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cars
        fields = [
            "id",
            "owner",
            "status",
            "brand",
            "model",
            "year",
            "color",
            "rent_price",
            "image",
            "description",
        ]  # Specify the fields you want to include


class BookingCarsSerializer(serializers.ModelSerializer):
    car = CarsSerializer(
        read_only=True
    )  # Use CarsSerializer to include car details for GET requests

    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Cars.objects.all(), source="car", write_only=True
    )  # Accept car_id for POST

    profile_data = ProfileSerializer(read_only=True)
    profile_id = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.all(), source="profile_data", write_only=True
    )

    class Meta:
        model = BookingCars
        fields = [
            "id",
            "car",
            "car_id",
            "user",
            "profile_id",
            "profile_data",
            "start_date",
            "end_date",
        ]

    def create(self, validated_data):
        # Extract car from validated data, and set its status to "Booked"
        car = validated_data["car"]
        car.status = "Yes"
        car.save()

        # Proceed with creating the booking record
        return super().create(validated_data)
