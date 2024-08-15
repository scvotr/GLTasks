const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createSchedulesQ = async data => {
  const command = `
  INSERT INTO schedules (
    schedule_id, assign_user_id, schedule_status, schedule_type, schedule_title, schedule_description, schedule_comment,
    deadline_time, estimated_time, schedule_priority, schedule_priority_rate, appoint_user_id, appoint_department_id, appoint_subdepartment_id, appoint_position_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

  try {
    const payloads = JSON.parse(data.payLoad)
    for (const schedul of payloads) {
      await executeDatabaseQueryAsync(command, [
        schedul.schedule_id,
        schedul.assign_user_id,
        schedul.schedule_status,
        schedul.schedule_type,
        schedul.schedule_title,
        schedul.schedule_description,
        schedul.schedule_comment,
        schedul.deadline_time,
        schedul.estimated_time,
        schedul.schedule_priority,
        schedul.schedule_priority_rate,
        schedul.appoint_user_id,
        schedul.appoint_department_id,
        schedul.appoint_subdepartment_id,
        schedul.appoint_position_id,
      ])
    }
  } catch (error) {
    console.error('Error - createSchedules:', error)
    throw error
  }
}

const updateScheduleQ = async data => {
  const command = `
  UPDATE schedules
  SET
    assign_user_id = ?, 
    schedule_status = ?, 
    schedule_type = ?, 
    schedule_title = ?, 
    schedule_description = ?, 
    schedule_comment = ?, 
    deadline_time = ?, 
    estimated_time = ?, 
    schedule_priority = ?, 
    schedule_priority_rate = ?, 
    appoint_user_id = ?, 
    appoint_department_id = ?, 
    appoint_subdepartment_id = ?, 
    appoint_position_id = ?
  WHERE
    schedule_id = ?
`
  const command2 = `
  UPDATE schedules
  SET
    schedule_status = ?
  WHERE
    schedule_id = ?
`
  const command3 = `
  UPDATE schedules
  SET
    schedule_description = ?,
    deadline_time = ?
  WHERE
    schedule_id = ?
`

  try {
    const payload = JSON.parse(data.payLoad)
    console.log('dddddddd', payload)
    
    if(payload.schedule_description) {
      await executeDatabaseQueryAsync(command3, [
        payload.schedule_description,
        payload.deadline_time,
        payload.schedule_id, // schedule_id используется в условии WHERE
      ])
    } else {
      await executeDatabaseQueryAsync(command2, [
        payload.schedule_status,
        payload.schedule_id, // schedule_id используется в условии WHERE
      ])
    }  
  } catch (error) {
    console.error('Error - updateSchedules:', error)
    throw error
  }
}

const getAllSchedulesByUserIdQ = async user_id => {
  const command = `
    SELECT schedules.*
    FROM schedules
    LEFT JOIN users AS assign_user ON schedules.assign_user_id = assign_user.id
    LEFT JOIN users AS appoint_user ON schedules.appoint_user_id = appoint_user.id
    WHERE assign_user.id = ?
  `

  try {
    const result = await executeDatabaseQueryAsync(command, [user_id])
    return result // Возвращаем результат выполнения запроса
  } catch (error) {
    console.error('Error fetching schedules by user ID:', error)
    throw error // Пробрасываем ошибку для дальнейшей обработки
  }
}

const removeScheduleByIdQ = async schedule_id => {
  const command = `
    DELETE FROM schedules
    WHERE schedule_id = ?
  `

  //! REMOVE COMMENTS

  try {
    const result = await executeDatabaseQueryAsync(command, [schedule_id])
    return result
  } catch (error) {
    console.error('Error fetching remove schedules by schedule ID:', error)
    throw error
  }
}

module.exports = {
  createSchedulesQ,
  updateScheduleQ,
  getAllSchedulesByUserIdQ,
  removeScheduleByIdQ,
}
