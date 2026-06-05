const app = require('./app');
const { initializeDatabase, sequelize } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Initialize and connect to MySQL database
    await initializeDatabase();

    // 2. Sync models to database tables (force: false, alter: true for safety)
    // In production we would use migrations, but for rapid prototyping alter: true is excellent.
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');

    // 3. Start server
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
