const { createSchedulesQ, getAllSchedulesByUserIdQ, removeScheduleByIdQ, updateScheduleQ } = require("../../Database/queries/Schedules/scheduleQueries")

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

class ScheduleController {
  async addNewSchedules(req, res) {
    try {
      const authDecodeUserData = req.user
      await createSchedulesQ(authDecodeUserData)
        sendResponseWithData(res, 'addNewSchedules-ok')
    } catch (error) {
      handleError(res, 'addNewSchedules')
    }
  }

  async updateSchedule(req, res) {
    try {
      const authDecodeUserData = req.user
      await updateScheduleQ(authDecodeUserData)
        sendResponseWithData(res, 'updateSchedule-ok')
    } catch (error) {
      handleError(res, 'updateSchedule')
    }
  }

  async getAllSchedulesByUserId(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = JSON.parse(authDecodeUserData.payLoad)
      const result = await getAllSchedulesByUserIdQ(user_id)
      sendResponseWithData(res, result)
    } catch (error) {
      handleError(res, 'getAllSchedulesByUserId')
    }
  }
  async getAllSchedulesBySubDepId(req, res) {
    try {
      const authDecodeUserData = req.user
      console.log('getAllSchedulesBySubDepId', authDecodeUserData)
      const data = JSON.parse(authDecodeUserData.payLoad)

      //   sendResponseWithData(res, 'editUserData - ok')
    } catch (error) {
      handleError(res, 'getAllSchedulesBySubDepId')
    }
  }
  async removeSchedule(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await removeScheduleByIdQ(data)
        sendResponseWithData(res, 'removeSchedule - ok')
    } catch (error) {
      handleError(res, 'removeSchedule')
    }
  }
}

module.exports = new ScheduleController()
