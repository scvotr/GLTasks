'use strict'

const { saveAndConvert } = require("../../utils/files/saveAndConvert");

class TasksControler {
  async addNewTask(req, res) {
    const authDecodeUserData = req.user
    const user_id = authDecodeUserData.id
    const postPayload = authDecodeUserData.payLoad; console.log(postPayload.fields)
    const fields = postPayload.fields;
    const files = postPayload.files
    const taskFolder = fields.task_id
    const fileNames = [];
    for (const [key, file] of Object.entries(files)) {
      try {
        const fileName = await saveAndConvert(file, taskFolder)
        fileNames.push(fileName.fileName);
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  }
}

module.exports = new TasksControler()