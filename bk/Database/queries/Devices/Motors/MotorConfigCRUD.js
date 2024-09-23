const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

class MotorConfigCRUD {
  async createConfigQ(motorConfig) {
    try {
      const insertQuery = `
        INSERT INTO motors_config (
          motor_config_id,
          motor_id,
          power,
          voltage,
          amperage,
          efficiency,
          cosF,
          rotationSpeed,
          torque,
          temperature,
          operationMode,
          protectionLevel,
          explosionProof,
          brake,
          bearingType,
          mounting
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      await executeDatabaseQueryAsync(insertQuery, [
        motorConfig.motor_config_id,
        motorConfig.motor_config_id, //motor_id
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
      ])
    } catch (error) {}
  }
  async updateCongigQ(data) {}

  async readAllConfigsQ() {
    const command = `
      SELECT 
        mc.id AS config_id,
        mc.motor_config_id,
        mc.motor_id,
        mc.power,
        mc.voltage,
        mc.amperage,
        mc.efficiency,
        mc.cosF,
        mc.rotationSpeed,
        mc.torque,
        mc.temperature,
        mc.operationMode,
        mc.protectionLevel,
        mc.explosionProof,
        mc.brake,
        mc.bearingType,
        mc.mounting,
        m.engine_number AS motor_name,  -- Имя мотора из таблицы motors
        bt.name AS bearing_type,  -- Тип подшипника из таблицы bearingTypeT
        br.name AS brake_type,  -- Тип тормоза из таблицы MotorBrakeT
        cf.name AS cosF_value,  -- Значение cosF из таблицы MotorCosFT
        ef.name AS efficiency_value,  -- Значение эффективности из таблицы MotorEfficiencyT
        ep.name AS explosion_proof_value,  -- Значение взрывозащиты из таблицы MotorExplosionProofT
        mt.name AS mounting_type,  -- Тип монтажа из таблицы MotorMountingT
        om.name AS operation_mode,  -- Режим работы из таблицы MotorOperationModeT
        pr.name AS power_range,  -- Диапазон мощности из таблицы motorPowerRangeT
        pl.name AS protection_level,  -- Уровень защиты из таблицы MotorProtectionLevelT
        rs.name AS rotation_speed,  -- Скорость вращения из таблицы MotorRotationSpeedT
        tt.name AS temperature_value,  -- Температура из таблицы MotorTemperatureT
        tq.name AS torque_value,  -- Момент силы из таблицы MotorTorqueT
        vt.name AS voltage_value  -- Напряжение из таблицы motorVoltageT
      FROM 
        motors_config mc
      LEFT JOIN 
        motors m ON mc.motor_id = m.id
      LEFT JOIN 
        bearingTypeT bt ON mc.bearingType = bt.id
      LEFT JOIN 
        MotorBrakeT br ON mc.brake = br.id
      LEFT JOIN 
        MotorCosFT cf ON mc.cosF = cf.id
      LEFT JOIN 
        MotorEfficiencyT ef ON mc.efficiency = ef.id
      LEFT JOIN 
        MotorExplosionProofT ep ON mc.explosionProof = ep.id
      LEFT JOIN 
        MotorMountingT mt ON mc.mounting = mt.id
      LEFT JOIN 
        MotorOperationModeT om ON mc.operationMode = om.id
      LEFT JOIN 
        motorPowerRangeT pr ON mc.power = pr.id
      LEFT JOIN 
        MotorProtectionLevelT pl ON mc.protectionLevel = pl.id
      LEFT JOIN 
        MotorRotationSpeedT rs ON mc.rotationSpeed = rs.id
      LEFT JOIN 
        MotorTemperatureT tt ON mc.temperature = tt.id
      LEFT JOIN 
        MotorTorqueT tq ON mc.torque = tq.id
      LEFT JOIN 
      motorVoltageT vt ON mc.voltage = vt.id;
      `
    try {
      const rows =  await executeDatabaseQueryAsync(command, [])
      console.log(rows)
      return rows
    } catch (error) {
      throw new Error('Ошибка удаления записи: ' + error.message)
    }
  }
}

module.exports = new MotorConfigCRUD()
