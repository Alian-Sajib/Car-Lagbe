from django.urls import path
from rest_framework import routers
from .views import CarsViewSets, BookingCarsViewSet

router = routers.SimpleRouter()
router.register(r"bookings", BookingCarsViewSet, basename="bookings")
router.register(r"", CarsViewSets, basename="cars")


urlpatterns = [] + router.urls
