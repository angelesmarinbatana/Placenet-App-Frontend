**ENSURE ALL DEPENDENCIES FROM [DEVELOPMENT.MD](/Development.md) ARE INSTALLED AS WELL AS THE BACKEND DEPENDENCIES**

PGAdmin is also highly recommended for those not familiar with PostgreSQL

## Deploying

1. Clone the frontend using: 

   > git clone https://github.com/angelesmarin/Placenet-App-Frontend.git

2. Clone the backend into a different directory with:

    > git clone https://github.com/angelesmarin/Placenet-App-Backend.git 

3. Create a PostgreSQL database:

    - Name it "placenet"

    - Enter the following SQL to set up the proper tables and collumns:
    
    >  CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    > CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    > CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    > CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    Or just use PGAdmin and create the tables following the specs in the above SQL.

4. In the project folder of the backend, create a file called ".env" and put the following in it:
    > DB_NAME=placenet

    > DB_USER=postgres

    > DB_PASSWORD=yourpasswordhere

    > DB_HOST=127.0.0.1

    > DB_PORT=5432

    > PORT=3000

    **THIS FILE IS REQUIRED OR THE PROJECT WILL NOT FUNCTION**

5. Connect to the database with:

    > psql -U postgres -d placenet

    Enter your postgres password when prompted.

6. Start the backend by running the following while cd'd into the backend directory:

    > node startServer.js backend

7. Start the frontend by running the following while cd'd into the frontend directory:

    > npx expo start

**THE DATABASE, BACKEND, AND FRONTEND MUST ALL BE OPERATIONAL**

8. Use SQL to insert a user with username and password columns specified, or use Insomnia to do so with a POST request using http://localhost:3000/api/users and some json as the body that looks like this:

    >  {"username": "usernamehere","password_hash": "passwordhere"}

9. Navigate to the [api.js script](..\API\api.js) and change the IP in the baseURL property to your own IP.

10. Upon opening the frontend, you should now be able to log in with the parameters specified in your request from step 8 and use the app.

11. To stop the processes, simply press Ctrl/Cmd + C in all the command windows, or just close the windows.

## Potential Errors

If you find that you cannot log in to the app using the user profile created in step 8, do the following:

1. Double check your spelling. The username and password is case sensitive.
2. Ensure the password column in the database is called "password_hash" and not just "password".
3. Double check that the IP in the [api.js script](..\API\api.js) is your own IP.

Insomnia can also be used to ensure the database itself is operational.