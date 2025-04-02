from django.contrib.auth.models import AbstractUser
from django.db import models
from pytesseract import image_to_string
from PIL import Image  # For image processing
import os

class CustomUser(AbstractUser):
    ADMIN = "admin"
    COMPANY_STAFF = "company_staff"
    USER = "user"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (COMPANY_STAFF, "Company Staff"),
        (USER, "User"),
    ]

    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=USER)

    def __str__(self):
        return f"{self.username} - {self.role}"


class AdminProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="admin_profile")
    department = models.CharField(max_length=100, blank=True, null=True)
    permissions = models.TextField(blank=True, null=True)  # Admin permissions

    def __str__(self):
        return f"Admin: {self.user.username}"


class CompanyStaffProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="company_staff_profile")
    company_name = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    work_experience = models.TextField(blank=True, null=True)  # Experience details

    def __str__(self):
        return f"Company Staff: {self.user.username}"


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="user_profile")
    education = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  # Store skills as comma-separated values
    experience = models.TextField(blank=True, null=True)
    personal_info = models.TextField(blank=True, null=True)  # Additional personal details

    def __str__(self):
        return f"User: {self.user.username}"

# Company Model
class Company(models.Model):
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='companies')
    email = models.EmailField(max_length=254)
    def __str__(self):
        return self.name

# Job Category Model
class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Job Model
class Job(models.Model):
    title = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    posted_on = models.DateTimeField(auto_now_add=True)
    application_deadline = models.DateTimeField()
     # Job Post Image Upload Field
    job_post_image = models.ImageField(upload_to="job_posts/", null=True, blank=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

    def extract_text_from_image(self):
        """Extract text from the uploaded job post image."""
        if self.job_post_image:
            image_path = self.job_post_image.path
            text = image_to_string(Image.open(image_path))
            return text.strip()
        return "No image uploaded or no text detected."
    def __str__(self):
        return f"{self.title} at {self.company.name}"
