// Import the mysql2 module Promise Wrapper 
const mysql = require('mysql2/promise');
// Prepare connection parameters we use to connect to the database
const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
}
// Create the connection pool  
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
// Prepare a function that will execute the SQL queries asynchronously
async function query(sql, params=[]) {
  
 try{const [rows, fields] = await pool.execute(sql, params);
  return rows;
} catch (error) {
    console.error('Database query error:', error);
    throw error;
  }} 
  
// Export the query function for use in the application 
module.exports = { query};