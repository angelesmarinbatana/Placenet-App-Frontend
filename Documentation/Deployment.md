**ENSURE ALL DEPENDENCIES FROM [DEVELOPMENT.MD](/Development.md) ARE INSTALLED AS WELL AS THE BACKEND DEPENDENCIES**

1. Clone the frontend using: 

   > git clone https://github.com/angelesmarin/Placenet-App-Frontend.git

2. Clone the backend into a different directory with:

    > git clone https://github.com/angelesmarin/Placenet-App-Backend.git 

3. Start the database with:

    > brew services start postgresql

4. Connect to the database with:

    > psql -U angelesmarin -d placenet

5. Start the backend by running the following while cd'd into the backend directory:

    > node startServer.js backend

6. Start the frontend by running the following while cd'd into the frontend directory:

    > npx expo start