const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.db');

const logger = require("../../../utils/logger/logger");
const { openConnection, closeConnection } = require("../activeConnections/activeConnectionsCount");

const executeDatabaseQueryAsync = async (command, params = [], method = 'all') => {
  // logger.info(`Executing query: ${command} with params: ${JSON.stringify(params)}`);
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

const queryAsyncWraper = (command, method = 'all') => {
  // const db = new sqlite3.Database('../database.db')
  return new Promise((resolve, reject) => {
    db[method](command, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const queryAsyncWraperParam = (command, params, method = 'all') => {
  // const db = new sqlite3.Database('../database.db')
  return new Promise((resolve, reject) => {
    db[method](command, params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
      // db.close()  
    })
  })
}

module.exports ={
  executeDatabaseQueryAsync,
  queryAsyncWraper,
  queryAsyncWraperParam,
}


// const executeDatabaseQueryAsync = async (command, params = [], method = 'all') => {
//   if (!Array.isArray(params)) {
//     throw new Error('Params must be an array');
//   }

//   if (method !== 'all' && method !== 'get' && method !== 'run') {
//     throw new Error('Unsupported method');
//   }

//   logger.info(`Executing query: ${command} with params: ${JSON.stringify(params)}`);
//   openConnection(db);
//   return new Promise((resolve, reject) => {
//     db[method](command, params, (err, result) => {
//       if (err) {
//         logger.error(`Error executing query: ${err}`);
//         reject(err);
//       } else {
//         resolve(result);
//       }
//       closeConnection(db); // Ensure connection is closed after query execution
//     });
//   });
// };