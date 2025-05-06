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
        # self.user = UserVerification.objects.create(
        UserVerification.objects.create(
            email=self.register_email,
            code=self.verification_code,
            created_at=timezone.now(),
            valid_until=timezone.now() + timedelta(minutes=5)
        )

        # Create user for login test only
        #User.objects.create_user(
        self.user = User.objects.create_user(
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

###################CREATE TOD0#######################################


    def test_create_todo(self):
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        cover_letter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake Cover Letter", content_type="application/pdf")

        form_data = {
            'company': 'Lockheed',
            'role': 'Software Engineer',
            'salary': '30000',
            'starting_date': '2025-09-03',
            'duration': '12',
            'next_stage_deadline': '2025-06-02',
            'placement_link': 'https://youtube.com',
            'cv': cv_file,
            'cover_letter': cover_letter_file,
            'description': ''
        }
    
        response = self.client.post('/api/todos/', form_data, **self.auth_headers)
        self.assertEqual(response.status_code, 201)
        
        # Check its the correct information
        response_data = response.json()
        self.assertEqual(response_data['company'], 'Lockheed')
        self.assertEqual(response_data['role'], 'Software Engineer')

    
    def test_todo_invalidURL(self):
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        cover_letter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake Cover Letter", content_type="application/pdf")

        form_data = {
            'company': 'Lockheed',
            'role': 'Software Engineer',
            'salary': '30000',
            'starting_date': '2025-09-03',
            'duration': '12',
            'next_stage_deadline': '2025-06-02',
            'placement_link': 'InvalidURL',
            'cv': cv_file,
            'cover_letter': cover_letter_file,
            'description': ''
        }
    
        response = self.client.post('/api/todos/', form_data, **self.auth_headers)
        self.assertEqual(response.status_code, 400)
        
        response_data = response.json()
        self.assertIn('placement_link', response_data)
        self.assertEqual(response_data['placement_link'][0], 'Enter a valid URL.')
    

    def test_toDo_pastDeadline(self):
        cv_file = SimpleUploadedFile("cv.pdf", b"Fake CV Content", content_type="application/pdf")
        coverLetter_file = SimpleUploadedFile("coverLetter.pdf", b"Fake CV Content", content_type="application/pdf")
        form_data = {
            'company': 'Lockheed',
            'role': 'Software Engineer',
            'salary': '30000',
            'starting_date': '2025-09-03',
            'duration': '12',
            'next_stage_deadline': '2023-06-05',
            'placement_link': 'https://youtube.com',
            'cv': cv_file,
            'cover_letter': coverLetter_file,
            'description': ''
        }
        response = self.client.post('/api/todos/', form_data, **self.auth_headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['next_stage_deadline'], '2023-06-05')


    def test_toDo_emptyFields(self):
        form_data = {
            'company': '',
            'role': '',
            'salary': '',
            'starting_date': '',
            'duration': '',
            'next_stage_deadline': '',
            'placement_link': '',
            'cv': '',
            'cover_letter': '',
            'description': ''
        }
        response = self.client.post('/api/placements/', form_data, **self.auth_headers)
        self.assertEqual(response.status_code, 400)

        errors = response.json()

        expected_errors = {
            'company': 'This field may not be blank.',
            'role': 'This field may not be blank.',
            'date_applied': 'This field is required.' 
        }

        for field, expected_message in expected_errors.items():
            self.assertIn(field, errors, msg=f"Missing error for field: {field}")
            self.assertTrue(
                any(expected_message in msg for msg in errors[field]),
                msg=f"Expected error containing '{expected_message}' for field: {field}, got: {errors[field]}"
            )

##################UPDATE TOD0##########################################


    def test_update_todo_valid(self):
        # ToDo to update
        response = self.client.post('/api/todos/', {
            "company": "Apple",
            "role": "Intern",
            "deadline": "2025-06-02",
            "salary": "20000",
            "duration": "10",
            "starting_date": "2025-09-02",
            "application_link": "https://youtube.com",
            "date_applied": "2025-05-06"
        }, **self.auth_headers)

        self.assertEqual(response.status_code, 201)
        todo_id = response.data['id']
       
        # Update the ToDo with new valid data
        update_response = self.client.patch(f'/api/todos/update/{todo_id}/', {
            "company": "Apple Updated",
            "role": "Software Engineer",
            "deadline": "2025-06-03",
            "salary": "22000",
            "duration": "12",
            "starting_date": "2025-09-03",
            "application_link": "https://youtube.com",
            "date_applied": "2025-05-06"
        }, content_type='application/json', **self.auth_headers)
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.data["company"], "Apple Updated")
        self.assertEqual(update_response.data["role"], "Software Engineer")
        self.assertEqual(int(update_response.data["duration"]), 12)

################### DELETE TOD0 ###################################

    def test_delete_todo(self):
        # ToDo to update
        response = self.client.post('/api/todos/', {
            "company": "Apple",
            "role": "Intern",
            "deadline": "2025-06-02",
            "salary": "20000",
            "duration": "10",
            "starting_date": "2025-09-02",
            "application_link": "https://youtube.com",
            "date_applied": "2025-05-06"
        }, **self.auth_headers)

        self.assertEqual(response.status_code, 201)
        todo_id = response.data['id']

        delete_response = self.client.delete(f'/api/todos/delete/{todo_id}/', **self.auth_headers)
        self.assertEqual(delete_response.status_code, 204)