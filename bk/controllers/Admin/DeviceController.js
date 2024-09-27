'use strict'

const DeviceCRUD = require('../../Database/queries/Devices/DeviceCRUD')
const DeviceTypesCRUD = require('../../Database/queries/Devices/DeviceTypes/DeviceTypesCRUD')
const { sendResponseWithData, handleError } = require('../../utils/response/responseUtils')
class DeviceController {
  async createBucketElevator(req, res) {
    try {
      const authDecodeUserData = req.user
      // создаем отдельно устройство
      await DeviceCRUD.createDeviceQ(JSON.parse(authDecodeUserData.payLoad))
      await DeviceCRUD.createBucketElevatorQ(JSON.parse(authDecodeUserData.payLoad))
      if (JSON.parse(authDecodeUserData.payLoad).motor_config_id) {
        await DeviceCRUD.appendMotorQ(JSON.parse(authDecodeUserData.payLoad))
      }
      sendResponseWithData(res, 'createBucketElevator-ok')
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
    }
  }
  async createEmptyDevice(req, res) {
    try {
      const authDecodeUserData = req.user
      await DeviceCRUD.createDeviceQ(JSON.parse(authDecodeUserData.payLoad))
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
  async getBucketElevator(req, res) {
    try {
      const authDecodeUserData = req.user
      const device = JSON.parse(authDecodeUserData.payLoad)
      const data = await DeviceCRUD.getBucketElevatorQ(device.id)
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
  // !----------------------------------------------------
  async readDevice(req, res) {
    try {
      const authDecodeUserData = req.user
      const device_id = JSON.parse(authDecodeUserData.payLoad)
      const data = await DeviceCRUD.getDeviceQ(device_id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readDevice')
    }
  }
  async readAllDevices(req, res) {
    try {
      const data = await DeviceCRUD.getAllDevicesQ()
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'Error: readAllDevices')
    }
  }
  async deleteDevice(req, res) {
    try {
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await DeviceCRUD.deleteDeviceQ(data)
      sendResponseWithData(res, 'device delete ok')
    } catch (error) {
      handleError(res, 'Error: createBucketElevator')
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
