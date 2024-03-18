'use strict'

const { getThumbnailFiles } = require("../../../utils/files/getThumbnailFiles");
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery");

const getAllTasksQ = async () => {
  const command = `
    SELECT 
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
      appoint_user.name AS appoint_user_name,
      t.appoint_department_id, 
      appoint_departments.name AS appoint_department_name,
      t.appoint_subdepartment_id,
      appoint_subdepartments.name AS appoint_subdepartment_name,
      t.responsible_user_id, -- ПОЛЬЗОВТЕЛЬ
      responsible_user.name AS responsible_user_name,
      t.responsible_department_id,  -- ДЕПАРТАМЕНТ
      responsible_departments.name AS responsible_department_name,
      t.responsible_subdepartment_id, -- ПОДРАЗДЕЛЕНИ
      responsible_subdepartments.name AS responsible_subdepartment_name,
      t.responsible_position_id, -- ОТДЕЛ
      responsible_position.name AS responsible_position_name,
      GROUP_CONCAT(f.file_name, '|') AS file_names
    FROM tasks t
      LEFT JOIN users AS appoint_user ON t.appoint_user_id = appoint_user.id
      LEFT JOIN departments AS appoint_departments ON t.appoint_department_id = appoint_departments.id
      LEFT JOIN subdepartments AS appoint_subdepartments ON t.appoint_subdepartment_id = appoint_subdepartments.id
      LEFT JOIN users AS responsible_user ON t.responsible_user_id = responsible_user.id
      LEFT JOIN departments AS responsible_departments ON t.responsible_department_id = responsible_departments.id
      LEFT JOIN subdepartments AS responsible_subdepartments ON t.responsible_subdepartment_id = responsible_subdepartments.id
      LEFT JOIN positions AS responsible_position ON t.responsible_position_id = responsible_position.id
      LEFT JOIN task_files f ON t.task_id = f.task_id
    GROUP BY t.task_id`;

  try {
    const files = await executeDatabaseQueryAsync(command, [])
    return await getThumbnailFiles(files)
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных getAllTasksQ')
  }
}

module.exports = {
  getAllTasksQ,
}