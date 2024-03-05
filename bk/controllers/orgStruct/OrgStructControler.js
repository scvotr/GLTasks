'use strict'

const { getAllDepartmentsQ } = require("../../Database/queries/OrgStructure/departmensQuery")

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
}

module.exports = new OrgStructControler()