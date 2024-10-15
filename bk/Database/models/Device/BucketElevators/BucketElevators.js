const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')
const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty')

const executeTableCreation = async (tableName, createTableQuery, allowDrop = false) => {
  try {
    if (allowDrop) {
      await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS ${tableName}`, [])
    }
    await executeDatabaseQueryAsync(createTableQuery, [])
  } catch (error) {
    console.log(`DB ERROR (${tableName}): `, error)
    throw new Error(`Failed to create ${tableName} table`)
  }
}

const createBucketElevatorTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bucketElevators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER NOT NULL,
      height REAL, -- Высота нории
      belt_brand_id INTEGER, -- Марка ленты
      belt_installation_date DATETIME, -- Дата установки ленты
      belt_length INTEGER, -- Длина ленты
      bucket_brand_id INTEGER, -- Марка ковшей
      bucket_installation_date DATETIME, -- Дата установки ковшей
      bucket_quantity INTEGER, -- Количество ковшей
      gearbox_brand_id INTEGER, -- Марка редуктора
      gearbox_installation_date DATETIME, -- Дата установки редуктора
      driveBelt_brand_id INTEGER,
      driveBelt_quantity INTEGER,
      driveBelt_installation_date DATETIME, -- Дата установки ремней
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(id),
      FOREIGN KEY (belt_brand_id) REFERENCES beltBrands(id),
      FOREIGN KEY (bucket_brand_id) REFERENCES bucketBrands(id),
      FOREIGN KEY (gearbox_brand_id) REFERENCES gearboxBrands(id)
      FOREIGN KEY (driveBelt_brand_id) REFERENCES driveBelts(id)
    )`
  await executeTableCreation('bucketElevators', createTableQuery, allowDrop)
}

const createBeltBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS beltBrands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name  TEXT NOT NULL
    )`
  await executeTableCreation('beltBrands', createTableQuery, allowDrop)
}

const insertBeltBrands = async () => {
  const insertQuery = `INSERT INTO beltBrands (brand_name) VALUES 
    ('бкнл-65-2-300Х8'), 
    ('бкнл-65-2-200Х6'), 
    ('бкнл-65-2-400х8'), 
    ('бкнл-65-2-450х8')
  `
  await executeInsertIfEmpty('beltBrands', insertQuery)
}

const createBucketBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bucketBrands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name  TEXT NOT NULL
    )`
  await executeTableCreation('bucketBrands', createTableQuery, allowDrop)
}

const insertBucketBrands = async () => {
  const insertQuery = `INSERT INTO bucketBrands (brand_name) VALUES 
    ('МАСТУ-100'), 
    ('МАСТУ-010'), 
    ('МАСТУ-п175'), 
    ('МАСТУ-175'), 
    ('УКЗ-100'), 
    ('УКЗ-175')`
  await executeInsertIfEmpty('bucketBrands', insertQuery)
}

const createGearboxBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS gearboxBrands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name  TEXT NOT NULL
    )`
  await executeTableCreation('gearboxBrands', createTableQuery, allowDrop)
}

const insertGearboxBrands = async () => {
  const insertQuery = `INSERT INTO gearboxBrands (brand_name) VALUES 
      ('1Ц2У200-20-12-У1'), 
      ('Ц2У200-16.31У1')`
  await executeInsertIfEmpty('gearboxBrands', insertQuery)
}

const createDriveBeltsBrandsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS driveBelts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name  TEXT NOT NULL
    )`
  await executeTableCreation('driveBelts', createTableQuery, allowDrop)
}

const insertDriveBeltsBrands = async () => {
  const insertQuery = `INSERT INTO driveBelts (brand_name) VALUES ('B 1800')`
  await executeInsertIfEmpty('driveBelts', insertQuery)
}

const createAllBucketElevatorTables = async (allowDrop = false) => {
  try {
    await createDriveBeltsBrandsTable(allowDrop)
    await insertDriveBeltsBrands()
    await createGearboxBrandsTable(allowDrop)
    await insertGearboxBrands() 
    await createBucketBrandsTable(allowDrop)
    await insertBucketBrands()
    await createBeltBrandsTable(allowDrop)
    await insertBeltBrands()
    await createBucketElevatorTable(allowDrop)
  } catch (error) {
    console.log('Error creating motor tables: ', error)
    throw new Error('Failed to create all motor tables')
  }
}

module.exports = { createAllBucketElevatorTables }
