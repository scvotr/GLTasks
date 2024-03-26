const { editUserDataQ, getUserByIdQ } = require("../../Database/queries/User/userQuery");

const sendResponseWithData = (res, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

const handleError = (res, error) => {
  console.log('handleError', error);
  res.statusCode = 500;
  res.end(JSON.stringify({
    error: error
  }));
};

class UserController {
  async getUserById(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const data = await getUserByIdQ(user_id) 
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getUserById')
    }
  }
  async editUserData(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await editUserDataQ(data)
      sendResponseWithData(res, 'editUserData - ok')
    } catch (error) {
      handleError(res, 'getUserById')
    }
  }
}

module.exports = new UserController()