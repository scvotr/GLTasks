'use strict'

const { executeDatabaseQueryAsync } = require('../../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createMotorVoltageTable = async () => {
  try {
    //! Удаляем таблицу, если она существует
    //  await executeDatabaseQueryAsync(`DROP TABLE IF EXISTS motorVoltageT`, [])

    await executeDatabaseQueryAsync(
      `CREATE TABLE IF NOT EXISTS motorVoltageT  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name REAL NOT NULL
         )`,
      []
    )

    const rows = await executeDatabaseQueryAsync('SELECT COUNT(*) as count FROM motorVoltageT')
    if (rows[0].count === 0) {
      await executeDatabaseQueryAsync(
        `INSERT INTO motorVoltageT (name) VALUES 
          (220), 
          (380), 
          (400), 
          (600), 
          (6000)`
      )
    }
  } catch (error) {
    console.log('DB ERROR: ', error)
  }
}

module.exports = {
    createMotorVoltageTable,
}

//   Таблица для хранения характеристик электрических двигателей должна включать в себя основные параметры, которые обычно используются для описания и оценки двигателей. Вот список рекомендуемых характеристик:

// 1. **`MotorID`** — Уникальный идентификатор двигателя (первичный ключ).
// 2. **`MotorName`** — Название или модель двигателя.
// 3. **`Manufacturer`** — Производитель двигателя.
// 4. **`PowerRating_kW`** — Мощность двигателя в киловаттах (kW).
// 5. **`Voltage`** — Напряжение питания (например, 230V, 400V).
// 6. **`Current`** — Ток (например, в амперах, A).
// 7. **`Frequency`** — Частота (например, 50 Hz или 60 Hz).
// 8. **`Efficiency`** — КПД (коэффициент полезного действия) двигателя.
// 9. **`Speed_rpm`** — Обороты в минуту (RPM).
// 10. **`Torque_Nm`** — Крутящий момент в Н·м (ньютон-метрах).
// 11. **`FrameSize`** — Размер корпуса или монтажные размеры.
// 12. **`ProtectionClass`** — Класс защиты (например, IP65).
// 13. **`CoolingType`** — Тип охлаждения (например, вентиляторное, водяное).
// 14. **`DutyCycle`** — Рабочий цикл (например, S1, S2).
// 15. **`AmbientTemperature`** — Температура окружающей среды.
// 16. **`Dimensions`** — Габаритные размеры двигателя.
// 17. **`Weight`** — Вес двигателя.
// 18. **`MountingType`** — Тип монтажа (например, фланцевый, на подставке).
// 19. **`Certifications`** — Сертификаты и стандарты (например, CE, UL).
// 20. **`Notes`** — Дополнительные примечания и особенности.

// Эти характеристики помогут вам полностью описать и каталогизировать электрические двигатели, что упростит их выбор, установку и эксплуатацию.
