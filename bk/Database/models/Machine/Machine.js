const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMachineTable = async () => {
  try {
    await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS machines`, [])

    // await executeDatabaseQueryAsync(
    //   `CREATE TABLE IF NOT EXISTS machines (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     machine_id INTEGER NOT NULL,
    //     type_id INTEGER NOT NULL,
    //     department_id INTEGER,
    //     workshop_id INTEGER,
    //     FOREIGN KEY (type_id) REFERENCES machineType(id),
    //     FOREIGN KEY (department_id) REFERENCES departments (id),
    //     FOREIGN KEY (workshop_id) REFERENCES workshops (id)
    //    )`,
    //   []
    // )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

const createMachineTypeTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS machineTypes`, [])

    // await executeDatabaseQueryAsync(
    //   `CREATE TABLE IF NOT EXISTS machineTypes  (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     name TEXT NOT NULL
    //    )`,
    //   []
    // )

    // const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM machineTypes')
    // if (rows[0].count === 0) {
    //   await executeDatabaseQueryAsync(
    //     `INSERT INTO machineTypes (name) VALUES
    //     ('нория'),
    //     ('вентилятор'),
    //     ('транспортер'),
    //     ('конвейер'),
    //     ('сепаратор'),
    //     ('БЗО'),
    //     ('МПО')`
    //   );
    // }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

const createMachineFilesTable = async () => {
  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS machineFiles`, [])
  try {
    // await executeDatabaseQueryAsync(
    //   // command
    //   `CREATE TABLE IF NOT EXISTS machineFiles (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     machine_id INTEGER,
    //     file_name TEXT,
    //     file_path TEXT,
    //     uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     FOREIGN KEY(machine_id) REFERENCES machine(machine_id)
    //    )`,
    //   []
    // )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createMachineTable,
  createMachineTypeTable,
  createMachineFilesTable,
}
