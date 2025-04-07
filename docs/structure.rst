Project Structure
==================================

Backend
-------

**DATABASE**

Django has ORM. This lets us define the objects we want in our database and their constraints within `models.py` without writing explicit SQL.

**SERIALISERS**

Since the application switches between Python (Django) and JavaScript (React), serialisers convert data between the two formats automatically.

**VIEWS**

Functions or classes that handle requests from the frontend. They take in data, process it and send a response back.

**URLS (urls.py)**

A file that matches the user's URL to trigger the corresponding view.

Frontend
--------

**CONSTANTS.JS**

File that defines fixed values that can be reused across the front end. Enforces the DRY principle and makes code cleaner.

**COMPONENTS**

Reusable building blocks for the UI. Components make up the whole page together.

**PAGES**

Entire pages that are made with components.

**STYLES**

Hosts all the CSS styling files for components and pages.

**API.JS**

Sets up the API (using Axios), handles API requests, and manages authentication with JWTs.

**APP.JSX**

The main file that structures the application and defines navigation between pages.

**MAIN.JSX**

Wrapper for our app.

Redis & Celery
-------

**CELERY.PY**

Initialises the Celery app -- taken from the official Celery documentation.

**TASKS.PY**

Contains all functions that define Celery tasks. Tasks are then registered and configured via Settings.py.

**Redis Port**

Acts as a message broker between Django & Celery. Tasks are queued and sent to Redis to store. Celery workers pull the tasks from Redis and excute them.


Flow of App
-----------

An example to help understand how the app works:

**Note:** In this context, the user has already registered.

**User Login:**
User enters details into the Form Component and clicks the login button. The form has method `login` and API endpoint of `/api/token/`, so it will send the data to that endpoint.

**API Request and Credential Validation:**
`urls.py` routes this endpoint to the `TokenObtainPairView`. The `TokenObtainPairView` uses built-in authentication to check if the user exists in the database and if credentials match. If so, an access and refresh token are returned.

**Receiving and Storing Tokens:**
The Form component receives the tokens and checks if the method of the form was login. Since it was, it now stores these tokens in `localStorage` and navigates to `/`.

**Navigation and Protected Route:**
`App.jsx` defines that when at `/`, the Home page is rendered. The home page is wrapped within a `ProtectedRoute` component that checks if a user is authenticated with the right tokens before rendering the element wrapped within it. The tokens are valid, so the home page is rendered and the user is logged in.