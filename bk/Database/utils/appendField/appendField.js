const { executeDatabaseQueryAsync } = require("../executeDatabaseQuery/executeDatabaseQuery")

const escapeIdentifier = identifier => `"${identifier.replace(/"/g, '""')}"`

const appendField = async (tableName, fieldName, fieldType, options = {}) => {
  try {
    // Проверка входных данных
    if (typeof tableName !== 'string' || typeof fieldName !== 'string' || typeof fieldType !== 'string') {
      throw new Error('Некорректные входные данные: tableName, fieldName и fieldType должны быть строками.')
    }
    const validTypes = ['TEXT', 'INTEGER', 'REAL', 'BLOB', 'NUMERIC', 'BOOLEAN', 'DATE']
    if (!validTypes.includes(fieldType.toUpperCase())) {
      throw new Error(`Некорректный тип данных: ${fieldType}. Допустимые типы: ${validTypes.join(', ')}`)
    }
    const escapedTableName = escapeIdentifier(tableName)
    const escapedFieldName = escapeIdentifier(fieldName)

    // Проверка существования столбца
    const checkColumnQuery = `PRAGMA table_info(${escapedTableName})`
    const columns = await executeDatabaseQueryAsync(checkColumnQuery)

    const columnExists = columns.some(column => column.name === fieldName)

    if (!columnExists) {
      // Добавление столбца
      const { defaultValue, notNull = false } = options
      let columnDefinition = `${escapedFieldName} ${fieldType}`
      if (notNull) columnDefinition += ' NOT NULL'
      if (defaultValue !== undefined) columnDefinition += ` DEFAULT ${defaultValue}`

      await executeDatabaseQueryAsync(`ALTER TABLE ${escapedTableName} ADD COLUMN ${columnDefinition}`)
      console.log(`Столбец '${fieldName}' успешно добавлен в таблицу '${tableName}'.`)
    } else {
      console.log(`Столбец '${fieldName}' уже существует в таблице '${tableName}'.`)
    }
  } catch (error) {
    console.error(`DB ERROR - ${tableName}:`, error.message)
    console.error('Stack trace:', error.stack)
    throw error // Пробросить ошибку выше, если это необходимо
  }
}

module.exports = {
  appendField,
}

// ? USE
// await appendFields('reqForAvailableTable', 'yearOfHarvest', 'TEXT');
// await appendFields('reqForAvailableTable', 'yearOfHarvest', 'TEXT', { defaultValue: '2023', notNull: true });



// const appendFields = async (tableName, fieldName, fieldType) => {
//   try {
//     // Получаем информацию о столбцах таблицы schedules
//     const checkColumnQuery = `PRAGMA table_info(${tableName})`
//     const columns = await executeDatabaseQueryAsync(checkColumnQuery);

//     // Проверяем, существует ли столбец schedule_priority_rate
//     const columnExists = columns.some(column => column.name === fieldName);

//     if (!columnExists) {
//       // Добавляем столбец schedule_priority_rate, если его еще нет
//       await executeDatabaseQueryAsync(
//         `ALTER TABLE ${tableName} ADD COLUMN ${fieldName} ${fieldType}`
//       );
//       console.log(`Столбец '${fieldName}' успешно добавлен.`);
//     } else {
//       console.log(`Столбец '${fieldName}' уже существует.`);
//     }
//   } catch (error) {
//     console.log(`DB ERROR - ${tableName}: `, error);
//   }
// }