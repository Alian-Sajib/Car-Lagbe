from .serializers import (
    CarsSerializer,
    BookingCarsSerializer,
)
from rest_framework import viewsets, status
from rest_framework.pagination import PageNumberPagination
from .models import Cars, BookingCars
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)


class CarsPagination(PageNumberPagination):
    page_size = 6


class CarsViewSets(viewsets.ModelViewSet):
    serializer_class = CarsSerializer
    pagination_class = CarsPagination
    queryset = Cars.objects.all()
    permission_classes = [
        IsAuthenticated
    ]  # Ensure that only authenticated users can access this view

    def get_queryset(self):
        # Get the user making the request
        user = self.request.user

        # Check if the user is a business user
        if user.user_type == "B":
            # Business users see only their own cars
            queryset = Cars.objects.filter(owner=user)
        else:
            # Personal users see all cars
            queryset = Cars.objects.all()

        return queryset


class BookingCarsViewSet(viewsets.ModelViewSet):
    queryset = BookingCars.objects.all()
    serializer_class = BookingCarsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CarsPagination

    def get_queryset(self):
        user = self.request.user
        # Include bookings for the authenticated user and the bookings for cars owned by the authenticated user
        return BookingCars.objects.filter(user=user) | BookingCars.objects.filter(
            car__owner=user
        )

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()

        # logger.info(
        #     f"Attempting to delete booking ID: {booking.id} by user ID: {request.user.id}"
        # )
        # logger.info(
        #     f"Booking user ID: {booking.user.id}, Car owner ID: {booking.car.owner.id}"
        # )

        # Check if the user is either the owner of the car or the user who booked it
        if booking.user != request.user and booking.car.owner != request.user:
            raise PermissionDenied("You do not have permission to cancel this booking.")

        # Set the car's status to 'Available' before deleting the booking
        booking.car.status = "No"
        booking.car.save()

        # Delete the booking
        self.perform_destroy(booking)

        return Response(
            {"message": "Booking canceled successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(detail=False, methods=["get"], url_path="my-car-bookings")
    def my_car_bookings(self, request):
        user = request.user
        # Ensure only business users with cars can access this
        if user.user_type != "B":
            raise PermissionDenied(
                "You do not have permission to view this information."
            )

        # Retrieve bookings for cars owned by the user
        bookings = BookingCars.objects.filter(car__owner=user).select_related(
            "car", "user"
        )
        page = self.paginate_queryset(bookings)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
