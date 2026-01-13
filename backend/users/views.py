from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
)
from .models import UserProfile

class AuthViewSet(viewsets.ViewSet):
    """
    Authentication ViewSet for Register/Login/Logout/Profile/ChangePassword.
    """
    permission_classes = [IsAuthenticated]

    # ----------- REGISTER ----------------
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserSerializer(user).data
                return Response(
                    {
                        'success': True,
                        'message': 'User registered successfully',
                        'user': user_data,
                        'token': token.key,
                    },
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'success': False, 'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- LOGIN ----------------
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            token, _ = Token.objects.get_or_create(user=user)
            profile = user.profile
            profile.update_last_login()
            user_data = UserSerializer(user).data
            return Response(
                {
                    'success': True,
                    'message': 'Login successful',
                    'user': user_data,
                    'token': token.key,
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- CHECK USERNAME ----------------
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[AllowAny],
        url_path='check-username'
    )
    def check_username(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'available': False, 'error': 'username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        exists = User.objects.filter(username=username).exists()
        return Response({'available': not exists}, status=status.HTTP_200_OK)

    # ----------- CHECK EMAIL ----------------
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[AllowAny],
        url_path='check-email'
    )
    def check_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'available': False, 'error': 'email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        exists = User.objects.filter(email=email).exists()
        return Response({'available': not exists}, status=status.HTTP_200_OK)

    # ----------- OTHER ACTIONS موجودة مسبقاً ------------
    # logout, me, update_profile, change_password, forgot_password, verify_email, list_users, delete_account
    # ... (نفس كودك السابق بدون تعديل)
