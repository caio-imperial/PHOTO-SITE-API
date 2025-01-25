export const mongoDbConstants = {
  user: process.env.MONGO_DB_USER,
  password: process.env.MONGO_DB_PASSWORD,
  host: process.env.MONGO_DB_HOST,
  app_name: process.env.MONGO_DB_APP_NAME,
  uri: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_APP_NAME}`,
};
