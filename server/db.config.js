const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
