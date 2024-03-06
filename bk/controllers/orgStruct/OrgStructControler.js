'use strict'

const { getAllDepartmentsQ } = require("../../Database/queries/OrgStructure/departmensQuery")
const { getPositionsByIDQ, getPositionsQ, getUserByPositionIdQ } = require("../../Database/queries/OrgStructure/positionQuery")
const { getSubDepartmentsByIDQ } = require("../../Database/queries/OrgStructure/subDepartmetsQuery")

class OrgStructControler {
  async getDepartments(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = await getAllDepartmentsQ()
      if (data.length === 0) {
        res.statusCode = 204
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
      }
      res.end()
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({
        error: 'getDepartments'
      }))
    }
  }
  async getSubDepartmentsByID(req, res) {
    try {
      const dep_id = req.user.payLoad

      const data = await getSubDepartmentsByIDQ(dep_id)
      if (data.length === 0) {
        res.statusCode = 204
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
      }
      res.end()
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({
        error: 'getSubDepartmentsByID'
      }))
    }
  }
  async getPositionsByID(req, res) {
    try {
      const subDep_id = req.user.payLoad
      const data = await getPositionsByIDQ(subDep_id)
      if (data.length === 0) {
        res.statusCode = 204
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
      }
      res.end()
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({
        error: 'getPositions'
      }))
    }
  }
  async getPositions(req, res) {
    try {
      const data = await getPositionsQ()
      if (data.length === 0) {
        res.statusCode = 204
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
      }
      res.end()
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({
        error: 'getPositions'
      }))
    }
  }
  async getUserByPositionId(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = authDecodeUserData.payLoad
      const data = await getUserByPositionIdQ(postPayload)
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(data))
      res.end()
    } catch (error) {
      console.log(error)
      res.statusCode = 500
      res.end(JSON.stringify({
        error: 'getUsersBySubDepId'
      }))
    }
  }
}

module.exports = new OrgStructControler()