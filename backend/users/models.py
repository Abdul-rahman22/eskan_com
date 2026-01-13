# users/models.py
from django.contrib.auth.models import User
from django.db import models
from django.core.validators import URLValidator
from django.utils import timezone

class UserProfile(models.Model):
    """
    Extended user profile with additional authentication fields.
    """
    USER_TYPE_CHOICES = [
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )

    # Profile Information
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='tenant'
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    profile_image = models.ImageField(
        upload_to='profile_images/',
        blank=True,
        null=True
    )

    # Address Information
    address = models.CharField(
        max_length=300,
        blank=True,
        null=True
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    state = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    country = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Professional Information
    bio = models.TextField(
        blank=True,
        null=True
    )
    website = models.URLField(
        blank=True,
        null=True
    )

    # Account Status
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.get_user_type_display()})"

    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login_at = timezone.now()
        self.save(update_fields=['last_login_at'])