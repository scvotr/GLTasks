'use strict'
const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

class LabAnalyticQueries {
  async executeQuery(query, method_name, params = []) {
    try {
      const result = await executeDatabaseQueryAsync(query, params)
      return result
    } catch (error) {
      console.log(`Error-${method_name}`, error)
      throw error
    }
  }
  async getDataQ() {
    const query = `
      SELECT
        reqForAvail_id,
        reqNum,
        d.name AS dep_name,
        --c.name AS cont_name, 
        salesPoint,
        culture,
        contractor,
        tonnage,
        SUM(CAST(total_tonnage AS FLOAT)) AS total_shipped,
        SUM(CAST(aspiration_dust AS FLOAT)) AS total_aspiration_dust,
        SUM(CAST(natural_loss AS FLOAT)) AS total_natural_loss
      FROM
        reqForAvailableTable rft
        JOIN departments d ON d.id = rft.selectedDepartment
        --JOIN contractors c ON c.id = rft.contractor_id
      WHERE
        req_status = 'closed'
      GROUP BY
        d.name,
        salesPoint,
        culture,
        contractor;
    `
    return this.executeQuery(query, 'getDataQ')
  }
  async getRequestByIDQ(request_id) {
    const query = `
      SELECT *
      FROM reqForAvailableTable
      WHERE reqForAvail_id = ?
    `
    return this.executeQuery(query, 'getRequestByIDQ', request_id, 'get') //db.all(): Всегда возвращает массив (даже пустой [])
    // const result = await this.executeQuery(query, 'getRequestByIDQ', [request_id]) //db.all() всегда возвращает массив ([{}])
    // return result.length > 0 ? result[0] : null // Возвращаем первый элемент или null, если массив пуст
  }
}

module.exports = new LabAnalyticQueries()
