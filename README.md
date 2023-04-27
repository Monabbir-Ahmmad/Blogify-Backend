# Blog-web-app

## Technologies used

[<img width="34" alt="ReactJS" src="https://img.icons8.com/color/344/react-native.png" />][reactjs]
[<img width="34" alt="Redux" src="https://img.icons8.com/color/344/redux.png" />][redux]
[<img width="34" alt="NodeJS" src="https://iconape.com/wp-content/png_logo_vector/node-js-2.png" />][nodejs]
[<img width="34" alt="ExpressJS" src="https://assets.website-files.com/61ca3f775a79ec5f87fcf937/6202fcdee5ee8636a145a41b_1234.png" />][expressjs]
[<img width="34" alt="MySQL" src="https://sp-ao.shortpixel.ai/client/q_glossy,ret_img,w_1280,h_1280/https://keytotech.com/wp-content/uploads/2019/05/mysql_PNG23.png" />][mysql]
[<img width="34" alt="Sequelize" src="https://doc.esdoc.org/github.com/sequelize/sequelize/image/brand_logo.png" />][sequelize]

<br/>

## How to run

- After downloading or cloning this repository make sure to use "npm i --force" on both the frontend and backend folders separately.
- Before starting the server make sure that the database is created. Use "npm run create-db" on the server folder to create the database.
- If you want you can also change the database configuration form the file at path "/backend/src/config/databaseConfig.js".
- Before starting the program make sure that the database is running.
- Use "npm start" on both the frontend and backend separately to start the client and server programs.
- For testing the backend api, a Postman collection file named "Blog API.postman_collection" is provided.
- The postman collection provides dynamic refresh token and access token variables for protected api routes that auto updates when you signin or signup in the blog api using the public routes. So you don't need to worry about copying and pasting the tokens in the authorization header. The tokens will be automatically inherited for the protected routes. The access token is auto refreshed before each request to the api.

[reactjs]: https://reactjs.org/
[redux]: https://redux.js.org/
[nodejs]: https://nodejs.org/en/
[expressjs]: https://expressjs.com/
[mysql]: https://www.mysql.com/
[sequelize]: https://sequelize.org/
