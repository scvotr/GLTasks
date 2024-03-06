'use strict'

class TasksControler {
  async addNewTask(req, res) {
    const authDecodeUserData = req.user
    const user_id = authDecodeUserData.id
    const postPayload = authDecodeUserData.payLoad
    console.log(postPayload)
  }
}

module.exports = new TasksControler()