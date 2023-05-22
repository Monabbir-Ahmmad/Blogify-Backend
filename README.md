# Blogify - Blog API

Blogify is a powerful and user-friendly Blog API built using Express.js. It provides a seamless way to manage and interact with blog posts, users, and authentication features.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

- Create, read, update, and delete blog posts.
- Create, fetch, update, and delete blog comments.
- User authentication with JWT tokens.
- User registration and login functionality.
- User profile customization with profile and cover photos.
- User authorization for protected routes.
- Unit testing with Jest.
- Integration with Sequelize ORM for efficient database management.

## Installation

1. This project relies on Node.js version **18.x** so make sure that you have the right version of Node.js installed on your system.

2. Clone the repository:

```bash
git clone https://github.com/Monabbir-Ahmmad/Blogify.git
```

2. Install the dependencies:

```bash
cd blogify/backend
npm install
```

3. Set up the database:

- Create a new SQL (Postgres/MySQL) database.
- Configure the database connection in the `.env` file.

```plaintext
APP_NAME = Blogify
PORT = 5000
JWT_REFRESH_KEY = Your Jwt Refresh Token Secret Key
JWT_ACCESS_KEY = Your Jwt Access Token Secret Key
JWT_RESET_KEY = Your Jwt Password Reset Token Secret Key
JWT_REFRESH_EXPIRE_TIME = Jwt Refresh Token Expiry Time
JWT_ACCESS_EXPIRE_TIME = Jwt Access Token Expiry Time
JWT_RESET_EXPIRE_TIME = Jwt Password Reset Token Expiry Time
SALT_ROUNDS = Salt Rounds For Password Hashing
DB_HOST = Database Host Address
DB_PORT = Database Port Number
DB_NAME = Database Name
DB_USER = Database Username
DB_PASSWORD = Database Password
DB_DIALECT = Database Type (Postgres/MySql etc)
EMAIL_ADDRESS = Email Address For Email Services
EMAIL_PASSWORD = Email Password For Email Services
CLIENT_URL = Client URL For Reset Password Redirect
CLOUDINARY_NAME = Cloudinary Storage Name
CLOUDINARY_KEY = Cloudinary Key
CLOUDINARY_SECRET = Cloudinary Secret
CLOUDINARY_FOLDER = Cloudinary Folder Name For File Storage
```

4. Start the server:

```bash
npm start
```

5. The API server will be running at `http://localhost:5000`.

## Usage

To interact with the API, you can use tools like Postman or any HTTP client of your choice. Refer to the [API Documentation](#api-documentation) section for detailed endpoint information.

Make sure to include the required headers in your requests for authorization using JWT tokens.

## API Documentation

The API documentation is available in Postman. You can find it [here](https://documenter.getpostman.com/view/23652878/2s93m33iXs).

## Technologies Used

- [Express.js](https://expressjs.com) - A fast, unopinionated, and minimalist web framework for Node.js.

- [Sequelize](https://sequelize.org) - A powerful Node.js-based Object Relational Mapper (ORM) for database management.

- [PostgreSQL](https://www.postgresql.org) - An open-source relational database management system.

- [Cloudinary](https://cloudinary.com/documentation) - A cloud-based image and video management platform.

- [Express-Validator](https://express-validator.github.io/docs) - A set of express.js middlewares that wraps validator.js validator and sanitizer functions.

- [JSON Web Token](https://jwt.io/) - A compact URL-safe means of representing claims between two parties.

- [bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.

- [Multer](https://github.com/expressjs/multer) - A middleware for handling `multipart/form-data`, primarily used for uploading files.

- [SQLite](https://www.npmjs.com/package/sqlite) - A self-contained, serverless, zero-configuration, transactional SQL database engine.

- [Jest](https://jestjs.io/) - A delightful JavaScript Testing Framework with a focus on simplicity.

- [SuperTest](https://github.com/ladjs/supertest) - A high-level abstraction for testing HTTP.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy using Blogify for all your blogging needs! If you encounter any issues or have any suggestions, please feel free to raise an issue on GitHub. Happy blogging!
