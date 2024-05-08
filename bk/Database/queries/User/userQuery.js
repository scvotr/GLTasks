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
      users.email_for_notify,
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

const getAllUsersBySubDepIdQ = async (userSubDepId) => {
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
      users.email_for_notify,
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
    WHERE subdepartments.id = ?;`;

    return await executeDatabaseQueryAsync(command, [userSubDepId], 'all');
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const editUserDataQ = async(data) => {
  try {
    console.log('>>>>>>', data)
    const {id, last_name, first_name, middle_name, internal_phone, external_phone, office_number, email_for_notify} = data
    const command = `UPDATE users SET last_name = ?, first_name = ?, middle_name = ?, internal_phone = ?, external_phone = ?, office_number = ?, email_for_notify = ? WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [last_name, first_name, middle_name, internal_phone, external_phone, office_number, email_for_notify, id], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getUserEmailQ = async(user_id) => {
  try {
    return await executeDatabaseQueryAsync(`SELECT email_for_notify FROM users WHERE id = ?`, [user_id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getLeadEmailQ = async (subdepartment_id) => {
  try {
    const query = `
      SELECT email_for_notify 
      FROM users 
      WHERE subdepartment_id = ? AND role = 'chife'
    `;
    return await executeDatabaseQueryAsync(query, [subdepartment_id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const getGeneralEmailQ = async (department_id) => {
  try {
    const query = `
      SELECT email_for_notify 
      FROM users 
      WHERE department_id = ? AND role = 'general'
    `;
    return await executeDatabaseQueryAsync(query, [department_id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const getLeadIdQ = async (subdepartment_id) => {
  try {
    const query = `
      SELECT id 
      FROM users 
      WHERE subdepartment_id = ? AND role = 'chife'
    `;
    return await executeDatabaseQueryAsync(query, [subdepartment_id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const getGeneralIdQ = async (department_id) => {
  try {
    const query = `
      SELECT id 
      FROM users 
      WHERE department_id = ? AND role = 'general'
    `;
    return await executeDatabaseQueryAsync(query, [department_id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

module.exports = {
  editUserDataQ,
  getUserByIdQ,
  getAllUsersBySubDepIdQ,
  getUserEmailQ,
  getLeadEmailQ,
  getLeadIdQ,
  getGeneralEmailQ,
  getGeneralIdQ,
}