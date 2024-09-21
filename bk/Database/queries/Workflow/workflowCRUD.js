const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

// Create
const createWorkflowQ = async data => {
  try {
    const { workflow_name, workflow_dep } = data
    console.log(workflow_name, workflow_dep)
    const command = `
      INSERT INTO workshops (department_id, name) VALUES (?, ?)
    `
    await executeDatabaseQueryAsync(command, [workflow_dep, workflow_name])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

// Read all
const getAllWorkflowByDepQ = async () => {
  try {
    const command = `
    SELECT w.id, d.name AS department_name, w.department_id, w.name AS workshop_name
    FROM departments d
    JOIN workshops w ON d.id = w.department_id
    `
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

// Read
const getAllWorkshopsByDepartmentIdQ = async departmentId => {
  try {
    const command = `
      SELECT w.name AS workshop_name
      FROM workshops w
      WHERE w.department_id = ?
    `
    const rows = await executeDatabaseQueryAsync(command, [departmentId])
    return rows
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

// Update
const updateWorkflowQ = async data => {
  try {
    const { id, workflow_name, workflow_dep } = data
    console.log(id, workflow_name, workflow_dep)
    const command = `
      UPDATE workshops 
      SET department_id = ?, name = ? 
      WHERE id = ?
    `
    await executeDatabaseQueryAsync(command, [workflow_dep, workflow_name, id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

// Delete
const deleteWorkflowQ = async id => {
  try {
    console.log('!!!!!!!!!!!!', id)
    const command = `
      DELETE FROM workshops 
      WHERE id = ?
    `
    await executeDatabaseQueryAsync(command, [id])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  createWorkflowQ,
  updateWorkflowQ,
  deleteWorkflowQ,
  getAllWorkflowByDepQ,
  getAllWorkshopsByDepartmentIdQ,
}
