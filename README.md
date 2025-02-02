# Project Setup Instructions - Basit


## Prerequisites

Before you begin, you need to have:
- [Node.js](https://nodejs.org/en/)
- [Python](https://www.python.org/downloads/)


## Project Setup

### Backend
1. Clone the repository
2. Navigate to backend and start a virtual environment ----> ``cd backend`` & ``python -m venv venv``
3. Activate the virtual environment ----> ``.\venv\Scripts\activate``
4. Install requirements.txt ----> ``pip install -r requirements.txt``
5. Set up the database ----> ``python manage.py makemigrations`` & ``python manage.py migrate``
6. Start the backend server ----> ``python manage.py runserver``

### Frontend
1. Change to the frontend and install dependencies ----> ``cd ../frontend`` & ``npm install``
2. Start the frontend server ----> ``npm run dev``
3. Control + Click the frontend link to access the app.




