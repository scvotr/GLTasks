const { executeDatabaseQueryAsync } = require('../executeDatabaseQuery/executeDatabaseQuery')

const escapeIdentifier = identifier => `"${identifier.replace(/"/g, '""')}"`

const addForeignKeyToTable = async (tableName, fieldName, fieldType, referenceTable, referenceField, allowDrop = false) => {
  try {
    // 1. Проверка существования таблицы
    const checkTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=${escapeIdentifier(tableName)};`
    const tableExists = await executeDatabaseQueryAsync(checkTableQuery)

    if (!tableExists.length) {
      throw new Error(`Таблица '${tableName}' не существует.`)
    }

    // 2. Проверка существования таблицы-ссылки
    const checkReferenceTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=${escapeIdentifier(referenceTable)};`
    const referenceTableExists = await executeDatabaseQueryAsync(checkReferenceTableQuery)

    if (!referenceTableExists.length) {
      throw new Error(`Таблица-ссылка '${referenceTable}' не существует.`)
    }

    // 3. Получение информации о структуре существующей таблицы
    const pragmaQuery = `PRAGMA table_info(${escapeIdentifier(tableName)});`
    const columns = await executeDatabaseQueryAsync(pragmaQuery)

    // Проверка, существует ли уже поле с таким именем
    const columnExists = columns.some(col => col.name === fieldName)
    if (columnExists) {
      console.log(`Поле '${fieldName}' уже существует в таблице '${tableName}'.`)
      return
    }

    // 4. Создание новой таблицы с добавлением внешнего ключа
    const createNewTableQuery = `
        CREATE TABLE new_${tableName} (
          ${columns.map(col => `${escapeIdentifier(col.name)} ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`).join(', ')},
          ${escapeIdentifier(fieldName)} ${fieldType},
          FOREIGN KEY (${escapeIdentifier(fieldName)}) REFERENCES ${escapeIdentifier(referenceTable)}(${escapeIdentifier(referenceField)})
        );
      `
    await executeDatabaseQueryAsync(createNewTableQuery)

    // 5. Копирование данных из старой таблицы в новую
    const copyDataQuery = `
        INSERT INTO new_${tableName} (${columns.map(col => escapeIdentifier(col.name)).join(', ')})
        SELECT ${columns.map(col => escapeIdentifier(col.name)).join(', ')}
        FROM ${tableName};
      `
    await executeDatabaseQueryAsync(copyDataQuery)

    // 6. Удаление старой таблицы
    if (allowDrop) {
      await executeDatabaseQueryAsync(`DROP TABLE ${tableName};`)
    } else {
      console.log(`Старая таблица '${tableName}' сохранена.`)
    }

    // 7. Переименование новой таблицы
    await executeDatabaseQueryAsync(`ALTER TABLE new_${tableName} RENAME TO ${tableName};`)

    console.log(`Поле '${fieldName}' успешно добавлено в таблицу '${tableName}' как внешний ключ.`)
  } catch (error) {
    console.error(`DB ERROR - ${tableName}:`, error.message)
    console.error('Stack trace:', error.stack)
    throw error
  }
}

module.exports = {
  addForeignKeyToTable,
}

// Использование функции
// await addForeignKeyToTable(
//   'reqForAvailableTable', // Название таблицы
//   'contractor_id', // Новое поле
//   'INTEGER', // Тип нового поля
//   'contractors', // Таблица-ссылка
//   'id', // Поле в таблице-ссылке
//   true // Разрешить удаление старой таблицы
// )
