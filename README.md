# SaveYourMoments

SaveYourMoments is a web application that allows users to upload their cherished photos, which are then captioned using Large Language Models (LLMs) and advanced Computer Vision techniques. The app provides a meaningful and engaging description of each uploaded moment.

## Getting Started

### Backend Setup

1. **Create a Virtual Environment**

   Navigate to the `Backend` directory and create a virtual environment:
   Use python 3.12 (Recommended)

   ```bash
   python -m venv env
   ```

   Activate the virtual environment:

   - On Windows:
     ```bash
     .\env\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source env/bin/activate
     ```

2. **Install Required Packages**

   Install the dependencies listed in `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

3. **Download Required Models and Files**

   Run the following scripts to download necessary models and category files:

   ```bash
   python download_places_model.py
   python download_categories_file.py
   ```

4. **Set MySQL Connection Credentials**

   Open `settings.py` and set your MySQL database credentials:

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'your_db_name',
           'USER': 'your_db_user',
           'PASSWORD': 'your_db_password',
           'HOST': 'localhost',  # Or your database host
           'PORT': '3306',       # Or your database port
       }
   }
   ```

   Replace `your_db_name`, `your_db_user`, and `your_db_password` with your actual MySQL database details.

5. **Replace OpenAI API Key**

   In `image_analysis_pipeline.py`, replace the placeholder `self.gpt4_api_key` with your actual OpenAI API key:

   ```python
   self.gpt4_api_key = "your_actual_openai_api_key"
   ```

6. **Apply Migrations**

   Run the following commands to apply migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Start Django Development Server**

   Run the server:

   ```bash
   python manage.py runserver
   ```

8. **Start Redis Server**

   Start Redis to handle background tasks:

   ```bash
   redis-server
   ```

9. **Start Celery Worker**

   Run Celery with solo mode to handle asynchronous tasks:

   ```bash
   celery -A SaveYourMoments worker --pool=solo
   ```

### Frontend Setup

1. **Install Node.js and npm**

   Ensure you have Node.js and npm installed. If not, download and install them from [Node.js official website](https://nodejs.org/).

2. **Install Frontend Dependencies**

   Navigate to the `save_your_moments` directory and install the necessary npm packages:

   ```bash
   npm install
   ```

3. **Run the Frontend**

   Start the frontend development server:

   ```bash
   npm run start
   ```

   The frontend will typically be served on `http://localhost:3000`.

## Additional Notes

- Ensure all backend services are running (Django server, Redis, and Celery worker) to fully utilize the application's functionality.
- Replace placeholders like the OpenAI API key and database credentials with your actual details.

## Credits

This project was developed by **Raghad Al Hossny** and **Mohamed Al Balkhi**, students of the Software Engineering college at Syrian Private University (SPU). This application was created as a project for the Computer Vision Course.
