'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const checkEqualNameQ = async (name) => {
  try {
    return await executeDatabaseQueryAsync(`SELECT * FROM users WHERE name = ?`, [name])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const checkEqualEmailQ = async (email) => {
  try {
    return await executeDatabaseQueryAsync(`SELECT * FROM users WHERE email = ?`, [email])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const createNewUserQ = async (user) => {
  const { name, email, password, pincode, role, department_id, subdepartment_id, position_id } = user;
  const command = `INSERT INTO users(name, email, password, pin_code, role, role_ref, department_id, subdepartment_id, position_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  try {
    await executeDatabaseQueryAsync(command, [ name, email, password, pincode, role || 'user', 2, department_id || 1, subdepartment_id || 1, position_id || 1 ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const getNewUserQ = async (name, pass) => {
  try {
    return await executeDatabaseQueryAsync(`SELECT * FROM users WHERE name = ? AND password = ?`, [name, pass]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const changeUserPasswordQ = async (user) => {
  try {
    const { id, password } = user;
    const command = `UPDATE users SET password = ? WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [password, id], 'run');    
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных changeUserPasswordQ')
  }
}

module.exports ={
  checkEqualNameQ,
  checkEqualEmailQ,
  createNewUserQ,
  getNewUserQ,
  changeUserPasswordQ,
}