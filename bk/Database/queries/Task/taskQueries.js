'use strict'
const {
  getThumbnailFiles
} = require("../../../utils/files/getThumbnailFiles");
const {
  removeFolder
} = require("../../../utils/files/removeFolder");
const {
  executeDatabaseQueryAsync
} = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTask = async (data) => {
  let taskID;
  try {
    if (!data.fields.setResponseUser_on) {
       const command = `
        INSERT INTO tasks (task_id, task_descript, task_priority, appoint_user_id, appoint_position_id, appoint_department_id, appoint_subdepartment_id, responsible_position_id, responsible_department_id, responsible_subdepartment_id, task_status, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      await executeDatabaseQueryAsync(
        command,
        [
          data.fields.task_id,
          data.fields.task_descript,
          data.fields.task_priority,

          data.fields.appoint_user_id,
          data.fields.appoint_position_id,
          data.fields.appoint_department_id,
          data.fields.appoint_subdepartment_id,

          // data.fields.setResponseUser_on ? data.fields.responsible_user_id : null,

          data.fields.responsible_position_id,
          data.fields.responsible_department_id,
          data.fields.responsible_subdepartment_id,

          data.fields.task_status,
          data.fields.deadline,
        ], "run");
      taskID = data.fields.task_id;
    } else {
      console.log('Задача от начальника своему сотруднику!!!')
      const command = `
        INSERT INTO tasks (task_id, task_descript, task_priority, appoint_user_id, appoint_department_id, appoint_subdepartment_id, responsible_user_id, responsible_position_id, responsible_department_id, responsible_subdepartment_id, task_status, deadline, setResponseUser_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      await executeDatabaseQueryAsync(
        command,
        [
          data.fields.task_id,
          data.fields.task_descript,
          data.fields.task_priority,
          data.fields.appoint_user_id,
          data.fields.appoint_department_id,
          data.fields.appoint_subdepartment_id,
          data.fields.responsible_user_id,
          data.fields.responsible_position_id,
          data.fields.responsible_department_id,
          data.fields.responsible_subdepartment_id,
          data.fields.task_status,
          data.fields.deadline,
          // Возможно, здесь также нужно передать значение для setResponseUser_on
        ], "run");
      taskID = data.fields.task_id;
    }
  } catch (error) {
    console.error("createTask ERROR: ", error);
    throw new Error('Ошибка запроса к базе данных')
    return;
  }

  // Добавляем комментарий к задаче (опционально)
  if (data.fields.task_comment) {
    const command2 = `INSERT INTO task_comments (task_id, user_id ,comment) VALUES (?, ?, ?);`;
    try {
      await executeDatabaseQueryAsync(
        command2,
        [taskID, data.fields.appoint_user_id, data.fields.task_comment], "run");
    } catch (error) {
      console.error("Error adding task comment: ", error);
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  // Добавляем файлы к задаче (опционально)
  for (let i = 0; i < data.fileNames.length; i++) {
    const file_name = data.fileNames[i];
    if (!file_name) {
      //.file_name || !file.file_path
      continue;
    }

    const command3 = `INSERT INTO task_files (task_id, file_name, file_path) VALUES (?, ?, ?);`;
    try {
      await executeDatabaseQueryAsync(command3, [taskID, file_name], "run");
      // console.log(`File ${file_name} added successfully to the task`);
    } catch (error) {
      console.error(`Error adding file ${file_name} to the task: `, error);
      throw new Error('Ошибка запроса к базе данных')
    }
  }
}

// Read (Чтение)
const getTaskById = async (taskId) => {
  // Реализация получения задачи по ее ID
}

const getTasksForUser = async (userId) => {
  // Реализация получения задач для конкретного пользователя
}

// Update (Обновление)
const updateTaskDescription = async (taskId, newDescription) => {
  // Реализация обновления описания задачи
}

const updateTaskStatusQ = async (data) => {
  const {
    task_id,
    task_status
  } = data
  const command = `
    UPDATE tasks
    SET task_status = ?, approved_on = CURRENT_TIMESTAMP
    WHERE task_id = ?
  `;
  try {
    await executeDatabaseQueryAsync(command, [task_status, task_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const removeTaskQ = async (data, taskFolderName) => {
  try {
    const {
      task_id
    } = data
    const command = `
    DELETE FROM tasks
    WHERE task_id = ?
  `
    const command2 = `
    DELETE FROM task_files
    WHERE task_id = ?
  `
    const command3 = `
    DELETE FROM task_read_status
    WHERE task_id = ?
  `
    await executeDatabaseQueryAsync(command, [task_id])
    await executeDatabaseQueryAsync(command2, [task_id])
    await executeDatabaseQueryAsync(command3, [task_id])
    await removeFolder(taskFolderName, 'tasks')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных removeTaskQ')
  }
}

const getAllTasksByDepQ = async (dep_id) => {
  const command = `
    SELECT
      t.id, 
      t.task_id,
      t.task_descript,
      t.task_priority,
      t.task_status,
      t.deadline,
      t.appoint_user_id,
      t.created_on,
      t.approved_on,          -- Дата согласования задачи
      t.reject_on,            -- Дата отклонения задачи
      t.confirmation_on,      -- Дата запрос на подтверждение задачи
      t.closed_on,            -- Дата закрытия задачи
      t.setResponseSubDep_on, -- Дата назначения отдела
      t.setResponseUser_on,   -- Дата назначения пользователя
      appoint_user_f_name.first_name AS appoint_user_name,
      appoint_user_l_name.last_name AS appoint_user_last_name,
      appoint_user_m_name.middle_name AS appoint_user_middle_name,
      t.appoint_department_id, 
      appoint_departments.name AS appoint_department_name,
      t.appoint_subdepartment_id,
      appoint_subdepartments.name AS appoint_subdepartment_name,
      t.responsible_user_id,
      responsible_f_user.first_name AS responsible_user_name,
      responsible_l_user.last_name AS responsible_user_last_name,
      responsible_m_user.middle_name AS responsible_user_middle_name,
      t.responsible_department_id, 
      responsible_departments.name AS responsible_department_name,
      t.responsible_subdepartment_id,
      responsible_subdepartments.name AS responsible_subdepartment_name,
      t.appoint_position_id,
      appoint_position.name AS appoint_position_name,
      t.responsible_position_id,
      responsible_position.name AS responsible_position_name,
      --GROUP_CONCAT(f.file_name, '|') AS file_names,
      --GROUP_CONCAT(DISTINCT f.file_name) AS file_names,
      REPLACE(GROUP_CONCAT(DISTINCT f.file_name), ',', '|') AS file_names,
      trs.read_status AS read_status
    FROM tasks t
      LEFT JOIN users AS appoint_user_f_name ON t.appoint_user_id = appoint_user_f_name.id
      LEFT JOIN users AS appoint_user_l_name ON t.appoint_user_id = appoint_user_l_name.id
      LEFT JOIN users AS appoint_user_m_name ON t.appoint_user_id = appoint_user_m_name.id
      LEFT JOIN departments AS appoint_departments ON t.appoint_department_id = appoint_departments.id
      LEFT JOIN subdepartments AS appoint_subdepartments ON t.appoint_subdepartment_id = appoint_subdepartments.id
      LEFT JOIN users AS responsible_f_user ON t.responsible_user_id = responsible_f_user.id
      LEFT JOIN users AS responsible_l_user ON t.responsible_user_id = responsible_l_user.id
      LEFT JOIN users AS responsible_m_user ON t.responsible_user_id = responsible_m_user.id
      LEFT JOIN departments AS responsible_departments ON t.responsible_department_id = responsible_departments.id
      LEFT JOIN subdepartments AS responsible_subdepartments ON t.responsible_subdepartment_id = responsible_subdepartments.id
      LEFT JOIN positions AS appoint_position ON t.appoint_position_id = appoint_position.id
      LEFT JOIN positions AS responsible_position ON t.responsible_position_id = responsible_position.id
      LEFT JOIN task_files f ON t.task_id = f.task_id
      LEFT JOIN (
        SELECT task_id, user_id, read_status
        FROM task_read_status
        WHERE user_id = ?
      ) trs ON t.task_id = trs.task_id
    WHERE ? IN (t.appoint_department_id, t.responsible_department_id)
    GROUP BY t.task_id `;
  try {
    const taskFiles = await executeDatabaseQueryAsync(command, [dep_id, dep_id])
    return await getThumbnailFiles(taskFiles, 'tasks')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}
const getAllTasksBySubDepQ = async (subDep_id) => {
  const command = `
    SELECT
      t.id, 
      t.task_id,
      t.task_descript,
      t.task_priority,
      t.task_status,
      t.deadline,
      t.appoint_user_id,
      t.created_on,
      t.approved_on,          -- Дата согласования задачи
      t.reject_on,            -- Дата отклонения задачи
      t.confirmation_on,      -- Дата запрос на подтверждение задачи
      t.closed_on,            -- Дата закрытия задачи
      t.setResponseSubDep_on, -- Дата назначения отдела
      t.setResponseUser_on,   -- Дата назначения пользователя
      appoint_user_f_name.first_name AS appoint_user_name,
      appoint_user_l_name.last_name AS appoint_user_last_name,
      appoint_user_m_name.middle_name AS appoint_user_middle_name,
      t.appoint_department_id, 
      appoint_departments.name AS appoint_department_name,
      t.appoint_subdepartment_id,
      appoint_subdepartments.name AS appoint_subdepartment_name,
      t.responsible_user_id,
      responsible_f_user.first_name AS responsible_user_name,
      responsible_l_user.last_name AS responsible_user_last_name,
      responsible_m_user.middle_name AS responsible_user_middle_name,
      t.responsible_department_id, 
      responsible_departments.name AS responsible_department_name,
      t.responsible_subdepartment_id,
      responsible_subdepartments.name AS responsible_subdepartment_name,
      t.appoint_position_id,
      appoint_position.name AS appoint_position_name,
      t.responsible_position_id,
      responsible_position.name AS responsible_position_name,
      --GROUP_CONCAT(f.file_name, '|') AS file_names,
      --GROUP_CONCAT(DISTINCT f.file_name) AS file_names,
      REPLACE(GROUP_CONCAT(DISTINCT f.file_name), ',', '|') AS file_names,
      trs.read_status AS read_status
    FROM tasks t
      LEFT JOIN users AS appoint_user_f_name ON t.appoint_user_id = appoint_user_f_name.id
      LEFT JOIN users AS appoint_user_l_name ON t.appoint_user_id = appoint_user_l_name.id
      LEFT JOIN users AS appoint_user_m_name ON t.appoint_user_id = appoint_user_m_name.id
      LEFT JOIN departments AS appoint_departments ON t.appoint_department_id = appoint_departments.id
      LEFT JOIN subdepartments AS appoint_subdepartments ON t.appoint_subdepartment_id = appoint_subdepartments.id
      LEFT JOIN users AS responsible_f_user ON t.responsible_user_id = responsible_f_user.id
      LEFT JOIN users AS responsible_l_user ON t.responsible_user_id = responsible_l_user.id
      LEFT JOIN users AS responsible_m_user ON t.responsible_user_id = responsible_m_user.id
      LEFT JOIN departments AS responsible_departments ON t.responsible_department_id = responsible_departments.id
      LEFT JOIN subdepartments AS responsible_subdepartments ON t.responsible_subdepartment_id = responsible_subdepartments.id
      LEFT JOIN positions AS responsible_position ON t.responsible_position_id = responsible_position.id
      LEFT JOIN positions AS appoint_position ON t.appoint_position_id = appoint_position.id
      LEFT JOIN task_files f ON t.task_id = f.task_id
      LEFT JOIN (
        SELECT task_id, user_id, read_status
        FROM task_read_status
        WHERE user_id = ?
      ) trs ON t.task_id = trs.task_id
    WHERE ? IN (t.appoint_subdepartment_id, t.responsible_subdepartment_id)
    GROUP BY t.task_id `;
  try {
    const taskFiles = await executeDatabaseQueryAsync(command, [subDep_id, subDep_id])
    return await getThumbnailFiles(taskFiles, 'tasks')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const getAllUserTasksQ = async (user_id) => {
  const command = `
    SELECT 
    t.id,
    t.task_id,
    t.task_descript,
    t.task_priority,
    t.task_status,
    t.deadline,
    t.appoint_user_id,
    t.created_on,
    approved_on ,                              -- Дата согласования задачи
    reject_on ,                                -- Дата отклонения задачи
    confirmation_on ,                          -- Дата запрос на подтверждение задачи
    closed_on ,                                -- Дата закрытия задачи
    setResponseSubDep_on ,                     -- Дата назначения отдела
    setResponseUser_on ,                       -- Дата назначения пользователя
    appoint_user_f_name.first_name AS appoint_user_name,
    appoint_user_l_name.last_name AS appoint_user_last_name,
    appoint_user_m_name.middle_name AS appoint_user_middle_name,
    t.appoint_department_id, 
    appoint_departments.name AS appoint_department_name,
    t.appoint_subdepartment_id,
    appoint_subdepartments.name AS appoint_subdepartment_name,
    t.responsible_user_id, -- ПОЛЬЗОВТЕЛЬ
    responsible_f_user.first_name AS responsible_user_name,
    responsible_l_user.last_name AS responsible_user_last_name,
    responsible_m_user.middle_name AS responsible_user_middle_name,
    t.responsible_department_id,  -- ДЕПАРТАМЕНТ
    responsible_departments.name AS responsible_department_name,
    t.responsible_subdepartment_id, -- ПОДРАЗДЕЛЕНИ
    responsible_subdepartments.name AS responsible_subdepartment_name,
    t.appoint_position_id, -- ОТДЕЛ
    appoint_position.name AS appoint_position_name,
    t.responsible_position_id, -- ОТДЕЛ
    responsible_position.name AS responsible_position_name,
    GROUP_CONCAT(f.file_name, '|') AS file_names,
    trs.read_status AS read_status
  FROM tasks t
    LEFT JOIN users AS appoint_user_f_name ON t.appoint_user_id = appoint_user_f_name.id
    LEFT JOIN users AS appoint_user_l_name ON t.appoint_user_id = appoint_user_l_name.id
    LEFT JOIN users AS appoint_user_m_name ON t.appoint_user_id = appoint_user_m_name.id
    LEFT JOIN departments AS appoint_departments ON t.appoint_department_id = appoint_departments.id
    LEFT JOIN subdepartments AS appoint_subdepartments ON t.appoint_subdepartment_id = appoint_subdepartments.id
    LEFT JOIN users AS responsible_f_user ON t.responsible_user_id = responsible_f_user.id
    LEFT JOIN users AS responsible_l_user ON t.responsible_user_id = responsible_l_user.id
    LEFT JOIN users AS responsible_m_user ON t.responsible_user_id = responsible_m_user.id
    LEFT JOIN departments AS responsible_departments ON t.responsible_department_id = responsible_departments.id
    LEFT JOIN subdepartments AS responsible_subdepartments ON t.responsible_subdepartment_id = responsible_subdepartments.id
    LEFT JOIN positions AS appoint_position ON t.appoint_position_id = appoint_position.id
    LEFT JOIN positions AS responsible_position ON t.responsible_position_id = responsible_position.id
    LEFT JOIN task_files f ON t.task_id = f.task_id
    LEFT JOIN (
      SELECT task_id, user_id, read_status
      FROM task_read_status
      WHERE user_id = ?
    ) trs ON t.task_id = trs.task_id
  WHERE ? IN (t.appoint_user_id, t.responsible_user_id)
  GROUP BY t.task_id`

  try {
    const taskFiles = await executeDatabaseQueryAsync(command, [user_id, user_id])
    return await getThumbnailFiles(taskFiles, 'tasks')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const updateTaskByEventrQ = async (data) => {
  console.log('updateTaskByEventrQ', data.deadline_changed)
  try {
    const {
      responsible_position_id,
      task_status,
      task_id,
      responsible_user_id,
      setResponseUser_on,
      confirmation_on,
      reject_on,
      deadline_changed,
      closed_on
    } = data

    let fieldsToUpdate = []

    if (setResponseUser_on) {
      fieldsToUpdate.push('setResponseUser_on = CURRENT_TIMESTAMP')
    }
    if (confirmation_on) {
      fieldsToUpdate.push('confirmation_on = CURRENT_TIMESTAMP')
    }
    if (reject_on) {
      fieldsToUpdate.push('deadline = ?, reject_on = CURRENT_TIMESTAMP')
      // fieldsToUpdate.push('deadline = ?')
    }
    if (closed_on) {
      fieldsToUpdate.push('closed_on = CURRENT_TIMESTAMP')
    }

    let command = `
      UPDATE tasks
      SET responsible_position_id = ?, task_status = ?, responsible_user_id = ?, ${fieldsToUpdate}
      WHERE task_id = ?
    `;

    let params = [responsible_position_id, task_status, responsible_user_id]
    if (reject_on) {
      params.push(deadline_changed); // Добавляем значение deadline только при reject_on
    }
    params.push(task_id);

    // await executeDatabaseQueryAsync(command, [responsible_position_id, task_status, responsible_user_id, deadline_changed, task_id, ])
    await executeDatabaseQueryAsync(command, params);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных updateTaskByEventrQ')
  }
}

const deleteTaskFileQ = async(task_id, file_name) => {
  try {
    const command = `
      DELETE FROM task_files
      WHERE file_name = ? AND task_id = ?
    `;
    await executeDatabaseQueryAsync(command, [file_name, task_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных deleteTaskFileQ')
  }
}

const updateTaskDataQ = async(postPayload, fileNames = null) => {
  try {
    const {
      task_id,
      task_status,
      task_descript,
      deadline,
      responsible_department_id,
      responsible_subdepartment_id,
    } = postPayload.fields

    const command = `
    UPDATE tasks
      SET
        task_status = ?,
        task_descript = ?,
        deadline = ?,
        responsible_department_id  = ?,
        responsible_subdepartment_id  = ?
      WHERE task_id = ?
  `;

    await executeDatabaseQueryAsync(command, [
      task_status,
      task_descript,
      deadline,
      responsible_department_id,
      responsible_subdepartment_id,
      task_id,
    ]);

    const command3 = `INSERT INTO task_files (task_id, file_name, file_path) VALUES (?, ?, ?);`;
    if (fileNames.length > 0) {
      try {
        for (const fileName of fileNames) {
          await executeDatabaseQueryAsync(command3, [task_id, fileName], "run");
        }
      } catch (error) {
        throw new Error('updateTaskDataQ: Произошла ошибка при сохранении файла:', error);
      }
    }

  } catch (error) {
    throw new Error('updateTaskDataQ: Произошла ошибка при обновлении задачи:', error);
  }
}
 
module.exports = {
  createTask,
  getTaskById,
  getTasksForUser,
  updateTaskDescription,
  updateTaskStatusQ,
  removeTaskQ,
  getAllTasksByDepQ,
  getAllTasksBySubDepQ,
  getAllUserTasksQ,
  updateTaskByEventrQ,
  deleteTaskFileQ,
  updateTaskDataQ,
};