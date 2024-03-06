'use strict'

class TasksControler {
  async addNewTask(req, res) {
    const authDecodeUserData = req.user
    const user_id = authDecodeUserData.id
    const postPayload = authDecodeUserData.payLoad
    console.log(postPayload)
    const fields = postPayload.fields;
    const files = postPayload.files
    const taskFolder = fields.task_id
    const fileNames = [];
  }
}

module.exports = new TasksControler()