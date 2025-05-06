from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from api.models import UserVerification
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
import json
import uuid

User = get_user_model()

class AuthenticationTests(TestCase):

    def setUp(self):
        # Use different emails for register vs login
        self.register_email = f"register_{uuid.uuid4().hex}@bocapies.com" #Must Change after every test run
        self.login_email = f"login_{uuid.uuid4().hex}@firain.com" #Must be independent from register email
        self.verification_code = "12345"

        # Create user for login test only
        User.objects.create_user(
            username="loginuser123",
            email=self.login_email,
            password="LoginPassword123"
        )

############################ LOGIN ##############################

    def test_login_valid_user(self):
        response = self.client.post(reverse('token_obtain_pair'), {
            'email': self.login_email,
            'password': 'LoginPassword123',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())


    def test_login_invalid_password(self):
            response = self.client.post(reverse('token_obtain_pair'), {
                'email': self.login_email,
                'password': 'InvalidPassword',
            }, content_type='application/json')
            self.assertEqual(response.status_code, 401)
            self.assertIn('detail', response.json())


    def test_login_empty_fields(self):
            response = self.client.post(reverse('token_obtain_pair'), {
                'email': '',
                'password': '',
            }, content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertIn('email', response.json())
            self.assertIn('password', response.json())


    def test_login_invalid_email(self):
            response = self.client.post(reverse('token_obtain_pair'), {
                'email': 'invalidEmail',
                'password': 'ILOVEYOUBASIT2',
            }, content_type='application/json')
            self.assertEqual(response.status_code, 401)
            self.assertIn('detail', response.json())


    def test_login_nonRegistered_user(self):
            response = self.client.post(reverse('token_obtain_pair'), {
                'email': 'userEmail@example.com',
                'password': 'LoginPassword123',
            }, content_type='application/json')
            self.assertEqual(response.status_code, 401) # 200 previous
            self.assertIn('detail', response.json())
