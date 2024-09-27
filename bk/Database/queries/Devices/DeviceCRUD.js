const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')
const QRCode = require('qrcode')

const generateQRCodeToURL = async machineId => {
  try {
    // Формируем URL с использованием machineId
    const baseURL = 'http://192.168.8.102:3001/admin/devices/' // Замените на ваш базовый URL
    const url = `${baseURL}${machineId}`

    // Генерируем QR-код для URL
    const qrCodeDataURL = await QRCode.toDataURL(url)
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

class DeviceCRUD {
  async createDeviceQ(data) {
    const { device_id, tech_num, type_id, workshop_id, department_id } = data
    const QRC = await generateQRCodeToURL(device_id)
    try {
      // Проверка на существование имени, если передано название поля
      if (tech_num) {
        const checkCommand = `SELECT COUNT(*) AS count FROM devices WHERE tech_num = ?
          AND workshop_id = ?`
        const checkResult = await executeDatabaseQueryAsync(checkCommand, [tech_num, workshop_id])

        if (checkResult[0].count > 0) {
          throw new Error(`Запись с таким ${tech_num} уже существует`) // Выбрасываем ошибку, если запись уже существует
        }
      }

      const command = `
      INSERT INTO devices (device_id, tech_num, qr_code, type_id, workshop_id, department_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
      await executeDatabaseQueryAsync(command, [device_id, tech_num, QRC, type_id, workshop_id, department_id])
    } catch (error) {
      console.error('Error creating new device:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  async appendMotorQ(data) {
    const { device_id, motor_config_id } = data
    try {
      const command = `
      INSERT INTO motors (device_id, motor_config_id)
      VALUES (?, ?)
    `
      await executeDatabaseQueryAsync(command, [device_id, motor_config_id])
    } catch (error) {
      console.error('Error creating new device:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  async createBucketElevatorQ(data) {
    try {
      const command = `
        INSERT INTO bucketElevators (
          device_id,
          height,
          belt_brand_id,
          belt_installation_date,
          belt_length,
          bucket_brand_id,
          bucket_installation_date,
          bucket_quantity,
          gearbox_brand_id,
          gearbox_installation_date,
          driveBelt_brand_id,
          driveBelt_quantity,
          driveBelt_installation_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      await executeDatabaseQueryAsync(command, [
        data.device_id, // ID устройства
        data.height, // Высота
        data.belt_brand_id, // Марка ленты
        data.belt_installation_date, // Дата установки ленты
        data.belt_length, // Длина ленты
        data.bucket_brand_id, // Марка ковшей
        data.bucket_installation_date, // Дата установки ковшей
        data.bucket_quantity, // Количество ковшей
        data.gearbox_brand_id, // Марка редуктора
        data.gearbox_installation_date, // Дата установки редуктора
        data.driveBelts_brand_id, // Марка приводного ремня
        data.driveBelts_quantity, // Количество ремней
        data.driveBelts_installation_date, // Дата установки ремней
      ])
    } catch (error) {
      console.error('Error creating new Bucket Elevator:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
  async getAllBucketElevatorsWithDetailsQ() {
    try {
      const command = `
        SELECT 
          be.device_id,
          be.height,
          d.tech_num,
          d.qr_code,
          w.name AS workshop_name,  
          dep.name AS department_name,
          mt.name AS type_name,
          bb.brand_name AS beltBrands_name,
          be.belt_installation_date,
          be.belt_length,
          bub.brand_name AS bucketBrand_name,
          be.bucket_quantity,
          be.bucket_installation_date,
          gb.brand_name AS gearboxBrand_name,
          be.gearbox_installation_date,
          db.brand_name AS driveBeltsBrand_name,
          be.driveBelt_quantity,
          be.driveBelt_installation_date
        FROM bucketElevators be
        JOIN devices d ON be.device_id = d.device_id
        LEFT JOIN workshops w ON d.workshop_id = w.id
        LEFT JOIN departments dep ON d.department_id = dep.id
        LEFT JOIN devicesTypes mt ON d.type_id = mt.id
        LEFT JOIN beltBrands bb ON be.belt_brand_id = bb.id
        LEFT JOIN bucketBrands bub ON be.bucket_brand_id = bub.id
        LEFT JOIN gearboxBrands gb ON be.gearbox_brand_id = gb.id
        LEFT JOIN driveBelts db ON be.driveBelt_brand_id = db.id
      `
      const results = await executeDatabaseQueryAsync(command)
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
  // !USE
  async getBucketElevatorQ(device_id) {
    try {
      const command = `
      SELECT
          be.device_id,
          be.height,
          d.tech_num,
          d.qr_code,
          w.name AS workshop_name,
          dep.name AS department_name,
          mt.name AS type_name,
          bb.brand_name AS beltBrands_name,
          be.belt_installation_date,
          be.belt_length,
          bub.brand_name AS bucketBrand_name,
          be.bucket_quantity,
          be.bucket_installation_date,
          gb.brand_name AS gearboxBrand_name,
          be.gearbox_installation_date,
          db.brand_name AS driveBeltsBrand_name,
          be.driveBelt_quantity,
          be.driveBelt_installation_date
      FROM
          bucketElevators be
          JOIN devices d ON be.device_id = d.device_id
          LEFT JOIN workshops w ON d.workshop_id = w.id
          LEFT JOIN departments dep ON d.department_id = dep.id
          LEFT JOIN devicesTypes mt ON d.type_id = mt.id
          LEFT JOIN beltBrands bb ON be.belt_brand_id = bb.id
          LEFT JOIN bucketBrands bub ON be.bucket_brand_id = bub.id
          LEFT JOIN gearboxBrands gb ON be.gearbox_brand_id = gb.id
          LEFT JOIN driveBelts db ON be.driveBelt_brand_id = db.id
      WHERE be.device_id = ?
      `
      const results = await executeDatabaseQueryAsync(command, [device_id])
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  async getByIdQ(id) {
    try {
      const command = `SELECT FROM devices WHERE id = ?`
      await executeDatabaseQueryAsync(command, [id])
    } catch (error) {
      console.error('Ошибка при удалении типа устройства:', error)
      throw new Error('Ошибка запроса к базе данных при удалении типа устройства')
    }
  }
  // !-------------------
  async getAllDevicesQ() {
    try {
      const command = `
        SELECT 
          d.device_id, 
          d.devices_installation_date, 
          d.tech_num, 
          d.qr_code, 
          dt.name AS type_name,
          dt.id AS type_id,
          w.name AS workshop_name,  
          dep.name AS department_name,
          p.name AS power_value
        FROM 
          devices d
        LEFT JOIN 
          devicesTypes dt ON d.type_id = dt.id
        LEFT JOIN 
          workshops w ON d.workshop_id = w.id
        LEFT JOIN 
          departments dep ON d.department_id = dep.id
        LEFT JOIN 
            motors m ON m.device_id = d.device_id
        LEFT JOIN 
          motors_config mc ON mc.motor_config_id = m.motor_config_id  
        LEFT JOIN 
          motorPowerRangeT p ON mc.power_id = p.id  
      `
      const results = await executeDatabaseQueryAsync(command)
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  async deleteDeviceQ(data) {
    try {
      const command = `DELETE FROM devices WHERE device_id = ?`
      await executeDatabaseQueryAsync(command, [data])
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных')
    }
  }
  async getDeviceQ(device_id) {
    try {
      const command = `
        SELECT d.device_id,
            d.devices_installation_date,
            d.tech_num,
            d.qr_code,
            dt.name AS type_name,
            w.name AS workshop_name,
            dep.name AS department_name,
            p.name AS power_value
        FROM devices d
            LEFT JOIN devicesTypes dt ON d.type_id = dt.id
            LEFT JOIN workshops w ON d.workshop_id = w.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            LEFT JOIN motors m ON m.device_id = d.device_id
            LEFT JOIN motors_config mc ON mc.motor_config_id = m.motor_config_id
            LEFT JOIN motorPowerRangeT p ON mc.power_id = p.id
        WHERE d.device_id = ?    
      `
      const results = await executeDatabaseQueryAsync(command, [device_id])
      return results
    } catch (error) {
      console.error('Error fetching bucket elevators with details:', error)
      throw new Error('Ошибка запроса к базе данных')
    }
  }
}

module.exports = new DeviceCRUD()

// async createBucketElevatorQ(data) {
//   console.log(data)
//   const { device_id, newField1, newField2 } = data
//   try {
//     const command = `
//     INSERT INTO bucketElevators (device_id)
//     VALUES (?)
//   `
//     // await executeDatabaseQueryAsync(command, [device_id])
//   } catch (error) {
//     console.error('Error creating new Bucket Elevator:', error)
//     throw new Error('Ошибка запроса к базе данных')
//   }
// }

// SELECT
// be.id AS bucket_elevator_id,
// be.device_id,
// d.tech_num,
// d.qr_code,
// d.created_on AS device_created_on,
// d.devices_installation_date,
// be.height,
// bb.brand_name AS bucket_brand,
// be.bucket_installation_date,
// be.bucket_quantity,
// gb.brand_name AS gearbox_brand,
// be.gearbox_installation_date,
// db.brand_name AS drive_belt_brand,
// be.driveBelt_quantity,
// be.driveBelt_installation_date,
// lb.brand_name AS belt_brand,
// be.belt_installation_date,
// be.belt_length,
// be.created_on AS elevator_created_on
// FROM bucketElevators be
// JOIN devices d ON be.device_id = d.id
// LEFT JOIN bucketBrands bb ON be.bucket_brand_id = bb.id
// LEFT JOIN gearboxBrands gb ON be.gearbox_brand_id = gb.id
// LEFT JOIN driveBelts db ON be.driveBelt_brand_id = db.id
// LEFT JOIN beltBrands lb ON be.belt_brand_id = lb.id

// const command = `
// SELECT
//     d.*,
//     m.*,
//     mc.*,
//     mb.name AS brand_name,
//     mm.name AS model_name,
//     dt.name AS type_name,
//     w.name AS workshop_name,
//     dep.name AS department_name,
//     be.height
// FROM
//     devices d
// LEFT JOIN
//     motors m ON m.device_id = d.device_id
// LEFT JOIN
//     motors_config mc ON mc.motor_config_id = m.motor_config_id
// LEFT JOIN
//     motor_brands mb ON mc.brand_id = mb.id
// LEFT JOIN
//     motor_models mm ON mc.model_id = mm.id
// LEFT JOIN
//   devicesTypes dt ON d.type_id = dt.id
// LEFT JOIN
//   workshops w ON d.workshop_id = w.id
// LEFT JOIN
//   departments dep ON d.department_id = dep.id
// LEFT JOIN
//   bucketElevators be ON d.device_id = be.device_id

// `
