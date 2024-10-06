const app = require('./app');
const connectDB = require('./db/connect')


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
  });
    return server
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = start;