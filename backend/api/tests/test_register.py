from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from api.models import UserVerification
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import uuid


User = get_user_model()

class AuthenticationTests(TestCase):

    def setUp(self):
        # Use different emails for register vs login
        self.register_email = f"register_{uuid.uuid4().hex}@bocapies.com" #Must Change after every test run
        self.unique_email = f"unique_{uuid.uuid4().hex}@firain.com" #Must be independent from register email
        self.verification_code = "12345"

        # Verification code for registration
        self.user = UserVerification.objects.create(
            email=self.unique_email,
            code=self.verification_code,
            created_at=timezone.now(),
            valid_until=timezone.now() + timedelta(minutes=5)
        )

        # Create user for login test only
        User.objects.create_user(
            username="loginuser123",
            email=self.register_email,
            password="LoginPassword123"
        )

        # Generate JWT token for authenticated requests
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)


        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.access_token}'
        }

####################REGISTER##############################

    def test_register_valid_user(self):
        response = self.client.post("/api/user/register/", {
            "email": self.unique_email,
            "password": "TestPassword123",
            "first_name": "Declan",
            "last_name": "Mannion",
            "verification_code": self.verification_code
        }, content_type="application/json")
        self.assertEqual(response.status_code, 201)

    def test_register_empty_fields(self):
        response = self.client.post('/api/user/register/', {}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.json())
        self.assertEqual(response.json()['detail'], 'Email and verification code are required.')

    def test_register_invalid_email(self):
        response = self.client.post('/api/user/register/', {
            'email': 'invalidemail',
            'password': 'Password123',
            'verification_code': '123456',
            'first_name': 'Declan',
            'last_name': 'Mannion',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.json())
        self.assertEqual(response.json()['detail'], 'Invalid email or verification code.')

    def test_register_existing_email(self):
        # This email is pre-registered for login
        response = self.client.post('/api/user/register/', {
            'email': self.register_email,
            'password': 'AnotherPassword123',
            'verification_code': '123456',
            'first_name': 'Declan',
            'last_name': 'Mannion',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.json())
        self.assertEqual(response.json()['detail'], 'Email already in use.')
