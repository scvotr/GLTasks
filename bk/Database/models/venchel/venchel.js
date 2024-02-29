const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createVenchelTable = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS venchels (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           venchel_id INTEGER NOT NULL,
           position TEXT NOT NULL,
           type TEXT NOT NULL,
           pos_num TEXT NOT NULL,
           model TEXT NOT NULL,
           location TEXT NOT NULL,
           power TEXT NOT NULL,
           width TEXT NOT NULL,
           height TEXT NOT NULL,
           department_id INTEGER,
           sector_id INTEGER,
           workshop_id INTEGER,
           FOREIGN KEY (department_id) REFERENCES departments (id),
           FOREIGN KEY (workshop_id) REFERENCES workshops (id)
       )`, []
    )
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
  createVenchelTable
}