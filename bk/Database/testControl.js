const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database.db')
const logger = require('../utils/logger/logger');
const { openConnection, closeConnection } = require('./utils/activeConnections/activeConnectionsCount')

const initDatabase = async() => {}

const executeDatabaseQueryAsync = async (command, params = [], method = 'all') => {
  logger.info(`Executing query: ${command} with params: ${JSON.stringify(params)}`);
  openConnection(db);
  return new Promise((resolve, reject) => {
    db[method](command, params, (err, result) => {
      if (err) {
        logger.error(`Error executing query: ${err}`);
        reject(err);
      } else {
        resolve(result);
      }
      closeConnection(db); // Ensure connection is closed after query execution
    });
  });
};

// db.serialize(async () => {
//   createTableTasksComments()
// })

module.exports ={
  initDatabase,
  executeDatabaseQueryAsync
}

