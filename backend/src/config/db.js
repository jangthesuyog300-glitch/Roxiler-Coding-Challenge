const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || 'root';
const database = process.env.DB_NAME || 'store_rating_db';

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

const initializeDatabase = async () => {
  try {
    // Create connection to MySQL server (without DB name) to run CREATE DATABASE IF NOT EXISTS
    const connection = await mysql.createConnection({
      host: host,
      port: port,
      user: user,
      password: password
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    
    // Authenticate with Sequelize
    await sequelize.authenticate();
    console.log(`Connected to database '${database}' successfully.`);
  } catch (error) {
    console.error('Database connection / initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  initializeDatabase
};
