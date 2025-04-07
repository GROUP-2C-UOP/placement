Project Setup
==================================

Prerequisites
-------------

Before you begin, you need to have:

- `Node.js <https://nodejs.org/en/>`_
- `Python <https://www.python.org/downloads/>`_
- `Redis <https://www.youtube.com/watch?v=DLKzd3bvgt8>`_ *(Follow tutorial for instillation)*

Project Setup
-------------

**Note:** The following commands are for Windows. The commands for macOS may differ.

Backend
^^^^^^^

1. Clone the repository
2. Navigate to backend and start a virtual environment:

   ::

     python -m venv venv
     cd backend

3. Activate the virtual environment:

   ::

     .\venv\Scripts\activate

4. Install requirements:

   ::

     pip install -r requirements.txt

5. Set up the database:

   ::

     python manage.py makemigrations
     python manage.py migrate

6. Start the backend server:

   ::

     python manage.py runserver

7. Create a `.env-backend` file in the main backend folder (where `requirements.txt` is)

8. Add the following lines to `.env-backend`:

   ::

     EMAIL_HOST_USER="your-email"
     EMAIL_HOST_PASSWORD="app-password"
     SECRET-KEY=your-generated-secret-key

   - **Note:** DO NOT use your actual Gmail password.
   - Enable 2FA in Gmail, go to *App Passwords*, generate one, and use the 16-character string.

9. To generate a secret key, run the following Python script:

   ::

     import secrets
     print(secrets.token_urlsafe(50))

Frontend
^^^^^^^^

1. Split the terminal and activate the virtual environment again:

   ::

     .\venv\Scripts\activate

2. Change to the frontend directory and install dependencies:

   ::

     cd ../frontend
     npm install

3. Start the frontend server:

   ::

     npm run dev

4. Use **Ctrl + Click** on the frontend link to access the app.

Redis
^^^^^

1. Open the Redis folder installed from the YouTube tutorial and run `redis-server.exe`

2. If your port is not `6379`, update it as indicated in the command terminal.

3. Split the terminal again and activate the virtual environment:

   ::

     .\venv\Scripts\activate

4. Make sure you're in ``\placement\backend`` and run the celery worker:

   ::

     celery -A backend worker --loglevel=info --pool=solo

5. Split the terminal again (you should have 4 terminals open now), activate the virtual environment:

   ::

     .\venv\Scripts\activate

6. Still in ``\placement\backend``, run the celery beat:

   ::

     celery -A backend beat --loglevel=info
