'use strict'

const { addPendingNotification } = require("../../Database/queries/Notification/pendingNotificationQueries");
const {
  saveAndConvert
} = require("../../utils/files/saveAndConvert");
const {
  socketManager
} = require("../../utils/socket/socketManager");

const handleError = (res, error) => {
  console.log('handleError', error);
  res.statusCode = 500;
  res.end(JSON.stringify({
    error: error
  }));
};

class TasksControler {
  async addNewTask(req, res) {
    console.log('addNewTask')
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields;
      const files = postPayload.files
      const taskFolderName = fields.task_id
      const fileNames = [];
      for (const [key, file] of Object.entries(files)) {
        try {
          const fileName = await saveAndConvert(file, 'tasks', taskFolderName)
          fileNames.push(fileName.fileName);
        } catch (error) {
          console.error('Error saving file:', error);
        }
      }
      // формирую дату для записи в базу
      // при создании задачи уведомляется руководитель отдела
      const data = {
        fields,
        fileNames,
        user_id
      }

      console.log(fields)

      const io = socketManager.getIO()

      const inOneDep = data.fields.appoint_department_id === data.fields.responsible_department_id;
      const inDifDep = data.fields.appoint_department_id !== data.fields.responsible_department_id;
      const inOneSubDep = data.fields.appoint_subdepartment_id === data.fields.responsible_subdepartment_id;
      const inDifSubDep = data.fields.appoint_subdepartment_id !== data.fields.responsible_subdepartment_id;

      const noticeToResponsibleUser = (user_id) => {
        io.in('user_' + fields.responsible_user_id).allSockets()
        .then(client => {
          if(client.size === 0) {
            addPendingNotification(fields.responsible_user_id, fields.task_id, false, 'Задача от начальником')
            console.log('offline', client, fields.responsible_user_id)
          } else {
            addPendingNotification(fields.responsible_user_id, fields.task_id, true, 'Задача от начальником')
            io.to('user_' + fields.responsible_user_id)
              .emit('taskApproved', {message: 'Задача от начальником', taskData: fields.task_id})
            console.log('online', client, fields.responsible_user_id); 
          }  
        })
        .catch(error => {
            console.error(error); // Обработка ошибки
        });
      };

      const noticeToAppointUser = (user_id) => {
        io.in('user_' + fields.appoint_user_id).allSockets()
        .then(client => {
          if(client.size === 0) {
            addPendingNotification(fields.appoint_user_id, fields.task_id, false, 'Задача согласованна начальником')
            console.log('offline', client, fields.appoint_user_id)
          } else {
            addPendingNotification(fields.appoint_user_id, fields.task_id, true, 'Задача согласованна начальником')
            io.to('user_' + fields.appoint_user_id)
              .emit('taskApproved', {message: 'Задача согласованна начальником', taskData: fields.task_id})
            console.log('online', client, fields.appoint_user_id); 
          }  
        })
        .catch(error => {
            console.error(error); // Обработка ошибки
        });
      };

      const noticeToResponceLead = (user_id) => {
        io.in('leadSubDep_' + fields.responsible_subdepartment_id).allSockets()
        .then(client => {
          if(client.size === 0) {
            addPendingNotification(fields.responsible_subdepartment_id, fields.task_id, false, 'Новая задача для отдела')
            console.log('offline', client, fields.responsible_subdepartment_id)
          } else {
            addPendingNotification(fields.responsible_subdepartment_id, fields.task_id, true, 'Новая задача для отдела')
            io.to('leadSubDep_' + fields.responsible_subdepartment_id)
              .emit('taskApproved', {message: 'Новая задача для отдела', taskData: fields.task_id})
            console.log('online', client, fields.responsible_subdepartment_id); 
          }  
        })
        .catch(error => {
            console.error(error); // Обработка ошибки
        });
      };


      if (data.fields.approved_on === 'true') {
        console.log('Задача от начальника');
        if (inOneDep && inOneSubDep){
          console.log('Задача внутри одного отдела в одном департаменте');
          noticeToResponsibleUser()
        } else if(inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте');
          noticeToAppointUser()
          noticeToResponceLead()
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов');
        }
      } else {
        console.log('Задача от сотрудника');
        io.to('leadSubDep_' + fields.appoint_subdepartment_id)
          .emit('taskCreated', {
            message: 'Новая задача на согласование',
            taskData: fields.task_id
          })
      }


      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200;
      res.end(JSON.stringify({
        message: 'Status accepted'
      }));

    } catch (error) {
      handleError(res, `addNewTask: ${error}`)
    }
  }
}



// task_id: '12ac8682-e241-45c2-9c53-949efbb06e60',
// task_status: 'approved',
// task_descript: 'aasas',
// task_comment: '',
// deadline: '2024-03-08',
// task_priority: 'false',
// appoint_user_id: '2',
// appoint_department_id: '2',
// appoint_subdepartment_id: '2',
// appoint_position_id: '2',
// responsible_user_id: '',
// responsible_department_id: '3',
// responsible_subdepartment_id: '5',
// responsible_position_id: '',
// filesToRemove: '',
// task_files: '',

module.exports = new TasksControler()