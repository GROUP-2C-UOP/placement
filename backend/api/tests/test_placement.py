from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from api.models import UserVerification
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
import json


User = get_user_model()

class AuthenticationTests(TestCase):

    def setUp(self):
        # Use different emails for register vs login
        self.register_email = "jebok59997@bocapies.com" #Must Change after every test run
        self.login_email = "nehike39991@firain.com" #Must be independent from register email
        self.verification_code = "12345"

        # Verification code for registration
        self.user = UserVerification.objects.create(
            email=self.register_email,
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

###################CREATE PLACEMENT#########################

    def test_create_placement(self):
            cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
            coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")
            response = self.client.post('/api/placements/', {
                'company': 'Apple',
                'role': 'Intern',
                'salary': '20000',
                'starting_date': '2025-09-06',
                'duration': '5',
                'next_stage_deadline': '2025-06-05',
                'placement_link': 'https://www.youtube.com/',
                'date_applied': '2025-04-02',
                'status': 'applied',
                'contact': '07566688344',
                'cv': cv_file,
                'cover_letter': coverLetter_file,
                'description': ''
            }, 
            **self.auth_headers
        )
            self.assertEqual(response.status_code, 201)
            self.assertIn('id', response.json())

    def test_create_placement_invalidURL(self):
                cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
                coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")
                response = self.client.post('/api/placements/', {
                    'company': 'Apple',
                    'role': 'Intern',
                    'salary': '20000',
                    'starting_date': '2025-09-03',
                    'duration': '5',
                    'next_stage_deadline': '2025-06-04',
                    'placement_link': 'youtube',
                    'date_applied': '2025-04-03',
                    'status': 'applied',
                    'contact': '07566688344',
                    'cv': cv_file,
                    'cover_letter': coverLetter_file,
                    'description': ''
                }, 
            **self.auth_headers
        )
                self.assertEqual(response.status_code, 400)
                self.assertIn('placement_link', response.json())

    def test_create_placement_invalidSalary(self):
                cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
                coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")
                response = self.client.post('/api/placements/', {
                    'company': 'Apple',
                    'role': 'Intern',
                    'salary': 'Money',
                    'starting_date': '2025-09-06',
                    'duration': '5',
                    'next_stage_deadline': '2025-06-05',
                    'placement_link': 'https://www.youtube.com/',
                    'date_applied': '2025-04-02',
                    'status': 'applied',
                    'contact': '07566688344',
                    'cv': cv_file,
                    'cover_letter': coverLetter_file,
                    'description': ''
                }, 
                **self.auth_headers
            )
                self.assertEqual(response.status_code, 400)
                self.assertIn('salary', response.json())


    def test_create_placement_pastDeadline(self):
            cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
            coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")
            response = self.client.post('/api/placements/', {
                'company': 'Apple',
                'role': 'Intern',
                'salary': '20000',
                'starting_date': '2025-09-06',
                'duration': '5',
                'next_stage_deadline': '2023-06-05',
                'placement_link': 'https://www.youtube.com/',
                'date_applied': '2025-04-02',
                'status': 'applied',
                'contact': '07566688344',
                'cv': cv_file,
                'cover_letter': coverLetter_file,
                'description': ''
            }, 
            **self.auth_headers
        )
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json()['next_stage_deadline'], '2023-06-05')

    def test_create_placement_emptyFields(self):
        payload = {
            'company': '',
            'role': '',
            'salary': '',
            'starting_date': '',
            'duration': '',
            'next_stage_deadline': '',
            'placement_link': '',
            'date_applied': '',
            'status': '',
            'contact': '',
            'cv': '',
            'cover_letter': '',
            'description': ''
        }

        response = self.client.post('/api/placements/', payload, **self.auth_headers)
        self.assertEqual(response.status_code, 400)

        errors = response.json()

        expected_errors = {
            'company': 'This field may not be blank.',
            'role': 'This field may not be blank.',
            'date_applied': 'Date has wrong format'  # Partial match for format error
        }

        for field, expected_message in expected_errors.items():
            self.assertIn(field, errors, msg=f"Missing error for field: {field}")
            self.assertTrue(
                any(expected_message in msg for msg in errors[field]),
                msg=f"Expected error containing '{expected_message}' for field: {field}, got: {errors[field]}"
            )

#########################UPDATE PLACEMENT###############################

    def test_update_placement_status_rejected(self):
        #Create a placement to test
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")

        create_response = self.client.post('/api/placements/', {
            'company': 'Netflix',
            'role': 'Intern',
            'salary': '30000',
            'starting_date': '2025-09-10',
            'duration': '6',
            'next_stage_deadline': '2025-06-01',
            'placement_link': 'https://netflix.com/careers',
            'date_applied': '2025-04-01',
            'status': 'applied',
            'contact': '01234567890',
            'cv': cv_file,
            'cover_letter': coverLetter_file,
            'description': ''
        }, **self.auth_headers)

        self.assertEqual(create_response.status_code, 201)
        placement_id = create_response.json()['id']

        # Update status
        update_response = self.client.patch(
            f'/api/placements/update/{placement_id}/',
            data=json.dumps({'status': 'rejected'}),
            content_type='application/json',
            **self.auth_headers
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()['status'], 'rejected')

    def test_update_placement_status_accepted(self):
        #Create a placement to test
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")

        create_response = self.client.post('/api/placements/', {
            'company': 'Netflix',
            'role': 'Intern',
            'salary': '30000',
            'starting_date': '2025-09-10',
            'duration': '6',
            'next_stage_deadline': '2025-06-01',
            'placement_link': 'https://netflix.com/careers',
            'date_applied': '2025-04-01',
            'status': 'applied',
            'contact': '01234567890',
            'cv': cv_file,
            'cover_letter': coverLetter_file,
            'description': ''
        }, **self.auth_headers)

        self.assertEqual(create_response.status_code, 201)
        placement_id = create_response.json()['id']

        # Update status
        update_response = self.client.patch(
            f'/api/placements/update/{placement_id}/',
            data=json.dumps({'status': 'offer_made'}),
            content_type='application/json',
            **self.auth_headers
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()['status'], 'offer_made')

#######################DELETE PLACEMENT###################################


    def test_delete_placement(self):
        # Create a placement to delete
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")

        create_response = self.client.post('/api/placements/', {
            'company': 'Netflix',
            'role': 'Intern',
            'salary': '30000',
            'starting_date': '2025-09-10',
            'duration': '6',
            'next_stage_deadline': '2025-06-01',
            'placement_link': 'https://netflix.com/careers',
            'date_applied': '2025-04-01',
            'status': 'applied',
            'contact': '01234567890',
            'cv': cv_file,
            'cover_letter': coverLetter_file,
            'description': ''
        }, **self.auth_headers)

        self.assertEqual(create_response.status_code, 201)
        placement_id = create_response.json()['id']

        # Delete placement
        delete_response = self.client.delete(
            f'/api/placements/delete/{placement_id}/',
            **self.auth_headers
        )

        self.assertEqual(delete_response.status_code, 204)

        # Verify deletion
        get_response = self.client.get(
            f'/api/placements/{placement_id}/',
            **self.auth_headers
        )

        self.assertEqual(get_response.status_code, 404)