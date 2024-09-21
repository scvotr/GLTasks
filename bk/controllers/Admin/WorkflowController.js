'use strict'

const { getAllWorkflowByDepQ, getAllWorkshopsByDepartmentIdQ, createWorkflowQ, deleteWorkflowQ, updateWorkflowQ } = require("../../Database/queries/Workflow/workflowCRUD")

const sendResponseWithData = (res, data) => {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(data))
  res.end()
}

const handleError = (res, error) => {
  console.log('handleError', error)
  res.statusCode = 500
  res.end(
    JSON.stringify({
      error: error,
    })
  )
}

class WorkflowController {
  async getAllWorkflowByDep(req, res) {
    try {
      const data = await getAllWorkflowByDepQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: getAllWorkflowByDep')
    }
  }

  async getAllWorkshopsByDepId(req, res) {
    try {
      const authDecodeUserData = req.user
      console.log(authDecodeUserData)
      // const data = await getAllWorkshopsByDepartmentIdQ()
      sendResponseWithData(res, 'data')
    } catch (error) {
      handleError(res, 'Error: getAllWorkflowByDep')
    }
  }

  async createWorkflow(req, res) {
    try {
      const authDecodeUserData = req.user
      await createWorkflowQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'createWorkflow-ok')
    } catch (error) {
      handleError(res, 'Error: createWorkflow')
    }
  }

  async updateWorkflow(req, res) {
    try {
      const authDecodeUserData = req.user
      await updateWorkflowQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'updateWorkflow-ok')
    } catch (error) {
      handleError(res, 'Error: updateWorkflow')
    }
  }

  async deleteWorkflow(req, res) {
    try {
      const authDecodeUserData = req.user
      await deleteWorkflowQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'deleteWorkflow-ok')
    } catch (error) {
      handleError(res, 'Error: deleteWorkflow')
    }
  }
}

module.exports = new WorkflowController()

// console.log(authDecodeUserData) //объект
// console.log(authDecodeUserData.payLoad)//строка JSON
// console.log(JSON.parse(authDecodeUserData.payLoad)) //объект JavaScript
