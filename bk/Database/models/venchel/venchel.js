const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createVenchelTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS venchels`, [])

    // await executeDatabaseQueryAsync(
    //   `CREATE TABLE IF NOT EXISTS venchels (
    //        id INTEGER PRIMARY KEY AUTOINCREMENT,
    //        --!!ПРЯМЫЕ ДАННЫЕ 
    //        venchel_id INTEGER NOT NULL,
    //        tech_num TEXT NOT NULL,
    //        --width TEXT NOT NULL,
    //        --height TEXT NOT NULL,
    //        --model TEXT NOT NULL,
    //        --location TEXT NOT NULL,
    //        --sector_id INTEGER,
    //        qr_code BLOB,
    //        --!!ВНЕШНИЕ СВЯЗИ 
    //        type_id INTEGER,
    //        department_id INTEGER,
    //        power_perform_id INTEGER,
    //        workshop_id INTEGER,
    //        FOREIGN KEY (type_id) REFERENCES machineTypes (id),
    //        FOREIGN KEY (department_id) REFERENCES departments (id),
    //        FOREIGN KEY (power_perform_id) REFERENCES powerRange (id),
    //        FOREIGN KEY (workshop_id) REFERENCES workshops (id)
    //    )`,
    //   []
    // )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createVenchelTable,
}

// const addBucketElevator = async (
//   deviceId, 
//   height, 
//   beltBrandId, 
//   beltInstallationDate, 
//   beltLength, 
//   bucketBrandId, 
//   bucketInstallationDate, 
//   bucketQuantity, 
//   gearboxBrandId, 
//   gearboxInstallationDate
// ) => {
//   try {
//     // Вставка данных об устройстве
//     await executeDatabaseQueryAsync(
//       `INSERT INTO devices (device_id, tech_num, created_on, devices_installation_date, qr_code, workshop_id, department_id) 
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [deviceId, 'tech_num_example', new Date(), new Date(), null, 1, 1] // Замените значения на свои
//     );

//     // Вставка данных о конвейере с ковшами
//     await executeDatabaseQueryAsync(
//       `INSERT INTO bucketElevators (device_id, height, belt_brand_id, belt_installation_date, belt_length, bucket_brand_id, bucket_installation_date, bucket_quantity, gearbox_brand_id, gearbox_installation_date) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         deviceId, 
//         height, 
//         beltBrandId, 
//         beltInstallationDate, 
//         beltLength, 
//         bucketBrandId, 
//         bucketInstallationDate, 
//         bucketQuantity, 
//         gearboxBrandId, 
//         gearboxInstallationDate
//       ]
//     );

//     console.log('Новый конвейер с ковшами добавлен!');
//   } catch (error) {
//     console.log('DB ERROR: ', error);
//   }
// };
//!-----------------------------------------

// Чтобы получить выборку после вставки значений, вам нужно выполнить запрос SELECT. Вот несколько вариантов, как это сделать:

// 1. Получение только что добавленного конвейера с ковшами:


// const getNewlyAddedBucketElevator = async (deviceId) => {
//   try {
//     const [rows] = await executeDatabaseQueryAsync(
//       `SELECT * FROM bucketElevators WHERE device_id = ? ORDER BY id DESC LIMIT 1`,
//       [deviceId]
//     );
//     return rows[0]; // Возвращает объект с данными конвейера
//   } catch (error) {
//     console.log('DB ERROR: ', error);
//     return null;
//   }
// };

// // Получить данные только что добавленного конвейера
// const newlyAddedElevator = await getNewlyAddedBucketElevator(123); // Замените 123 на deviceId
// console.log(newlyAddedElevator); 
// 2. Получение всех конвейеров с ковшами:


// const getAllBucketElevators = async () => {
//   try {
//     const [rows] = await executeDatabaseQueryAsync(
//       `SELECT * FROM bucketElevators`,
//       []
//     );
//     return rows; // Возвращает массив объектов с данными всех конвейеров
//   } catch (error) {
//     console.log('DB ERROR: ', error);
//     return [];
//   }
// };

// // Получить данные всех конвейеров
// const allElevators = await getAllBucketElevators();
// console.log(allElevators); 
// 3. Получение конвейеров по конкретному критерию:


// const getBucketElevatorsByHeight = async (minHeight, maxHeight) => {
//   try {
//     const [rows] = await executeDatabaseQueryAsync(
//       `SELECT * FROM bucketElevators WHERE height BETWEEN ? AND ?`,
//       [minHeight, maxHeight]
//     );
//     return rows; 
//   } catch (error) {
//     console.log('DB ERROR: ', error);
//     return [];
//   }
// };

// // Получить конвейеры с высотой от 4 до 6 метров
// const elevatorsByHeight = await getBucketElevatorsByHeight(4, 6); 
// console.log(elevatorsByHeight);
// Объяснение:

// executeDatabaseQueryAsync: Функция, выполняющая запросы к базе данных.
// SELECT * FROM bucketElevators: Запрос, выбирающий все данные из таблицы bucketElevators.
// WHERE height BETWEEN ? AND ?: Условие, ограничивающее выборку по высоте конвейера.
// ORDER BY id DESC LIMIT 1: Сортировка по ID в обратном порядке и ограничение выборки одним элементом (для получения только что добавленного).
// [rows]: Деструктуризация массива с результатами запроса.
// rows[0]: Получение первого элемента массива (объекта с данными конвейера).
// Важно:

// Замените executeDatabaseQueryAsync на функцию, которую вы используете для взаимодействия с вашей базой данных.
// Используйте правильные имена таблиц и столбцов, соответствующие вашей схеме базы данных.
// Замените placeholder'ы (например, 123, 4, 6) на свои значения.