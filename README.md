# MERN Stack Todo Application

This repository contains the server code and React app for a Todo application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Getting Started

To run the application locally, follow the steps below:

1. Download the repository and extract its contents.

2. Set up MongoDB with the following schema:

   - Create a database named `todoapp`.
   - Inside the `todoapp` database, create two collections: `lists` and `all-tasks`.

3. Navigate to the `server` folder in your terminal.

4. Install the required dependencies by running the following command:
  - npm install

5. Start the server by running the following command:
  - node server.js

Note: Make sure you have Node.js and npm installed on your machine. If not, you can download and install them from the official Node.js website: https://nodejs.org

6. Once the server is running, open any web browser and go to http://localhost:3000/ to access the Todo application.

Note: If port 3000 is already in use on your machine, you can modify the port number in the `server.js` file.

## Usage

- Create a new account or log in with your existing credentials.
- Use the Todo application to manage your tasks and lists.
- Add, update, or delete tasks.
- Create new lists and organize your tasks within them.
- Mark tasks as completed or incomplete.
- Mark task as important
- add duedate, remindme, repeat to task
- create list of tasks
