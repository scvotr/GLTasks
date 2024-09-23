const BucketElevatorsController = require('../controllers/Admin/BucketElevatorsController')
const DeviceController = require('../controllers/Admin/DeviceController')
const MangeOrgStructController = require('../controllers/Admin/MangeOrgStructController')
const MotorController = require('../controllers/Admin/Devices/Motors/MotorPowerRangeController')
const TasksController = require('../controllers/Admin/TasksController')
const UserController = require('../controllers/Admin/UserController')
const WorkflowController = require('../controllers/Admin/WorkflowController')
// const DepsControler = require('../controls/Admin/Deps/DepsControler')
const { handleDefaultRoute } = require('../routingHandlers/handleDefaultRoute')
const { protectRouteTkPl } = require('../utils/protectRouteTkPl')
const MotorPowerRangeController = require('../controllers/Admin/Devices/Motors/MotorPowerRangeController')
const MotorVoltageController = require('../controllers/Admin/Devices/Motors/MotorVoltageController')
const MotorAmperageController = require('../controllers/Admin/Devices/Motors/MotorAmperageController')
const MotorEfficiencyController = require('../controllers/Admin/Devices/Motors/MotorEfficiencyController')
const MotorCosFController = require('../controllers/Admin/Devices/Motors/MotorCosFController')
const MotorRotationSpeedController = require('../controllers/Admin/Devices/Motors/MotorTorqueController')
const MotorTorqueController = require('../controllers/Admin/Devices/Motors/MotorTorqueController')
const MotorTemperatureController = require('../controllers/Admin/Devices/Motors/MotorTemperatureController')
const MotorOperationModeController = require('../controllers/Admin/Devices/Motors/MotorOperationModeController')
const MotorProtectionLevelController = require('../controllers/Admin/Devices/Motors/MotorProtectionLevelController')
const MotorExplosionProofController = require('../controllers/Admin/Devices/Motors/MotorExplosionProofController')
const MotorBrakeController = require('../controllers/Admin/Devices/Motors/MotorBrakeController')
const MotorMountingController = require('../controllers/Admin/Devices/Motors/MotorMountingController')
const MotorBearingTypeController = require('../controllers/Admin/Devices/Motors/MotorBearingTypeController')
const MotorRotationSpeedController2 = require('../controllers/Admin/Devices/Motors/MotorRotationSpeedController2')


const routeHandlers = {
  '/admin/getAllUsers': UserController.getAllUsers,
  '/admin/updateUserData': UserController.updateUserData,
  '/admin/createNewDep': MangeOrgStructController.createNewDep,
  '/admin/deleteDep': MangeOrgStructController.deleteDep,
  '/admin/createNewSubDep': MangeOrgStructController.createNewSubDep,
  '/admin/deleteSubDep': MangeOrgStructController.deleteSubDep,
  '/admin/createNewPosition': MangeOrgStructController.createNewPosition,
  '/admin/deletePosition': MangeOrgStructController.deletePosition,
  '/admin/getAllTasks': TasksController.getAllTasks,

  // -------------------11-09-2024ы
  '/admin/devices/bucketElevators/create': DeviceController.createBucketElevator,
  '/admin/devices/bucketElevators/readAll': DeviceController.getAllBucketElevators,
  // -------------------
  // -------------------12-09-2024ы
  '/admin/devices/types/create': DeviceController.createDeviceType,
  '/admin/devices/types/read': DeviceController.readDeviceType,
  '/admin/devices/types/update': DeviceController.updateDeviceType,
  '/admin/devices/types/delete': DeviceController.deleteDeviceType,
  '/admin/devices/getById': DeviceController.getById,

  '/admin/workflow/createWorkflow': WorkflowController.createWorkflow,
  '/admin/workflow/updateWorkflow': WorkflowController.updateWorkflow,
  '/admin/workflow/deleteWorkflow': WorkflowController.deleteWorkflow,
  '/admin/workflow/allWorkflowByDep': WorkflowController.getAllWorkflowByDep,
  '/admin/workflow/allWorkshopsByDepId': WorkflowController.getAllWorkshopsByDepId,
  // -------------------
  // -------------------
  '/admin/devices/motor/electrical/power/create': MotorPowerRangeController.create,
  '/admin/devices/motor/electrical/power/read': MotorPowerRangeController.read,
  '/admin/devices/motor/electrical/power/update': MotorPowerRangeController.update,
  '/admin/devices/motor/electrical/power/delete': MotorPowerRangeController.delete,
  // -------------------
  '/admin/devices/motor/electrical/voltage/create': MotorVoltageController.create,
  '/admin/devices/motor/electrical/voltage/read': MotorVoltageController.read,
  '/admin/devices/motor/electrical/voltage/update': MotorVoltageController.update,
  '/admin/devices/motor/electrical/voltage/delete': MotorVoltageController.delete,
  // -------------------
  '/admin/devices/motor/electrical/amperage/create': MotorAmperageController.create,
  '/admin/devices/motor/electrical/amperage/read': MotorAmperageController.read,
  '/admin/devices/motor/electrical/amperage/update': MotorAmperageController.update,
  '/admin/devices/motor/electrical/amperage/delete': MotorAmperageController.delete,
  // -------------------
  '/admin/devices/motor/electrical/efficiency/create': MotorEfficiencyController.create,
  '/admin/devices/motor/electrical/efficiency/read': MotorEfficiencyController.read,
  '/admin/devices/motor/electrical/efficiency/update': MotorEfficiencyController.update,
  '/admin/devices/motor/electrical/efficiency/delete': MotorEfficiencyController.delete,
  // -------------------
  '/admin/devices/motor/electrical/cosF/create': MotorCosFController.create,
  '/admin/devices/motor/electrical/cosF/read': MotorCosFController.read,
  '/admin/devices/motor/electrical/cosF/update': MotorCosFController.update,
  '/admin/devices/motor/electrical/cosF/delete': MotorCosFController.delete,
  // -------------------
  // -------------------
  '/admin/devices/motor/electrical/cosF/create': MotorCosFController.create,
  '/admin/devices/motor/electrical/cosF/read': MotorCosFController.read,
  '/admin/devices/motor/electrical/cosF/update': MotorCosFController.update,
  '/admin/devices/motor/electrical/cosF/delete': MotorCosFController.delete,
  // -------------------
  '/admin/devices/motor/mechanical/rotationSpeed/create': MotorRotationSpeedController2.create,
  '/admin/devices/motor/mechanical/rotationSpeed/read': MotorRotationSpeedController2.read,
  '/admin/devices/motor/mechanical/rotationSpeed/update': MotorRotationSpeedController2.update,
  '/admin/devices/motor/mechanical/rotationSpeed/delete': MotorRotationSpeedController2.delete,
  // -------------------
  '/admin/devices/motor/mechanical/torque/create': MotorTorqueController.create,
  '/admin/devices/motor/mechanical/torque/read': MotorTorqueController.read,
  '/admin/devices/motor/mechanical/torque/update': MotorTorqueController.update,
  '/admin/devices/motor/mechanical/torque/delete': MotorTorqueController.delete,
  // -------------------
  '/admin/devices/motor/mechanical/temperature/create': MotorTemperatureController.create,
  '/admin/devices/motor/mechanical/temperature/read': MotorTemperatureController.read,
  '/admin/devices/motor/mechanical/temperature/update': MotorTemperatureController.update,
  '/admin/devices/motor/mechanical/temperature/delete': MotorTemperatureController.delete,
  // -------------------
  '/admin/devices/motor/mechanical/operationMode/create': MotorOperationModeController.create,
  '/admin/devices/motor/mechanical/operationMode/read': MotorOperationModeController.read,
  '/admin/devices/motor/mechanical/operationMode/update': MotorOperationModeController.update,
  '/admin/devices/motor/mechanical/operationMode/delete': MotorOperationModeController.delete,
  // -------------------
  '/admin/devices/motor/protection/protectionLevel/create': MotorProtectionLevelController.create,
  '/admin/devices/motor/protection/protectionLevel/read': MotorProtectionLevelController.read,
  '/admin/devices/motor/protection/protectionLevel/update': MotorProtectionLevelController.update,
  '/admin/devices/motor/protection/protectionLevel/delete': MotorProtectionLevelController.delete,
  // -------------------
  '/admin/devices/motor/protection/explosionProof/create': MotorExplosionProofController.create,
  '/admin/devices/motor/protection/explosionProof/read': MotorExplosionProofController.read,
  '/admin/devices/motor/protection/explosionProof/update': MotorExplosionProofController.update,
  '/admin/devices/motor/protection/explosionProof/delete': MotorExplosionProofController.delete,
  // -------------------
  '/admin/devices/motor/protection/brake/create': MotorBrakeController.create,
  '/admin/devices/motor/protection/brake/read': MotorBrakeController.read,
  '/admin/devices/motor/protection/brake/update': MotorBrakeController.update,
  '/admin/devices/motor/protection/brake/delete': MotorBrakeController.delete,
  // -------------------
  '/admin/devices/motor/technical/bearingType/create': MotorBearingTypeController.create,
  '/admin/devices/motor/technical/bearingType/read': MotorBearingTypeController.read,
  '/admin/devices/motor/technical/bearingType/update': MotorBearingTypeController.update,
  '/admin/devices/motor/technical/bearingType/delete': MotorBearingTypeController.delete,
  // -------------------
  '/admin/devices/motor/technical/mounting/create': MotorMountingController.create,
  '/admin/devices/motor/technical/mounting/read': MotorMountingController.read,
  '/admin/devices/motor/technical/mounting/update': MotorMountingController.update,
  '/admin/devices/motor/technical/mounting/delete': MotorMountingController.delete,
  // -------------------
  '/admin/devices/motor/brands/brands/create': MotorMountingController.create,
  '/admin/devices/motor/brands/brands/read': MotorMountingController.read,
  '/admin/devices/motor/brands/brands/update': MotorMountingController.update,
  '/admin/devices/motor/brands/brands/delete': MotorMountingController.delete,
  // -------------------
  '/admin/devices/motor/brands/models/create': MotorMountingController.create,
  '/admin/devices/motor/brands/models/read': MotorMountingController.read,
  '/admin/devices/motor/brands/models/update': MotorMountingController.update,
  '/admin/devices/motor/brands/models/delete': MotorMountingController.delete,
  // -------------------

  // -------------------
  // -------------------
  // ! РАЗОБРАТЬ
  '/admin/machines/bucketElevators/beltBrands/readAll': BucketElevatorsController.readAllBeltBrands,
  '/admin/machines/bucketElevators/bucketBrands/readAll': BucketElevatorsController.readAllBucketBrands,
  '/admin/machines/bucketElevators/gearboxBrands/readAll': BucketElevatorsController.readAllGearboxBrands,
  '/admin/machines/bucketElevators/driveBelts/readAll': BucketElevatorsController.readAllDriveBelts,

  '/admin/machines/bucketElevators/beltReplacementHistory/readAll': BucketElevatorsController.readAllBeltReplacementHistory,
  '/admin/machines/bucketElevators/bucketReplacementHistory/readAll': BucketElevatorsController.readAllBucketReplacementHistory,
  '/admin/machines/bucketElevators/gearboxReplacementHistory/readAll': BucketElevatorsController.readAllGearboxReplacementHistory,

  // "/admin/removeDep": DepsControler.removeDep,
  // "/admin/createNewSubDep": DepsControler.createNewSubDep,
  // "/admin/createNewPosition": DepsControler.createNewPosition,
}

const handleAdminRoutes = async (req, res) => {
  const { url, method } = req

  try {
    if (url.startsWith('/admin')) {
      const routeHandler = routeHandlers[url]
      if (routeHandler) {
        if (method === 'POST') {
          await protectRouteTkPl(routeHandler)(req, res)
          // await protectRouteTkPl(await routeHandler)(req, res);
        } else {
          handleDefaultRoute(req, res)
        }
      } else {
        handleDefaultRoute(req, res)
      }
    } else {
      handleDefaultRoute(req, res)
    }
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'handleAdminRoutes - ERROR' }))
  }
}

module.exports = { handleAdminRoutes }
