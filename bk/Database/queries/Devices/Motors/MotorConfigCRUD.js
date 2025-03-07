const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

class MotorConfigCRUD {
  // async createMotorQ(data) {
  //   const insertQuery = `
  //     INSERT INTO motors (
  //       engine_number,
  //       motor_config_id
  //     ) VALUES (?, ?)
  //   `
  //   try {
  //     await executeDatabaseQueryAsync(insertQuery, [data.motor_tech_num, data.motor_config_id])
  //   } catch (error) {}
  // }

  async createConfigQ(motorConfig) {
    //! нет проверки на тех номер! Тут нужен номер конфигурации а не технический!!
    try {
      const insertQuery = `
        INSERT INTO motors_config (
          motor_config_id,
          motor_tech_num,
          power_id,
          voltage_id,
          amperage_id,
          efficiency_id,
          cosF_id,
          rotationSpeed_id,
          torque_id,
          temperature_id,
          operationMode_id,
          protectionLevel_id,
          explosionProof_id,
          brake_id,
          bearingType_id,
          mounting_id,
          brand_id,
          model_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      await executeDatabaseQueryAsync(insertQuery, [
        motorConfig.motor_config_id,
        motorConfig.motor_tech_num,
        motorConfig.power,
        motorConfig.voltage,
        motorConfig.amperage,
        motorConfig.efficiency,
        motorConfig.cosF,
        motorConfig.rotationSpeed,
        motorConfig.torque,
        motorConfig.temperature,
        motorConfig.operationMode,
        motorConfig.protectionLevel,
        motorConfig.explosionProof,
        motorConfig.brake,
        motorConfig.bearingType,
        motorConfig.mounting,
        motorConfig.brand,
        motorConfig.model,
      ])
    } catch (error) {}
  }

  async updateConfigQ(data) {}

  async readAllConfigsQ() {
    const commandWR = `
    SELECT
        mc.motor_tech_num,
        mc.motor_config_id,
        mc.installed_on,
        mc.on_repair,
        mb.name AS brand_name,
        mm.name AS model_name,
        pr.name AS power_range,
        rs.name AS rotation_speed,
        ma.name AS amperage_value,
        vt.name AS voltage_value,
        pl.name AS protection_level,
        tt.name AS temperature_value,
        ef.name AS efficiency_value,
        cf.name AS cosF_value,
        tq.name AS torque_value,
        om.name AS operation_mode,
        ep.name AS explosion_proof,
        br.name AS brake_value,
        bt.name AS bearing_type,
        mmt.name AS mounting_type
    FROM 
        motors_config mc
    JOIN 
        motor_brands mb ON mc.brand_id = mb.id
    JOIN 
        motor_models mm ON mc.model_id = mm.id
    LEFT JOIN 
        motorPowerRangeT pr ON mc.power_id = pr.id
    LEFT JOIN 
        MotorRotationSpeedT rs ON mc.rotationSpeed_id = rs.id
    LEFT JOIN 
        MotorAmperageT ma ON mc.amperage_id = ma.id
    LEFT JOIN 
        motorVoltageT vt ON mc.voltage_id = vt.id
    LEFT JOIN 
        MotorProtectionLevelT pl ON mc.protectionLevel_id = pl.id
    LEFT JOIN 
        MotorTemperatureT tt ON mc.temperature_id = tt.id
    LEFT JOIN 
        MotorEfficiencyT ef ON mc.efficiency_id = ef.id
    LEFT JOIN 
        MotorCosFT cf ON mc.cosF_id = cf.id
    LEFT JOIN 
        MotorTorqueT tq ON mc.torque_id = tq.id
    LEFT JOIN 
        MotorOperationModeT om ON mc.operationMode_id = om.id
    LEFT JOIN 
        MotorExplosionProofT ep ON mc.explosionProof_id = ep.id
    LEFT JOIN 
        MotorBrakeT br ON mc.brake_id = br.id
    LEFT JOIN 
        bearingTypeT bt ON mc.bearingType_id = bt.id
    LEFT JOIN 
        MotorMountingT mmt ON mc.mounting_id = mmt.id
  `
    try {
      const rows = await executeDatabaseQueryAsync(commandWR, [])
      // console.log(rows)
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }

  async readAllConfigQ() {
    const commandWR = `
      SELECT
        mc.id,
        mc.motor_tech_num,
        mc.motor_config_id,
        mb.name AS brand_name,
        mm.name AS model_name
      FROM motors_config mc
      LEFT JOIN motor_brands mb ON mc.brand_id = mb.id
      LEFT JOIN motor_models mm ON mc.model_id = mm.id
      `
    try {
      const rows = await executeDatabaseQueryAsync(commandWR, [])
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
  async readAllConfigUninstallQ() {
    const commandWR = `
      SELECT
        mc.id,
        mc.motor_tech_num,
        mc.motor_config_id,
        mb.name AS brand_name,
        mm.name AS model_name
      FROM motors_config mc
        LEFT JOIN motor_brands mb ON mc.brand_id = mb.id
        LEFT JOIN motor_models mm ON mc.model_id = mm.id
      WHERE mc.installed_on = FALSE AND mc.on_repair = FALSE
    `
    try {
      const rows = await executeDatabaseQueryAsync(commandWR, [])
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
  async readAllConfigInstallQ() {
    const commandWR = `
      SELECT
        mc.id,
        mc.motor_tech_num,
        mc.motor_config_id,
        mb.name AS brand_name,
        mm.name AS model_name
      FROM motors_config mc
        LEFT JOIN motor_brands mb ON mc.brand_id = mb.id
        LEFT JOIN motor_models mm ON mc.model_id = mm.id
      WHERE mc.installed_on = TRUE
    `
    try {
      const rows = await executeDatabaseQueryAsync(commandWR, [])
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
  async appendConfigToMotorQ(data) {
    const { motor_id, motor_config_id } = data
    const command = `
      UPDATE motors
      SET motor_config_id = ?
      WHERE motor_id = ?;  
    `
    const command2 = `
      UPDATE motors_config
      SET installed_on = TRUE
      WHERE motor_config_id = ?;  
    `
    try {
      await executeDatabaseQueryAsync(command, [motor_config_id, motor_id])
      await executeDatabaseQueryAsync(command2, [motor_config_id])
    } catch (error) {
      throw new Error('Ошибка установки конфигурации: ' + error.message)
    }
  }
  // Демонтаж для ремонта\обслуживания
  async removeConfigFromMotorQ(data) {
    const { motor_id, motor_config_id } = data
    console.log( motor_id, motor_config_id)
    const command = `
      UPDATE motors
      SET motor_config_id = NULL
      WHERE motor_id = ?;  
    `
    const command2 = `
      UPDATE motors_config
      SET installed_on = FALSE,
          on_repair = TRUE
      WHERE motor_config_id = ?;  
    `
    try {
      await executeDatabaseQueryAsync(command, [motor_id])
      await executeDatabaseQueryAsync(command2, [motor_config_id])
    } catch (error) {
      throw new Error('Ошибка установки конфигурации: ' + error.message)
    }
  }
  // Перемещение на склад с возможностью установки(подмены)
  async removeConfigForStorageQ(data) {
    const { motor_id, motor_config_id } = data
    const command = `
      UPDATE motors
      SET motor_config_id = NULL
      WHERE motor_id = ?;  
    `
    const command2 = `
      UPDATE motors_config
      SET installed_on = FALSE
      WHERE motor_config_id = ?;  
    `
    try {
      await executeDatabaseQueryAsync(command, [motor_id])
      await executeDatabaseQueryAsync(command2, [motor_config_id])
    } catch (error) {
      throw new Error('Ошибка установки конфигурации: ' + error.message)
    }
  }
  async readConfigsQ(device_id) {
    const commandWR = `
    SELECT
        mc.motor_tech_num,
        mc.motor_config_id,
        mb.name AS brand_name,
        mm.name AS model_name,
        pr.name AS power_range,
        rs.name AS rotation_speed,
        ma.name AS amperage_value,
        vt.name AS voltage_value,
        pl.name AS protection_level,
        tt.name AS temperature_value,
        ef.name AS efficiency_value,
        cf.name AS cosF_value,
        tq.name AS torque_value,
        om.name AS operation_mode,
        ep.name AS explosion_proof,
        br.name AS brake_value,
        bt.name AS bearing_type,
        mmt.name AS mounting_type
    FROM
        motors_config mc
        LEFT JOIN motor_brands mb ON mc.brand_id = mb.id
        LEFT JOIN motor_models mm ON mc.model_id = mm.id
        LEFT JOIN motorPowerRangeT pr ON mc.power_id = pr.id
        LEFT JOIN MotorRotationSpeedT rs ON mc.rotationSpeed_id = rs.id
        LEFT JOIN MotorAmperageT ma ON mc.amperage_id = ma.id
        LEFT JOIN motorVoltageT vt ON mc.voltage_id = vt.id
        LEFT JOIN MotorProtectionLevelT pl ON mc.protectionLevel_id = pl.id
        LEFT JOIN MotorTemperatureT tt ON mc.temperature_id = tt.id
        LEFT JOIN MotorEfficiencyT ef ON mc.efficiency_id = ef.id
        LEFT JOIN MotorCosFT cf ON mc.cosF_id = cf.id
        LEFT JOIN MotorTorqueT tq ON mc.torque_id = tq.id
        LEFT JOIN MotorOperationModeT om ON mc.operationMode_id = om.id
        LEFT JOIN MotorExplosionProofT ep ON mc.explosionProof_id = ep.id
        LEFT JOIN MotorBrakeT br ON mc.brake_id = br.id
        LEFT JOIN bearingTypeT bt ON mc.bearingType_id = bt.id
        LEFT JOIN MotorMountingT mmt ON mc.mounting_id = mmt.id
        LEFT JOIN motors m ON mc.motor_config_id = m.motor_config_id
      WHERE m.device_id = ?  
    `
    try {
      const rows = await executeDatabaseQueryAsync(commandWR, [device_id])
      // console.log(rows)
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
  async readAllMotorsQ() {
    //   const selectQuery = `
    //   SELECT
    //       m.id AS motor_id,
    //       m.motor_config_id,
    //       m.device_id,
    //       m.engine_number,
    //       m.created_on,
    //       mc.power_id,
    //       pr.name AS power_name,
    //       mc.voltage_id,
    //       mc.amperage_id,
    //       mc.efficiency_id,
    //       mc.cosF_id,
    //       mc.rotationSpeed_id,
    //       mc.torque_id,
    //       mc.temperature_id,
    //       mc.operationMode_id,
    //       mc.protectionLevel_id,
    //       mc.explosionProof_id,
    //       mc.brake_id,
    //       mc.bearingType_id,
    //       mc.mounting_id,
    //       mc.brand_id,
    //       mc.model_id
    //   FROM
    //       motors m
    //   LEFT JOIN
    //       motors_config mc ON m.motor_config_id = mc.motor_config_id
    //   LEFT JOIN
    //       motorPowerRangeT pr ON mc.power_id = pr.id
    // `
    const selectQuery = `
    SELECT 
        *
    FROM 
      motors m
  `

    try {
      const rows = await executeDatabaseQueryAsync(selectQuery, [])
      // console.log(rows)
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }

  async deleteMotorConfigQ(id) {
    try {
      const command = `DELETE FROM motors_config WHERE motor_config_id = ?`
      await executeDatabaseQueryAsync(command, [id])
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
}

module.exports = new MotorConfigCRUD()

// const command2 = `
// SELECT
//   mc.motor_config_id AS motor_config_id,
//   mm.name AS model_name,
//   mb.name AS brand_name
// FROM
//   motors_config mc
// LEFT JOIN
//   motors m ON mc.motor_id = m.id  -- Соединяем с таблицей motors
// LEFT JOIN
//   motor_models mm ON m.model_id = mm.id  -- Соединяем с таблицей motor_models
// LEFT JOIN
//   motor_brands mb ON mm.brand_id = mb.id;  -- Соединяем с таблицей motor_brands
// `

// const command22 = `
// SELECT
//    mb.name AS brand_name,
//    mm.name AS model_name
// FROM
//    motors_config mc
// JOIN
//    motor_brands mb ON mc.brand_id = mb.id
// JOIN
//    motor_models mm ON mc.model_id = mm.id;
// `
// const command222 = `
//  SELECT
//      mc.*,
//      mb.name AS brand_name,
//      mm.name AS model_name
//  FROM
//      motors_config mc
//  LEFT JOIN
//      motor_brands mb ON mc.brand_id = mb.id
//  LEFT JOIN
//      motor_models mm ON mc.model_id = mm.id
// `
