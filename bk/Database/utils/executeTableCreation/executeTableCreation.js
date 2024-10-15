'use strict';

const { executeDatabaseQueryAsync } = require("../executeDatabaseQuery/executeDatabaseQuery");

const executeTableCreation = async (tableName, createTableQuery, allowDrop = false) => {
  try {
    // Удаляем таблицу только если разрешено
    if (allowDrop) {
      await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS ${tableName}`, []);
    }
    await executeDatabaseQueryAsync(createTableQuery, []);
  } catch (error) {
    console.log(`DB ERROR (${tableName}): `, error);
    throw new Error(`Failed to create ${tableName} table`);
  }
};

module.exports = {
  executeTableCreation,
};

// USAGE

// const createAllMotorTables = async (allowDrop = false) => {
//     await createMotorsNameTable(allowDrop); // Передаем параметр разрешения удаления
//     await createMotorsTable(allowDrop);
//     await createMotorsConfigTable(allowDrop);
//   };