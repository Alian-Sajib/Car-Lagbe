from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
    Group,
    Permission,
)
from django.utils.translation import gettext_lazy

# To create automaticaaly one to one object with user and profile
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class UserManager(BaseUserManager):
    """A custom manager to deal with email as unique identifier"""

    def create_user(self, email, password):
        """Create and save a user with the given email and password"""
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)  # sends hash value
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Create and save a superuser with the given email and password"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports email as unique identifier"""

    TYPE = [("P", "Personal"), ("B", "Business")]

    email = models.EmailField(unique=True, null=False)
    user_type = models.CharField(max_length=50, choices=TYPE, default="P")

    is_staff = models.BooleanField(
        gettext_lazy("active"),
        default=False,
        help_text=gettext_lazy(
            "Designates whether the user can log into this admin site."
        ),
    )
    is_active = models.BooleanField(
        gettext_lazy("active"),
        default=True,
        help_text=gettext_lazy(
            "Designates whether this user should be treated as active. Unselect this instead of deleting the user"
        ),
    )

    # Add related_name attributes to prevent reverse accessor conflicts
    groups = models.ManyToManyField(Group, related_name="user_groups", blank=True)
    user_permissions = models.ManyToManyField(
        Permission, related_name="user_permissions", blank=True
    )

    USERNAME_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return f"{self.email } ({self.user_type})"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    # username = models.CharField(max_length=264, blank=True)
    full_name = models.CharField(max_length=264, blank=True)
    address_1 = models.TextField(max_length=300, blank=True)
    city = models.CharField(max_length=30, blank=True)
    zipcode = models.IntegerField(null=True)
    phone = models.IntegerField(null=True)
    country = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name + "'s Profile"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Creates a Profile for each new user upon registration, or updates the Profile
    when the User model is updated.
    """
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()  # This saves updates to the profile automatically.
