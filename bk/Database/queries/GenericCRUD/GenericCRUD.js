const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const handleError = (res, error) => {
  console.error('handleError', error)
  res.statusCode = 500
  res.end(
    JSON.stringify({
      error: error,
    })
  )
}

class GenericCRUD {
  constructor(tableName) {
    this.tableName = tableName
  }

  async createQ(data, checkField = null) {
    // Проверка на существование имени, если передано название поля
    if (checkField) {
      const checkCommand = `SELECT COUNT(*) AS count FROM ${this.tableName} WHERE ${checkField.checkForExist} = ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [data[checkField.checkForExist]])

      if (checkResult[0].count > 0) {
        throw new Error(`Запись с таким ${data.name} уже существует`) // Выбрасываем ошибку, если запись уже существует
      }
    }

    const fields = Object.keys(data).join(', ')
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ')
    const values = Object.values(data)

    const command = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`
    try {
      await executeDatabaseQueryAsync(command, values)
    } catch (error) {
      console.error(`Error creating new record in ${this.tableName}:`, error)
      throw new Error('Ошибка создания записи: ' + error.message)
    }
  }

  async createWithProtectFelidsQ(data, allowedFields) {
    const filteredData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key]
        return obj
      }, {})

    const fields = Object.keys(filteredData).join(', ')
    const placeholders = Object.keys(filteredData)
      .map(() => '?')
      .join(', ')
    const values = Object.values(filteredData)

    const command = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`
    try {
      await executeDatabaseQueryAsync(command, values)
    } catch (error) {
      console.error(`Error creating new record in ${this.tableName}:`, error)
      throw new Error('Ошибка создания записи: ' + error.message)
    }
  }

  async readQ(id) {
    try {
      const command = id ? `SELECT * FROM ${this.tableName} WHERE id = ?` : `SELECT * FROM ${this.tableName}`
      const params = id ? [id] : []
      return await executeDatabaseQueryAsync(command, params)
    } catch (error) {
      console.error(`Error reading records from ${this.tableName}:`, error)
      throw new Error('Ошибка чтения записей: ' + error.message)
    }
  }

  async updateQ(data, checkField = null) {
    // Проверка на существование имени, если передано название поля
    if (checkField) {
      const checkCommand = `SELECT COUNT(*) AS count FROM ${this.tableName} WHERE ${checkField.checkForExist} = ?`
      const checkResult = await executeDatabaseQueryAsync(checkCommand, [data[checkField.checkForExist]])

      if (checkResult[0].count > 0) {
        throw new Error(`Запись ${data.name} уже существует`) // Выбрасываем ошибку, если запись уже существует
      }
    }
    const { id, ...fields } = data
    const updates = Object.keys(fields)
      .map(key => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(fields), id]

    const command = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`
    try {
      await executeDatabaseQueryAsync(command, values)
    } catch (error) {
      console.error(`Error updating record in ${this.tableName}:`, error)
      throw new Error('Ошибка обновления записи: ' + error.message)
    }
  }

  async deleteQ(id) {
    try {
      const command = `DELETE FROM ${this.tableName} WHERE id = ?`
      await executeDatabaseQueryAsync(command, [id])
    } catch (error) {
      console.error(`Error deleting record from ${this.tableName}:`, error)
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
}

module.exports = GenericCRUD

// !!!!!!!!!!!! USEGE
//  метод createQ с проверкой на пустые данные:
// async createQ(data) {
//   if (!data || Object.keys(data).length === 0) {
//     throw new Error('Данные для создания записи не могут быть пустыми.');
//   }

//   const fields = Object.keys(data).join(', ');
//   const placeholders = Object.keys(data).map(() => '?').join(', ');
//   const values = Object.values(data);

//   const command = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
//   try {
//     await executeDatabaseQueryAsync(command, values);
//   } catch (error) {
//     console.error(`Error creating new record in ${this.tableName}:`, error);
//     throw new Error('Ошибка создания записи: ' + error.message);
//   }
// }

// !!!!!!!!!!!! USEGE
// async create(req, res) {
//     try {
//       const authDecodeUserData = req.user;
//       const data = JSON.parse(authDecodeUserData.payLoad);
//       const allowedFields = ['name', 'power', 'type']; // Укажите разрешённые поля
//       await this.crud.createWithProtectFelidsQ(data, allowedFields); // Используйте метод с фильтрацией полей
//       sendResponseWithData(res, 'MotorPowerRangeController-create-ok');
//     } catch (error) {
//       handleError(res, 'Error: createMotorPowerRange - ' + error.message);
//     }
//   }
// !!!!!!!!!!!! USEGE
// !!!!!!!!!!!! USEGE
// const GenericCRUD = require('./path/to/GenericCRUD');

// class MotorPowerRangeController {
//   constructor() {
//     this.crud = new GenericCRUD('motorPowerRangeT'); // Создание экземпляра с указанием имени таблицы
//   }

//   async create(req, res) {
//     try {
//       const authDecodeUserData = req.user;
//       const data = JSON.parse(authDecodeUserData.payLoad);
//       await this.crud.createQ(data); // Вставка данных в таблицу
//       sendResponseWithData(res, 'MotorPowerRangeController-create-ok');
//     } catch (error) {
//       handleError(res, 'Error: createMotorPowerRange - ' + error.message);
//     }
//   }

//   async read(req, res) {
//     try {
//       const id = req.query.id;
//       const data = await this.crud.readQ(id); // Чтение данных из таблицы
//       sendResponseWithData(res, data);
//     } catch (error) {
//       handleError(res, 'Error: readMotorPowerRange - ' + error.message);
//     }
//   }

//   async update(req, res) {
//     try {
//       const data = req.body; // Получение данных для обновления
//       await this.crud.updateQ(data); // Обновление записи
//       sendResponseWithData(res, 'MotorPowerRangeController-update-ok');
//     } catch (error) {
//       handleError(res, 'Error: updateMotorPowerRange - ' + error.message);
//     }
//   }

//   async delete(req, res) {
//     try {
//       const id = req.params.id; // Получение id для удаления
//       await this.crud.deleteQ(id); // Удаление записи
//       sendResponseWithData(res, 'MotorPowerRangeController-delete-ok');
//     } catch (error) {
//       handleError(res, 'Error: deleteMotorPowerRange - ' + error.message);
//     }
//   }
// }

// module.exports = MotorPowerRangeController;
