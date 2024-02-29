const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTablePositions = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS positions     (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        subdepartment_id INTEGER,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id)
      )`, [])
    // Выполняем проверку наличия записей в таблице
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM positions  ', 'get');
    if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
      // await queryAsyncWraper("INSERT INTO positions (name,  department_id, subdepartment_id) VALUES ('новый', 1, 1), ('Начальник ХПР', 2, 2), ('Гл. специалист по монтажу', 2, 2), ('Инженер АСУ ТП', 2, 2), ('Гл. Энергетик', 2, 2), ('Инженер по ГХ', 2, 2), ('Гл. Инженер', 3, 3), ('Гл. механик', 3, 3), ('Инженер по механизации', 3, 3), ('Инженер по аспирации', 3, 3), ('Гл. энергетик', 3, 3), ('Инженер АСУ ТП', 3, 3), ('Инженер КИПиА', 3, 3), ('Зав гаражом', 3, 3), ('Гл. Инженер', 4, 4), ('Гл. механик', 4, 4), ('Инженер по механизации',4, 4), ('Инженер по аспирации', 4, 4), ('Гл. энергетик', 4, 4), ('Инженер АСУ ТП', 4, 4), ('Инженер КИПиА', 4, 4), ('Зав гаражом',4, 4) ", 'run');
      await queryAsyncWraper("INSERT INTO positions (name,  department_id, subdepartment_id) VALUES ('новый', 1, 1), ('Начальник ХПР', 2, 2), ('Гл. специалист по монтажу', 2, 2), ('Инженер АСУ ТП', 2, 2), ('Гл. Энергетик', 2, 2), ('Инженер по ГХ', 2, 2), ('Гл. Инженер', 3, 3), ('Гл. механик', 3, 3), ('Инженер по механизации', 3, 3), ('Инженер по аспирации', 3, 3), ('Гл. энергетик', 3, 3), ('Инженер АСУ ТП', 3, 3), ('Инженер КИПиА', 3, 3), ('Зав гаражом', 3, 3), ('Зам. по производству', 3, 5), ('Нач. Лаб', 3, 5), ('Cт. мастер', 3, 5), ('Мастер ПРР', 3, 5), ('Гл. Инженер', 4, 4), ('Гл. механик', 4, 4), ('Инженер по механизации',4, 4), ('Инженер по аспирации', 4, 4), ('Гл. энергетик', 4, 4), ('Инженер АСУ ТП', 4, 4), ('Инженер КИПиА', 4, 4), ('Зав гаражом',4, 4), ('Зам. по производству', 4, 6), ('Нач. Лаб', 4, 6), ('Ст. Мастер Эл-1', 4, 6), ('Ст. Мастер Эл-2', 4, 6), ('Мастер ПРР', 4, 6)", 'run');
    }
  } catch (error) {
    console.error('DB ERROR - createTablePositions: ', error);
  }
}

module.exports = {
  createTablePositions
}
