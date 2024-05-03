const { createSchedulesQ, getAllSchedulesByUserIdQ } = require("../../Database/queries/Schedules/scheduleQueries")

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
  async authDecodeUserData(req, res) {
    try {
      const authDecodeUserData = req.user
      await createSchedulesQ(authDecodeUserData)
        sendResponseWithData(res, 'authDecodeUserData -ok')
    } catch (error) {
      handleError(res, 'addSchedules')
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
}

module.exports = new ScheduleController()
