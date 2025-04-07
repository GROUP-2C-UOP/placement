Introduction
=========================

Purpose
----------
This app was created as part of a coursework assignment for the Software Engineering Theory and Practice module.

Motivation
----------
As students all of us were aiming to land placements. We identified that there was no sufficient answer to Placement Tracking that had all the features we wanted. As a result, we created a Placement Tracking app that helps students manage their placement applications.

Features: 
-----------
- Add & Edit Placements
- Track Deadline and Statuses
- To-Do List of Placements
- See All Placements In One Dashboard
- Save Associated CVs and Cover Letters to the Placement
- Recieve In-App and Email Notifications for Deadlines

Tech Stack:
------------

Frontend
~~~~~~~~
- **React** - for building an interactive and responsive user interface
- **Axios** - for handling API requests

Backend
~~~~~~~~
- **Django** - for server-side logic and RESTful API creation
- **Django REST Framework** - to simplify API development

Database
~~~~~~~~~
- **DBSqlite** - the default with a Django Backend

Asynchronous Task Queue
~~~~~~~~~~~~~~~~~~~~~~~~~
- **Celery** - for handling background tasks like sending emails
- **Redis** - as the message broker for Celery

Other Tools
~~~~~~~~~~~~
- **Git & GitHub** - for version control and collaboration