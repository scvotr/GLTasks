'use strict'

const DeviceCRUD = require('../../Database/queries/Devices/MotorsMotorPowerCRUD')
const DeviceTypesCRUD = require('../../Database/queries/Devices/DeviceTypes/DeviceTypesCRUD')

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

class DeviceController {
  async createBucketElevator(req, res) {
    try {
      const authDecodeUserData = req.user
      await DeviceCRUD.createQ(JSON.parse(authDecodeUserData.payLoad))
      await DeviceCRUD.createBucketElevatorQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'createBucketElevator-ok')
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  async getAllBucketElevators(req, res) {
    try {
      const data = await DeviceCRUD.getAllBucketElevatorsWithDetailsQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  // TYPES OF DEVICE  -------------------
  async createDeviceType(req, res) {
    try {
      const authDecodeUserData = req.user
      await DeviceTypesCRUD.createQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'createDeviceType - OK!')
    } catch (error) {
      handleError(res, error.message)
    }
  }
  async readDeviceType(req, res) {
    try {
      const data = await DeviceTypesCRUD.readQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, error.message)
    }
  }
  async updateDeviceType(req, res) {
    try {
      const authDecodeUserData = req.user
      await DeviceTypesCRUD.updateQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'updateDeviceType - OK!')
    } catch (error) {
      handleError(res, error.message)
    }
  }
  async deleteDeviceType(req, res) {
    try {
      const authDecodeUserData = req.user
      await DeviceTypesCRUD.deleteQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, 'updateDeviceType - OK!')
    } catch (error) {}
  }
  //! TYPES OF DEVICE  -------------------END
  async getById(req, res) {
    try {
      const authDecodeUserData = req.user
      console.log('getById', JSON.parse(authDecodeUserData.payLoad))
      const data = await DeviceCRUD.getByIdQ(JSON.parse(authDecodeUserData.payLoad))
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, error.message)
    }
  }
}

module.exports = new DeviceController()

// class DeviceController {
//   // Вспомогательный метод для обработки запросов
//   async handleRequest(req, res, callback) {
//     try {
//       await callback();
//     } catch (error) {
//       handleError(res, error.message);
//     }
//   }

//   // Извлечение данных пользователя
//   getUserData(req) {
//     return JSON.parse(req.user.payLoad);
//   }

//   async createBucketElevator(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const userData = this.getUserData(req);
//       await DeviceCRUD.createQ(userData);
//       await DeviceCRUD.createBucketElevatorQ(userData);
//       sendResponseWithData(res, 'createBucketElevator-ok');
//     });
//   }

//   async getAllBucketElevators(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const data = await DeviceCRUD.getAllBucketElevatorsWithDetailsQ();
//       console.log(data);
//       sendResponseWithData(res, data);
//     });
//   }

//   // TYPES OF DEVICE  -------------------
//   async createDeviceType(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const userData = this.getUserData(req);
//       await DeviceTypesCRUD.createQ(userData);
//       sendResponseWithData(res, 'createDeviceType - OK!');
//     });
//   }

//   async readDeviceType(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const data = await DeviceTypesCRUD.readQ();
//       sendResponseWithData(res, data);
//     });
//   }

//   async updateDeviceType(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const userData = this.getUserData(req);
//       await DeviceTypesCRUD.updateQ(userData);
//       sendResponseWithData(res, 'updateDeviceType - OK!');
//     });
//   }

//   async deleteDeviceType(req, res) {
//     await this.handleRequest(req, res, async () => {
//       const userData = this.getUserData(req);
//       await DeviceTypesCRUD.deleteQ(userData);
//       sendResponseWithData(res, 'deleteDeviceType - OK!');
//     });
//   }
//   //! TYPES OF DEVICE  -------------------END
// }
