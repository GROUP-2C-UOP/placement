# Project Setup Instructions - Basit


## Prerequisites

Before you begin, you need to have:
- [Node.js](https://nodejs.org/en/)
- [Python](https://www.python.org/downloads/)


## Project Setup

> **Note:** The following commands are for Windows. The commands for macOS may differ.

### Backend
1. Clone the repository
2. Navigate to backend and start a virtual environment ----> `python -m venv venv & cd backend
3. Activate the virtual environment ----> `.\venv\Scripts\activate
4. Install requirements.txt ----> `pip install -r requirements.txt
5. Set up the database ----> `python manage.py makemigrations & python manage.py migrate
6. Start the backend server ----> `python manage.py runserver

### Frontend
1. Split terminal and start virtaul environment ----> `.\venv\Scripts\activate
2. Change to the frontend and install dependencies ----> `cd ../frontend & npm install
3. Start the frontend server ----> `npm run dev
4. Control + Click the frontend link to access the app.
