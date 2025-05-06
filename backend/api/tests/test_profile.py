from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from api.models import UserVerification
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import os
from django.test.client import encode_multipart, BOUNDARY, MULTIPART_CONTENT
from api.models import CustomUser as User
from api.models import UserPreferences
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

class AuthenticationTests(TestCase):

    def setUp(self):
        self.register_email = "jebok59997@bocapies.com"
        self.auth_user = User.objects.create_user(
            username="loginuser123",
            email=self.register_email,
            password="LoginPassword123"
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.auth_user)

        refresh = RefreshToken.for_user(self.auth_user)
        self.access_token = str(refresh.access_token)

        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

    def test_change_profile_picture_valid(self):
        path_image = './api/tests/profilePictureTest.jpg'

        with open(path_image, 'rb') as img:
            image_file = SimpleUploadedFile(
                name='profilePictureTest.jpg',
                content=img.read(),
                content_type='image/jpeg'
            )

        data = {
            'profile_picture': image_file,
        }

        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertIn(response.status_code, [200])

    def test_change_profile_picture_invalid(self):
        # Create a fake image file
        invalidImage_file = SimpleUploadedFile(
            name='fakeImage.txt',
            content=b'Invalid',
            content_type='text/plain'
        )

        response = self.client.patch('/api/account/update/',
        data={'profile_picture': invalidImage_file},
        **self.auth_headers
        )

        self.assertIn(response.status_code, [400])

    def test_change_name_valid(self):
        data = {
            'first_name': 'NewFirst',
            'last_name': 'NewLast',
        }

        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 200)

        user = User.objects.get(email=self.register_email)
        self.assertEqual(user.first_name, 'NewFirst')
        self.assertEqual(user.last_name, 'NewLast')

    def test_change_name_invalid(self):
        data = {
            'first_name': '',
            'last_name': '101',
        }

        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 400)

    def test_change_email_valid(self):
        new_email = "newemail@example.com"
        data = {
            'email': new_email,
        }
        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 200)
        self.auth_user.refresh_from_db()
        self.assertEqual(self.auth_user.email, new_email)

    def test_change_email_invalid_format(self):
        invalid_email = "invalid-email"
        data = {
            'email': invalid_email,
        }
        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 400) 

    def test_change_email_already_taken(self):
        other_user = User.objects.create_user(
            username="otheruser123",
            email="otheruser@example.com",
            password="Password123"
        )

        data = {
            'email': other_user.email,
        }
        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 400) 

    def test_change_email_empty(self):
        data = {
            'email': '',
        }
        encoded = encode_multipart(BOUNDARY, data)

        response = self.client.generic(
            method='PATCH',
            path='/api/account/update/',
            data=encoded,
            content_type=MULTIPART_CONTENT,
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 400) 

    def test_change_notification_status_valid(self):
        new_status = True
        data = {
            'notification_enabled': new_status,
        }

        response = self.client.patch(
            '/api/account/notification/update/',
            data=json.dumps(data),
            content_type='application/json',
            **self.auth_headers
        )

        self.assertEqual(response.status_code, 200)
        user_preferences = UserPreferences.objects.get(user=self.auth_user)
        self.assertEqual(user_preferences.notification_enabled, new_status)


    def test_change_password_valid(self):
        new_password = "NewPassword123!"

        response = self.client.patch('/api/account/password/update/', {'password': new_password})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.auth_user.refresh_from_db()
        self.assertTrue(self.auth_user.check_password(new_password))

