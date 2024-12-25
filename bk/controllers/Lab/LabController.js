const {
  createNewReqForAvailableQ,
  appendApprovalsUsersQ,
  getUsersForApprovalQ,
  getAllRequestsWithApprovalsQ,
  getAllRequestsQ,
  updateApprovalsUserQ,
  addLabReqReadStatusQ,
  appendUserForApprovalQ,
  updateLabReqReadStatusQ,
  updateAppendApprovalsUsersQ,
} = require('../../Database/queries/Lab/labQueries')
const { saveAndConvert } = require('../../utils/files/saveAndConvert')
const { handleError, sendResponseWithData } = require('../../utils/response/responseUtils')
const { update } = require('../Admin/Devices/Motors/MotorController')

class LabController {
  async addNewLabsReqForAvailability(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await createNewReqForAvailableQ(payLoad)
      await appendUserForApprovalQ(payLoad)
      sendResponseWithData(res, 'addNewLabsReqForAvailability-ok')
    } catch (error) {
      handleError(res, 'addNewLabsReqForAvailability')
    }
  }

  async getAllRequestsWithApprovals(req, res) {
    const authDecodeUserData = req.user
    // Проверяем, есть ли данные пользователя
    if (!authDecodeUserData) {
      return handleError(res, 'User data not found')
    }
    const payLoad = JSON.parse(authDecodeUserData.payLoad)
    try {
      // Получаем все запросы
      const requests = await getAllRequestsQ()
      // Проверяем, есть ли запросы
      if (!requests || requests.length === 0) {
        return sendResponseWithData(res, []) // Возвращаем пустой массив, если запросов нет
      }
      // Создаем массив промисов для получения пользователей для каждого запроса
      const requestsWithUsers = await Promise.all(
        requests.map(async request => {
          try {
            // Получаем пользователей для текущего запроса
            const users = await getUsersForApprovalQ(request.reqForAvail_id)
            // Возвращаем объект с данными запроса и пользователями
            return {
              ...request, // Все данные запроса
              users: users || [], // Добавляем пользователей или пустой массив, если пользователей нет
            }
          } catch (userError) {
            console.error('Ошибка при получении пользователей для запроса:', userError)
            return {
              ...request,
              users: [], // Возвращаем пустой массив пользователей в случае ошибки
            }
          }
        })
      )
      // Отправляем ответ с данными
      sendResponseWithData(res, requestsWithUsers)
    } catch (error) {
      console.error('Ошибка при получении запросов с одобрениями:', error)
      handleError(res, 'addNewLabsReqForAvailability')
    }
  }

  async getUserConfirmation(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await updateApprovalsUserQ(payLoad)
      // обновляем статус прочтено
      // await appendApprovalsUsersQ(payLoad)
      await updateAppendApprovalsUsersQ(payLoad)
      sendResponseWithData(res, 'getUserConfirmation-ok')
    } catch (error) {
      console.error('Ошибка при получении запросов с одобрениями:', error)
      handleError(res, 'getUserConfirmation')
    }
  }
  async updateReadStatus(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await updateLabReqReadStatusQ(payLoad)
      sendResponseWithData(res, 'updateReadStatus-ok')
    } catch (error) {
      console.error('Ошибка при updateReadStatus:', error)
      handleError(res, 'updateReadStatus')
    }
  }
  async addFilesForRequest(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields
      const files = postPayload.files
      const taskFolderName = fields.reqForAvail_id
      const fileNames = []

      for (const [key, file] of Object.entries(files)) {
        try {
          const fileName = await saveAndConvert(file, 'labRequests', taskFolderName)
          fileNames.push(fileName.fileName)
        } catch (error) {
          console.error('Error saving file:', error)
        }
      }

      const data = {
        fields,
        fileNames,
      }

      console.log(data)

      // await updateLabReqReadStatusQ(payLoad)
      sendResponseWithData(res, 'addFilesForRequest-ok')
    } catch (error) {
      console.error('Ошибка при addFilesForRequest:', error)
      handleError(res, 'addFilesForRequest')
    }
  }
}

module.exports = new LabController()
