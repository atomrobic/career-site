# # from rest_framework import serializers
# # from django.contrib.auth import get_user_model
# # from .models import Company, Job,UserProfile
# # User = get_user_model()


# # class CustomUserSerializer(serializers.ModelSerializer):
# #     password1 = serializers.CharField(write_only=True, required=True)
# #     password2 = serializers.CharField(write_only=True, required=True)

# #     class Meta:
# #         model = User
# #         fields = ["id", "username", "email", "phone_number", "password1", "password2"]
# #         extra_kwargs = {"password1": {"write_only": True}, "password2": {"write_only": True}}

# #     def validate(self, data):
# #         """Validate that passwords match and check for existing users."""
# #         if data["password1"] != data["password2"]:
# #             raise serializers.ValidationError({"password": "Passwords do not match"})

# #         if User.objects.filter(username=data["username"]).exists():
# #             raise serializers.ValidationError({"username": "Username already exists"})

# #         if User.objects.filter(email=data["email"]).exists():
# #             raise serializers.ValidationError({"email": "Email already exists"})

# #         if User.objects.filter(phone_number=data["phone_number"]).exists():
# #             raise serializers.ValidationError({"phone_number": "Phone number already registered"})

# #         return data

# #     def create(self, validated_data):
# #         """Create a user and hash the password."""
# #         validated_data.pop("password2")  # Remove password2 as it's not needed
# #         password = validated_data.pop("password1")
# #         user = User(**validated_data)
# #         user.set_password(password)  # Hash password before saving
# #         user.save()
# #         return user


# # class CompanySerializer(serializers.ModelSerializer):
# #     created_by = CustomUserSerializer(read_only=True)  # Display created_by details

# #     class Meta:
# #         model = Company
# #         fields = [
# #             "id",
# #             "name",
# #             "website",
# #             "location",
# #             "email",
# #             "description",
# #             "created_by",
# #         ]

# # # Job Serializer
# # class JobSerializer(serializers.ModelSerializer):
# #     company_name = serializers.ReadOnlyField(source="company.name")

# #     class Meta:
# #         model = Job
# #         fields = [
# #             "id", "title", "company", "company_name", "category", "description",
# #             "location", "salary", "posted_on", "application_deadline" ,
# #         ]




# # from rest_framework import serializers
# # from .models import UserProfile

# # class UserProfileSerializer(serializers.ModelSerializer):
# #     email = serializers.EmailField(source='user.email', read_only=True)
# #     username = serializers.CharField(source='user.username', read_only=True)
# #     phone_number = serializers.CharField(source='user.phone_number', required=False)
# #     profile_picture = serializers.ImageField(source='user.profile_picture', required=False)

# #     class Meta:
# #         model = UserProfile
# #         fields = [
# #             'id', 'email', 'username', 'phone_number', 'profile_picture',
# #             'education', 'skills', 'experience', 'personal_info'
# #         ]
# #         read_only_fields = ['id']

# #     def update(self, instance, validated_data):
# #         # Handle nested user data updates
# #         user_data = validated_data.pop('user', {})
# #         user = instance.user
        
# #         for attr, value in user_data.items():
# #             setattr(user, attr, value)
# #         user.save()
        
# #         # Update profile fields
# #         return super().update(instance, validated_data)

# from rest_framework import serializers
# from .models import (
#     CustomUser, 
#     UserProfile, 
#     CompanyStaffProfile, 
#     AdminProfile,
#     Company,
#     Job,
#     JobCategory
# )

# class CustomUserSerializer(serializers.ModelSerializer):
#     role_display = serializers.CharField(source='get_role_display', read_only=True)
    
#     class Meta:
#         model = CustomUser
#         fields = [
#             'id', 'username', 'email', 'phone_number', 
#             'role', 'role_display', 'profile_picture'
#         ]
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'role': {'required': True}
#         }

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data['role'],
#             phone_number=validated_data.get('phone_number', '')
#         )
#         return user

# class UserProfileSerializer(serializers.ModelSerializer):
#     user = CustomUserSerializer(read_only=True)
    
#     class Meta:
#         model = UserProfile
#         fields = '__all__'

# class CompanyStaffProfileSerializer(serializers.ModelSerializer):
#     user = CustomUserSerializer(read_only=True)
    
#     class Meta:
#         model = CompanyStaffProfile
#         fields = '__all__'

# class AdminProfileSerializer(serializers.ModelSerializer):
#     user = CustomUserSerializer(read_only=True)
    
#     class Meta:
#         model = AdminProfile
#         fields = '__all__'

# class CompanySerializer(serializers.ModelSerializer):
#     created_by = CustomUserSerializer(read_only=True)
    
#     class Meta:
#         model = Company
#         fields = '__all__'

# class JobCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = JobCategory
#         fields = '__all__'

# class JobSerializer(serializers.ModelSerializer):
#     company = CompanySerializer(read_only=True)
#     category = JobCategorySerializer(read_only=True)
#     posted_by = CustomUserSerializer(read_only=True)
    
#     class Meta:
#         model = Job
#         fields = '__all__'


from rest_framework import serializers
from .models import (
    CustomUser,
    AdminProfile,
    CompanyStaffProfile,
    UserProfile,
    Company,
    JobCategory,
    Job,
)

# ... existing imports ...

# Serializer for UserProfile
class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'password1',
            'password2',
            'phone_number',
            'role',
        ]
        extra_kwargs = {
            'password1': {'write_only': True},
            'password2': {'write_only': True},
        }

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
# Serializer for AdminProfile
class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = '__all__'


# Serializer for CompanyStaffProfile
class CompanyStaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyStaffProfile
        fields = '__all__'


# Serializer for UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    phone_number = serializers.CharField(source='user.phone_number')
    email = serializers.CharField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone_number', 'email', 'username', 'education', 'skills', 'experience', 'personal_info']

    def update(self, instance, validated_data):
        # Handle phone number update
        if 'user' in validated_data and 'phone_number' in validated_data['user']:
            instance.user.phone_number = validated_data['user']['phone_number']
            instance.user.save()

        # Update other fields
        instance.education = validated_data.get('education', instance.education)
        instance.skills = validated_data.get('skills', instance.skills)
        instance.experience = validated_data.get('experience', instance.experience)
        instance.personal_info = validated_data.get('personal_info', instance.personal_info)
        instance.save()
        return instance
# Serializer for Company
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['created_by']  # Ensure created_by is not editable

    def create(self, validated_data):
        # Automatically set the `created_by` field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


# Serializer for JobCategory
class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = '__all__'


# Serializer for Job
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['posted_by']  # Ensure posted_by is not editable

    def create(self, validated_data):
        # Automatically set the `posted_by` field to the current user
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)
    
    

