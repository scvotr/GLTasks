'use strict'

const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery");

const getUserByIdQ = async (userId) => {
  try {
    const command = `
    SELECT 
      users.id, 
      users.login, 
      users.email, 
      users.role,
      users.pin_code,
      users.last_name,
      users.first_name,
      users.middle_name,
      users.internal_phone,
      users.external_phone,
      users.office_number, 
      users.created_on,
      departments.id AS department_id,
      departments.name AS department, 
      subdepartments.id AS subdepartment_id,
      subdepartments.name AS subdepartment,
      positions.id AS position_id,
      positions.name AS position
    FROM 
      users 
      LEFT JOIN departments ON users.department_id = departments.id
      LEFT JOIN subdepartments ON users.subdepartment_id = subdepartments.id
      LEFT JOIN positions ON users.position_id = positions.id
    WHERE users.id = ?;`;

    return await executeDatabaseQueryAsync(command, [userId], 'get');
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const editUserDataQ = async(data) => {
  try {
    console.log('>>>>>>', data)
    const {id, last_name, first_name, middle_name, internal_phone, external_phone, office_number} = data
    const command = `UPDATE users SET last_name = ?, first_name = ?, middle_name = ?, internal_phone = ?, external_phone = ?, office_number = ? WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [last_name, first_name, middle_name, internal_phone, external_phone, office_number, id], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  editUserDataQ,
  getUserByIdQ,
}