# from django.urls import path,include
# from django.contrib import admin
# from myapp.views import register_view,manage_profile, login_view, job_list, job_detail ,token_refresh,update_job,create_job,delete_job,admin_dashboard_category_stats,company_list,admin_dashboard_latest_companies,company_detail,admin_dashboard_stats,admin_dashboard_recent_jobs,admin_dashboard_latest_users,admin_dashboard_expiring_jobs
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# urlpatterns = [
#     # Authentication
#      path('admin/', admin.site.urls),  # Default Django Admin

#     path('api/register/', register_view, name='register'),
#     path('api/login/', login_view, name='login'),
#     path('api/token/refresh/', token_refresh, name='token_refresh'),

#     # Jobs
#     path('api/jobs/', job_list, name='job_list'),
#     path('api/jobs/<int:pk>/', job_detail, name='job_detail'),
#     path('api/jobs/create/', create_job, name='create_job'),
#     path('api/jobs/<int:pk>/update/', update_job, name='update_job'),
#     path('api/jobs/<int:pk>/delete/', delete_job, name='delete_job'),

#     # Companies
#     path('api/companies/', company_list, name='company_list'),
#     path('api/companies/<int:pk>/', company_detail, name='company_detail'),
    
#     #profile
#      path('api/profile/', manage_profile, name='manage_profile'),  # Without ID (for logged-in user)

#     #admin dashboard
    
#     path('api/admin/dashboard/stats/',admin_dashboard_stats, name='api_admin_dashboard_stats'),
#     path('api/admin/dashboard/recent-jobs/',admin_dashboard_recent_jobs, name='api_admin_dashboard_recent_jobs'),
#     path('api/admin/dashboard/expiring-jobs/', admin_dashboard_expiring_jobs, name='api_admin_dashboard_expiring_jobs'),
#     path('api/admin/dashboard/latest-users/', admin_dashboard_latest_users, name='api_admin_dashboard_latest_users'),
#     path('api/admin/dashboard/latest-companies/', admin_dashboard_latest_companies, name='api_admin_dashboard_latest_companies'),
#     path('api/admin/dashboard/category-stats/',admin_dashboard_category_stats, name='api_admin_dashboard_category_stats'),
  
from django.contrib import admin

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from myapp.views import (
    register,
    login,
    refresh_token,
    profile,
    company_list,
    company_detail,
    job_category_list,
    job_list,
    job_detail,LogoutView,send_email_verification, verify_email_otp
)

urlpatterns = [
    # JWT Authentication Endpoints
        path('custom-admin/', admin.site.urls),  # Change 'custom-admin' to your preferred URL

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Authentication and Registration
    path('api/register/', register, name='register'),
    path('api/login/', login, name='login'),
    path('api/refresh-token/', refresh_token, name='refresh_token'),

    # Profile Management
    path('api/profile/', profile, name='profile'),

    # Company Endpoints
    path('api/companies/', company_list, name='company_list'),
    path('api/companies/<int:pk>/', company_detail, name='company_detail'),

    # Job Category Endpoints
    path('api/job-categories/', job_category_list, name='job_category_list'),

    # Job Endpoints
    path('api/jobs/', job_list, name='job_list'),
    path('api/jobs/<int:pk>/', job_detail, name='job_detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("auth/send-email-otp/", send_email_verification, name="send_email_otp"),
    path("auth/verify-email-otp/", verify_email_otp, name="verify_email_otp"),
    # Basic job CRUD
    
    # OCR endpoint
]
