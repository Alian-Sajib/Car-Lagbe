from rest_framework import viewsets, status
from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import Http404

from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing, creating, updating, and deleting users.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Allow anyone to access the create action for signup, but require authentication for other actions
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Optionally restricts the returned users to a specific subset based on user_type,
        by filtering against a `user_type` query parameter in the URL. (?user_type=P)
        """
        queryset = super().get_queryset()
        user_type = self.request.query_params.get("user_type", None)

        if user_type:
            queryset = queryset.filter(user_type=user_type)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create access and refresh tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class ProfileViewSets(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Limit queryset to the authenticated user's profile
        return Profile.objects.filter(user=self.request.user)

    def get_object(self):
        # Retrieve profile based on `user_id`
        try:
            return Profile.objects.get(user__id=self.kwargs["pk"])
        except Profile.DoesNotExist:
            raise Http404("Profile not found")

    def retrieve(self, request, pk=None):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
