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
  deleteReqForLabQ,
  sendNotifyThenNewCommentQ,
  getAllLabReqCommentQ,
  addNewLabReqCommentQ,
} = require('../../Database/queries/Lab/labQueries')
const { executeDatabaseQueryAsync } = require('../../Database/utils/executeDatabaseQuery/executeDatabaseQuery')
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

      console.log(data.fields.reqForAvail_id)
      console.log(data.fields.filesToRemove)
      console.log(data.fields.new_files)
      console.log(data.fileNames)

      // !--------------------------------------------
      // Добавляем файлы к задаче (опционально)
      for (let i = 0; i < data.fileNames.length; i++) {
        const file_name = data.fileNames[i]
        if (!file_name) {
          //.file_name || !file.file_path
          continue
        }

        const command3 = `INSERT INTO lab_req_files (req_id, file_name, file_path) VALUES (?, ?, ?);`
        try {
          await executeDatabaseQueryAsync(command3, [data.fields.reqForAvail_id, file_name])
          console.log(`File ${file_name} added successfully to the lab request`);
        } catch (error) {
          console.error(`Error adding file ${file_name} to the lab request: `, error)
          throw new Error('Ошибка запроса к базе данных')
        }
      }
      // !--------------------------------------------

      // await updateLabReqReadStatusQ(payLoad)
      sendResponseWithData(res, 'addFilesForRequest-ok')
    } catch (error) {
      console.error('Ошибка при addFilesForRequest:', error)
      handleError(res, 'addFilesForRequest')
    }
  }
  async deleteReqForLab(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await deleteReqForLabQ(payLoad)
      sendResponseWithData(res, 'deleteReqForLab-ok')
    } catch (error) {
      console.error('Ошибка при deleteReqForLab:', error)
      handleError(res, 'deleteReqForLab')
    }
  }
  async addNewLabReqComment(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await addNewLabReqCommentQ(payLoad)
      // Отправка уведомления
      await sendNotifyThenNewCommentQ(payLoad)
      sendResponseWithData(res, 'addNewLabReqComment-ok')
    } catch (error) {
      console.error('Ошибка при addNewLabReqComment:', error)
      handleError(res, 'addNewLabReqComment')
    }
  }
  async getAllLabReqComment(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      const allComments = await getAllLabReqCommentQ(payLoad)
      sendResponseWithData(res, allComments)
    } catch (error) {
      console.error('Ошибка при getAllLabReqCommentQ:', error)
      handleError(res, 'getAllLabReqCommentQ')
    }
  }
}

module.exports = new LabController()
