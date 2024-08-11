const { Pool } = require('pg');

// Create a new pool instance with your database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'notes',
    password: 'elaya55555',
    port: 5432,
});

// Export the pool instance to be used in other parts of your application
module.exports = pool;
