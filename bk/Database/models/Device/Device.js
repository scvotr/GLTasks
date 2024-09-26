const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createDevicesTable = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS devices`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS devices (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          device_id INTEGER NOT NULL,
          tech_num TEXT NOT NULL,
          created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          devices_installation_date DATETIME,
          qr_code BLOB,
          type_id INTEGER,
          workshop_id INTEGER,
          department_id INTEGER,
          FOREIGN KEY (type_id) REFERENCES devicesTypes (id),
          FOREIGN KEY (workshop_id) REFERENCES workshops (id),
          FOREIGN KEY (department_id) REFERENCES departments (id)
         )`,
      []
    )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}


// !-----------------------------HISTORY LOG---------------------
const createBeltReplacementHistoryTable = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS belt_replacement_history`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS belt_replacement_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id INTEGER NOT NULL,
          old_belt_brand_id INTEGER,
          new_belt_brand_id INTEGER,
          replacement_date DATETIME NOT NULL,
          total_operation_time INTEGER, -- Общее время работы в часах между заменами
          created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_replacement DATETIME,
          FOREIGN KEY (device_id) REFERENCES devices(id),
          FOREIGN KEY (old_belt_brand_id) REFERENCES beltBrands(id),
          FOREIGN KEY (new_belt_brand_id) REFERENCES beltBrands(id)
         )`,
      []
    )
    // Создание триггера
    await executeDatabaseQueryAsync(
      `CREATE TRIGGER IF NOT EXISTS update_belt_last_replacement
      AFTER INSERT ON belt_replacement_history
      FOR EACH ROW
      BEGIN
        -- Обновляем поле last_replacement для всех предыдущих записей для того же device_id
        UPDATE belt_replacement_history
        SET last_replacement = NEW.replacement_date
        WHERE device_id = NEW.device_id
          AND id != NEW.id
          AND last_replacement IS NULL;
      END;`,
      []
    )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

const createBucketReplacementHistoryTable = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS bucket_replacement_history`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS bucket_replacement_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id INTEGER NOT NULL,
            old_bucket_brand_id INTEGER,
            new_bucket_brand_id INTEGER,
            replacement_date DATETIME NOT NULL,
            total_operation_time INTEGER, -- Общее время работы в часах между заменами
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_replacement DATETIME,
            FOREIGN KEY (device_id) REFERENCES devices(id),
            FOREIGN KEY (old_bucket_brand_id) REFERENCES bucketBrands(id),
            FOREIGN KEY (new_bucket_brand_id) REFERENCES bucketBrands(id)
           )`,
      []
    )
    // Создание триггера
    await executeDatabaseQueryAsync(
      `CREATE TRIGGER IF NOT EXISTS update_bucket_last_replacement
      AFTER INSERT ON bucket_replacement_history
      FOR EACH ROW
      BEGIN
        -- Обновляем поле last_replacement для всех предыдущих записей для того же device_id
        UPDATE bucket_replacement_history
        SET last_replacement = NEW.replacement_date
        WHERE device_id = NEW.device_id
          AND id != NEW.id
          AND last_replacement IS NULL;
      END;`,
      []
    )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

const createGearboxReplacementHistoryTable = async () => {
  try {
    // await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS gearbox_replacement_history`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS gearbox_replacement_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id INTEGER NOT NULL,
            old_gearbox_brand_id INTEGER,
            new_gearbox_brand_id INTEGER,
            replacement_date DATETIME NOT NULL,
            total_operation_time INTEGER, -- Общее время работы в часах между заменами
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_replacement DATETIME,
            FOREIGN KEY (device_id) REFERENCES devices(id),
            FOREIGN KEY (old_gearbox_brand_id) REFERENCES gearboxBrands(id),
            FOREIGN KEY (new_gearbox_brand_id) REFERENCES gearboxBrands(id)
           )`,
      []
    )
    // Создание триггера
    await executeDatabaseQueryAsync(
      `CREATE TRIGGER IF NOT EXISTS update_gearbox_last_replacement
      AFTER INSERT ON gearbox_replacement_history
      FOR EACH ROW
      BEGIN
        -- Обновляем поле last_replacement для всех предыдущих записей для того же device_id
        UPDATE gearbox_replacement_history
        SET last_replacement = NEW.replacement_date
        WHERE device_id = NEW.device_id
          AND id != NEW.id
          AND last_replacement IS NULL;
      END;`,
      []
    )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createDevicesTable,
  
  createBeltReplacementHistoryTable,
  createBucketReplacementHistoryTable,
  createGearboxReplacementHistoryTable,
}

// INSERT INTO Machines (tech_number, brand, installation_location, installation_date)
// VALUES ('12345', 'Machine A', 'Location A', '2024-01-01');

// INSERT INTO MachineType1 (machine_id, height, belt_brand_id, bucket_brand_id, bucket_quantity, gearbox_brand_id)
// VALUES (1, 5.0, 1, 1, 10, 1);

// SELECT
//     m.id AS machine_id,
//     m.tech_number,
//     m.brand AS machine_brand,
//     m.installation_location,
//     m.installation_date,
//     mt.height,
//     bb.brand_name AS belt_brand,
//     bkb.brand_name AS bucket_brand,
//     mt.bucket_quantity,
//     gb.brand_name AS gearbox_brand
// FROM
//     Machines m
// JOIN
//     MachineType1 mt ON m.id = mt.machine_id
// LEFT JOIN
//     BeltBrands bb ON mt.belt_brand_id = bb.id
// LEFT JOIN
//     BucketBrands bkb ON mt.bucket_brand_id = bkb.id
// LEFT JOIN
//     GearboxBrands gb ON mt.gearbox_brand_id = gb.id
// WHERE
//     m.id = 1;  -- Замените на нужный ID

// BEGIN TRANSACTION;

// INSERT INTO gearbox_replacement_history (
//     device_id,
//     old_gearbox_brand_id,
//     new_gearbox_brand_id,
//     replacement_date
// ) VALUES (
//     1, -- device_id
//     2, -- old_gearbox_brand_id
//     3, -- new_gearbox_brand_id
//     '2024-09-05' -- replacement_date
// );

// UPDATE bucketElevators
// SET current_gearbox_brand_id = 3, gearbox_installation_date = '2024-09-05'
// WHERE device_id = 1;

// COMMIT;

// BEGIN TRANSACTION;

// INSERT INTO bucket_replacement_history (
//     device_id,
//     old_bucket_brand_id,
//     new_bucket_brand_id,
//     replacement_date
// ) VALUES (
//     1, -- device_id
//     2, -- old_bucket_brand_id
//     3, -- new_bucket_brand_id
//     '2024-09-05' -- replacement_date
// );

// UPDATE bucketElevators
// SET current_bucket_brand_id = 3, bucket_installation_date = '2024-09-05'
// WHERE device_id = 1;

// COMMIT;

// BEGIN TRANSACTION;

// INSERT INTO belt_replacement_history (
//     device_id,
//     old_belt_brand_id,
//     new_belt_brand_id,
//     replacement_date
// ) VALUES (
//     1, -- device_id
//     2, -- old_belt_brand_id
//     3, -- new_belt_brand_id
//     '2024-09-05' -- replacement_date
// );

// UPDATE bucketElevators
// SET current_belt_brand_id = 3, belt_installation_date = '2024-09-05'
// WHERE device_id = 1;

// COMMIT;

// INSERT INTO belt_replacement_history (
//     device_id,
//     old_belt_brand_id,
//     new_belt_brand_id,
//     replacement_date
// ) VALUES (
//     ?,
//     ?,
//     ?,
//     ?
// );

// UPDATE bucketElevators
// SET belt_brand_id = ?, belt_installation_date = ?
// WHERE device_id = ?;
