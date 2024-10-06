#### Project Setup

In order to spin up the project, in the root create .env with these two variables, with your own values.

MONGO_URI
JWT_SECRET
MONGO_URI_TEST (database connection for tests)

to use locally, in your html files set apiBaseURL to 'http://localhost:5000/api/v1' 
add to script on package.json  -  "dev": "nodemon server.js", //npm run dev

After that run this command

```bash
npm install && npm start
```

