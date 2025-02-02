# Project Setup Instructions - Basit


## Prerequisites

Before you begin, you need to have:
- [Node.js](https://nodejs.org/en/)
- [Python](https://www.python.org/downloads/)


## Project Setup

> **Note:** The following commands are for Windows. The commands for macOS may differ.

### Backend
1. Clone the repository
2. Navigate to backend and start a virtual environment ----> `python -m venv venv` & `cd backend`
3. Activate the virtual environment ----> `.\venv\Scripts\activate`
4. Install requirements.txt ----> `pip install -r requirements.txt`
5. Set up the database ----> `python manage.py makemigrations` & `python manage.py migrate`
6. Start the backend server ----> `python manage.py runserver`

### Frontend
1. Split terminal and start virtual environment ----> `.\venv\Scripts\activate`
2. Change to the frontend and install dependencies ----> `cd ../frontend` & `npm install`
3. Start the frontend server ----> `npm run dev`
4. Control + Click the frontend link to access the app.


# The Application's Structure 

## Backend

DATABASE - Django has ORM. This lets us define the objects we want in our database and their constraints within models.py without writing explicit SQL.

SERIALISERS - Since the applicaiton switches between Python (Django) and JavaScript (React), serialisers convert data between the two formats automatically.

VIEWS - Functions or classes that handle requests from the frontend. They take in data, process it and send a response back.

URLS (urls.py) - A file that matches the user's URL to trigger the corresponding view 


## Frontend

CONSTANTS.JS - File that defines fixed values that can be reused across the front end. Enforces DRY principle and makes code cleaner.

COMPONENTS - Reusable building blocks for the UI. Components make up the whole page together.

PAGES - Entire pages that are made with components.

STYLES - Hosts all the css styling files for components and pages.

API.JS - Sets up the API (using Axios), handles API requests, and manages authentication with JWTs.

APP.JSX - The main file that structures the application and deines navigation between pages.

MAIN.JSX - Wrapper for our app.






# Flow of App
To help understand how the app works
> **Note:** In this context the user has already registered.

1. User Login:
User enters details into Form Component and clicks login button. Form has method === login and API endpoint of /api/token/ so it will send the data to that endpoint.

2. API Request and Credential Validation:
Urls.py routes this endpoint to the TokenObtainPairView. The TokenObtainPairView uses built in authentication to check if user exists in database and if credentials match. If so, an access and refresh token are returned.

3. The Form component recieves the tokens and checks if the method of the form was login. Since it was it now stores these tokens in localStorage and naviagtes to "/".

4. App.jsx defines that when at "/" the Home page is rendered. The home page is wrapped within a ProtectedRoute component that checks if a user is authenticated with the right tokens before rendering the element wrapped within it. The tokens are valid so the home page is rendered and the user is logged in.
