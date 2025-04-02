# from django.contrib.auth import get_user_model, authenticate
# from django.contrib.auth.hashers import make_password
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from myapp.models import Job, Company
# from .serializers import CustomUserSerializer, JobSerializer, CompanySerializer
# from rest_framework import status
# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required, user_passes_test
# from django.db.models import Count
# from django.utils import timezone
# from datetime import timedelta
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, BasePermission
# from rest_framework.response import Response
# from rest_framework import status

# from .models import CustomUser, Company, Job, JobCategory
# User = get_user_model()

# @api_view(['POST'])
# def register_view(request):
#     """Handles user registration with phone number and OTP"""
#     serializer = CustomUserSerializer(data=request.data)

#     if serializer.is_valid():
#         user = serializer.save()
#         # Send OTP via SMS (implement Twilio or other service)
#         return Response({
#             "message": "User registered successfully. Please verify OTP."
#         }, status=status.HTTP_201_CREATED)
    
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from django.contrib.auth import authenticate
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken

# @api_view(['POST'])
# def login_view(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     print(f"Trying to authenticate: {username}")  # Debugging

#     user = authenticate(username=username, password=password)
#     if user is None:
#         print("Authentication failed!")  # Debugging
#         return Response({'error': 'Invalid credentials'}, status=401)

#     print(f"Authenticated user: {user}")  # Debugging

#     refresh = RefreshToken.for_user(user)
#     return Response({
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     })

# # List all Jobs (DRF)
# @api_view(["GET"])
# @permission_classes([AllowAny])
# def job_list(request):
#     jobs = Job.objects.all().order_by("-posted_on")
#     serializer = JobSerializer(jobs, many=True)
#     return Response(serializer.data)

# # Job Detail View (DRF)
# @api_view(["GET"])
# @permission_classes([AllowAny])
# def job_detail(request, pk):
#     try:
#         job = Job.objects.get(pk=pk)
#         serializer = JobSerializer(job)
#         return Response(serializer.data)
#     except Job.DoesNotExist:
#         return Response({"error": "Job not found"}, status=404)

# # Create a New Job Posting (Only authenticated users)
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_job(request):
#     serializer = JobSerializer(data=request.data)
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# # Update a Job Posting (Only authenticated users)
# @api_view(["PUT"])
# @permission_classes([IsAuthenticated])
# def update_job(request, pk):
#     try:
#         job = Job.objects.get(pk=pk)
#     except Job.DoesNotExist:
#         return Response({"error": "Job not found"}, status=404)

#     serializer = JobSerializer(job, data=request.data, partial=True)
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=400)

# # Delete a Job Posting (Only authenticated users)
# @api_view(["DELETE"])
# @permission_classes([IsAuthenticated])
# def delete_job(request, pk):
#     try:
#         job = Job.objects.get(pk=pk)
#         job.delete()
#         return Response({"message": "Job deleted successfully"}, status=204)
#     except Job.DoesNotExist:
#         return Response({"error": "Job not found"}, status=404)

# @api_view(["GET", "POST"])
# def company_list(request):
#     if request.method == "GET":
#         companies = Company.objects.all()
#         serializer = CompanySerializer(companies, many=True)
#         return Response(serializer.data)

#     elif request.method == "POST":
#         serializer = CompanySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# # Company Detail View (DRF)
# @api_view(["GET"])
# @permission_classes([AllowAny])
# def company_detail(request, pk):
#     try:
#         company = Company.objects.get(pk=pk)
#         serializer = CompanySerializer(company)
#         return Response(serializer.data)
#     except Company.DoesNotExist:
#         return Response({"error": "Company not found"}, status=404)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken

# @api_view(['POST'])
# def token_refresh(request):
#     print("Received request for token refresh...")

#     refresh_token = request.data.get('refresh')  # Extract refresh token
#     print(f"Received refresh token: {refresh_token}")

#     if not refresh_token:  # Check if refresh token is missing
#         print("Error: Refresh token is missing in the request.")
#         return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         refresh = RefreshToken(refresh_token)  # Validate and generate new access token
#         new_access_token = str(refresh.access_token)
#         print(f"New access token generated: {new_access_token}")

#         return Response({'access': new_access_token})
#     except Exception as e:
#         print(f"Error: Invalid refresh token - {e}")
#         return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
    
  


# def is_admin(user):
#     return user.role == CustomUser.ADMIN

# class AdminDashboardPermission(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == CustomUser.ADMIN

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_stats(request):
#     """
#     Get overview statistics for the admin dashboard
#     """
#     # Calculate key metrics
#     total_users = CustomUser.objects.filter(role=CustomUser.USER).count()
#     total_companies = Company.objects.count()
#     total_jobs = Job.objects.count()
#     total_categories = JobCategory.objects.count()
    
#     # Calculate job trends (last 6 months)
#     end_date = timezone.now()
#     start_date = end_date - timedelta(days=180)
    
#     # Create a list of months
#     months = []
#     current_date = start_date
#     job_counts = []
    
#     while current_date <= end_date:
#         month_start = current_date.replace(day=1)
#         if current_date.month == 12:
#             month_end = current_date.replace(year=current_date.year + 1, month=1, day=1) - timedelta(days=1)
#         else:
#             month_end = current_date.replace(month=current_date.month + 1, day=1) - timedelta(days=1)
        
#         job_count = Job.objects.filter(posted_on__gte=month_start, posted_on__lte=month_end).count()
        
#         months.append(current_date.strftime('%b %Y'))
#         job_counts.append(job_count)
        
#         # Move to next month
#         if current_date.month == 12:
#             current_date = current_date.replace(year=current_date.year + 1, month=1)
#         else:
#             current_date = current_date.replace(month=current_date.month + 1)
    
#     data = {
#         'overview': {
#             'total_users': total_users,
#             'total_companies': total_companies,
#             'total_jobs': total_jobs,
#             'total_categories': total_categories,
#         },
#         'job_trends': {
#             'months': months,
#             'counts': job_counts
#         }
#     }
    
#     return Response(data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_recent_jobs(request):
#     """
#     Get recent jobs for the admin dashboard
#     """
#     recent_date = timezone.now() - timedelta(days=7)
#     recent_jobs = Job.objects.filter(posted_on__gte=recent_date).order_by('-posted_on')[:5]
#     serializer = JobSerializer(recent_jobs, many=True)
    
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_expiring_jobs(request):
#     """
#     Get jobs with approaching deadlines
#     """
#     upcoming_deadline = timezone.now() + timedelta(days=3)
#     expiring_jobs = Job.objects.filter(
#         application_deadline__lte=upcoming_deadline,
#         application_deadline__gte=timezone.now()
#     ).order_by('application_deadline')[:5]
    
#     serializer = JobSerializer(expiring_jobs, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_latest_users(request):
#     """
#     Get latest registered users
#     """
#     latest_users = CustomUser.objects.filter(role=CustomUser.USER).order_by('-date_joined')[:5]
#     serializer = UserSerializer(latest_users, many=True)
    
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_latest_companies(request):
#     """
#     Get latest registered companies
#     """
#     latest_companies = Company.objects.order_by('-id')[:5]
#     serializer = CompanySerializer(latest_companies, many=True)
    
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, AdminDashboardPermission])
# def admin_dashboard_category_stats(request):
#     """
#     Get job distribution by category
#     """
#     categories = JobCategory.objects.annotate(job_count=Count('job')).order_by('-job_count')
    
#     data = {
#         'labels': [category.name for category in categories],
#         'counts': [category.job_count for category in categories]
#     }
    
#     return Response(data)


# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework import status
# from .models import UserProfile
# from .serializers import UserProfileSerializer

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import UserProfileSerializer
# from .models import UserProfile


# from rest_framework.decorators import api_view, permission_classes, authentication_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication, SessionAuthentication
# from rest_framework.response import Response
# from rest_framework import status
# from .models import UserProfile, CustomUser
# from .serializers import UserProfileSerializer

# @api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
# @authentication_classes([TokenAuthentication, SessionAuthentication])
# @permission_classes([IsAuthenticated])
# def manage_profile(request):
#     """
#     Handle all profile operations for authenticated users:
#     - GET: Retrieve profile
#     - POST: Create profile
#     - PUT/PATCH: Update profile
#     - DELETE: Delete profile
#     """
#     user = request.user
    
#     try:
#         profile = user.user_profile
#         profile_exists = True
#     except UserProfile.DoesNotExist:
#         profile = None
#         profile_exists = False

#     # Handle GET request
#     if request.method == 'GET':
#     if not profile_exists:
#         return Response(
#             {"detail": "Profile not found"}, 
#             status=status.HTTP_404_NOT_FOUND
#         )
#         serializer = UserProfileSerializer(profile)
#         return Response(serializer.data)

#     # Handle POST request (create)
#     elif request.method == 'POST':
#         if profile_exists:
#             return Response(
#             {"detail": "Profile already exists"}, 
#             status=status.HTTP_400_BAD_REQUEST
#         )
        
#         serializer = UserProfileSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Handle PUT/PATCH requests (update)
#     elif request.method in ['PUT', 'PATCH']:
#         if not profile_exists:
#             return Response(
#             {"detail": "Profile not found"}, 
#             status=status.HTTP_404_NOT_FOUND
#         )
            
#         serializer = UserProfileSerializer(
#             profile, 
#             data=request.data, 
#             partial=request.method == 'PATCH'
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Handle DELETE request
#     elif request.method == 'DELETE':
#         if not profile_exists:
#             return Response(
#             {"detail": "Profile not found"}, 
#             status=status.HTTP_404_NOT_FOUND
#         )
#         profile.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    CustomUser,
    AdminProfile,
    CompanyStaffProfile,
    UserProfile,
    Company,
    JobCategory,
    Job,
)
from .serializers import (
    CustomUserSerializer,
    AdminProfileSerializer,
    CompanyStaffProfileSerializer,
    UserProfileSerializer,
    CompanySerializer,
    JobCategorySerializer,
    JobSerializer,
)

# Helper function to get the appropriate profile and serializer based on user role
def get_profile(user):
    """
    Retrieve the user's profile and determine the appropriate serializer class.
    """
    print(f"=== Debugging get_profile ===")
    print(f"User: {user.username} (ID: {user.id}, Role: {user.role})")
    
    # Check if the profile exists
    try:
        profile = UserProfile.objects.get(user=user)
        print(f"Profile found: {profile}")
    except UserProfile.DoesNotExist:
        profile = None
        print("Profile not found")
    
    # Determine the serializer class based on the user's role
    if user.role == "user":
        serializer_class = UserProfileSerializer
        print(f"Serializer class: UserSerializer")
    elif user.role == "admin":
        serializer_class = AdminProfileSerializer
        print(f"Serializer class: AdminSerializer")
    else:
        serializer_class = None  # Fallback case
        print("No serializer class matched")
    
    print(f"Returning profile: {profile}, serializer_class: {serializer_class}")
    return profile, serializer_class

from rest_framework.permissions import IsAuthenticatedOrReadOnly
# Authentication Views
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, AdminProfile, CompanyStaffProfile, UserProfile
from .serializers import CustomUserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user and create a corresponding profile.
    Tokens are not generated during registration.
    """
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Create a profile based on the user's role
        if user.role == CustomUser.ADMIN:
            AdminProfile.objects.create(user=user)
        elif user.role == CustomUser.COMPANY_STAFF:
            CompanyStaffProfile.objects.create(user=user)
        else:
            UserProfile.objects.create(user=user)

        return Response({
            'message': 'User registered successfully.',
            'user': serializer.data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Authenticate a user and return JWT tokens.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': CustomUserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh an access token using a refresh token.
    """
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        refresh = RefreshToken(refresh_token)
        return Response({'access': str(refresh.access_token)})
    except Exception:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


# # Profile Views
# @api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
# @permission_classes([IsAuthenticated])
# def profile(request):
#     """
#     Handle profile creation, retrieval, update, and deletion.
#     """
#     user = request.user
#     profile, serializer_class = get_profile(user)
#     if request.method == 'GET':
#             # Debugging: Print the current user and their role
#             print(f"User attempting to retrieve profile: {user.username}, Role: {user.role}")

#             # Check if a profile exists
#             if not profile:
#                 print(f"Profile not found for user: {user.username}")
#                 return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#             # Debugging: Print the serializer class being used
#             print(f"Using serializer class: {serializer_class.__name__}")

#             # Serialize the profile data
#             serializer = serializer_class(profile)
#             print(f"Serialized profile data: {serializer.data}")

#             # Return the serialized data
#             return Response(serializer.data)

#     elif request.method == 'POST':
#             # Debugging: Print the current user and their role
#             print(f"User attempting to create profile: {user.username}, Role: {user.role}")

#             # Check if a profile already exists
#             if profile:
#                 print(f"Profile already exists for user: {user.username}")
#                 return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)

#             # Debugging: Print the serializer class being used
#             print(f"Using serializer class: {serializer_class.__name__}")

#             # Validate and save the profile data
#             serializer = serializer_class(data=request.data)
#             if serializer.is_valid():
#                 print("Serializer data is valid. Saving profile...")
#                 serializer.save(user=user)
#                 print(f"Profile created successfully for user: {user.username}")
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
            
#             # Debugging: Print serializer errors if validation fails
#             print(f"Serializer errors: {serializer.errors}")
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
     
#     elif request.method in ['PUT', 'PATCH']:
#         if not profile:
#             return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = serializer_class(
#             profile,
#             data=request.data,
#             partial=request.method == 'PATCH'
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         if not profile:
#             return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
#         profile.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    profile, serializer_class = get_profile(user)
    
    
    # Debugging: Print basic info
    print(f"\n=== Profile View ===")
    print(f"User: {user.username} (ID: {user.id}, Role: {user.role})")
    print(f"Request Method: {request.method}")
    print(f"Existing Profile: {'Yes' if profile else 'No'}")
    
    if request.method == 'GET':
        if not profile:
            print("GET: Profile not found")
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = serializer_class(profile)
        print("GET: Profile data:", serializer.data)
        return Response(serializer.data)

    elif request.method == 'POST':
        if profile:
            print("POST: Profile already exists")
            return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        print("POST: Request data:", request.data)
        serializer = serializer_class(data=request.data)
        
        if serializer.is_valid():
            print("POST: Valid data. Saving profile...")
            serializer.save(user=user)
            print("POST: Profile created successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("POST: Validation errors:", serializer.errors)
            return Response({
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    elif request.method in ['PUT', 'PATCH']:
        if not profile:
            print(f"{request.method}: Profile not found")
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        update_data = request.data.copy()
        
        # Remove user field if present as it's not needed for update
        if 'user' in update_data:
            update_data.pop('user')
            
        print(f"{request.method}: Request data:", update_data)
        serializer = serializer_class(
            profile,
            data=update_data,
            partial=True  # Always use partial update to avoid required field errors
        )
        
        if serializer.is_valid():
            print(f"{request.method}: Valid data. Updating profile...")
            serializer.save()
            
            # Include the existing phone number in response
            response_data = serializer.data
            response_data['phone_number'] = user.phone_number
            print(f"{request.method}: Profile updated successfully")
            return Response(response_data)
        else:
            print(f"{request.method}: Validation errors:", serializer.errors)
            return Response({
                'error': 'Invalid update data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'DELETE':
        if not profile:
            print("DELETE: Profile not found")
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        print("DELETE: Deleting profile...")
        profile.delete()
        print("DELETE: Profile deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)
# Company Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_list(request):
    """
    List all companies or create a new company.
    """
    if request.method == 'GET':
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def company_detail(request, pk):
    """
    Retrieve, update, or delete a company.
    """
    try:
        company = Company.objects.get(pk=pk)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CompanySerializer(company)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        if company.created_by != request.user and not request.user.is_superuser:
            return Response({'error': 'Not authorized to edit this company'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CompanySerializer(
            company,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if company.created_by != request.user and not request.user.is_superuser:
            return Response({'error': 'Not authorized to delete this company'}, status=status.HTTP_403_FORBIDDEN)
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Job Category Views
@api_view(['GET'])
@permission_classes([AllowAny])
def job_category_list(request):
    """
    List all job categories.
    """
    categories = JobCategory.objects.all()
    serializer = JobCategorySerializer(categories, many=True)
    return Response(serializer.data)


# Job Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def job_list(request):
    """
    List all jobs or create a new job.
    """
    if request.method == 'GET':
        jobs = Job.objects.all().order_by('-posted_on')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def job_detail(request, pk):
    """
    Retrieve, update, or delete a job.
    """
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        if job.posted_by != request.user and not request.user.is_superuser:
            return Response({'error': 'Not authorized to edit this job'}, status=status.HTTP_403_FORBIDDEN)
        serializer = JobSerializer(
            job,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if job.posted_by != request.user and not request.user.is_superuser:
            return Response({'error': 'Not authorized to delete this job'}, status=status.HTTP_403_FORBIDDEN)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pytesseract
from PIL import Image

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pytesseract
from PIL import Image

class JobListCreateView(APIView):
    def get(self, request):
        # List jobs logic
        return Response({"message": "List of jobs"}, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Create job logic
        return Response({"message": "Job created"}, status=status.HTTP_201_CREATED)

class ExtractTextView(APIView):
    def post(self, request):
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            img = Image.open(request.FILES['file'])
            text = pytesseract.image_to_string(img)
            return Response({"text": text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)