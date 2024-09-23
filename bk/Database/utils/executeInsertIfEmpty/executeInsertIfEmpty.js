'use strict'

const { executeDatabaseQueryAsync } = require("../executeDatabaseQuery/executeDatabaseQuery")

const executeInsertIfEmpty = async (tableName, insertQuery) => {
    console.log('executeInsertIfEmpty', tableName, insertQuery)
  try {
    // Проверяем количество записей в таблице
    const rows = await executeDatabaseQueryAsync(`SELECT COUNT(*) as count FROM ${tableName}`, [])

    // Если таблица пуста, выполняем вставку
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(insertQuery, [])
    }
  } catch (error) {
    console.log(`DB ERROR (${tableName}): `, error)
    throw new Error(`Failed to insert data into ${tableName}`)
  }
}

module.exports = {
  executeInsertIfEmpty,
}

// Пример использования функции
// const insertIntoMotorAmperageT = async () => {
//   const insertQuery = `
//       INSERT INTO MotorAmperageT (name) VALUES
//         (1),
//         (2),
//         (63)`

//   await executeInsertIfEmpty('MotorAmperageT', insertQuery)
// }
