const logger = require('../../../utils/logger/logger')
let activeConnectionsCount = 0;

const openConnection = (db) => {
  logger.info(`Trying to open connection. Active connections before opening: ${activeConnectionsCount}`);
  activeConnectionsCount++;
  logger.info(`Connection successfully opened. Active connections: ${activeConnectionsCount}`);
  return db;
  // ---------------------------------------------
  return new Promise((resolve, reject) => {
    db.get("PRAGMA quick_check", (err, result) => {
      if (err) {
        logger.error(`Database connection check failed: ${err.message}`);
        reject(err);
      } else {
        logger.info("Database connection is healthy.");
        activeConnectionsCount++;
        logger.info(`Connection successfully opened. Active connections: ${activeConnectionsCount}`);
        resolve(db);
      }
    });
  });
  // ---------------------------------------------
};

const closeConnection = (db) => {
  activeConnectionsCount--;
  logger.info(`Connection closed. Active connections: ${activeConnectionsCount}`);
  // --------------------------------------------
  //   db.serialize(() => {
  //     db.run("PRAGMA wal_checkpoint(FULL)", (err) => { // Убедитесь, что WAL (Write-Ahead Logging) журнал был применен

  //       if (err) {
  //         logger.error(`Error during WAL checkpoint: ${err.message}`);
  //         reject(err);
  //       } else {
  //         logger.info("WAL checkpoint completed.");
  //         db.close((err) => { // Закрытие соединения с базой данных

  //           if (err) {
  //             logger.error(`Error closing the database connection: ${err.message}`);
  //             reject(err);
  //           } else {
  //             activeConnectionsCount--;
  //             logger.info(`Connection closed. Active connections: ${activeConnectionsCount}`);
  //             resolve();
  //           }
  //         });
  //       }
  //     });
  //   });
  // });
  // --------------------------------------------
  
};

module.exports = {
  openConnection,
  closeConnection,
};

// SQL команда PRAGMA quick_check для базы данных SQLite для быстрой проверки
// здоровья соединения. Это дает базовую гарантию, что соединение с базой данных
// работает корректно перед тем, как считать соединение "открытым".
// Если проверка проваливается, функция логирует ошибку и возвращает
// отклоненный промис.

// метод sqlite3 для выполнения PRAGMA wal_checkpoint(FULL) перед фактическим закрытием
// соединения. Это гарантирует, что весь журнал WAL (если он используется)
// был применен к основной базе данных, что может быть важно для обеспечения
// целостности данных. После успешного выполнения checkpoint соединение
//  закрывается с помощью метода close.