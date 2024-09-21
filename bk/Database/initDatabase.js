const { createTableTasks } = require('./models/Task/task')
const { createTableTaskReadStatus } = require('./models/Task/taskReadStatus')
const { createTableTasksComments } = require('./models/Task/tasksComments')
const { createTableDepartments } = require('./models/OrgStructure/departmens')
const { createTablePositions } = require('./models/OrgStructure/positions')
const { createTableSubdepartments } = require('./models/OrgStructure/subdepartments')
const { createTaskStatus } = require('./models/Task/taskStatus')
const { createTableUsers } = require('./models/User/user')
const { createTableTokens } = require('./models/User/token')
const { createTableWorkshops } = require('./models/venchel/workshop')
const { createVenchelTable } = require('./models/venchel/venchel')
const { createTableVenchelFiles } = require('./models/venchel/venchelFiles')
const { createTableVenchelComments } = require('./models/venchel/venchelCommets')
const { createTablePendingNotifications } = require('./models/Notification/pendingNotification')
const { createUserRoles } = require('./models/User/userRoles')
const { createTableTasksFiles } = require('./models/Task/tasksFiles')
const { createTableSchedules, addCreatedOnField, addReportColumnToSchedules, addSchedulePriorityRateColumnToSchedules } = require('./models/Schedules/schedules')
const { createTableSchedulesComments } = require('./models/Schedules/schedulesComments')
const { testPGQuery, testPGQuery2 } = require('./queries/pg_test/test_pg_query')
const { createTableUsersPG } = require('./models/User/createTableUsersPG')
const { createMachineTypeTable, createMachineFilesTable, createMachineTable } = require('./models/Machine/Machine')
const { createDevicesTable, createBeltBrandsTable, createBucketBrandsTable, createGearboxBrandsTable, createBucketElevatorsTable, createBeltReplacementHistoryTable, createBucketReplacementHistoryTable, createGearboxReplacementHistoryTable, createDriveBeltsBrandsTable, createRollerBrandsTable, createBeltConveyorTable } = require('./models/Device/Device')
const { createDevicesTypesTable } = require('./models/Device/DevicesTypes')
const { createTableDeviceComments } = require('./models/Device/DeviceCommets')
const { createTableDeviceFiles } = require('./models/Device/DeviceFiles')
const { createPowerRangeTable } = require('./models/Machine/PowerRangeT')
const { createMotorPowerRangeTable } = require('./models/Device/Motors/MotorPowerRangeT')
const { createMotorAmperageTable } = require('./models/Device/Motors/MotorAmperage')
const { createMotorVoltageTable } = require('./models/Device/Motors/MotorVoltage')
const { createMotorCosFTable } = require('./models/Device/Motors/MotorCosF')
const { createMotorEfficiencyTable } = require('./models/Device/Motors/MotorEfficiency')
const { createMotorRotationSpeedTable } = require('./models/Device/Motors/MotorRotationSpeed')
const { createMotorTorqueTable } = require('./models/Device/Motors/MotorTorque')
const { createMotorTemperatureTable } = require('./models/Device/Motors/MotorTemperature')
const { createMotorMotorOperationModeTable } = require('./models/Device/Motors/MotorOperationMode')
const { createMotorProtectionLevelTable } = require('./models/Device/Motors/MotorProtectionLevel')
const { createMotorExplosionProofTable } = require('./models/Device/Motors/MotorExplosionProof')
const { createMotorBrakeTable } = require('./models/Device/Motors/MotorBrake')
const { createMotorMountingTable } = require('./models/Device/Motors/MotorMounting')
const { createMotorBearingTypeTable } = require('./models/Device/Motors/MotorBearingType')
const { createAllMotorTables } = require('./models/Device/Motors/Motor')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database.db')

const initDatabase = async() => {}

db.serialize(async () => {
  createTableTasks()
  createTaskStatus()
  createTableTaskReadStatus()
  createTableTasksFiles()
  createTableTasksComments()
  createTableDepartments()
  createTableSubdepartments()
  createTablePositions()
  createUserRoles()
  createTableUsers()
  createTableTokens()
  createTableWorkshops()

  createTablePendingNotifications()
  createTableSchedules()
  createTableSchedulesComments()
 
  createDevicesTable()
  createBeltBrandsTable()
  createBucketBrandsTable()
  createGearboxBrandsTable()
  createDriveBeltsBrandsTable()
  createBucketElevatorsTable()

  createBeltReplacementHistoryTable()
  createBucketReplacementHistoryTable()
  createGearboxReplacementHistoryTable()

  createRollerBrandsTable()
  createBeltConveyorTable()

  // ----12-09-2024
  createDevicesTypesTable()
  createTableDeviceComments()
  createTableDeviceFiles()

  // ! MOTORS
  createMotorPowerRangeTable()
  createMotorAmperageTable()
  createMotorVoltageTable()
  createMotorCosFTable()
  createMotorEfficiencyTable()
  createMotorRotationSpeedTable()
  createMotorTorqueTable()
  createMotorTemperatureTable()
  createMotorMotorOperationModeTable()
  createMotorProtectionLevelTable()
  createMotorExplosionProofTable()
  createMotorBrakeTable()
  createMotorMountingTable()
  createMotorBearingTypeTable()
  // dimensions
  // ServiceType
  createAllMotorTables()



  // addCreatedOnField()
  // addReportColumnToSchedules()
  // addSchedulePriorityRateColumnToSchedules()
  // await testPGQuery()
  // await testPGQuery2()
  // createTableUsersPG()

  // ! FOR REMOVE ONLY
  createVenchelTable()
  createTableVenchelFiles()
  createTableVenchelComments()
  createMachineTable()
  createMachineFilesTable()
  createMachineTypeTable()
  createPowerRangeTable()
  
})

module.exports ={
  initDatabase,
}

// Да, вы абсолютно правы. У вас есть основная таблица devices, которая хранит информацию об устройствах, и несколько таблиц, которые содержат специфические данные о разных типах устройств (в вашем случае - конвейер с ковшами и ленточный конвейер).

// Чтобы правильно установить связи между этими таблицами, вам нужно воспользоваться Foreign Keys (внешними ключами). Вот как это реализовать в вашем коде:

// 1. Добавление Foreign Keys в таблицы устройств:

// В каждой из таблиц, описывающих конкретный тип устройства (например, bucketElevators и beltConveyors), вы должны добавить столбец device_type (или подобный), который будет указывать на тип устройства.


// -- Таблица для конвейеров с ковшами
// CREATE TABLE IF NOT EXISTS bucketElevators (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     device_id INTEGER NOT NULL,
//     device_type TEXT NOT NULL, -- Добавлен столбец типа устройства
//     height REAL, -- Высота нории
//     belt_brand_id INTEGER, -- Марка ленты
//     belt_installation_date DATETIME, -- Дата установки ленты
//     belt_length INTEGER, -- Длина ленты
//     bucket_brand_id INTEGER, -- Марка ковшей
//     bucket_installation_date DATETIME, -- Дата установки ковшей
//     bucket_quantity INTEGER, -- Количество ковшей
//     gearbox_brand_id INTEGER, -- Марка редуктора
//     gearbox_installation_date DATETIME, -- Дата установки редуктора
//     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (device_id) REFERENCES devices(id),
//     FOREIGN KEY (belt_brand_id) REFERENCES beltBrands(id),
//     FOREIGN KEY (bucket_brand_id) REFERENCES bucketBrands(id),
//     FOREIGN KEY (gearbox_brand_id) REFERENCES gearboxBrands(id)
// );

// -- Таблица для ленточных конвейеров
// CREATE TABLE IF NOT EXISTS beltConveyors (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     device_id INTEGER NOT NULL,
//     device_type TEXT NOT NULL, -- Добавлен столбец типа устройства
//     belt_brand_id INTEGER, -- Марка ленты
//     belt_installation_date DATETIME, -- Дата установки ленты
//     belt_length INTEGER, -- Длина ленты
//     chute_roller_quantity INTEGER, -- Количество желобчатых роликоопор
//     straight_roller_quantity INTEGER, -- Количество прямых роликоопор
//     roller_installation_date DATETIME, -- Дата установки роликоопор
//     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (device_id) REFERENCES devices(id),
//     FOREIGN KEY (belt_brand_id) REFERENCES rollerBelts(id)
// );
// 2. Создание функций для добавления устройств:

// Теперь вы можете создать функции для добавления устройств разных типов:


// const addBucketElevator = async (
//     deviceId,
//     height,
//     beltBrandId,
//     beltInstallationDate,
//     beltLength,
//     bucketBrandId,
//     bucketInstallationDate,
//     bucketQuantity,
//     gearboxBrandId,
//     gearboxInstallationDate
// ) => {
//     try {
//         // Вставка данных об устройстве
//         await executeDatabaseQueryAsync(
//             `INSERT INTO devices (device_id, tech_num, created_on, devices_installation_date, qr_code, workshop_id, department_id) 
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [deviceId, 'tech_num_example', new Date(), new Date(), null, 1, 1] // Замените значения на свои
//         );

//         // Вставка данных о конвейере с ковшами
//         await executeDatabaseQueryAsync(
//             `INSERT INTO bucketElevators (device_id, device_type, height, belt_brand_id, belt_installation_date, belt_length, bucket_brand_id, bucket_installation_date, bucket_quantity, gearbox_brand_id, gearbox_installation_date) 
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 deviceId,
//                 'bucketElevator', // Укажите тип устройства
//                 height,
//                 beltBrandId,
//                 beltInstallationDate,
//                 beltLength,
//                 bucketBrandId,
//                 bucketInstallationDate,
//                 bucketQuantity,
//                 gearboxBrandId,
//                 gearboxInstallationDate
//             ]
//         );

//         console.log('Новый конвейер с ковшами добавлен!');
//     } catch (error) {
//         console.log('DB ERROR: ', error);
//     }
// };

// const addBeltConveyor = async (
//     deviceId,
//     beltBrandId,
//     beltInstallationDate,
//     beltLength,
//     chuteRollerQuantity,
//     straightRollerQuantity,
//     rollerInstallationDate
// ) => {
//     try {
//         // Вставка данных об устройстве
//         await executeDatabaseQueryAsync(
//             `INSERT INTO devices (device_id, tech_num, created_on, devices_installation_date, qr_code, workshop_id, department_id) 
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [deviceId, 'tech_num_example', new Date(), new Date(), null, 1, 1] // Замените значения на свои
//         );

//         // Вставка данных о ленточном конвейере
//         await executeDatabaseQueryAsync(
//             `INSERT INTO beltConveyors (device_id, device_type, belt_brand_id, belt_installation_date, belt_length, chute_roller_quantity, straight_roller_quantity, roller_installation_date) 
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 deviceId,
//                 'beltConveyor', // Укажите тип устройства
//                 beltBrandId,
//                 beltInstallationDate,
//                 beltLength,
//                 chuteRollerQuantity,
//                 straightRollerQuantity,
//                 rollerInstallationDate
//             ]
//         );

//         console.log('Новый ленточный конвейер добавлен!');
//     } catch (error) {
//         console.log('DB ERROR: ', error);
//     }
// };
// 3. Получение данных об устройстве:

// Чтобы получить данные об устройстве, вы можете использовать JOIN-запросы. Например, чтобы получить информацию о конвейере с ковшами, используя его device_id:


// const getBucketElevatorByDeviceId = async (deviceId) => {
//     try {
//         const [rows] = await executeDatabaseQueryAsync(
//             `SELECT devices.*, bucketElevators.* 
//              FROM devices
//              JOIN bucketElevators ON devices.id = bucketElevators.device_id
//              WHERE devices.id = ?`,
//             [deviceId]
//         );
//         return rows[0];
//     } catch (error) {
//         console.log('DB ERROR: ', error);
//         return null;
//     }
// };
// Важно:

// Убедитесь, что вы добавили столбец device_type в каждую таблицу, описывающую конкретный тип устройства, чтобы различать их.
// Используйте device_type при добавлении устройства в соответствующую таблицу.
// Используйте JOIN запросы для получения данных из разных таблиц, используя device_id как ключ связи.
// Теперь вы можете добавлять устройства разных типов, а также получать информацию о них, используя связи между таблицами.