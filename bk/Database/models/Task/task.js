const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableTasks = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS tasks (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           task_id INTEGER NOT NULL UNIQUE,
           task_descript TEXT,
           task_priority TEXT,
           task_status TEXT NOT NULL,
           task_status_ref TEXT, --NOT NULL,
           deadline DATETIME,
           appoint_user_id INTEGER NOT NULL,
           appoint_department_id INTEGER NOT NULL,
           appoint_subdepartment_id  INTEGER NOT NULL,
           appoint_position_id INTEGER NULL,
           responsible_user_id INTEGER NULL,
           responsible_department_id INTEGER NOT NULL,
           responsible_subdepartment_id INTEGER NOT NULL,
           responsible_position_id INTEGER NULL,
           created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           approved_on DATETIME,                              -- Дата согласования задачи
           reject_on DATETIME,                                -- Дата отклонения задачи
           confirmation_on DATETIME,                          -- Дата запрос на подтверждение задачи
           closed_on DATETIME,                                -- Дата закрытия задачи
           setResponseSubDep_on DATETIME,                     -- Дата назначения отдела
           setResponseUser_on DATETIME,                       -- Дата назначения пользователя
           FOREIGN KEY(appoint_user_id) REFERENCES users(id)
           FOREIGN KEY(appoint_department_id) REFERENCES departments(id),
           FOREIGN KEY(appoint_subdepartment_id) REFERENCES subdepartments(id)
           FOREIGN KEY(appoint_position_id) REFERENCES position(id)
           FOREIGN KEY(responsible_user_id) REFERENCES users(id)
           FOREIGN KEY(responsible_department_id) REFERENCES departments(id),
           FOREIGN KEY(responsible_subdepartment_id) REFERENCES subdepartments(id)
           FOREIGN KEY(responsible_position_id) REFERENCES position(id)
           FOREIGN KEY(task_status_ref) REFERENCES taskStatus(status)
       )`, [])
  } catch (error) {
    console.log('DB ERROR - createTableTasks: ', error)
  }
}

module.exports = {
  createTableTasks
}

// class Task {
//   async createTaskTable() {
//     try {
//       await executeDatabaseQueryAsync(
//         `CREATE TABLE IF NOT EXISTS tasks (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             task_id INTEGER NOT NULL,
//           )`, "run"
//       )
//     } catch (error) {
//       console.log('DB ERROR createTaskTable: ', error)
//     }
//   }
// }

// module.exports = Task

// **tasks**
// Эта таблица содержит информацию о задачах, их статусе и назначении.

// | Поле                     | Тип данных      | Описание                                                                                                       |
// |------------------------- |-----------------|----------------------------------------------------------------------------------------------------------------|
// | id                       | INTEGER         | Первичный ключ, уникальный идентификатор задачи                                                                 |
// | task_id                  | INTEGER         | Уникальный идентификатор задачи                                                                                  |
// | task_descript            | TEXT            | Описание задачи                                                                                                 |
// | task_priority            | TEXT            | Приоритет задачи                                                                                                |
// | task_status              | TEXT            | Текущий статус задачи                                                                                            |
// | task_status_ref          | TEXT            | Ссылка на статус задачи в таблице `taskStatus`                                                                    |
// | deadline                 | DATETIME        | Крайний срок выполнения задачи                                                                                   |
// | appoint_user_id          | INTEGER         | Идентификатор пользователя, назначенного на выполнение задачи                                                     |
// | appoint_department_id    | INTEGER         | Идентификатор отдела, к которому относится назначенный пользователь                                               |
// | appoint_subdepartment_id | INTEGER         | Идентификатор подотдела, к которому относится назначенный пользователь                                            |
// | appoint_position_id      | INTEGER         | Идентификатор должности назначенного пользователя (при наличии)                                                   |
// | responsible_user_id      | INTEGER         | Идентификатор пользователя, ответственного за выполнение задачи                                                   |
// | responsible_department_id| INTEGER         | Идентификатор отдела, к которому относится ответственный пользователь                                              |
// | responsible_subdepartment_id | INTEGER      | Идентификатор подотдела, к которому относится ответственный пользователь                                           |
// | responsible_position_id  | INTEGER         | Идентификатор должности ответственного пользователя (при наличии)                                                 |
// | created_on               | TIMESTAMP       | Дата и время создания записи                                                                                     |
// | approved_on              | DATETIME        | Дата согласования задачи                                                                                         |
// | reject_on                | DATETIME        | Дата отклонения задачи                                                                                           |
// | confirmation_on          | DATETIME        | Дата запроса на подтверждение задачи                                                                             |
// | closed_on                | DATETIME        | Дата закрытия задачи                                                                                             |
// | setResponseSubDep_on     | DATETIME        | Дата назначения ответственного подотдела                                                                        |
// | setResponseUser_on       | DATETIME        | Дата назначения ответственного пользователя                                                                       |

// **Связи с другими таблицами:**
// - `appoint_user_id`, `responsible_user_id` связаны с таблицей `users` по полю `id`.
// - `appoint_department_id`, `responsible_department_id` связаны с таблицей `departments` по полю `id`.
// - `appoint_subdepartment_id`, `responsible_subdepartment_id` связаны с таблицей `subdepartments` по полю `id`.
// - `appoint_position_id`, `responsible_position_id` связаны с таблицей `position` по полю `id`.
// - `task_status_ref` связано с таблицей `taskStatus` по полю `status`.