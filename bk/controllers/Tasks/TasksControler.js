'use strict'

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
      const data = {
        fields,
        fileNames,
        user_id
      }
      console.log(data.task_status)

      const io = socketManager.getIO()
      io.to('leadSubDep_' + fields.appoint_subdepartment_id)
        .emit('taskCreated', {
          message: 'Новая задача на согласование',
          taskData: fields.task_id
        })

      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Status accepted' }));

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