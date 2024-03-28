'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createNewDep = async (data) => {
  const { dep_name } = data
  const command = `INSERT INTO departments (name) VALUES (?)`
  try {
    await executeDatabaseQueryAsync(command, [ dep_name ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const deleteDep = async (dep_id) => {
  const command = 'DELETE FROM departments WHERE id = ?'
  try {
    await executeDatabaseQueryAsync(command, [ dep_id ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const createNewSubDep = async (data) => {
  const { department_id, subdep_name } = data
  const command = `INSERT INTO subdepartments (department_id, name) VALUES (?, ?)`
  try {
    await executeDatabaseQueryAsync(command, [ department_id, subdep_name ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const deleteSubDep = async (subDep_id) => {
  const command = 'DELETE FROM subdepartments WHERE id = ?'
  try {
    await executeDatabaseQueryAsync(command, [ subDep_id ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const createNewPosition = async (data) => {
  const { position_name, department_id, subdepartment_id } = data;
  const command = `INSERT INTO positions (name,  department_id, subdepartment_id) VALUES (?, ?, ?)`
  try {
    await executeDatabaseQueryAsync(command, [ position_name, department_id, subdepartment_id ], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const deletePositionQ = async (id) => {
  try {
    console.log('deletePositionQ', id)
    const command = `DELETE FROM positions WHERE id = ?`
    await executeDatabaseQueryAsync(command, [id], 'run')
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}


module.exports = {
  createNewDep,
  deleteDep,
  createNewSubDep,
  deleteSubDep,
  createNewPosition,
  deletePositionQ,
}