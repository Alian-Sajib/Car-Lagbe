from django.db import models
from authentication.models import User, Profile
from django.conf import settings
from django.utils import timezone

# Create your models here.


class Cars(models.Model):
    STATUS = [("Yes", "Booked"), ("No", "Available")]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    status = models.CharField(max_length=50, choices=STATUS, default="No")
    brand = models.CharField(max_length=200)
    model = models.CharField(max_length=200)
    year = models.IntegerField()
    color = models.CharField(max_length=200)
    rent_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="car_pic")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Cars"

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"


class BookingCars(models.Model):
    car = models.ForeignKey(Cars, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_data = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    booked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name_plural = "Booking Cars"
        ordering = ["-booked_at"]

    def __str__(self):
        return f"Booking for {self.car} by {self.profile_data.full_name}"
