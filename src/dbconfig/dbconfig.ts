import { Sequelize } from 'sequelize'
import mysql2 from 'mysql2'

// MySQL Configuration
const config = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL root password if applicable
  database: 'userdatabase',
  port: 3306 // Add your MySQL port if applicable
}

// Create a Sequelize instance with your configuration
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  dialectModule: mysql2, // Specify mysql2 as the dialect module
  port: config.port,
  logging: false // Optional: Disable logging, set to console.log to enable
})

// Test the connection and optionally sync models
export async function connect() {
  try {
    await sequelize.authenticate()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1) // Exit on connection failure
  }
}

export default sequelize
