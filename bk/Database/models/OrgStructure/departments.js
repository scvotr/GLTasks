const { executeDatabaseQueryAsync, queryAsyncWraper } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableDepartments = async () => {
  try {
    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS departments  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`, [])
    // Выполняем проверку наличия записей в таблице
    const rows = await queryAsyncWraper('SELECT COUNT(*) FROM departments', 'get');
    if (rows['COUNT(*)'] === 0) { // Если записей нет, то выполняем вставку начальных значений
      await queryAsyncWraper("INSERT INTO departments (name) VALUES ('новый'), ('Гелио-Пакс'), ('Алексиковский Э.'), ('Панфиловский Э.')", 'run');
      // await queryAsyncWraper("INSERT INTO tasks (id,task_id,task_descript,task_priority,task_status,deadline,appoint_user_id,appoint_department_id,appoint_subdepartment_id,appoint_position_id,responsible_user_id,responsible_department_id,responsible_subdepartment_id,responsible_position_id,created_on,approved_on,reject_on,confirmation_on,closed_on,setResponseSubDep_on,setResponseUser_on) VALUES (5,'0e8f694a-a47e-441e-8569-91c9399c61ef','Назначить на старшего мастера','false','closed','2023-08-28',11,2,2,NULL,NULL,3,5,17,'2023-08-25 05:19:23','2023-08-25 05:20:18',NULL,'2023-12-11 07:32:08','2023-12-11 07:32:45','2023-12-11 07:32:01',NULL)")
      // await queryAsyncWraper(insertTasks)
      // await queryAsyncWraper(insertTasksFiles)
    }
  } catch (error) {
    console.error('DB ERROR - createTableDepartments: ', error);
  }
}

module.exports = {
  createTableDepartments
}