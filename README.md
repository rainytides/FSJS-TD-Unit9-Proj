# FSJS-TD-Unit9-Proj
Treehous FSJS techdegree ninth project - REST API


# REST API Project

This project is a RESTful API using Express. It provides a way to administer a school database containing information about users and courses. Users can interact with the database to create new courses, retrieve information on existing courses, update courses, and delete courses.

## Features

- REST API created using Express.
- Database created using the SQL ORM Sequelize.
- Users can create new courses, retrieve information on existing ones, update them, and delete them.
- Passwords are hashed before being stored in the database.
- Users are authenticated before being allowed to make changes to the database.

## Getting Started

### Prerequisites

You need Node.js and npm installed on your machine. This project was built against the following versions:
- Node.js v14.15.1
- npm v6.14.8

### Installation

Install dependencies:
```bash
npm install
```

#### Setting up the database
Run the command to initialize the database:
```bash
npm run seed
```
This will create and seed the fsjstd-restapi.db database with initial data.

#### Running the Application
Start the application:
```bash
npm start
```
The server will start on localhost:5000.

#### Testing
To test the API, you can use Postman or any other API testing tool. The project includes a Postman collection (RESTAPI.postman_collection.json) that you can import to quickly get started with testing the available routes.

### Routes

- GET /api/users: Retrieves the currently authenticated user.
- POST /api/users: Creates a new user.
- GET /api/courses: Retrieves a list of courses.
- GET /api/courses/:id: Retrieves a course by ID.
- POST /api/courses: Creates a new course.
- PUT /api/courses/:id: Updates a course by ID.
- DELETE /api/courses/:id: Deletes a course by ID.

## Built With

- Express - The web framework used
- Sequelize - ORM for database management
- SQLite - Database used
- bcryptjs - Used for hashing passwords

## License

This project is licensed under the MIT License.

