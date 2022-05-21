// Update with your config settings.
require('dotenv').config({ path: './.env' })

let DBConnection;

const environment = process.env.ES_ENV

switch (environment) {
  case "production": {
    DBConnection = process.env.DATABASE_URL;
    break;
  }
  case "development": {
    DBConnection = {
      host: process.env.DEV_DB_HOST,
      database: process.env.DEV_DB_NAME,
      user: process.env.DEV_DB_USR,
      port: process.env.DEV_DB_PORT,
      password: process.env.DEV_DB_PWD
    }
    break;    
  }
}

module.exports = {
  client: 'pg',
  connection: DBConnection,
  cwd: "./",
  migrations: {
    directory: './db/migrations'
  },
  seeds: { directory: './db/seeds' }
};
