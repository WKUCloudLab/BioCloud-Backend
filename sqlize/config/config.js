require('dotenv').config();

module.exports =
{
  "development": {
    "username": process.env.DB_USER2,
    "password": process.env.DB_PASS2,
    "database": "BioCloud2",
    "host": "172.18.0.2",
    "port":"3306",
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_USER2,
    "password": process.env.DB_PASS2,
    "database": "database_test",
    "host": "127.0.0.1:6603",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER2,
    "password": process.env.DB_PASS2,
    "database": "BioCloud2",
    "host": "127.0.0.1:6603",
    "dialect": "mysql"
  }
}
